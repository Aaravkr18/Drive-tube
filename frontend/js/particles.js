// Particle Background Effect
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 300; // Adjust for density
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
      // Randomize initial position across the whole screen
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      // Start from center-ish for new particles
      this.x = width / 2 + (Math.random() - 0.5) * 100;
      this.y = height / 2 + (Math.random() - 0.5) * 100;
      this.z = Math.random() * width;
      
      this.size = Math.random() * 1.5 + 0.5;
      
      // Speed and direction
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.5 + 0.1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.vz = (Math.random() - 0.5) * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;

      // Wrap around screen
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      // Perspective size (simple fake 3D)
      const scale = (width / 2) / (this.z + width / 2);
      if (scale < 0) return;
      
      const px = (this.x - width / 2) * scale + width / 2;
      const py = (this.y - height / 2) * scale + height / 2;
      const pSize = this.size * scale;
      
      // Fade out based on distance (z)
      const alpha = Math.max(0.1, 1 - (this.z / width));

      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 191, 255, ${alpha})`; // #00bfff color matching the reference
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Slow rotation effect for the whole canvas
    ctx.save();
    ctx.translate(width / 2, height / 2);
    const time = Date.now() * 0.00005;
    ctx.rotate(time);
    ctx.translate(-width / 2, -height / 2);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    ctx.restore();
    
    requestAnimationFrame(animate);
  }

  init();
  animate();
});
