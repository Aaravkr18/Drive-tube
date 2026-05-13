/**
 * Synapse AI — 3D Hero Background (Three.js)
 * Implements a liquid 3D orb and organic particle system
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // --- Scene Setup ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Liquid Orb ---
  // We use an IcosahedronGeometry with high detail for smooth displacement
  const orbGeometry = new THREE.IcosahedronGeometry(4, 50);
  
  // Custom Material with subtle glass/liquid properties
  const orbMaterial = new THREE.MeshPhongMaterial({
    color: 0x00dbe9,
    emissive: 0x7701d0,
    emissiveIntensity: 0.2,
    shininess: 100,
    transparent: true,
    opacity: 0.7,
    wireframe: false,
    flatShading: false
  });

  const orb = new THREE.Mesh(orbGeometry, orbMaterial);
  scene.add(orb);

  // Store original positions for vertex displacement
  const originalPositions = orbGeometry.attributes.position.array.slice();

  // --- Particles ---
  const particlesCount = 1500;
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25;
  }
  
  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: 0xdbfcff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // --- Lights ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x00dbe9, 1.5);
  mainLight.position.set(2, 5, 5);
  scene.add(mainLight);

  const secondaryLight = new THREE.PointLight(0x7701d0, 2);
  secondaryLight.position.set(-5, -5, 2);
  scene.add(secondaryLight);

  camera.position.z = 10;

  // --- Mouse Interactivity ---
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
  });

  // --- Animation Loop ---
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();
    
    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate Orb
    orb.rotation.y = elapsedTime * 0.15;
    orb.rotation.x = elapsedTime * 0.1;
    
    // Liquid Displacement (Morphing)
    const positions = orbGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i+1];
      const z = originalPositions[i+2];
      
      // Calculate noise-like displacement
      const noise = Math.sin(x * 1.2 + elapsedTime) * 
                    Math.cos(y * 1.5 + elapsedTime * 1.1) * 
                    Math.sin(z * 1.0 + elapsedTime * 0.8) * 0.35;
      
      const factor = 1 + noise;
      positions[i] = x * factor;
      positions[i+1] = y * factor;
      positions[i+2] = z * factor;
    }
    orbGeometry.attributes.position.needsUpdate = true;

    // Subtle parallax based on mouse
    orb.position.x = targetX * 3;
    orb.position.y = -targetY * 3;
    
    particlesMesh.rotation.y = elapsedTime * 0.05 + targetX * 0.2;
    particlesMesh.rotation.x = -targetY * 0.2;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
});
