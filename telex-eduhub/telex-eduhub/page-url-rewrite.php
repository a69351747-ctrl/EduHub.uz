<?php

/**
 * Rewrites bare single-host relative page/category/tag URLs in rendered blocks
 * to the resolved permalink at runtime.
 *
 * The agent regularly emits hrefs like /contact/, /menu/, /category/news/, /tag/film/
 * for buttons and inline links inside page content. Those serialise to absolute paths
 * in the rendered HTML and break on Playground inner-page navigations (and on any
 * deployed site whose home_url is not the host root). This filter resolves them
 * against the installed page set / term taxonomy and replaces the href with the
 * correct permalink. Unmatched paths are left alone (fail-open).
 */

if (!function_exists('telex_resolve_relative_page_path')) {
    /**
     * Resolve a bare path like "/contact/" or "/category/news/" to a permalink.
     * Returns null when the path is not a candidate or when no matching page/term exists.
     */
    function telex_resolve_relative_page_path(string $href): ?string
    {
        // Only consider hrefs that look like single-host absolute paths.
        if ($href === '' || $href[0] !== '/') {
            return null;
        }

        // Drop query string and fragment for lookup. The regex delimiter is
        // `~` so the character class `[?#]` doesn't collide with it.
        $bare = preg_replace('~[?#].*$~', '', $href) ?? $href;
        $bare = trim($bare, '/');

        if ($bare === '') {
            return null;
        }

        // Skip WP internals, admin paths, REST, feeds.
        if (preg_match('#^(wp-admin|wp-content|wp-includes|wp-json|feed|comments)(/|$)#', $bare)) {
            return null;
        }

        // Skip date-based archives (yyyy/mm/dd or yyyy/mm or yyyy).
        if (preg_match('#^\d{4}(/|$)#', $bare)) {
            return null;
        }

        // Category archive.
        if (strpos($bare, 'category/') === 0) {
            $slug = trim(substr($bare, strlen('category/')), '/');
            return telex_resolve_term_permalink($slug, 'category');
        }

        // Tag archive.
        if (strpos($bare, 'tag/') === 0) {
            $slug = trim(substr($bare, strlen('tag/')), '/');
            return telex_resolve_term_permalink($slug, 'post_tag');
        }

        // Page (hierarchical or single segment).
        return telex_resolve_page_permalink($bare);
    }
}

if (!function_exists('telex_resolve_page_permalink')) {
    /**
     * Look up a page by its path and return its permalink. Memoised per request.
     */
    function telex_resolve_page_permalink(string $path): ?string
    {
        static $cache = [];

        if (array_key_exists($path, $cache)) {
            return $cache[$path];
        }

        if (!function_exists('get_page_by_path') || !function_exists('get_permalink')) {
            return $cache[$path] = null;
        }

        $page = get_page_by_path($path);
        if (!$page) {
            return $cache[$path] = null;
        }

        $link = get_permalink($page->ID);
        return $cache[$path] = is_string($link) ? $link : null;
    }
}

if (!function_exists('telex_resolve_term_permalink')) {
    /**
     * Look up a term by slug + taxonomy and return its archive link. Memoised per request.
     */
    function telex_resolve_term_permalink(string $slug, string $taxonomy): ?string
    {
        static $cache = [];
        $key = $taxonomy . '|' . $slug;

        if (array_key_exists($key, $cache)) {
            return $cache[$key];
        }

        if ($slug === '' || !function_exists('get_term_by') || !function_exists('get_term_link')) {
            return $cache[$key] = null;
        }

        $term = get_term_by('slug', $slug, $taxonomy);
        if (!$term || (function_exists('is_wp_error') && is_wp_error($term))) {
            return $cache[$key] = null;
        }

        $link = get_term_link($term);
        if (!is_string($link) || (function_exists('is_wp_error') && is_wp_error($link))) {
            return $cache[$key] = null;
        }

        return $cache[$key] = $link;
    }
}

if (!function_exists('telex_rewrite_relative_page_hrefs')) {
    /**
     * Rewrite every `href="/..."` in the given HTML whose path resolves to an
     * installed page or term. Leaves all other hrefs untouched.
     */
    function telex_rewrite_relative_page_hrefs(string $html): string
    {
        if ($html === '' || strpos($html, 'href="/') === false) {
            return $html;
        }

        // Only match clean paths — exclude `?` and `#` so we don't silently
        // drop a query string or fragment when rewriting. Query-stringed
        // hrefs are rare in hand-authored CTAs and pass through untouched.
        // Delimiter is `~` because `#` would clash with the fragment exclusion.
        $rewritten = preg_replace_callback(
            '~href="(/[^"?#]*)"~',
            static function (array $m): string {
                $resolved = telex_resolve_relative_page_path($m[1]);
                if ($resolved === null) {
                    return $m[0];
                }
                $escaped = function_exists('esc_url') ? esc_url($resolved) : $resolved;
                return 'href="' . $escaped . '"';
            },
            $html
        );

        return is_string($rewritten) ? $rewritten : $html;
    }
}

// Apply on every block render. Idempotent: a rewritten href starts with the
// host scheme and no longer matches the leading-slash regex on the next pass.
if (function_exists('add_filter')) {
    add_filter('render_block', static function ($content) {
        if (!is_string($content) || $content === '') {
            return $content;
        }
        return telex_rewrite_relative_page_hrefs($content);
    }, 20);
}