/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/

window.addEventListener('DOMContentLoaded', event => {

    // 1. Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) return;
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // 2. Activate Bootstrap scrollspy
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // 3. Responsive navbar'ı mobilde linke tıklayınca kapat
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

    // 4. GreenAiriva: ID ile scroll-to fonksiyonları
    const smoothScrollButtons = [
        { buttonId: 'scrollToContact', sectionId: 'contact' },
        { buttonId: 'scrollToSolutions', sectionId: 'solutions' },
        { buttonId: 'scrollToabout', sectionId: 'about' },
        { buttonId: 'scrollToTeam', sectionId: 'team' }
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

    // 6. Sayfa hash ile açıldıysa otomatik smooth scroll
    if (window.location.hash) {
        var section = document.querySelector(window.location.hash);
        if (section) {
            setTimeout(function() {
                section.scrollIntoView({ behavior: "smooth" });
            }, 150);
        }
    }

    // 7. Timeline Carousel (YENİ CLASS'LAR İLE!)
    const timelineData = [
        {
            title: "Q3 2025",
            desc: "Finalize project concept, conduct literature review on air purification methods, and start building our first public presence."
        },
        {
            title: "Q4 2025",
            desc: "Design initial prototype, launch website, reach out to potential partners, and apply for early-stage innovation funding opportunities."
        },
        {
            title: "2026",
            desc: "Pilot testing of the solution in a real urban setting, gather impact data, and form the founding team as well as a network of supporters and mentors."
        },
        {
            title: "2027",
            desc: "Expand to more cities, build B2B partnerships, and launch advanced air purification products."
        },
        {
            title: "2028",
            desc: "Scale globally and introduce AI-driven pollution analytics."
        },
        {
            title: "2029",
            desc: "Achieve measurable air quality improvement in pilot regions."
        },
        {
            title: "2030",
            desc: "Lead Europe's urban clean air movement with GreenAiriva solutions."
        }
    ];

    let focus = 2; // Başlangıçta ortadaki iki kart aktif
    const $cards = document.getElementById('timeline-cards');
    const total = timelineData.length;

    function render() {
        $cards.innerHTML = "";
        for (let i = 0; i < total; i++) {
            const d = timelineData[i];
            const $el = document.createElement("div");
            $el.className = "greenairiva-timeline-card";
            $el.innerHTML = `
                <span class="greenairiva-timeline-bullet"></span>
                <div class="greenairiva-timeline-content">
                    <h3>${d.title}</h3>
                    <p>${d.desc}</p>
                </div>
            `;
            const diff = i - focus;
            if (diff === -2) $el.classList.add('scale-2l');
            else if (diff === -1) $el.classList.add('scale-1l');
            else if (diff === 0) $el.classList.add('active');
            else if (diff === 1) $el.classList.add('active2');
            else if (diff === 2) $el.classList.add('scale-1r');
            else if (diff === 3) $el.classList.add('scale-2r');
            else $el.classList.add('hide');
            $cards.appendChild($el);
        }
    }
    render();

    function goNext() {
        if (focus < total - 2) {
            focus++;
            render();
        }
    }
    function goPrev() {
        if (focus > 0) {
            focus--;
            render();
        }
    }

    document.getElementById("timeline-next").onclick = goNext;
    document.getElementById("timeline-prev").onclick = goPrev;

    // Klavye ile sağ/sol oklar
    document.addEventListener('keydown', function (e) {
        if (e.key === "ArrowRight") goNext();
        else if (e.key === "ArrowLeft") goPrev();
    });

}); // window.addEventListener('DOMContentLoaded', ...)'un bitişi

// Sadece dropdown içindeki item veya gerçek nav-link'e tıklanınca menüyü kapat
document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item').forEach(function(element) {
    element.addEventListener('click', function(e) {
        if (element.classList.contains('dropdown-toggle')) return;
        var navbarCollapse = document.getElementById('navbarResponsive');
        if (navbarCollapse.classList.contains('show')) {
            var bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: true});
        }
    });
});

/**
 * Dil geçişi fonksiyonları (Lang Switch)
 */
function switchToTR() {
    var path = window.location.pathname;
    if (path.endsWith('/')) path += 'index.html';
    if (!path.includes('/tr/')) {
        var newPath = path.replace(/\/index\.html$/, '/tr/index.html');
        window.location.href = newPath;
    }
}
function switchToEN() {
    var path = window.location.pathname;
    if (path.includes('/tr/index.html')) {
        var newPath = path.replace('/tr/index.html', '/index.html');
        window.location.href = newPath;
    } else if (path.endsWith('/tr/')) {
        var newPath = path.replace('/tr/', '/');
        if (!newPath.endsWith('/')) newPath += '/';
        newPath += 'index.html';
        window.location.href = newPath;
    } else {
        window.location.href = '/index.html';
    }
}
