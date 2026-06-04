<?php

/**
 * Seeds a theme's sample pages and CPT entries from content/ HTML files.
 *
 * Content files live in the theme under content/pages/<slug>.html and
 * content/cpt/<cpt-slug>/<item-slug>.html. Each begins with a single
 * <!-- telex:meta --> HTML comment carrying metadata (title at minimum),
 * followed by block markup that becomes the post_content.
 *
 * This file is injected into every generated theme by
 * AddArbitraryFilesToArtefactTask; do not edit it inside a generated theme.
**/

/**
 * Extract the first `<!-- wp:image -->` block from a body.
 *
 * Returns the matched block markup (so we can strip it from post_content)
 * along with the parsed `src` and `alt` attributes the seeder needs to
 * sideload the asset as a real WordPress featured image. Tolerates the
 * canonical Telex shape (`theme:./assets/<file>.png`), arbitrary attribute
 * order, and self-closing or paired `<img>` tags.
 *
 * Returns null when the body has no leading image block — those entries
 * end up without a featured image, which is fine for entries that don't
 * need one.
 *
 * @param string $body
 * @return array{block: string, src: string, alt: string}|null
 */
function telex_extract_first_image_block(string $body): ?array
{
    if (preg_match('/<!--\s*wp:image[^>]*-->\s*<figure\b[^>]*>\s*<img\b[^>]*?\/?>(?:\s*<figcaption\b[^<]*<\/figcaption>)?\s*<\/figure>\s*<!--\s*\/wp:image\s*-->\s*/s', $body, $blockMatch) !== 1) {
        return null;
    }
    $block = $blockMatch[0];
    if (preg_match('/<img\b[^>]*\bsrc="([^"]+)"/i', $block, $srcMatch) !== 1) {
        return null;
    }
    $src = $srcMatch[1];
    $alt = '';
    if (preg_match('/<img\b[^>]*\balt="([^"]*)"/i', $block, $altMatch) === 1) {
        $alt = $altMatch[1];
    }
    return ['block' => $block, 'src' => $src, 'alt' => $alt];
}

/**
 * Resolve a `theme:./assets/<file>` URL to an absolute filesystem path
 * inside the active theme. Returns null for any URL that doesn't match
 * the canonical theme-relative shape — external URLs aren't sideloaded.
 */
function telex_resolve_theme_asset_path(string $src): ?string
{
    if (strncmp($src, 'theme:.', 7) !== 0) {
        return null;
    }
    $relative = substr($src, 7);
    if ($relative === '' || $relative[0] !== '/') {
        return null;
    }
    if (strpos($relative, '..') !== false) {
        return null;
    }
    return get_template_directory() . $relative;
}

/**
 * Active theme slug used to scope seed markers and option keys.
 */
function telex_current_theme_seed_slug(): string
{
    if (function_exists('get_stylesheet')) {
        return sanitize_key((string) get_stylesheet());
    }
    if (function_exists('wp_get_theme')) {
        return sanitize_key((string) wp_get_theme()->get_stylesheet());
    }
    return 'theme';
}

function telex_seed_done_option_key(?string $theme_slug = null): string
{
    $slug = $theme_slug !== null && $theme_slug !== '' ? sanitize_key($theme_slug) : telex_current_theme_seed_slug();
    return 'telex_seeded_theme_' . $slug;
}

function telex_seed_pending_option_key(?string $theme_slug = null): string
{
    $slug = $theme_slug !== null && $theme_slug !== '' ? sanitize_key($theme_slug) : telex_current_theme_seed_slug();
    return 'telex_seed_pending_theme_' . $slug;
}

function telex_mark_seed_pending(): void
{
    $theme_slug = telex_current_theme_seed_slug();
    delete_option(telex_seed_done_option_key($theme_slug));
    update_option(telex_seed_pending_option_key($theme_slug), 1);
}

function telex_should_seed_content(): bool
{
    $theme_slug = telex_current_theme_seed_slug();
    if ((bool) get_option(telex_seed_pending_option_key($theme_slug))) {
        return true;
    }
    return ! (bool) get_option(telex_seed_done_option_key($theme_slug));
}

