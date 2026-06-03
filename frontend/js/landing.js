// ============================================
// Synapse AI — Landing Page Logic
// ============================================

// ── Page Transition Helper ──
function landingNavigateTo(url) {
  const overlay = document.getElementById('page-overlay');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = url; }, 300);
  } else {
    window.location.href = url;
  }
}

// Wire up all navigation links for smooth transitions
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="/"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // If link points to login, auto-navigate if already signed in, otherwise show modal
      if (href === '/login.html') {
        e.preventDefault();
        if (typeof auth !== 'undefined' && auth.currentUser) {
          landingNavigateTo('/chat.html');
        } else {
          openAuthModal();
        }
        return;
      }
      if (href && !href.startsWith('#')) {
        e.preventDefault();
        landingNavigateTo(href);
      }
    });
  });

  const heroStartBtn = document.getElementById('hero-start-btn');
  if (heroStartBtn) {
    heroStartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof auth !== 'undefined' && auth.currentUser) {
        landingNavigateTo('/chat.html');
      } else {
        openAuthModal();
      }
    });
  }

  // Fade in on load — start fully opaque then fade to transparent
  const overlay = document.getElementById('page-overlay');
  if (overlay) {
    overlay.style.opacity = '1';
    overlay.style.transition = 'none';
    // Double rAF ensures the browser paints the black frame before fading out
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition = 'opacity 0.35s ease';
        overlay.style.opacity = '0';
      });
    });
  }

  // ── Auth Modal Logic ──
  const authModal = document.getElementById('auth-modal');
  const authModalContent = document.getElementById('auth-modal-content');
  const closeAuthModalBtn = document.getElementById('close-auth-modal');

  window.openAuthModal = function() {
    if (!authModal) return;
    authModal.style.display = 'flex';
    // slight delay for transition paint
    requestAnimationFrame(() => {
      authModal.style.opacity = '1';
      authModalContent.style.transform = 'scale(1)';
    });
    // Auto focus email field inside modal
    setTimeout(() => {
      const emailEl = document.getElementById('email');
      if (emailEl) emailEl.focus();
    }, 300);
  };

  window.closeAuthModal = function() {
    if (!authModal) return;
    authModal.style.opacity = '0';
    authModalContent.style.transform = 'scale(0.95)';
    setTimeout(() => {
      authModal.style.display = 'none';
    }, 300);
  };

  if (closeAuthModalBtn) {
    closeAuthModalBtn.addEventListener('click', window.closeAuthModal);
  }

  // Close on backdrop click
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        window.closeAuthModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal && authModal.style.display !== 'none') {
      window.closeAuthModal();
    }
  });

  // ── Typewriter Effect ──
  const target = document.getElementById('typewriter-target');
  if (target) {
    const words = ['Synapse', 'Intelligence', 'Aura', 'Future'];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeWriter() {
      const word = words[wordIndex];
      if (!deleting) {
        target.textContent = word.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(typeWriter, 1800);
          return;
        }
      } else {
        target.textContent = word.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(typeWriter, deleting ? 60 : 100);
    }
    // Start after reveal animation
    setTimeout(typeWriter, 1000);
  }

  // ── Scroll Indicator ──
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });
  }

  // ── Scroll Reveal Animations ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// ── Parallax Orb on Mouse Move ──
document.addEventListener('mousemove', (e) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const orbContainer = document.querySelector('.aura-orb-container');
  if (!orbContainer) return;
  const mouseX = e.clientX / window.innerWidth - 0.5;
  const mouseY = e.clientY / window.innerHeight - 0.5;
  orbContainer.style.transform = `translate(${mouseX * 30}px, ${mouseY * 30}px)`;
});

console.log('Synapse AI Landing Page Online.');

// ── (#14) Mobile Hamburger Menu ──
(function() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('mobile-nav-overlay');
  const closeBtn = document.getElementById('mobile-nav-close');
  
  if (!menuBtn || !overlay) return;
  
  menuBtn.addEventListener('click', () => {
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
  });
  
  function closeMenu() {
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
  }
  
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  
  // Close on link click
  overlay.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
  });
})();

// ============================================
// LANDING PAGE UI UPGRADE PACK
// ============================================

