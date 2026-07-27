const toc = document.getElementById("siteToc");
const tocScrim = document.getElementById("tocScrim");
const tocMobileToggle = document.getElementById("tocMobileToggle");
const tocSectionToggles = Array.from(document.querySelectorAll(".toc-section-toggle"));
const tocLinks = Array.from(document.querySelectorAll(".toc-nav a"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const updatesTrack = document.querySelector(".updates-track");
const updatesSection = document.querySelector(".updates-section");
const updateButtons = Array.from(document.querySelectorAll(".updates-actions button"));
const updateCards = Array.from(document.querySelectorAll(".update-card"));
const contentCards = Array.from(document.querySelectorAll(".contents-grid a"));
const manualSections = Array.from(document.querySelectorAll(".manual-section"));
const contentsGrid = document.querySelector(".contents-grid");
const updateSearch = document.getElementById("updateSearch");
const updateSearchClear = document.getElementById("updateSearchClear");
const updatesEmpty = document.getElementById("updatesEmpty");

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

updateButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const card = updatesTrack?.querySelector(".update-card:not([hidden])");
    if (!card) return;

    const direction = index === 0 ? -1 : 1;
    const gap = parseFloat(getComputedStyle(updatesTrack).columnGap) || 0;
    updatesTrack.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  });
});

function getSearchText(element) {
  return element.textContent.replace(/\s+/g, " ").trim().toLowerCase();
}

function filterGuideContent() {
  const keyword = updateSearch.value.trim().toLowerCase();
  let visibleUpdates = 0;
  let visibleContentCards = 0;
  let visibleSections = 0;

  updateCards.forEach((card) => {
    const isMatch = !keyword || getSearchText(card).includes(keyword);
    card.hidden = !isMatch;
    if (isMatch) visibleUpdates += 1;
  });

  contentCards.forEach((card) => {
    const targetId = card.getAttribute("href");
    const targetSection = targetId ? document.querySelector(targetId) : null;
    const searchText = `${getSearchText(card)} ${targetSection ? getSearchText(targetSection) : ""}`;
    const isMatch = !keyword || searchText.includes(keyword);

    card.hidden = !isMatch;
    if (isMatch) visibleContentCards += 1;
  });

  manualSections.forEach((section) => {
    const isMatch = !keyword || getSearchText(section).includes(keyword);
    section.hidden = !isMatch;
    if (isMatch) visibleSections += 1;
  });

  updateSearchClear.hidden = !keyword;
  updatesSection.hidden = Boolean(keyword) && visibleUpdates === 0 && visibleContentCards + visibleSections > 0;
  updatesTrack.hidden = Boolean(keyword) && visibleUpdates === 0;
  contentsGrid.hidden = Boolean(keyword) && visibleContentCards === 0;
  updatesEmpty.hidden = !keyword || visibleUpdates + visibleContentCards + visibleSections > 0;
  updatesTrack.scrollTo({ left: 0 });
}

updateSearch?.addEventListener("input", filterGuideContent);

updateSearchClear?.addEventListener("click", () => {
  updateSearch.value = "";
  updateSearch.focus();
  filterGuideContent();
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