function telex_finish_seed_content(): void
{
    $theme_slug = telex_current_theme_seed_slug();
    update_option(telex_seed_done_option_key($theme_slug), 1);
    delete_option(telex_seed_pending_option_key($theme_slug));
    // Legacy global marker from the unscoped-v1 era. Remove it so the
    // active theme's scoped keys are the single source of truth.
    delete_option('telex_seeded_v1');
}

/**
 * Extract distinct theme-asset URLs referenced anywhere in a body.
 *
 * Theme-authored content files are allowed to use `theme:./assets/...` in
 * their block markup for portability across generated themes. At seed time we
 * materialize those references into real WordPress media-library attachments
 * so page/post/CPT content stays editor-manageable on the destination site.
 *
 * @return list<string>
 */
function telex_extract_theme_asset_urls_from_body(string $body): array
{
    if (preg_match_all('#theme:\./[A-Za-z0-9._/-]+#', $body, $matches) < 1) {
        return [];
    }

    $seen = [];
    $urls = [];
    foreach ($matches[0] as $src) {
        if (isset($seen[$src])) {
            continue;
        }
        $seen[$src] = true;
        $urls[] = $src;
    }

    return $urls;
}

/**
 * Best-effort alt lookup for a theme-asset URL referenced by an <img>.
 *
 * The first matching <img src="..."> wins. Covers both standard image blocks
 * and Cover blocks, which emit a real <img> element for the background image.
 */
function telex_extract_alt_for_theme_asset(string $body, string $src): string
{
    $quoted = preg_quote($src, '/');
    if (preg_match('/<img\b[^>]*\bsrc="' . $quoted . '"[^>]*\balt="([^"]*)"/i', $body, $match) === 1) {
        return $match[1];
    }
    if (preg_match('/<img\b[^>]*\balt="([^"]*)"[^>]*\bsrc="' . $quoted . '"/i', $body, $match) === 1) {
        return $match[1];
    }
    return '';
}

/**
 * Sideload an asset from the theme's filesystem into the media library.
 *
 * Reuses an existing attachment when the same theme-relative source was
 * already imported on this site, so repeated seed passes don't create
 * duplicate uploads for the same asset.
 *
 * Returns the attachment ID on success, or null when the source asset
 * is missing or the sideload fails.
 */
function telex_import_theme_asset_attachment(int $post_id, string $src, string $alt): ?int
{
    $existing = get_posts([
        'post_type'        => 'attachment',
        'post_status'      => 'inherit',
        'numberposts'      => 1,
        'fields'           => 'ids',
        'suppress_filters' => true,
        'meta_key'         => '_telex_theme_asset_source',
        'meta_value'       => $src,
    ]);
    if (!empty($existing)) {
        $attachment_id = (int) $existing[0];
        if ($alt !== '') {
            update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt);
        }
        return $attachment_id;
    }

    $absolute = telex_resolve_theme_asset_path($src);
    if ($absolute === null || !file_exists($absolute)) {
        error_log("telex_seed_content: media source not found for post {$post_id}: {$src}");
        return null;
    }

    if (!function_exists('media_handle_sideload')) {
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';
    }

    $tmp = wp_tempnam(basename($absolute));
    if (!$tmp || !@copy($absolute, $tmp)) {
        @unlink($tmp ?: '');
        error_log("telex_seed_content: failed copying media source for post {$post_id}: {$absolute}");
        return null;
    }

    $file_array = [
        'name'     => basename($absolute),
        'tmp_name' => $tmp,
    ];

    $attachment_id = media_handle_sideload($file_array, $post_id, $alt !== '' ? $alt : null);
    if (is_wp_error($attachment_id)) {
        @unlink($tmp);
        error_log("telex_seed_content: media_handle_sideload failed for post {$post_id}: " . $attachment_id->get_error_message());
        return null;
    }

    if ($alt !== '') {
        update_post_meta($attachment_id, '_wp_attachment_image_alt', $alt);
    }
    update_post_meta((int) $attachment_id, '_telex_theme_asset_source', $src);

    return (int) $attachment_id;
}

/**
 * Replace theme-relative asset URLs in a body with media-library URLs.
 *
 * After seeding, all page/post/CPT content should point at uploads-backed
 * media so site owners can manage those assets from WordPress itself. Theme
 * assets remain valid in templates/patterns/template parts, but seeded
 * content should not depend on the active theme directory at render time.
 */
