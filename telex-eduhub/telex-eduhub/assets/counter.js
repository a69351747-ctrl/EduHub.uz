/**
 * Animates `.counter[data-counter-target]` elements from 0 up to their target
 * value when they enter the viewport. Optional `data-counter-suffix` is
 * appended (e.g. "+", "%", "k"). Numbers render with thousand-separators
 * via toLocaleString — "600000" displays as "600,000".
 *
 * Gated on prefers-reduced-motion: users who opted out of motion see the
 * final value rendered immediately, no count-up.
 *
 * Deterministically injected into every theme by AddArbitraryFilesToArtefactTask;
 * functions.php enqueues it only when the home page actually uses .counter
 * blocks.
 */
(function () {
    'use strict';

    function renderFinal(el) {
        var target = parseInt(el.dataset.counterTarget, 10) || 0;
        var suffix = el.dataset.counterSuffix || '';
        el.textContent = target.toLocaleString() + suffix;
    }

    function animate(el) {
        var target = parseInt(el.dataset.counterTarget, 10) || 0;
        var suffix = el.dataset.counterSuffix || '';
        var duration = 1400;
        var start = performance.now();
        function tick(now) {
            var t = Math.min(1, (now - start) / duration);
            var eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased).toLocaleString() + suffix;
            if (t < 1) {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }

    function init() {
        var counters = document.querySelectorAll('.counter[data-counter-target]');
        if (!counters.length) {
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            typeof IntersectionObserver === 'undefined') {
            counters.forEach(renderFinal);
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (el) { io.observe(el); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();