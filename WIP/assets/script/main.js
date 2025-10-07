// Configuration
const config = {
  selectors: {
    menuButton: 'button.menu',
    nav: 'nav',
    yearElement: '#currentYear',
    header: 'header',
    main: 'main'
  },
  icons: {
    menu: {
      open: '<i class="fa-solid fa-xmark"></i>',
      closed: '<i class="fa-solid fa-bars"></i>'
    }
  },
  classes: {
    isOpen: 'isOpen',
    isScrolled: 'isScrolled'
  }
};

// UI Controller
const UI = {
  elements: {},

  // Cache DOM elements
  init() {
    Object.keys(config.selectors).forEach(key => {
      this.elements[key] = document.querySelector(config.selectors[key]);
    });
    return this;
  },

  // Toggle menu state
  toggleMenu(isOpen) {
    const { menuButton, nav } = this.elements;
    nav.classList.toggle(config.classes.isOpen, isOpen);
    menuButton.innerHTML = config.icons.menu[isOpen ? 'open' : 'closed'];
  },

  // Handle menu interactions
  setupMobileMenu() {
    const { menuButton, nav } = this.elements;
    if (!menuButton || !nav) return;

    // Toggle menu on button click
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu(!nav.classList.contains(config.classes.isOpen));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains(config.classes.isOpen) && 
          (e.target.classList.contains('overlay') ||
           (!e.target.closest('nav') && !e.target.closest('button.menu')))) {
        this.toggleMenu(false);
      }
    });
  },

  // Setup header scroll effect
  setupHeaderScroll() {
    const { header, main } = this.elements;
    if (!header || !main) return;

    const sentinel = document.createElement('div');
    main.before(sentinel);

    new IntersectionObserver(([entry]) => {
      header.classList.toggle(config.classes.isScrolled, !entry.isIntersecting);
    }).observe(sentinel);
  },

  // Update copyright year
  updateCopyright() {
    const { yearElement } = this.elements;
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  UI.init()
    .setupMobileMenu();
    UI.setupHeaderScroll();
    UI.updateCopyright();
});
