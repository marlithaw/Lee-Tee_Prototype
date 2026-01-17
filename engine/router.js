export function getEpisodeId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("episode") || "episode1";
}

export function getSectionFromHash() {
  const hash = window.location.hash.replace("#", "");
  return hash.startsWith("section-") ? hash.replace("section-", "") : null;
}

export function navigateToSection(sectionId) {
  window.location.hash = `section-${sectionId}`;
}

export function scrollToSection(sectionId) {
  const section = document.getElementById(`section-${sectionId}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
