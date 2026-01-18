import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { renderStoryInteraction } from "./storyInteractions.js";
import { renderListenButton } from "./media.js";

const renderSupports = ({ supports, showHints }) => {
  if (!supports) return null;
  const wrapper = el("div", { className: "story-supports" });
  if (showHints && supports.hintsKey) {
    wrapper.appendChild(el("p", { className: "muted", text: t(supports.hintsKey) }));
  }
  if (showHints && supports.framesKey) {
    const list = el("ul", { className: "section__checklist" });
    t(supports.framesKey)
      .split("|")
      .filter(Boolean)
      .forEach((frame) => list.appendChild(el("li", { text: frame.trim() })));
    wrapper.appendChild(list);
  }
  return wrapper.childElementCount ? wrapper : null;
};

export const renderStory = ({ story, settings, progress, onInteractionComplete, language }) => {
  const wrapper = el("div", { className: "story" });
  wrapper.appendChild(el("h3", { text: t(story.titleKey) }));
  if (story.introKey) {
    wrapper.appendChild(el("p", { className: "muted", text: t(story.introKey) }));
  }

  const interactions = new Map((story.interactions || []).map((interaction) => [interaction.id, interaction]));

  story.segments.forEach((segment, index) => {
    const segmentCard = el("div", { className: "story-segment" });
    segmentCard.appendChild(
      el("div", {
        className: "story-segment__meta muted",
        text: t("story.segmentLabel")
          .replace("{index}", index + 1)
          .replace("{total}", story.segments.length),
      }),
    );
    const segmentText = t(segment.textKey);
    segmentCard.appendChild(el("p", { text: segmentText }));
    if (settings.readAloud) {
      const listenButton = renderListenButton({
        text: segmentText,
        language,
        labelKey: "story.listen",
      });
      segmentCard.appendChild(listenButton);
      segmentCard.appendChild(
        el("p", {
          className: "muted",
          text: t("story.readAloud")
            .replace("{index}", index + 1)
            .replace("{total}", story.segments.length),
        }),
      );
    }

    const supports = renderSupports({ supports: segment.supports, showHints: settings.showHints });
    if (supports) segmentCard.appendChild(supports);

    const interaction = interactions.get(segment.interactionId);
    if (interaction) {
      const interactionNode = renderStoryInteraction({
        interaction,
        progress,
        onComplete: (interactionId) => onInteractionComplete(interactionId),
      });
      segmentCard.appendChild(interactionNode);
    }

    wrapper.appendChild(segmentCard);
  });

  return wrapper;
};
