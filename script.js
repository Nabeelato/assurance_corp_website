const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
    document.body.classList.add('has-motion');
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const primaryNavLinks = Array.from(document.querySelectorAll('.nav-links a:not(.nav-cta), .mobile-nav-links a:not(.mobile-nav-cta)'));

function normalizePathname(pathname) {
    if (!pathname || pathname === '/') {
        return '/index.html';
    }

    if (pathname.endsWith('/')) {
        return `${pathname}index.html`.toLowerCase();
    }

    return pathname.toLowerCase();
}

function setActivePageNavLink() {
    if (!primaryNavLinks.length) {
        return;
    }

    const currentPath = normalizePathname(window.location.pathname);

    // On leader profile pages (leader-*.html), treat leadership.html as current
    const isLeaderProfilePage = /\/leader-[^/]+\.html$/.test(currentPath);

    primaryNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) {
            link.classList.remove('is-active');
            return;
        }

        let targetUrl;
        try {
            targetUrl = new URL(href, window.location.href);
        } catch (error) {
            link.classList.remove('is-active');
            return;
        }

        const targetPath = normalizePathname(targetUrl.pathname);
        const isMatch = targetPath === currentPath ||
            (isLeaderProfilePage && targetPath.endsWith('/leadership.html'));
        link.classList.toggle('is-active', isMatch);
    });
}

function initMobileNav() {
    const menu = document.getElementById('mobile-menu');
    const toggle = document.querySelector('.mobile-nav-toggle');
    const backdrop = document.querySelector('.mobile-nav-backdrop');
    if (!menu || !toggle || !backdrop) {
        return;
    }

    const setMenuOpen = isOpen => {
        menu.classList.toggle('is-open', isOpen);
        menu.setAttribute('aria-hidden', String(!isOpen));
        backdrop.classList.toggle('is-open', isOpen);
        toggle.classList.toggle('is-active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('mobile-nav-open', isOpen);
    };

    const closeMenu = () => setMenuOpen(false);
    const closeTriggers = Array.from(document.querySelectorAll('[data-mobile-nav-close]'));

    toggle.addEventListener('click', () => {
        setMenuOpen(!menu.classList.contains('is-open'));
    });

    closeTriggers.forEach(trigger => {
        trigger.addEventListener('click', closeMenu);
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

function handleNavbarScroll() {
    if (!navbar) {
        return;
    }

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();
setActivePageNavLink();
initMobileNav();

// Measure navbar height and expose as CSS custom property for scroll-margin-top
function syncNavHeight() {
    if (!navbar) return;
    document.documentElement.style.setProperty('--nav-height', navbar.offsetHeight + 'px');
}
syncNavHeight();
window.addEventListener('resize', syncNavHeight, { passive: true });

// Smooth scroll for anchor links
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            return;
        }

        let targetUrl;
        try {
            targetUrl = new URL(href, window.location.href);
        } catch (error) {
            return;
        }

        const currentPath = normalizePathname(window.location.pathname);
        const targetPath = normalizePathname(targetUrl.pathname);
        if (targetPath !== currentPath || !targetUrl.hash) {
            return;
        }

        const target = document.querySelector(targetUrl.hash);
        if (!target) {
            return;
        }

        e.preventDefault();
        target.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start'
        });

        if (targetUrl.hash !== window.location.hash) {
            history.replaceState(null, '', targetUrl.hash);
        }
    });
});

function setStaggeredDelays(selector, intervalMs, maxItems = 8) {
    document.querySelectorAll(selector).forEach((item, index) => {
        const delay = Math.min(index, maxItems) * intervalMs;
        item.style.setProperty('--reveal-delay', `${delay}ms`);
    });
}

