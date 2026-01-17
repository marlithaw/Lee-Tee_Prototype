import { createEl } from "../utils/dom.js";
import { t } from "../i18n.js";

export const renderWriting = ({ promptKey, frames }) => {
  const wrapper = createEl("div");
  wrapper.append(createEl("p", { text: t(promptKey) }));
  if (frames?.length) {
    const frameList = createEl("ul");
    frames.forEach((frameKey) => frameList.append(createEl("li", { text: t(frameKey) })));
    wrapper.append(createEl("h4", { text: t("writing.frames") }), frameList);
  }
  const textarea = createEl("textarea", {
    attrs: {
      rows: "4",
      placeholder: t("writing.placeholder"),
      "aria-label": t("writing.placeholder"),
    },
  });
  wrapper.append(textarea);
  return wrapper;
};
