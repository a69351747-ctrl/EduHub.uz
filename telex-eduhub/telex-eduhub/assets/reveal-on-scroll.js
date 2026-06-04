/**
 * Adds `.is-visible` to every `.reveal-on-scroll` element as it enters the
 * viewport. style.css drives the fade-in + slide-up off that class. Once
 * an element has been revealed it is unobserved — no re-trigger on scroll
 * back, no flicker.
 *
 * Gated on prefers-reduced-motion: users who opted out of motion never see
 * any reveal animation; the elements render in their final state from page
 * load. style.css handles the static fallback via the `@media
 * (prefers-reduced-motion: no-preference)` wrapper around the .reveal-on-scroll
 * rules — when motion is reduced, those rules don't apply and elements stay
 * fully visible at opacity 1 / translateY(0).
 *
 * Deterministically injected into every theme by AddArbitraryFilesToArtefactTask;
 * functions.php enqueues it only when the home or interior page actually
 * uses .reveal-on-scroll in its block markup.
 */
(function () {
    'use strict';

    function init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        var targets = document.querySelectorAll('.reveal-on-scroll');
        if (!targets.length || typeof IntersectionObserver === 'undefined') {
            // No targets, or ancient browser — bail. The static fallback
            // in style.css keeps elements visible regardless.
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
        targets.forEach(function (el) { io.observe(el); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();