function initHeroSequence() {
    const heroItems = document.querySelectorAll('.hero-reveal');
    heroItems.forEach(item => {
        const delay = Number(item.dataset.heroDelay || 0);
        item.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    requestAnimationFrame(() => {
        heroItems.forEach(item => item.classList.add('is-visible'));
    });
}

function initHeroLineCycle() {
    const focusWords = Array.from(document.querySelectorAll('.hero-headline .hero-rotator-word'));
    if (!focusWords.length) {
        return;
    }

    let current = focusWords.findIndex(word => word.classList.contains('is-current'));
    if (current < 0) {
        current = 0;
    }

    const setCurrentWord = index => {
        focusWords.forEach((word, i) => {
            word.classList.toggle('is-current', i === index);
        });
    };

    setCurrentWord(current);

    if (reduceMotion || focusWords.length < 2) {
        return;
    }

    window.setInterval(() => {
        current = (current + 1) % focusWords.length;
        setCurrentWord(current);
    }, 1800);
}

function initHomeLeadershipCarousel() {
    const carousel = document.querySelector('[data-leadership-carousel]');
    if (!carousel) {
        return;
    }

    const track = carousel.querySelector('[data-leadership-track]');
    const slides = Array.from(carousel.querySelectorAll('[data-leadership-slide]'));
    const dotsContainer = carousel.querySelector('[data-leadership-dots]');
    const prevButton = carousel.querySelector('[data-leadership-prev]');
    const nextButton = carousel.querySelector('[data-leadership-next]');
    if (!track || !slides.length) {
        return;
    }

    let currentIndex = 0;
    let autoplayTimer = null;
    let pointerStartX = null;
    const autoplay = carousel.dataset.autoplay === 'true' && !reduceMotion;
    const intervalMs = Number(carousel.dataset.interval || 7000);

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'home-leadership-dot';
            dot.setAttribute('aria-label', `Go to profile ${index + 1}`);
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.home-leadership-dot')) : [];

    const setSlide = index => {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            slide.setAttribute('aria-hidden', String(slideIndex !== currentIndex));
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === currentIndex;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-pressed', String(isActive));
        });
    };

    const goToNext = () => setSlide(currentIndex + 1);
    const goToPrevious = () => setSlide(currentIndex - 1);

    const stopAutoplay = () => {
        if (!autoplayTimer) {
            return;
        }
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
    };

    const startAutoplay = () => {
        if (!autoplay || slides.length < 2) {
            return;
        }
        stopAutoplay();
        autoplayTimer = window.setInterval(goToNext, intervalMs);
    };

    if (slides.length < 2) {
        carousel.classList.add('is-static');
        setSlide(0);
        return;
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToPrevious();
            startAutoplay();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToNext();
            startAutoplay();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            setSlide(index);
            startAutoplay();
        });
    });

    track.addEventListener('pointerdown', event => {
        pointerStartX = event.clientX;
    });

    track.addEventListener('pointerup', event => {
        if (pointerStartX === null) {
            return;
        }

        const delta = event.clientX - pointerStartX;
        pointerStartX = null;
        if (Math.abs(delta) < 40) {
            return;
        }

        if (delta < 0) {
            goToNext();
        } else {
            goToPrevious();
        }
        startAutoplay();
    });

    track.addEventListener('pointercancel', () => {
        pointerStartX = null;
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', event => {
        if (carousel.contains(event.relatedTarget)) {
            return;
        }
        startAutoplay();
    });
    carousel.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToNext();
            startAutoplay();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToPrevious();
            startAutoplay();
        }
    });

    setSlide(0);
    startAutoplay();
}

