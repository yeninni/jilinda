const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarScrim = document.getElementById("sidebarScrim");
const pageShell = document.querySelector(".page-shell");
const navLinks = Array.from(document.querySelectorAll(".side-nav a"));
const sideParentButtons = Array.from(document.querySelectorAll(".side-parent"));
const trackedSections = Array.from(document.querySelectorAll(".chapter, .guide-block"));
const guideFigures = Array.from(document.querySelectorAll(".guide-block figure"));
const guideCopyBlocks = Array.from(document.querySelectorAll(".guide-copy"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setSidebarOpen(isOpen) {
  sidebar.classList.toggle("open", isOpen);
  pageShell.classList.toggle("sidebar-mobile-open", isOpen);
  sidebarToggle.setAttribute("aria-expanded", String(isOpen));
  sidebarToggle.setAttribute("aria-label", isOpen ? "목차 닫기" : "목차 열기");
  sidebarScrim.hidden = !isOpen;
}

function setSidebarCollapsed(isCollapsed) {
  pageShell.classList.toggle("sidebar-collapsed", isCollapsed);
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
  sidebarToggle.setAttribute("aria-label", isCollapsed ? "목차 펼치기" : "목차 접기");
}

function setActiveNav() {
  const current = trackedSections
    .filter((section) => section.getBoundingClientRect().top <= 150)
    .at(-1);

  if (!current) return;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

function initGuideFigureMotion() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  guideFigures.forEach((figure) => {
    const image = figure.querySelector("img");

    gsap.fromTo(
      figure,
      { autoAlpha: 0, y: 36, scale: 0.97 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: figure,
          start: "top 82%",
          once: true
        }
      }
    );

    if (!image) return;

    gsap.fromTo(
      image,
      { scale: 1.035 },
      {
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: figure,
          start: "top 82%",
          once: true
        }
      }
    );
  });
}

function initGuideCopyMotion() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  guideCopyBlocks.forEach((copy) => {
    const copyItems = copy.querySelectorAll("h3, p, li");

    gsap.fromTo(
      copyItems,
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.62,
        ease: "power3.out",
        stagger: 0.055,
        scrollTrigger: {
          trigger: copy,
          start: "top 82%",
          once: true
        }
      }
    );
  });
}

sidebarToggle.addEventListener("click", () => {
  setSidebarCollapsed(!pageShell.classList.contains("sidebar-collapsed"));
});
sidebarScrim.addEventListener("click", () => setSidebarOpen(false));
sideParentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.getAttribute("aria-controls"));
    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    button.classList.toggle("active", !isOpen);
    target.classList.toggle("open", !isOpen);
  });
});
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setSidebarOpen(false);
    }
  });
});
window.addEventListener("scroll", setActiveNav, { passive: true });
window.addEventListener("resize", setActiveNav);
window.addEventListener("resize", () => {
  sidebarToggle.setAttribute("aria-label", pageShell.classList.contains("sidebar-collapsed") ? "목차 펼치기" : "목차 접기");
});

setActiveNav();
initGuideFigureMotion();
initGuideCopyMotion();
sidebarToggle.setAttribute("aria-label", "목차 접기");
