// ACCTAB shared page behaviour: loader transitions, mobile menu, back-to-top, reveal, year
(function () {
    var loader = document.getElementById('pageLoader');

    function hideLoader() {
        if (loader) loader.classList.add('hidden');
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader);
        // Safety net in case a slow asset stalls the load event
        setTimeout(hideLoader, 2500);
    }

    // Restore state when navigating back from bfcache
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) hideLoader();
    });

    // Fade the loader in before moving between pages of the site
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link || !loader) return;
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#' || link.target === '_blank') return;
        if (/^(https?:|mailto:|tel:|whatsapp:)/i.test(href) && link.host !== location.host) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        loader.classList.remove('hidden');
        setTimeout(function () { location.href = link.href; }, 380);
    });

    var backToTop = document.getElementById('backToTop');
    var ticking = false;

    function onScroll() {
        if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            var open = navMenu.classList.toggle('open');
            hamburger.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', open);
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // Category filter on the Learn More hub
    var chips = document.querySelectorAll('.chip[data-filter]');
    var posts = document.querySelectorAll('.post-card[data-cat]');

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            var f = chip.getAttribute('data-filter');
            posts.forEach(function (p) {
                p.style.display = (f === 'all' || p.getAttribute('data-cat') === f) ? '' : 'none';
            });
        });
    });
})();
