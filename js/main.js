document.addEventListener("DOMContentLoaded", () => {
  const headerElement = document.querySelector("header");
  const mainElement = document.querySelector("main");

  if (!headerElement || !mainElement) {
    console.error("Required elements not found. Check if header and main elements exist.");
    return;
  }

  const scrollSentinel = document.createElement("div");
  mainElement.before(scrollSentinel);

  const headerScrollObserver = new IntersectionObserver(
    ([{ isIntersecting }]) => {
      headerElement.classList.toggle("isScrolled", !isIntersecting);
    }
  );

  headerScrollObserver.observe(scrollSentinel);
});
