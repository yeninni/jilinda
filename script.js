const toc = document.getElementById("siteToc");
const tocScrim = document.getElementById("tocScrim");
const tocMobileToggle = document.getElementById("tocMobileToggle");
const tocSectionToggles = Array.from(document.querySelectorAll(".toc-section-toggle"));
const tocLinks = Array.from(document.querySelectorAll(".toc-nav a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));

function setTocOpen(isOpen) {
  toc.classList.toggle("open", isOpen);
  tocMobileToggle.setAttribute("aria-expanded", String(isOpen));
  tocScrim.hidden = !isOpen;
  document.body.classList.toggle("toc-open", isOpen);
}

tocMobileToggle.addEventListener("click", () => {
  setTocOpen(!toc.classList.contains("open"));
});

tocScrim.addEventListener("click", () => setTocOpen(false));

tocSectionToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.getAttribute("aria-controls"));
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.classList.toggle("active", !isOpen);
    target.classList.toggle("open", !isOpen);
  });
});

tocLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setTocOpen(false);
    }
  });
});

function setActiveLink() {
  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= 140)
    .at(-1);

  if (!current) return;

  tocLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("resize", setActiveLink);
setActiveLink();