// ── Navbar Scroll Glow ──
(function() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── Cursor Glow (desktop only) ──
(function() {
  if (window.matchMedia('(max-width: 767px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });

  // Change glow color when over feature cards
  const accentColors = ['rgba(99,102,241,0.08)', 'rgba(14,165,233,0.08)', 'rgba(255,152,0,0.08)'];
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      glow.style.background = `radial-gradient(circle, ${accentColors[i % accentColors.length]} 0%, transparent 70%)`;
    });
    card.addEventListener('mouseleave', () => {
      glow.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)';
    });
  });
})();

// ── Feature Card 3D Tilt (5° max, desktop only) ──
(function() {
  if (window.matchMedia('(max-width: 767px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      const maxTilt = 5;
      const rotateX = (-y * maxTilt).toFixed(2);
      const rotateY = ( x * maxTilt).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
})();

// ── Stats Count-up Animation ──
(function() {
  const statItems = document.querySelectorAll('.stat-number');
  if (!statItems.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const duration = 1400;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el, target) {
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target; // ensure final value is exact
    }
    requestAnimationFrame(step);
  }

  function spinReveal(el) {
    el.classList.add('spin-reveal');
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const text = el.textContent.trim();

      if (text === '∞') {
        spinReveal(el);
      } else if (text === '<1s') {
        // Type-in effect
        el.textContent = '';
        const chars = ['<', '1', 's'];
        chars.forEach((c, i) => {
          setTimeout(() => { el.textContent += c; }, i * 220);
        });
      } else {
        const num = parseInt(text, 10);
        if (!isNaN(num)) animateCounter(el, num);
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(el => observer.observe(el));
})();

// ── CTA Button Ripple ──
(function() {
  document.querySelectorAll('.glass-btn-heavy, .btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.remove('rippling');
      void this.offsetWidth; // force reflow
      this.classList.add('rippling');
      setTimeout(() => this.classList.remove('rippling'), 600);
    });
  });
})();

// ── Scroll-linked Parallax (mesh background) ──
// NOTE: We move the mesh-container wrapper (not individual blobs) to avoid
// conflicting with the CSS @keyframes mesh-float animations on .mesh-blob.
(function() {
  if (window.matchMedia('(max-width: 767px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mesh    = document.querySelector('.mesh-container');
  const auroras = document.querySelectorAll('.aurora-band');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // Move the whole mesh background at 10% scroll speed
        if (mesh) mesh.style.transform = `translateY(${y * 0.10}px)`;
        // Aurora bands drift at individual rates (CSS will re-add skew via animation)
        auroras.forEach((band, i) => {
          band.style.marginTop = `${y * (0.03 + i * 0.015)}px`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── Hero Word-by-Word Reveal ──
// Wrapped in DOMContentLoaded to guarantee DOM is ready (script runs in <head> on some setups)
document.addEventListener('DOMContentLoaded', function wordRevealInit() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  // Use TreeWalker to find all text nodes deeply, including inside spans
  const walker = document.createTreeWalker(heroTitle, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.trim()) textNodes.push(node);
  }

  let wordIndex = 0;
  textNodes.forEach(textNode => {
    // If the text node is inside a span that has special styling (like text-glow),
    // wrap the parent element instead of the text node, to preserve background-clip.
    const parent = textNode.parentElement;
    if (parent && parent !== heroTitle && parent.tagName.toLowerCase() === 'span' && parent.childNodes.length === 1) {
      if (!parent.parentElement.classList.contains('word-reveal')) {
        const wrapper = document.createElement('span');
        wrapper.className = 'word-reveal';
        wrapper.style.animationDelay = `${0.1 + (wordIndex++) * 0.08}s`;
        parent.replaceWith(wrapper);
        wrapper.appendChild(parent);
      }
      return;
    }

    const words = textNode.textContent.split(' ');
    const frag = document.createDocumentFragment();
    words.forEach((word, i) => {
      if (word) {
        const span = document.createElement('span');
        span.className = 'word-reveal';
        span.style.animationDelay = `${0.1 + (wordIndex++) * 0.08}s`;
        span.textContent = word;
        frag.appendChild(span);
        if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
      }
    });
    // For trailing space if split removed it
    if (textNode.textContent.endsWith(' ') && words[words.length - 1] !== '') {
        frag.appendChild(document.createTextNode(' '));
    }
    // For leading space
    if (textNode.textContent.startsWith(' ') && words[0] !== '') {
        frag.insertBefore(document.createTextNode(' '), frag.firstChild);
    }
    textNode.replaceWith(frag);
  });
});

console.log('Synapse AI Landing — UI Upgrade Pack loaded.');
