import { el } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderWriting = ({ promptKey, framesKeys = [], hintKey, showHints }) => {
  const wrapper = el("div");
  wrapper.appendChild(el("p", { text: t(promptKey) }));
  if (hintKey) {
    wrapper.appendChild(el("p", { className: `hint muted${showHints ? "" : " hint--hidden"}`, text: t(hintKey) }));
  }
  const textarea = el("textarea", { attrs: { rows: "4", "aria-label": t("writing.response") } });
  const frameToggle = el("button", {
    className: "button button--ghost",
    text: t("writing.showFrames"),
    attrs: { type: "button", "aria-label": t("writing.showFrames") },
  });
  const frames = el("ul", { className: "section__checklist" });
  framesKeys.forEach((frameKey) => frames.appendChild(el("li", { text: t(frameKey) })));
  frames.style.display = "none";

  frameToggle.addEventListener("click", () => {
    const show = frames.style.display === "none";
    frames.style.display = show ? "block" : "none";
    frameToggle.setAttribute("aria-expanded", String(show));
    frameToggle.textContent = show ? t("writing.hideFrames") : t("writing.showFrames");
    frameToggle.setAttribute("aria-label", show ? t("writing.hideFrames") : t("writing.showFrames"));
  });

  wrapper.append(frameToggle, frames, textarea);
  return wrapper;
};
