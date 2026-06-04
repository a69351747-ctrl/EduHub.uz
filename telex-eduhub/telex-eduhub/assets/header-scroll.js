/**
 * Toggles `body.is-scrolled` once the viewport has scrolled past a small
 * threshold. The class drives the scrolled-state CSS on the fixed/sticky
 * header (background, blur, shrink, invert, etc.) declared in style.css.
 *
 * Also tracks scroll direction and toggles `body.header-hidden` while the
 * user scrolls DOWN past the threshold, clearing it on any upward gesture.
 * style.css drives the hide-on-scroll-down header variant off that flag.
 * Direction tracking is gated on prefers-reduced-motion so users who
 * opted out of motion never see the header retract/reappear; they get
 * a plain sticky header.
 *
 * Deterministically injected into every theme by AddArbitraryFilesToArtefactTask;
 * functions.php enqueues it only when headerBehavior or a picked scroll
 * variant requires the scrolled state.
 */
(function () {
    'use strict';

    function init() {
        var threshold = 60;
        var scrolled = false;
        var hidden = false;
        var lastY = window.scrollY;
        var directionTracking = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function onScroll() {
            var y = window.scrollY;
            var isScrolled = y > threshold;
            if (isScrolled !== scrolled) {
                scrolled = isScrolled;
                document.body.classList.toggle('is-scrolled', scrolled);
            }
            if (directionTracking) {
                var goingDown = y > lastY && y > 80;
                if (goingDown !== hidden) {
                    hidden = goingDown;
                    document.body.classList.toggle('header-hidden', hidden);
                }
            }
            lastY = y;
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();