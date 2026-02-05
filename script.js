import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// NEO-LIQUID VOID - Distorted Glass & Ink in Water Physics
// ═══════════════════════════════════════════════════════════════════════════

// --- 1. Lenis Smooth Scroll (Native Feel) ---
const lenis = new Lenis({
    duration: 0.6,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 2,
    smoothTouch: false,
    touchMultiplier: 2,
    wheelMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 2. GSAP Registration ---
gsap.registerPlugin(ScrollTrigger);

// Sync GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// --- 3. Default Browser Cursor (Custom cursor disabled) ---
// Using normal browser cursor for better usability

// --- 4. Preloader with Liquid Animation ---
const initLoader = () => {
    const preloader = document.querySelector('.preloader');
    const loaderText = preloader.querySelector('.loader-text');
    const loaderSub = preloader.querySelector('.loader-sub');

    const tl = gsap.timeline();

    tl.to(loaderText, {
        opacity: 1,
        scale: 1.1,
        duration: 0.8,
        ease: 'power2.out'
    })
        .to(loaderSub, {
            opacity: 1,
            y: -10,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3')
        .to({}, { duration: 1 }) // Pause
        .to(preloader, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut',
            onComplete: () => {
                preloader.style.display = 'none';
                initHeroAnimations();
            }
        });
};

// --- 5. Hero Animations (Simple & Stable) ---
const initHeroAnimations = () => {
    // Simple hero animations that stay visible
    gsap.fromTo('.hero-title',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out' }
    );

    gsap.fromTo('.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
    );
};

// --- 6. Text Scramble Effect ---
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

const scrambleEl = document.querySelector('.scramble-target');
if (scrambleEl) {
    const fx = new TextScramble(scrambleEl);
    let counter = 0;
    const phrases = ['Dinesh Kumar', 'AI Engineer', 'Full Stack Developer'];
    const next = () => {
        fx.setText(phrases[counter]).then(() => setTimeout(next, 3500)); // Longer gap between transitions
        counter = (counter + 1) % phrases.length;
    };
    setTimeout(next, 2000); // Start after 2 seconds
}

// --- 7. Three.js Simple Particles (No Sphere) ---
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Simple ambient particles only (no sphere)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00FF88, // Green color
        transparent: true,
        opacity: 0.5,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        // Slow particle rotation
        particlesMesh.rotation.y += 0.0003;
        particlesMesh.rotation.x += 0.0001;

        // Subtle mouse influence
        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;

        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initThreeJS();

// --- 8. Magnetic Hover Effect for Project Cards ---
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.15,
            y: y * 0.15,
            rotationY: x * 0.02,
            rotationX: -y * 0.02,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// --- 9. Scroll Animations ---
// Reveal text
gsap.utils.toArray('.reveal-text').forEach(text => {
    gsap.to(text, {
        scrollTrigger: {
            trigger: text,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Skill cards stagger
// Skill cards stagger (Optimized for speed)
gsap.from('.skill-card', {
    scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 85%',
        once: true // Animate only once for better performance
    },
    y: 30, // Reduced travel distance
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out'
});

// Section headers
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: { trigger: header, start: 'top 85%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Counter animation
gsap.utils.toArray('.stat-number').forEach(stat => {
    const target = stat.getAttribute('data-target');
    gsap.to(stat, {
        scrollTrigger: { trigger: stat, start: 'top 90%', once: true },
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: 'power1.out'
    });
});

// --- 10. Navigation Scroll State ---
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// --- 11. Barba.js Page Transitions ---
if (window.location.protocol !== 'file:' && typeof barba !== 'undefined') {
    barba.init({
        transitions: [{
            name: 'liquid-transition',
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    y: -50,
                    duration: 0.6
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    opacity: 0,
                    y: 50,
                    duration: 0.6
                });
            }
        }]
    });
}

// --- 12. Initialize ---
window.addEventListener('load', initLoader);
