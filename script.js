// Elements
const navToggle = document.getElementById('navToggle');
const menuOverlay = document.getElementById('menuOverlay');
const navbar = document.getElementById('navbar');
const navbarHoverZone = document.getElementById('navbarHoverZone');
const heroSection = document.querySelector('.hero-slider');

let menuOpen = false;

function openMenu() {
  menuOpen = true;
  navToggle.classList.add('active');
  menuOverlay.classList.add('open');
  navbar.classList.remove('navbar-hidden');
}

function closeMenu() {
  menuOpen = false;
  navToggle.classList.remove('active');
  menuOverlay.classList.remove('open');
  handleNavbarScroll();
}

function toggleMenu() {
  if (menuOpen) closeMenu();
  else openMenu();
}

navToggle.addEventListener('click', toggleMenu);

// Close menu when clicking a menu item
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => closeMenu());
});

// Navbar scroll behavior — hide banner, burger always stays
function handleNavbarScroll() {
  if (menuOpen) return;

  const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 0;

  if (window.scrollY > heroBottom - 100) {
    navbar.classList.add('navbar-hidden');
  } else {
    navbar.classList.remove('navbar-hidden');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// Show navbar on hover at top of screen
let hoverTimeout;
navbarHoverZone.addEventListener('mouseenter', () => {
  if (navbar.classList.contains('navbar-hidden') && !menuOpen) {
    clearTimeout(hoverTimeout);
    navbar.classList.remove('navbar-hidden');
  }
});

navbar.addEventListener('mouseleave', () => {
  if (menuOpen) return;
  hoverTimeout = setTimeout(() => {
    handleNavbarScroll();
  }, 300);
});

navbar.addEventListener('mouseenter', () => {
  clearTimeout(hoverTimeout);
});

// Burger color based on background
function updateBurgerColor() {
  if (menuOpen) return;

  const burgerRect = navToggle.getBoundingClientRect();
  const burgerY = burgerRect.top + burgerRect.height / 2;

  const sections = document.querySelectorAll('section, .hero-slider, footer, .connect-section, .timeline');
  let isDark = false;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (burgerY >= rect.top && burgerY <= rect.bottom) {
      // Check for manual override
      const burgerAttr = section.getAttribute('data-burger');
      if (burgerAttr === 'dark') {
        isDark = false; // light bg → dark burger
        break;
      }
      if (burgerAttr === 'light') {
        isDark = true; // dark bg → light burger
        break;
      }

      const style = getComputedStyle(section);
      const bg = style.backgroundColor;

      // Check if section has a background image (likely dark)
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        isDark = true;
        break;
      }

      // Parse rgb color and check brightness
      const match = bg.match(/\d+/g);
      if (match) {
        const r = parseInt(match[0]);
        const g = parseInt(match[1]);
        const b = parseInt(match[2]);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        isDark = brightness < 128;
      }
      break;
    }
  }

  if (isDark) {
    navToggle.classList.remove('dark');
  } else {
    navToggle.classList.add('dark');
  }
}

window.addEventListener('scroll', updateBurgerColor, { passive: true });
updateBurgerColor();

// Hero slider
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
let currentSlide = 0;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Touch swipe for hero slider
let touchStartX = 0;
let touchEndX = 0;
const heroSlider = document.querySelector('.hero-slider');

heroSlider.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

heroSlider.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }
}, { passive: true });

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('.contact-title');
    title.textContent = 'Thanks!';
    contactForm.innerHTML = '<div class="contact-thanks"><p>Bold move. We like it!</p><p>Your message landed safely in our inbox — no ghosting here, promise.</p><p>Expect to hear from us very soon!</p></div>';
  });
}
