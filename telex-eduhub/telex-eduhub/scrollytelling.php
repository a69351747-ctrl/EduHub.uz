<?php

/**
 * Enqueues the scrollytelling catalog stylesheet on the front-end only.
 *
 * The motion CSS lives in its own file (assets/scrollytelling.css) instead
 * of being folded into style.css because styles.php registers style.css
 * via add_editor_style(), so any rule that ships in it also applies inside
 * the block-editor iframe. The catalog opens with .reveal-on-scroll
 * { opacity: 0; ... } — fine on the front-end where the matching
 * IntersectionObserver in assets/reveal-on-scroll.js toggles .is-visible,
 * but blanks every reveal section in the editor canvas where no scripts
 * run.
 *
 * Enqueueing via wp_enqueue_scripts keeps the catalog frontend-only by
 * construction: the hook does not fire inside the editor iframe.
**/

add_action( 'wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'telex-scrollytelling',
        get_theme_file_uri( 'assets/scrollytelling.css' ),
        [],
        wp_get_theme()->get( 'Version' )
    );
} );