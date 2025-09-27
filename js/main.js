document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const main = document.querySelector("main");

  const sentinel = document.createElement("div");
  main.before(sentinel);

  const observer = new IntersectionObserver(([entry]) => {
    header.classList.toggle("isScrolled", !entry.isIntersecting);
  });

  observer.observe(sentinel);
});
