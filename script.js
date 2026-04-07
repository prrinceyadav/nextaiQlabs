/* ═══════════════════════════════════════════════════════════╗
   NextAIQ-Edu — Premium Interactive JavaScript
   Three.js 3D · Scroll Animations · Glass Interactions
╚═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ───────────────────────────────────────────────
    // ADVANCED MORPHING AI DATA CLOUD (3D HERO)
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

        // ── Particle Configuration ──
        const particleCount = 2000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const targetPositions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        // Particle State
        let currentShape = 0; // 0: Sphere, 1: Cube, 2: DNA
        const shapes = ['sphere', 'cube', 'dna'];
        let morphProgress = 1;
        const morphDuration = 2.5; // seconds
        const stayDuration = 4.0; // seconds
        let timer = 0;

        // ── Shape Generation ──
        function generateSphere(arr) {
            const radius = 12;
            for (let i = 0; i < particleCount; i++) {
                const phi = Math.acos(-1 + (2 * i) / particleCount);
                const theta = Math.sqrt(particleCount * Math.PI) * phi;
                arr[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
                arr[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
                arr[i * 3 + 2] = radius * Math.cos(phi);
            }
        }

        function generateCube(arr) {
            const size = 18;
            for (let i = 0; i < particleCount; i++) {
                const p = i / particleCount;
                if (p < 1/6) { // Bottom
                    arr[i * 3] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 1] = -size / 2;
                    arr[i * 3 + 2] = (Math.random() - 0.5) * size;
                } else if (p < 2/6) { // Top
                    arr[i * 3] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 1] = size / 2;
                    arr[i * 3 + 2] = (Math.random() - 0.5) * size;
                } else if (p < 3/6) { // Left
                    arr[i * 3] = -size / 2;
                    arr[i * 3 + 1] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 2] = (Math.random() - 0.5) * size;
                } else if (p < 4/6) { // Right
                    arr[i * 3] = size / 2;
                    arr[i * 3 + 1] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 2] = (Math.random() - 0.5) * size;
                } else if (p < 5/6) { // Front
                    arr[i * 3] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 1] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 2] = size / 2;
                } else { // Back
                    arr[i * 3] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 1] = (Math.random() - 0.5) * size;
                    arr[i * 3 + 2] = -size / 2;
                }
            }
        }

        function generateDNA(arr) {
            const radius = 6;
            const height = 24;
            const turns = 3;
            for (let i = 0; i < particleCount; i++) {
                const p = i / particleCount;
                const angle = p * Math.PI * 2 * turns;
                const y = (p - 0.5) * height;
                
                // Strand alternating
                const strand = i % 2 === 0 ? 0 : Math.PI;
                
                // Random jitter for "cloud" effect
                const jitter = (Math.random() - 0.5) * 0.8;
                
                // Add "rungs" logic
                if (i % 20 === 0) { // Construct a rung
                    const t = Math.random();
                    arr[i * 3] = radius * Math.cos(angle) * (1 - 2 * t);
                    arr[i * 3 + 1] = y;
                    arr[i * 3 + 2] = radius * Math.sin(angle) * (1 - 2 * t);
                } else {
                    arr[i * 3] = radius * Math.cos(angle + strand) + jitter;
                    arr[i * 3 + 1] = y + jitter;
                    arr[i * 3 + 2] = radius * Math.sin(angle + strand) + jitter;
                }
            }
        }

        // ── Data for Shapes ──
        const shapeData = {
            sphere: new Float32Array(particleCount * 3),
            cube: new Float32Array(particleCount * 3),
            dna: new Float32Array(particleCount * 3)
        };
        generateSphere(shapeData.sphere);
        generateCube(shapeData.cube);
        generateDNA(shapeData.dna);

        // Initial Position (Sphere)
        for (let i = 0; i < positions.length; i++) {
            positions[i] = shapeData.sphere[i];
            // Initialize Colors (AI Violet & Cyan)
            if (i % 3 === 0) {
                const mix = Math.random();
                colors[i] = mix > 0.5 ? 0.31 : 0.66; // R
                colors[i + 1] = mix > 0.5 ? 0.56 : 0.33; // G
                colors[i + 2] = mix > 0.5 ? 1.0 : 0.97; // B
            }
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.18, // Increased from 0.15 for better visibility
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const pointCloud = new THREE.Points(particles, material);
        scene.add(pointCloud);

        // ── Scroll-Linked Blur Logic ──
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;
        let blurTimeout;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            scrollVelocity = Math.abs(currentScrollY - lastScrollY);
            lastScrollY = currentScrollY;

            // Apply blur based on velocity (max 10px)
            const blurAmount = Math.min(scrollVelocity * 0.15, 12);
            canvas.style.filter = `blur(${blurAmount}px)`;
            canvas.style.transition = 'filter 0.05s ease-out';

            // Reset blur after scroll stops
            clearTimeout(blurTimeout);
            blurTimeout = setTimeout(() => {
                canvas.style.filter = 'blur(0px)';
                canvas.style.transition = 'filter 0.4s ease-out';
            }, 100);
        }, { passive: true });

        // ── Interactive Logic ──
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 100;
            mouseY = (e.clientY - window.innerHeight / 2) / 100;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ── Animation Loop ──
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            timer += delta;

            // Shape Morphing Logic
            if (timer > (morphProgress < 1 ? morphDuration : stayDuration)) {
                timer = 0;
                if (morphProgress >= 1) {
                    // Start new morph
                    const nextShape = (currentShape + 1) % shapes.length;
                    const fromData = shapeData[shapes[currentShape]];
                    const toData = shapeData[shapes[nextShape]];
                    
                    // Set Target
                    for (let i = 0; i < particleCount * 3; i++) {
                        targetPositions[i] = toData[i];
                    }
                    
                    currentShape = nextShape;
                    morphProgress = 0;
                }
            }

            if (morphProgress < 1) {
                morphProgress += delta / morphDuration;
                if (morphProgress > 1) morphProgress = 1;
                
                const posAttr = particles.attributes.position;
                const fromData = shapeData[shapes[(currentShape + shapes.length - 1) % shapes.length]];
                const toData = shapeData[shapes[currentShape]];

                for (let i = 0; i < particleCount * 3; i++) {
                    // Smooth LERP with Ease In Out
                    const ease = morphProgress < 0.5 
                        ? 2 * morphProgress * morphProgress 
                        : -1 + (4 - 2 * morphProgress) * morphProgress;
                    
                    posAttr.array[i] = fromData[i] + (toData[i] - fromData[i]) * ease;
                }
                posAttr.needsUpdate = true;
            }

            // Subtle Drift & Rotation
            pointCloud.rotation.y += 0.002;
            pointCloud.rotation.x += 0.001;

            // Parallax
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            // Pulse Opacity
            material.opacity = 0.6 + Math.sin(time * 1.5) * 0.2;

            renderer.render(scene, camera);
        }

        animate();
    }


    // ───────────────────────────────────────────────
    // AI NEURAL SWARM (DISTRIBUTED NODES)
    // ───────────────────────────────────────────────
    function initNeuralSwarm() {
        const swarm = document.getElementById('ai-neural-swarm');
        if (!swarm) return;

        const nodeCount = 18;
        const nodes = [];
        const labels = ['CV', 'NLP', 'ML', 'ROBO', 'BI', 'EDGE', 'NN', 'DATA'];

        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node' + (i % 3 === 0 ? '' : ' small');
            
            // Random positions within container
            const x = Math.random() * 80 + 10;
            const y = Math.random() * 80 + 10;
            const depth = Math.random() * 100;

            node.style.left = x + '%';
            node.style.top = y + '%';
            node.style.transform = `translateZ(${depth}px)`;
            
            // Add floating animation
            node.style.animation = `float-swarm ${5 + Math.random() * 5}s ease-in-out infinite`;
            node.style.animationDelay = `-${Math.random() * 5}s`;

            if (i < labels.length) {
                node.setAttribute('data-label', labels[i]);
            }

            swarm.appendChild(node);
            nodes.push({ el: node, x, y, depth, vx: 0, vy: 0 });
        }

        // ── Synapse Lines (Connections) ──
        for (let i = 0; i < 12; i++) {
            const line = document.createElement('div');
            line.className = 'synapse-line';
            swarm.appendChild(line);
            
            const startNode = nodes[Math.floor(Math.random() * nodes.length)];
            const endNode = nodes[Math.floor(Math.random() * nodes.length)];
            
            updateLine(line, startNode, endNode);
            
            // Periodically update lines to simulate shifting connections
            setInterval(() => {
                const newEnd = nodes[Math.floor(Math.random() * nodes.length)];
                updateLine(line, startNode, newEnd);
            }, 3000 + Math.random() * 3000);
        }

        function updateLine(line, n1, n2) {
            const x1 = n1.x, y1 = n1.y;
            const x2 = n2.x, y2 = n2.y;
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) * 6; // scaling
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            line.style.width = length + 'px';
            line.style.left = x1 + '%';
            line.style.top = y1 + '%';
            line.style.transform = `rotate(${angle}deg)`;
        }

        // ── Mouse Parallax ──
        window.addEventListener('mousemove', (e) => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 40;
            const my = (e.clientY / window.innerHeight - 0.5) * 40;

            nodes.forEach((n, i) => {
                const factor = (i % 3 + 1) * 0.5;
                n.el.style.transform = `translate3d(${mx * factor}px, ${my * factor}px, ${n.depth}px)`;
            });
        });
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
        const watermarks = document.querySelectorAll('.watermark-text');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            geoElements.forEach((el, i) => {
                const speed = (i + 1) * 0.15;
                el.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
            });

            // Watermark parallax: subtle horizontal drift on scroll
            watermarks.forEach((wm) => {
                const rect = wm.parentElement.getBoundingClientRect();
                const progress = -rect.top / window.innerHeight;
                wm.style.transform = `translate(calc(-50% + ${progress * 40}px), -50%)`;
            });
        }, { passive: true });
    }

    // ───────────────────────────────────────────────
    // MAGNETIC BUTTONS
    // ───────────────────────────────────────────────
    function initMagneticButtons() {
        if (window.innerWidth < 768) return;

        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => {
                    btn.style.transition = '';
                }, 500);
            });
        });
    }

    // ───────────────────────────────────────────────
    // SCROLL-VELOCITY MARQUEE
    // ───────────────────────────────────────────────
    function initScrollMarquee() {
        const marqueeContent = document.querySelector('.marquee-content');
        if (!marqueeContent) return;

        let lastScroll = window.scrollY;
        let scrollSpeed = 0;
        let currentDirection = 'normal';

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const delta = currentScroll - lastScroll;
            scrollSpeed = Math.abs(delta);
            lastScroll = currentScroll;

            // Direction
            const newDirection = delta < 0 ? 'reverse' : 'normal';
            if (newDirection !== currentDirection) {
                currentDirection = newDirection;
                marqueeContent.style.animationName = newDirection === 'reverse' ? 'marquee-reverse' : 'marquee';
            }

            // Speed: map scroll speed to animation duration (faster scroll = faster marquee)
            const baseDuration = 30;
            const speedFactor = Math.max(4, baseDuration - scrollSpeed * 0.5);
            marqueeContent.style.animationDuration = speedFactor + 's';
        }, { passive: true });

        // Gradually reset speed when not scrolling
        let resetTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                marqueeContent.style.animationDuration = '30s';
            }, 300);
        }, { passive: true });
    }

    // ───────────────────────────────────────────────
    // CARD GLOW FOLLOW EFFECT
    // ───────────────────────────────────────────────
    function initCardGlow() {
        const cards = document.querySelectorAll('.glass-card');

        cards.forEach(card => {
            // Inject the glow div if not present
            if (!card.querySelector('.card-glow')) {
                const glow = document.createElement('div');
                glow.classList.add('card-glow');
                card.appendChild(glow);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    // ───────────────────────────────────────────────
    // PAGE PRELOADER
    // ───────────────────────────────────────────────
    function initPageLoader() {
        const preloader = document.getElementById('page-preloader');
        if (!preloader) return;

        function dismissLoader() {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 400);
        }

        // If page already loaded, dismiss immediately
        if (document.readyState === 'complete') {
            dismissLoader();
        } else {
            window.addEventListener('load', dismissLoader);
        }

        // Failsafe: always dismiss after 3 seconds no matter what
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 3000);
    }

    // ───────────────────────────────────────────────
    // INITIALIZE EVERYTHING
    // ───────────────────────────────────────────────
    // Start preloader immediately
    initPageLoader();

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
        initMagneticButtons();
        initScrollMarquee();
        initCardGlow();
        initNeuralSwarm();

        // Force initial reveal check
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            setTimeout(() => heroContent.classList.add('visible'), 300);
        }
    });

})();