function initContactMap() {
    const mapEl = document.getElementById('office-map');
    if (!mapEl || typeof window.L === 'undefined') {
        return;
    }

    const officeAddress = 'Assurance Corp, United Arab Emirates';
    const fallbackCoords = [24.4539, 54.3773];

    const map = window.L.map(mapEl, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        tap: false
    });

    window.L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.attributionControl.setPrefix('');

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    const pinIcon = window.L.divIcon({
        className: 'office-pin-marker',
        html: '<span class="office-pin"><span class="office-pin-pulse"></span><span class="office-pin-dot"></span></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    const marker = window.L.marker(fallbackCoords, { icon: pinIcon }).addTo(map);
    map.setView(fallbackCoords, 6);

    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(officeAddress)}`;
    fetch(geocodeUrl, { headers: { Accept: 'application/json' } })
        .then(response => {
            if (!response.ok) {
                return null;
            }
            return response.json();
        })
        .then(result => {
            if (!Array.isArray(result) || !result.length) {
                return;
            }

            const lat = Number(result[0].lat);
            const lng = Number(result[0].lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                return;
            }

            marker.setLatLng([lat, lng]);
            map.setView([lat, lng], 12);
        })
        .catch(() => {
            // Ignore geocoding errors and keep fallback coordinates.
        });
}

function initScrollReveal() {
    const revealSelector = [
        '.section-header',
        '.about-content',
        '.about-image',
        '.vm-card',
        '.home-about-content',
        '.home-about-image',
        '.home-about-value',
        '.home-pillar-item',
        '.home-leadership-carousel',
        '.home-industry-item',
        '.services-hero-main',
        '.services-hero-panel .summary-item',
        '.services-intro-copy',
        '.detail-card',
        '.profile-card',
        '.industry-column',
        '.page-cta',
        '.value-card',
        '.leader-profile-content',
        '.leader-profile-photo',
        '.contact-grid',
        '.footer-brand',
        '.footer-column',
        '.footer-bottom'
    ].join(', ');

    const revealItems = document.querySelectorAll(revealSelector);
    revealItems.forEach(item => item.classList.add('reveal-on-scroll'));

    setStaggeredDelays('.vision-mission .vm-card', 100, 1);
    setStaggeredDelays('.home-about-values .home-about-value', 100, 1);
    setStaggeredDelays('.home-pillars-grid .home-pillar-item', 85, 3);
    setStaggeredDelays('.home-industries-grid .home-industry-item', 35, 11);
    setStaggeredDelays('.services-hero-panel .summary-item', 70, 5);
    setStaggeredDelays('.detail-grid .detail-card', 80, 3);
    setStaggeredDelays('.profile-stack .profile-card', 90, 2);
    setStaggeredDelays('.industry-columns .industry-column', 80, 2);
    setStaggeredDelays('.values-grid .value-card', 70, 5);
    setStaggeredDelays('footer .footer-column', 75, 2);

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
}

function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (!yearEl) {
        return;
    }

    yearEl.textContent = String(new Date().getFullYear());
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    const statusEl = document.getElementById('form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const submitLabel = submitButton ? submitButton.textContent.trim() : 'Send Inquiry';

    const setStatus = (message, type) => {
        if (!statusEl) {
            return;
        }

        statusEl.textContent = message;
        statusEl.classList.remove('is-success', 'is-error');
        if (type) {
            statusEl.classList.add(type);
        }
    };

    const toggleSubmit = isPending => {
        if (!submitButton) {
            return;
        }

        submitButton.disabled = isPending;
        submitButton.textContent = isPending ? 'Sending...' : submitLabel;
    };

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (!form.reportValidity()) {
            return;
        }

        const honeypot = form.querySelector('input[name="_honey"]');
        if (honeypot && honeypot.value.trim()) {
            return;
        }

        setStatus('Sending your inquiry...', '');
        toggleSubmit(true);

        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: form.method || 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            form.reset();
            setStatus('Thank you. Your inquiry was sent successfully.', 'is-success');
        } catch (error) {
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const company = formData.get('company') || '';
            const service = formData.get('service') || '';
            const message = formData.get('message') || '';
            const mailtoSubject = encodeURIComponent('New inquiry from Assurance Corp website');
            const mailtoBody = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nService Interest: ${service}\n\nMessage:\n${message}`
            );

            window.location.href = `mailto:info@assurance.ae?subject=${mailtoSubject}&body=${mailtoBody}`;
            setStatus('Direct submit is unavailable right now. Your email app has been opened to send the inquiry.', 'is-error');
        } finally {
            toggleSubmit(false);
        }
    });
}

initHeroSequence();
initHeroLineCycle();
initHomeLeadershipCarousel();
initContactMap();
initScrollReveal();
initFooterYear();
initContactForm();