function telex_rewrite_body_theme_assets_to_media_urls(int $post_id, string $body): string
{
    $srcs = telex_extract_theme_asset_urls_from_body($body);
    if (empty($srcs)) {
        return $body;
    }

    foreach ($srcs as $src) {
        $alt = telex_extract_alt_for_theme_asset($body, $src);
        $attachment_id = telex_import_theme_asset_attachment($post_id, $src, $alt);
        if ($attachment_id === null) {
            continue;
        }
        $attachment_url = wp_get_attachment_url($attachment_id);
        if (!is_string($attachment_url) || $attachment_url === '') {
            continue;
        }
        $body = str_replace($src, $attachment_url, $body);
    }

    return $body;
}

/**
 * Import an asset from the theme's filesystem as a media-library attachment
 * and attach it as the post's featured image.
 *
 * Idempotent guard isn't needed here because the caller only runs while the
 * current theme's scoped seed markers say content still needs to be applied.
 *
 * Returns the attachment ID on success, or null when the source asset
 * is missing or the sideload fails. Failures are logged so missing
 * featured images don't surface as silent UX bugs.
 */
function telex_attach_featured_image_from_body(int $post_id, string $src, string $alt): ?int
{
    $attachment_id = telex_import_theme_asset_attachment($post_id, $src, $alt);
    if ($attachment_id === null) {
        return null;
    }

    set_post_thumbnail($post_id, $attachment_id);

    return $attachment_id;
}

/**
 * Attach featured images for posts whose pending src postmeta references
 * the given filename. Called by the playground's writeImageToPlayground
 * after a freshly generated asset has been written to <theme>/assets/, so
 * posts that lost the race during seed time pick up `_thumbnail_id` without
 * a full reload.
 *
 * Returns the number of posts reconciled — zero when no posts were pending
 * this filename or when every retry sideload still failed.
 */
function telex_reconcile_featured_image_for_filename(string $filename): int
{
    $expected_src = 'theme:./assets/' . $filename;
    $post_ids = get_posts([
        'post_type'        => 'any',
        'numberposts'      => -1,
        'post_status'      => 'any',
        'fields'           => 'ids',
        'suppress_filters' => true,
        'meta_query'       => [
            [
                'key'   => '_telex_pending_featured_src',
                'value' => $expected_src,
            ],
        ],
    ]);

    if (empty($post_ids)) {
        return 0;
    }

    $reconciled = 0;
    foreach ($post_ids as $post_id) {
        $alt = (string) get_post_meta((int) $post_id, '_telex_pending_featured_alt', true);
        $attachment_id = telex_attach_featured_image_from_body((int) $post_id, $expected_src, $alt);
        if ($attachment_id !== null) {
            delete_post_meta((int) $post_id, '_telex_pending_featured_src');
            delete_post_meta((int) $post_id, '_telex_pending_featured_alt');
            $reconciled++;
        }
    }

    return $reconciled;
}

/**
 * Parse a content file into its meta header and body.
 *
 * `has_header` is true when the file begins with a well-formed
 * `<!-- telex:meta ... -->` comment, regardless of whether that header
 * carries any parseable keys. This lets the loader distinguish a file
 * with no header (skip) from a file with a header missing `title:`
 * (fall back to the titleized slug).
 *
 * @param string $content Raw file content.
 * @return array{has_header: bool, meta: array<string,string>, body: string}
 */
function telex_parse_content_file(string $content): array
{
    $trimmed = ltrim($content);
    $prefix = '<!-- telex:meta';

    if (strncmp($trimmed, $prefix, strlen($prefix)) !== 0) {
        return ['has_header' => false, 'meta' => [], 'body' => $content];
    }

    $closePos = strpos($trimmed, '-->');
    if ($closePos === false) {
        return ['has_header' => false, 'meta' => [], 'body' => $content];
    }

    $headerInner = substr($trimmed, strlen($prefix), $closePos - strlen($prefix));
    $body = substr($trimmed, $closePos + 3);

    $meta = [];
    foreach (explode("\n", $headerInner) as $line) {
        $line = trim($line);
        if ($line === '') {
            continue;
        }
        $colonPos = strpos($line, ':');
        if ($colonPos === false) {
            continue;
        }
        $key = trim(substr($line, 0, $colonPos));
        $value = trim(substr($line, $colonPos + 1));
        if ($key === '') {
            continue;
        }
        $meta[$key] = $value;
    }

    return ['has_header' => true, 'meta' => $meta, 'body' => $body];
}

