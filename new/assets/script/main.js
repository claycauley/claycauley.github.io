const header = document.querySelector('header');
const menuBtn = header.querySelector('.menu');
const icon = menuBtn.querySelector('.icon');

// Mobile nav toggle
menuBtn.addEventListener('click', () => {
    const open = header.querySelector('nav').classList.toggle('nav--is-open');
    header.querySelector('.overlay').classList.toggle('overlay--is-open', open);
    document.body.classList.toggle('body--no-scroll', open);
    icon.classList.replace(open ? 'icon--bars' : 'icon--cross-mark', open ? 'icon--cross-mark' : 'icon--bars');
    menuBtn.setAttribute('aria-expanded', open);
});

// Active nav link
const navLinks = [...header.querySelectorAll('nav a')].filter(a => !a.closest('.btn-container'));

const setActive = (link) => {
    [...header.querySelectorAll('a')].forEach(a => a.classList.remove('is-active'));
    link.classList.add('is-active');
};

const currentPath = location.pathname === '/' ? '/index.html' : location.pathname;

navLinks.forEach(link => {
    link.classList.remove('is-active');
    if (link.pathname === currentPath) link.classList.add('is-active');
    link.addEventListener('click', () => setActive(link));
});

header.querySelector('.logo a').addEventListener('click', () => setActive(navLinks[0]));
requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-transition');
}));

// Sticky header on scroll
window.addEventListener('scroll', () => {
    header.classList.toggle('header--is-scrolled', window.scrollY > header.offsetHeight);
}, { passive: true });

// Marquee — clone track contents so HTML only needs one set of logos
document.querySelectorAll('.brands__track').forEach(track => {
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(clone);
});
