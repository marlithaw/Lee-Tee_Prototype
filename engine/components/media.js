import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { speakText } from "../utils/speech.js";

const lazyLoaders = new WeakMap();
let mediaObserver;

const ensureObserver = () => {
  if (mediaObserver) return;
  mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const loader = lazyLoaders.get(entry.target);
        if (loader) loader();
        mediaObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "600px 0px" },
  );
};

const registerLazyLoad = (node, loader) => {
  ensureObserver();
  lazyLoaders.set(node, loader);
  mediaObserver.observe(node);
};

const renderError = ({ onRetry, src }) => {
  const wrapper = el("div", { className: "media-error", attrs: { role: "alert" } });
  wrapper.appendChild(el("strong", { text: t("media.errorTitle") }));
  wrapper.appendChild(el("p", { className: "muted", text: t("media.errorDetail").replace("{src}", src) }));
  const retry = el("button", { className: "button button--ghost", text: t("media.retry") });
  retry.addEventListener("click", () => onRetry());
  wrapper.appendChild(retry);
  return wrapper;
};

const attachLoadHandling = ({ element, wrapper, load, src }) => {
  const reset = () => {
    wrapper.querySelector(".media-error")?.remove();
    load();
  };

  element.addEventListener("error", () => {
    wrapper.querySelector(".media-error")?.remove();
    wrapper.appendChild(renderError({ onRetry: reset, src }));
  });

  registerLazyLoad(wrapper, load);
};

const renderCaption = ({ captionKey, creditKey }) => {
  if (!captionKey && !creditKey) return null;
  const caption = el("figcaption", { className: "media-caption" });
  if (captionKey) caption.appendChild(el("p", { text: t(captionKey) }));
  if (creditKey) caption.appendChild(el("p", { className: "muted", text: t(creditKey) }));
  return caption;
};

const renderTranscript = (transcriptKey) => {
  if (!transcriptKey) return null;
  const wrapper = el("details", { className: "media-transcript" });
  wrapper.appendChild(el("summary", { text: t("media.transcriptLabel") }));
  wrapper.appendChild(el("p", { text: t(transcriptKey) }));
  return wrapper;
};

const createMediaElement = (media) => {
  if (media.type === "image") {
    return el("img", {
      className: "media",
      attrs: { loading: "lazy", alt: t(media.alt), "data-src": media.src },
    });
  }
  if (media.type === "video") {
    const video = el("video", {
      className: "media",
      attrs: {
        controls: media.controls === false ? null : "controls",
        preload: media.preload || "metadata",
        poster: media.poster || null,
        "aria-label": t(media.alt),
        "data-src": media.src,
      },
    });
    if (media.captionsVtt) {
      const track = el("track", { attrs: { kind: "captions", src: media.captionsVtt } });
      video.appendChild(track);
    }
    return video;
  }
  const audio = el("audio", {
    className: "media",
    attrs: {
      controls: media.controls === false ? null : "controls",
      preload: media.preload || "metadata",
      "aria-label": t(media.alt),
      "data-src": media.src,
    },
  });
  return audio;
};

const loadMediaElement = (element, media) => {
  const src = element.getAttribute("data-src");
  if (!src) return;
  if (element.tagName === "VIDEO" || element.tagName === "AUDIO") {
    element.src = `${src}${src.includes("?") ? "&" : "?"}cacheBust=${Date.now()}`;
    element.load();
  } else if (element.tagName === "IMG") {
    element.src = `${src}${src.includes("?") ? "&" : "?"}cacheBust=${Date.now()}`;
  }
};

export const renderSectionMedia = ({ items }) => {
  if (!items || !items.length) return null;
  const grid = el("div", { className: "media-grid" });

  items.forEach((media) => {
    const figure = el("figure", { className: "media-card" });
    const mediaElement = createMediaElement(media);

    attachLoadHandling({
      element: mediaElement,
      wrapper: figure,
      load: () => loadMediaElement(mediaElement, media),
      src: media.src,
    });

    figure.appendChild(mediaElement);
    const caption = renderCaption({ captionKey: media.caption, creditKey: media.credit });
    if (caption) figure.appendChild(caption);
    const transcript = renderTranscript(media.transcriptText);
    if (transcript) figure.appendChild(transcript);
    grid.appendChild(figure);
  });

  return grid;
};

export const renderListenButton = ({ text, language, labelKey, onClick }) => {
  const button = el("button", {
    className: "button button--outline",
    text: t(labelKey),
    attrs: { type: "button", "aria-label": t(labelKey) },
  });
  button.addEventListener("click", () => {
    speakText(text, language);
    if (onClick) onClick();
  });
  return button;
};
