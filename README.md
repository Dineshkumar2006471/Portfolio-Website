# Dinesh Kumar's Premium 3D Portfolio

This project is a high-performance, cinematic portfolio website built with modern web technologies.

## Tech Stack
- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS (Variables, Flexbox/Grid, Glassmorphism)
- **3D**: Three.js (Particle Field & Geometry)
- **Animations**: GSAP (ScrollTrigger, Text Scramble, Parallax)
- **Smooth Scroll**: Lenis
- **Transitions**: Barba.js

## Setup & Running
**Important**: Because this project uses ES Modules (for Three.js and custom scripts), you cannot simply double-click `index.html`. You must run it through a local server.

### Option 1: VS Code (Recommended)
1. Install the "Live Server" extension in VS Code.
2. Right-click `index.html` and select "Open with Live Server".

### Option 2: Node.js
Run the following command in this directory:
```bash
npx serve .
```

## Customization
1. **Resume**: Replace `assets/resume/Resume.pdf` with your actual PDF file.
2. **Images**: Add your profile photo to `assets/images/Me2.jpg`.
3. **Contact Form**: Currently set to `mailto`. For a better experience, sign up for [Formspree](https://formspree.io/) and replace the `<form action="...">` URL with your Formspree endpoint.
4. **Projects**: Edit the `Projects` section in `index.html` with your real links and images.

## Structure
- `index.html`: Main content and structure.
- `styles.css`: All visual styling and responsiveness.
- `script.js`: Animation logic, 3D scene, and smooth scrolling.
