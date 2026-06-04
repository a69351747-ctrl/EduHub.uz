/**
 * On landing-page themes whose nav is in-page anchor links (href="#history",
 * etc.), toggles `.is-active` on the nav link matching whichever anchored
 * section is currently in the viewport's middle band. style.css drives the
 * visual treatment (underline, color shift, etc.) off that class.
 *
 * Gated on prefers-reduced-motion: users who opted out of motion don't
 * get the active-anchor animation. Static layout still works — the nav
 * links remain functional, just without the rolling highlight.
 *
 * Deterministically injected into every theme by AddArbitraryFilesToArtefactTask;
 * functions.php enqueues it only on landing-page themes that want the
 * active-anchor variant.
 */
(function () {
    'use strict';

    function init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        var sections = document.querySelectorAll('main [id]');
        var navLinks = document.querySelectorAll('.wp-block-navigation a[href^="#"]');
        if (!sections.length || !navLinks.length || typeof IntersectionObserver === 'undefined') {
            return;
        }
        var linksBySlug = {};
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href') || '';
            var hash = href.charAt(0) === '#' ? href.slice(1) : '';
            if (hash) {
                linksBySlug[hash] = link;
            }
        });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var link = linksBySlug[entry.target.id];
                if (!link) {
                    return;
                }
                if (entry.isIntersecting) {
                    Object.keys(linksBySlug).forEach(function (slug) {
                        linksBySlug[slug].classList.remove('is-active');
                    });
                    link.classList.add('is-active');
                }
            });
        }, { rootMargin: '-40% 0px -40% 0px' });
        sections.forEach(function (s) { io.observe(s); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();