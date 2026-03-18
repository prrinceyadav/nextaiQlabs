/* ═══════════════════════════════════════════════════════════╗
   NextAIQ-Edu — Premium Interactive JavaScript
   Three.js 3D · Scroll Animations · Glass Interactions
╚═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ───────────────────────────────────────────────
    // THREE.JS 3D HERO SCENE
    // ───────────────────────────────────────────────
    function initThreeHero() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // ── Ambient + Point Lights ──
        const ambientLight = new THREE.AmbientLight(0x4f8eff, 0.3);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x4f8eff, 1.5, 100);
        pointLight1.position.set(15, 15, 15);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xa855f7, 1.2, 100);
        pointLight2.position.set(-15, -10, 10);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0x22d3ee, 0.8, 80);
        pointLight3.position.set(0, 20, -10);
        scene.add(pointLight3);

        // ── Glass Material ──
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x4f8eff,
            metalness: 0.1,
            roughness: 0.1,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            wireframe: false
        });

        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x4f8eff,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        });

        // ── Floating Geometries ──
        const geometries = [];

        // Torus Knot (center)
        const torusKnotGeo = new THREE.TorusKnotGeometry(5, 1.5, 100, 16);
        const torusKnot = new THREE.Mesh(torusKnotGeo, glassMaterial.clone());
        torusKnot.material.color.setHex(0x4f8eff);
        torusKnot.position.set(0, 0, -5);
        scene.add(torusKnot);
        geometries.push({ mesh: torusKnot, rotSpeed: { x: 0.003, y: 0.005, z: 0.002 }, floatOffset: 0 });

        // Icosahedron (left)
        const icoGeo = new THREE.IcosahedronGeometry(3, 0);
        const ico = new THREE.Mesh(icoGeo, glassMaterial.clone());
        ico.material.color.setHex(0xa855f7);
        ico.position.set(-18, 5, -8);
        scene.add(ico);
        geometries.push({ mesh: ico, rotSpeed: { x: 0.008, y: 0.006, z: 0.004 }, floatOffset: 1 });

        // Octahedron (right)
        const octGeo = new THREE.OctahedronGeometry(2.5, 0);
        const oct = new THREE.Mesh(octGeo, glassMaterial.clone());
        oct.material.color.setHex(0x22d3ee);
        oct.position.set(16, -6, -5);
        scene.add(oct);
        geometries.push({ mesh: oct, rotSpeed: { x: 0.006, y: 0.008, z: 0.005 }, floatOffset: 2 });

        // Dodecahedron (top-right)
        const dodGeo = new THREE.DodecahedronGeometry(2, 0);
        const dod = new THREE.Mesh(dodGeo, glassMaterial.clone());
        dod.material.color.setHex(0xf472b6);
        dod.position.set(12, 10, -12);
        scene.add(dod);
        geometries.push({ mesh: dod, rotSpeed: { x: 0.004, y: 0.007, z: 0.003 }, floatOffset: 3 });

        // Torus (bottom-left)
        const torusGeo = new THREE.TorusGeometry(3, 0.8, 16, 40);
        const torus = new THREE.Mesh(torusGeo, glassMaterial.clone());
        torus.material.color.setHex(0x34d399);
        torus.position.set(-14, -8, -10);
        scene.add(torus);
        geometries.push({ mesh: torus, rotSpeed: { x: 0.005, y: 0.003, z: 0.007 }, floatOffset: 4 });

        // ── Particle System (Starfield) ──
        const particleCount = 800;
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 100;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
            particleSizes[i] = Math.random() * 2 + 0.5;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

        const particleMat = new THREE.PointsMaterial({
            color: 0x4f8eff,
            size: 0.15,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // ── Wireframe Sphere (background) ──
        const sphereGeo = new THREE.SphereGeometry(20, 32, 32);
        const wireframeSphere = new THREE.Mesh(sphereGeo, wireframeMaterial);
        wireframeSphere.position.set(0, 0, -20);
        scene.add(wireframeSphere);

        // ── Mouse interaction ──
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // ── Resize handler ──
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ── Animation Loop ──
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Rotate geometries
            geometries.forEach((g, i) => {
                g.mesh.rotation.x += g.rotSpeed.x;
                g.mesh.rotation.y += g.rotSpeed.y;
                g.mesh.rotation.z += g.rotSpeed.z;

                // Floating motion
                const floatY = Math.sin(time * 0.5 + g.floatOffset * 1.2) * 2;
                const floatX = Math.cos(time * 0.3 + g.floatOffset * 0.8) * 1;
                g.mesh.position.y += (floatY - g.mesh.position.y + (i === 0 ? 0 : g.mesh.position.y)) * 0.01;
            });

            // Main torus knot float
            torusKnot.position.y = Math.sin(time * 0.5) * 2;
            torusKnot.position.x = Math.cos(time * 0.3) * 1;

            // Particle rotation
            particles.rotation.y += 0.0003;
            particles.rotation.x += 0.0001;

            // Wireframe sphere rotation
            wireframeSphere.rotation.y += 0.001;
            wireframeSphere.rotation.x += 0.0005;

            // Mouse parallax
            camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        }

        animate();
    }

    // ───────────────────────────────────────────────
    // SCROLL REVEAL (Intersection Observer)
    // ───────────────────────────────────────────────
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Don't unobserve — let elements re-animate if needed
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px'
            });

            revealElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for older browsers
            revealElements.forEach(el => el.classList.add('visible'));
        }
    }

    // ───────────────────────────────────────────────
    // ANIMATED COUNTERS
    // ───────────────────────────────────────────────
    function initCounters() {
        const counters = document.querySelectorAll('.counter');
        let animated = new Set();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated.has(entry.target)) {
                    animated.add(entry.target);
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out expo
            const eased = 1 - Math.pow(2, -10 * progress);
            const current = target * eased;

            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    el.textContent = target.toFixed(1) + suffix;
                } else {
                    el.textContent = target + suffix;
                }
            }
        }

        requestAnimationFrame(update);
    }

    // ───────────────────────────────────────────────
    // HEADER SCROLL EFFECT
    // ───────────────────────────────────────────────
    function initHeaderScroll() {
        const header = document.getElementById('site-header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ───────────────────────────────────────────────
    // MOBILE NAVIGATION
    // ───────────────────────────────────────────────
    function initMobileNav() {
        const toggle = document.getElementById('mobile-toggle');
        const navLinks = document.getElementById('nav-links');
        if (!toggle || !navLinks) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
                toggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ───────────────────────────────────────────────
    // SMOOTH SCROLL
    // ───────────────────────────────────────────────
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ───────────────────────────────────────────────
    // 3D TILT CARD EFFECT
    // ───────────────────────────────────────────────
    function initTiltCards() {
        const cards = document.querySelectorAll('.glass-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 768) return; // Disable on mobile

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ───────────────────────────────────────────────
    // CONSULTATION MODAL
    // ───────────────────────────────────────────────
    function initModal() {
        const overlay = document.getElementById('modal-overlay');
        const openBtn = document.getElementById('open-modal');
        const closeBtn = document.getElementById('close-modal');
        const doneBtn = document.getElementById('modal-done');
        const form = document.getElementById('consultation-form');
        const submitBtn = document.getElementById('submit-btn');
        const successDiv = document.getElementById('form-success');

        if (!overlay) return;

        function openModal() {
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            // Reset form after close
            setTimeout(() => {
                if (form) {
                    form.style.display = '';
                    form.reset();
                }
                if (successDiv) successDiv.style.display = 'none';
            }, 300);
        }

        if (openBtn) openBtn.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (doneBtn) doneBtn.addEventListener('click', closeModal);

        // Close on overlay click (not content)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
        });

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const submitText = submitBtn.querySelector('.submit-text');
                const submitLoader = submitBtn.querySelector('.submit-loader');

                // Show loader
                if (submitText) submitText.style.display = 'none';
                if (submitLoader) submitLoader.style.display = 'inline-flex';
                submitBtn.disabled = true;

                // Simulate submission (replace with real endpoint)
                setTimeout(() => {
                    form.style.display = 'none';
                    successDiv.style.display = 'block';

                    // Reset button state
                    if (submitText) submitText.style.display = '';
                    if (submitLoader) submitLoader.style.display = 'none';
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }

    // ───────────────────────────────────────────────
    // ACTIVE NAV LINK HIGHLIGHT
    // ───────────────────────────────────────────────
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // ───────────────────────────────────────────────
    // TYPING TEXT EFFECT (Hero)
    // ───────────────────────────────────────────────
    function initTypingEffect() {
        const badge = document.querySelector('.hero-badge');
        if (!badge) return;

        // Pulse animation for the badge dot
        const dot = badge.querySelector('.badge-dot');
        if (dot) {
            setInterval(() => {
                dot.style.boxShadow = '0 0 12px rgba(52, 211, 153, 0.6)';
                setTimeout(() => {
                    dot.style.boxShadow = '';
                }, 1000);
            }, 2000);
        }
    }

    // ───────────────────────────────────────────────
    // PARALLAX ON SCROLL (Subtle)
    // ───────────────────────────────────────────────
    function initParallax() {
        const geoElements = document.querySelectorAll('.geo-float');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            geoElements.forEach((el, i) => {
                const speed = (i + 1) * 0.15;
                el.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
            });
        }, { passive: true });
    }

    // ───────────────────────────────────────────────
    // INITIALIZE EVERYTHING
    // ───────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        initThreeHero();
        initScrollReveal();
        initCounters();
        initHeaderScroll();
        initMobileNav();
        initSmoothScroll();
        initTiltCards();
        initModal();
        initActiveNav();
        initTypingEffect();
        initParallax();

        // Force initial reveal check
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            setTimeout(() => heroContent.classList.add('visible'), 300);
        }
    });

})();
