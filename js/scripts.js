window.addEventListener('DOMContentLoaded', event => {

    // 1. Navbar shrink function (scroll ile navbar'ı koyult/şeffaf yap)
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    // Sayfa yüklenince ve scroll olunca fonksiyon tetiklenir
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // 2. Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // 3. Responsive navbar'ı mobilde linke tıklayınca kapat
    // NOT: Artık sadece dropdown-toggle OLMAYAN nav-link'lerde çalışıyor!
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link:not(.dropdown-toggle)')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // 4. GreenAiriva: ID ile scroll-to fonksiyonları (özelleştirilebilir)
    const smoothScrollButtons = [
        { buttonId: 'scrollToContact', sectionId: 'contact' },
        { buttonId: 'scrollToSolutions', sectionId: 'solutions' },
        { buttonId: 'scrollToabout', sectionId: 'about' },
        { buttonId: 'scrollToTeam', sectionId: 'team' }
        // Ekstra buton ve section burada eklenebilir
    ];
    smoothScrollButtons.forEach(({ buttonId, sectionId }) => {
        const btn = document.getElementById(buttonId);
        const section = document.getElementById(sectionId);
        if (btn && section) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                section.scrollIntoView({ behavior: 'smooth' });
                if (history.pushState) {
                    history.pushState(null, null, window.location.pathname);
                }
            });
        }
    });

    // 5. Genel: Tüm anchor (href="#...") linklerinde smooth scroll desteği
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                if (history.pushState) {
                    history.pushState(null, null, window.location.pathname);
                }
            }
        });
    });

    // 6. Sayfa hash ile açıldıysa otomatik smooth scroll (örn. /about/#vision)
    if (window.location.hash) {
        var section = document.querySelector(window.location.hash);
        if (section) {
            setTimeout(function() {
                section.scrollIntoView({ behavior: "smooth" });
            }, 150); // sayfa yüklenince biraz bekleyip kaydır
        }
    }

});

// ── PROMPT 7: Scroll-reveal & Card stagger ──────────────────────────────────
(function () {
  // IntersectionObserver desteklenmiyorsa hiçbir şey yapma (tüm içerik görünür kalır)
  if (!('IntersectionObserver' in window)) return;

  // Reduced-motion tercihine saygı göster
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('ga-scroll-animated');

  // Card selectors — stagger animasyonu alacak elementler
  const CARD_SELECTORS = [
    '.ga-diff-card', '.ga-segment-card', '.ga-metric-card',
    '.ga-outcome-card', '.ga-pain-card', '.ga-framework-card',
    '.ga-mrv-step', '.ga-proof-card', '.ga-cert-card',
    '.ga-esg-card', '.ga-model-card', '.ga-compare-card',
    '.ga-data-card', '.blog-card', '.ga-step'
  ].join(', ');

  // Heading reveals
  const HEADING_SELECTORS = [
    '.section-heading', '.ga-band-heading', '.ga-seg-heading',
    '.ga-demo-heading', '.ga-cta-heading', '.ga-form-section-title'
  ].join(', ');

  // Cards: stagger delay hesapla (her container içinde 0–3 index, 85ms artış)
  const containerSeen = new WeakMap();
  document.querySelectorAll(CARD_SELECTORS).forEach(card => {
    card.classList.add('ga-stagger-child');
    const parent = card.parentElement;
    if (!containerSeen.has(parent)) containerSeen.set(parent, 0);
    const idx = containerSeen.get(parent);
    card.style.transitionDelay = (idx % 4 * 85) + 'ms';
    containerSeen.set(parent, idx + 1);
  });

  // Headings
  document.querySelectorAll(HEADING_SELECTORS).forEach(h => h.classList.add('ga-reveal-heading'));

  // Single observer — threshold 0 karşılamak element görünür olduğunda hemen tetikle
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.ga-stagger-child, .ga-reveal-heading').forEach(el => obs.observe(el));

  // GWP bar chart — ayrı IntersectionObserver (scaleX animasyonu, translateY ile çakışmaz)
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.ga-bar-animate').forEach(b => b.classList.add('revealed'));
      barObs.unobserve(e.target);
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.ga-gwp-chart').forEach(chart => barObs.observe(chart));
})();

// Sadece dropdown içindeki item veya gerçek nav-link'e tıklanınca menüyü kapat
document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item').forEach(function(element) {
  element.addEventListener('click', function(e) {
    // Eğer tıklanan element bir dropdown ana başlığı ise (yani dropdown-toggle class'ı varsa), menüyü kapatma
    if (element.classList.contains('dropdown-toggle')) {
      // Sadece dropdown'ı aç/kapat, menüyü kapatma
      return;
    }
    // Eğer tıklanan dropdown menü içindeki bir item veya menüdeki gerçek bir link ise, menüyü kapat
    var navbarCollapse = document.getElementById('navbarResponsive');
    if (navbarCollapse.classList.contains('show')) {
      var bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: true});
    }
  });
});