/**
 * Split a comma-separated taxonomy meta value into a list of slugs.
 *
 * Post meta headers carry `category` and `tags` as comma-separated slug
 * strings. The loader trims each entry and drops empties so a header line
 * like `tags: typography,  process , ,` cleanly yields
 * `['typography', 'process']`.
 *
 * @return list<string>
 */
function telex_parse_taxonomy_slugs(string $value): array
{
    if (trim($value) === '') {
        return [];
    }
    $parts = array_map('trim', explode(',', $value));
    return array_values(array_filter($parts, static fn(string $s): bool => $s !== ''));
}

/**
 * Idempotently ensure each slug exists as a term in the given taxonomy and
 * return their term IDs. Reuses any existing term; never duplicates.
 *
 * @param list<string> $slugs
 * @return list<int>
 */
function telex_ensure_terms_for_slugs(array $slugs, string $taxonomy): array
{
    $ids = [];
    foreach ($slugs as $slug) {
        $existing = term_exists($slug, $taxonomy);
        if (is_array($existing) && isset($existing['term_id'])) {
            $ids[] = (int) $existing['term_id'];
            continue;
        }
        if (is_int($existing) || is_string($existing)) {
            $ids[] = (int) $existing;
            continue;
        }
        $inserted = wp_insert_term(
            ucwords(str_replace(['-', '_'], ' ', $slug)),
            $taxonomy,
            ['slug' => $slug]
        );
        if (is_array($inserted) && isset($inserted['term_id'])) {
            $ids[] = (int) $inserted['term_id'];
        }
    }
    return $ids;
}

/**
 * Apply native blog taxonomies (category, post_tag) and post format to a
 * seeded post based on its meta header. No-op for non-`post` post types,
 * since those use `register_taxonomy` flows owned by functions.php.
 *
 * Reads `category`, `tags`, and `format` from $meta. Idempotently creates
 * any missing terms, attaches them to the post, and sets the post format
 * for any non-empty, non-`standard` value.
 *
 * @param array<string, string> $meta
 */
function telex_apply_post_taxonomies_and_format(int $post_id, array $meta): void
{
    $category_value = isset($meta['category']) ? (string) $meta['category'] : '';
    if ($category_value !== '') {
        $category_slugs = telex_parse_taxonomy_slugs($category_value);
        $category_ids = telex_ensure_terms_for_slugs($category_slugs, 'category');
        if ($category_ids !== []) {
            wp_set_object_terms($post_id, $category_ids, 'category', false);
        }
    }

    $tags_value = isset($meta['tags']) ? (string) $meta['tags'] : '';
    if ($tags_value !== '') {
        $tag_slugs = telex_parse_taxonomy_slugs($tags_value);
        $tag_ids = telex_ensure_terms_for_slugs($tag_slugs, 'post_tag');
        if ($tag_ids !== []) {
            wp_set_object_terms($post_id, $tag_ids, 'post_tag', false);
        }
    }

    $format = isset($meta['format']) ? trim((string) $meta['format']) : '';
    if ($format !== '' && $format !== 'standard') {
        set_post_format($post_id, $format);
    }
}

/**
 * Given a relative content-file path and its parsed meta, derive post fields.
 *
 * @param string $relativePath Path relative to the theme root (e.g. content/pages/home.html).
 * @param array<string,string> $meta Parsed meta from telex_parse_content_file().
 * @return array{post_type: string, post_name: string, post_title: string, is_home: bool}|null
 */
