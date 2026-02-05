import * as THREE from 'three';
// We are using CDN for GSAP and Lenis in HTML, so they are global variables (window.gsap, window.Lenis)
// But for Three.js using import map, we import it.

// --- 1. Init Lenis (Smooth Scroll) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// --- 2. Custom Text Scramble Effect (GSAP Alternative) ---
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
                    char = this.randomChar();
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

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Initialize Scramble on Hero Title
const el = document.querySelector('.scramble-target');
const fx = new TextScramble(el);

let counter = 0;
const phrases = [
    'Dinesh Kumar',
    'AI Engineer',
    'Full Stack Developer'
];

const next = () => {
    fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 2000);
    });
    counter = (counter + 1) % phrases.length;
};
// Start the cycle
setTimeout(next, 2000);


// --- 3. Three.js Background (Digital Reality) ---
const initThreeJS = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();

    // Fog for depth
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const posArray = new Float32Array(count * 3);

    // Create random particles in a donut/torus shape or sphere
    for (let i = 0; i < count * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00ff88,
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Floating Geometric Shape (Icosahedron) - REMOVED


    camera.position.z = 5;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotation


        particlesMesh.rotation.y = -mouseX * 0.5;
        particlesMesh.rotation.x = -mouseY * 0.5;

        // Parallax effect on camera
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initThreeJS();


// --- 4. GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero Reveal
gsap.from('.hero-title', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.5
});

gsap.from('.hero-description', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.8
});

gsap.from('.hero-buttons', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: 'power4.out',
    delay: 1.0
});

// Reveal Text on Scroll (About Section)
gsap.utils.toArray('.reveal-text').forEach(text => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Skill Cards Stagger
gsap.from('.skill-card', {
    scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%'
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2, // 0.2s delay between each
    ease: 'back.out(1.7)'
});

// Projects Parallax/Fade
gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
    });
});

// Counter Animation for Stats
gsap.utils.toArray('.stat-number').forEach(stat => {
    const target = stat.getAttribute('data-target');
    gsap.to(stat, {
        scrollTrigger: {
            trigger: stat,
            start: 'top 90%',
            once: true
        },
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: 'power1.out'
    });
});


// --- 5. Barba.js (Page Transitions) ---
// Note: Barba really shines with multi-page. Since we are mostly anchor based here, 
// we will just init it to allow for future multi-page support or smooth reloads.
// If running locally without a server, Barba might throw CORS errors on file:// protocol.
// We'll add a check.

if (window.location.protocol !== 'file:') {
    barba.init({
        transitions: [{
            name: 'opacity-transition',
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.5
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    opacity: 0,
                    duration: 0.5
                });
            }
        }]
    });
}

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const text = preloader.querySelector('.loader-text');

    const tl = gsap.timeline();

    tl.to(text, {
        opacity: 1,
        duration: 0.5
    })
        .to(text, {
            scale: 1.2,
            duration: 1,
            ease: 'power2.inOut'
        })
        .to(preloader, {
            y: '-100%',
            duration: 1,
            ease: 'power4.inOut' // Cinematic sweep up
        }, '-=0.2');
});


// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3
    });
});