function telex_derive_post_info(string $relativePath, array $meta): ?array
{
    if (!str_ends_with($relativePath, '.html')) {
        return null;
    }

    $post_type = null;
    $post_name = null;

    if (preg_match('#^content/pages/([^/]+)\.html$#', $relativePath, $m)) {
        $post_type = 'page';
        $post_name = $m[1];
    } elseif (preg_match('#^content/posts/([^/]+)\.html$#', $relativePath, $m)) {
        $post_type = 'post';
        $post_name = $m[1];
    } elseif (preg_match('#^content/cpt/([^/]+)/([^/]+)\.html$#', $relativePath, $m)) {
        $post_type = $m[1];
        $post_name = $m[2];
    } else {
        return null;
    }

    $title = isset($meta['title']) && $meta['title'] !== ''
        ? $meta['title']
        : ucwords(str_replace('-', ' ', $post_name));

    return [
        'post_type'  => $post_type,
        'post_name'  => $post_name,
        'post_title' => $title,
        'is_home'    => ($post_type === 'page' && $post_name === 'home'),
    ];
}

/**
 * Scan content/ in the active theme and insert one post per content file.
 *
 * Runs once per active theme slug unless an activation/overwrite marked the
 * seed as pending. A per-slug get_page_by_path() check keeps inserts
 * idempotent while still allowing updates of seed-origin content.
 */
function telex_seed_content(): void
{
    static $running = false;
    if ($running) {
        return;
    }
    $running = true;
    if (!telex_should_seed_content()) {
        return;
    }

    $theme_dir = get_template_directory();
    $paths = array_merge(
        glob($theme_dir . '/content/pages/*.html') ?: [],
        glob($theme_dir . '/content/posts/*.html') ?: [],
        glob($theme_dir . '/content/cpt/*/*.html') ?: []
    );

    // Allow the `theme:` pseudo-protocol through wp_kses_post during seeding so
    // theme-relative asset URLs (e.g. theme:./assets/hero.png) survive the
    // content_save_pre sanitization that runs inside wp_insert_post. Without
    // this the prefix is stripped and block validation fails in the editor.
    $allow_theme_protocol = static function (array $protocols): array {
        $protocols[] = 'theme';
        return $protocols;
    };
    add_filter('kses_allowed_protocols', $allow_theme_protocol);

    $home_id = null;

    foreach ($paths as $absolute_path) {
        $relative = ltrim(str_replace($theme_dir, '', $absolute_path), '/');
        $raw = @file_get_contents($absolute_path);
        if ($raw === false) {
            error_log("telex_seed_content: could not read {$relative}");
            continue;
        }

        $parsed = telex_parse_content_file($raw);
        if (!$parsed['has_header']) {
            error_log("telex_seed_content: missing telex:meta header in {$relative}, skipping");
            continue;
        }

        $info = telex_derive_post_info($relative, $parsed['meta']);
        if ($info === null) {
            error_log("telex_seed_content: unexpected path shape {$relative}, skipping");
            continue;
        }

        // menu_order: 0 for Home so it sorts first, 10+ for everything else.
        // This drives the default wp_list_pages() ordering used by the
        // Navigation block fallback when no explicit menu is set.
        $menu_order = ($info['post_type'] === 'page')
            ? ($info['is_home'] ? 0 : 10)
            : 0;

        // Extract the entry's first wp:image block as a featured-image
        // candidate. Removing it from post_content keeps the single page
        // from rendering the image twice (once via the template's
        // <wp:post-featured-image> and once inline through <wp:post-content>),
        // and gives the archive cards a real _thumbnail_id to render via
        // <wp:post-featured-image>. Pages don't need featured-image
        // extraction — only CPT entries.
        $body = $parsed['body'];
        $featured_candidate = null;
        if ($info['post_type'] !== 'page') {
            $featured_candidate = telex_extract_first_image_block($body);
            if ($featured_candidate !== null) {
                $body = (string) substr_replace(
                    $body,
                    '',
                    (int) strpos($body, $featured_candidate['block']),
                    strlen($featured_candidate['block'])
                );
                $body = ltrim($body);
            }
        }

        $post_data = [
            'post_type'    => $info['post_type'],
            'post_name'    => $info['post_name'],
            'post_title'   => $info['post_title'],
            'post_content' => $body,
            'post_status'  => 'publish',
            'menu_order'   => $menu_order,
        ];

        // Upsert: if a post with this slug+type already exists, refresh its
        // content from the file. Without this, OPFS-persisted theme projects
        // never pick up assistant edits to content/ files — the playground
        // blueprint clears the theme-scoped seed markers so the seed re-runs, but
        // get_page_by_path() finds the prior post and we'd skip it. The
        // overwrite is the same trade-off CLEAR_THEME_DB_STATE_PHP already
        // accepted for templates: while the assistant is in charge of theme
        // files, every blueprint apply replaces seed-origin content.
        $existing = get_page_by_path($info['post_name'], OBJECT, $info['post_type']);
        if ($existing) {
            $post_data['ID'] = (int) $existing->ID;
            $inserted = wp_update_post($post_data, true);
        } else {
            $inserted = wp_insert_post($post_data, true);
        }

        if (is_wp_error($inserted) || !$inserted) {
            $msg = is_wp_error($inserted) ? $inserted->get_error_message() : 'unknown error';
            error_log("telex_seed_content: failed for {$relative}: {$msg}");
            continue;
        }

        $rewritten_body = telex_rewrite_body_theme_assets_to_media_urls((int) $inserted, $body);
        if ($rewritten_body !== $body) {
            $body = $rewritten_body;
            $updated = wp_update_post([
                'ID'           => (int) $inserted,
                'post_content' => $body,
            ], true);
            if (is_wp_error($updated)) {
                error_log("telex_seed_content: failed updating rewritten media URLs for {$relative}: " . $updated->get_error_message());
            }
        }

        // Persist any non-title meta-header keys as post meta. The header
        // already produced ['title' => ..., 'price' => '12.00', 'allergens' => 'gluten, egg', ...]
        // — `title` consumed above as post_title, everything else is meta.
        // REST exposure / sanitisation is controlled by register_post_meta in
        // functions.php; this loader writes whatever it finds.
        //
        // `category`, `tags`, and `format` are consumed by
        // telex_apply_post_taxonomies_and_format() below — they belong in
        // wp_term_relationships / the post_format taxonomy, not in postmeta.
        $consumed_by_taxonomy = ['category' => true, 'tags' => true, 'format' => true];
        foreach ($parsed['meta'] as $meta_key => $meta_value) {
            if ($meta_key === 'title') {
                continue;
            }
            if ($info['post_type'] === 'post' && isset($consumed_by_taxonomy[$meta_key])) {
                continue;
            }
            update_post_meta((int) $inserted, $meta_key, $meta_value);
        }

        if ($info['post_type'] === 'post') {
            telex_apply_post_taxonomies_and_format((int) $inserted, $parsed['meta']);
        }

        // Marker postmeta read by Telex cleanup paths to identify seed-origin
        // posts for the current theme only (vs. user-authored posts or a
        // different installed Telex theme). Written after the user-meta loop
        // so a header that happened to declare the same key cannot strip it.
        update_post_meta((int) $inserted, '_telex_seeded_theme', telex_current_theme_seed_slug());

        if ($featured_candidate !== null) {
            $attachment_id = telex_attach_featured_image_from_body(
                (int) $inserted,
                $featured_candidate['src'],
                $featured_candidate['alt']
            );
            if ($attachment_id === null) {
                // Asset isn't on disk yet — image generation is racing the
                // playground boot. Record the pending candidate so the
                // playground's writeImageToPlayground reconcile flow can
                // attach the thumbnail when the asset bytes arrive, instead
                // of forcing the user to reload before the post gets a
                // _thumbnail_id.
                update_post_meta((int) $inserted, '_telex_pending_featured_src', $featured_candidate['src']);
                update_post_meta((int) $inserted, '_telex_pending_featured_alt', $featured_candidate['alt']);
            }
        }

        if ($info['is_home']) {
            $home_id = (int) $inserted;
        }
    }

    remove_filter('kses_allowed_protocols', $allow_theme_protocol);

    // Remove the WordPress default "Sample Page" so it does not appear in the
    // theme's navigation. Force-delete to bypass trash.
    $sample_page = get_page_by_path('sample-page', OBJECT, 'page');
    if ($sample_page) {
        wp_delete_post((int) $sample_page->ID, true);
    }

    if ($home_id) {
        update_option('show_on_front', 'page');
        update_option('page_on_front', $home_id);
    }

    telex_finish_seed_content();
}

if (function_exists('add_action')) {
    add_action('after_switch_theme', 'telex_mark_seed_pending');
    add_action('init', 'telex_seed_content', 99);
}