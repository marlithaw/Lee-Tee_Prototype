import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { speakText } from "../utils/speech.js";

const createErrorFallback = ({ message, onRetry }) => {
  const fallback = el("div", { className: "media__fallback" });
  fallback.appendChild(el("p", { text: message }));
  const retry = el("button", { className: "button button--ghost", text: t("media.retry") });
  retry.addEventListener("click", () => onRetry());
  fallback.appendChild(retry);
  return fallback;
};

const attachErrorHandling = (mediaEl, wrapper, reload) => {
  const showFallback = (errorType) => {
    mediaEl.classList.add("media__hidden");
    const fallback = createErrorFallback({
      message: `${t("media.error")} ${errorType || ""}`.trim(),
      onRetry: () => {
        wrapper.querySelector(".media__fallback")?.remove();
        mediaEl.classList.remove("media__hidden");
        reload();
      },
    });
    wrapper.appendChild(fallback);
  };

  mediaEl.addEventListener("error", () => {
    showFallback(mediaEl.dataset.type || "");
  });
};

const applyMediaSource = (mediaEl) => {
  const src = mediaEl.dataset.src;
  if (src) {
    mediaEl.setAttribute("src", src);
  }
  const poster = mediaEl.dataset.poster;
  if (poster) {
    mediaEl.setAttribute("poster", poster);
  }
  const track = mediaEl.querySelector("track[data-src]");
  if (track) {
    track.setAttribute("src", track.dataset.src);
  }
};

const buildMediaElement = (media) => {
  const wrapper = el("figure", { className: "media" });
  let mediaEl;
  if (media.type === "image") {
    mediaEl = el("img", {
      className: "media__asset",
      attrs: {
        loading: "lazy",
        alt: media.alt ? t(media.alt) : t("media.altFallback"),
        "data-src": media.src,
        "data-type": media.type,
      },
    });
  }
  if (media.type === "video") {
    mediaEl = el("video", {
      className: "media__asset",
      attrs: {
        controls: media.controls === false ? null : "controls",
        preload: media.preload || "metadata",
        "data-src": media.src,
        "data-poster": media.poster || "",
        "data-type": media.type,
        "aria-label": t("media.videoAria"),
      },
    });
    if (media.captionsVtt) {
      const track = el("track", {
        attrs: {
          kind: "captions",
          srclang: "en",
          label: t("media.captions"),
          "data-src": media.captionsVtt,
        },
      });
      mediaEl.appendChild(track);
    }
  }
  if (media.type === "audio") {
    mediaEl = el("audio", {
      className: "media__asset",
      attrs: {
        controls: media.controls === false ? null : "controls",
        preload: media.preload || "metadata",
        "data-src": media.src,
        "data-type": media.type,
        "aria-label": t("media.audioAria"),
      },
    });
  }

  if (!mediaEl) return null;

  attachErrorHandling(mediaEl, wrapper, () => applyMediaSource(mediaEl));
  wrapper.appendChild(mediaEl);

  if (media.caption) {
    wrapper.appendChild(el("figcaption", { className: "media__caption", text: t(media.caption) }));
  }
  if (media.credit) {
    wrapper.appendChild(el("p", { className: "media__credit muted", text: t(media.credit) }));
  }
  if (media.type === "audio" && media.transcriptText) {
    const transcript = el("details", { className: "media__transcript" });
    transcript.appendChild(el("summary", { text: t("media.transcript") }));
    transcript.appendChild(el("p", { text: t(media.transcriptText) }));
    wrapper.appendChild(transcript);
  }

  return wrapper;
};

export const renderMediaGroup = (mediaItems = []) => {
  if (!mediaItems.length) return null;
  const group = el("div", { className: "media-group" });
  mediaItems.forEach((media) => {
    const item = buildMediaElement(media);
    if (item) group.appendChild(item);
  });
  return group;
};

export const observeMedia = (root) => {
  const mediaNodes = root.querySelectorAll(".media__asset[data-src]");
  if (!mediaNodes.length) return;
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const mediaEl = entry.target;
        applyMediaSource(mediaEl);
        mediaEl.setAttribute("data-loaded", "true");
        observerInstance.unobserve(mediaEl);
      });
    },
    { rootMargin: "600px 0px" },
  );
  mediaNodes.forEach((node) => observer.observe(node));
};

export const renderListenButton = ({ text, language, labelKey, onClick }) => {
  const button = el("button", {
    className: "button button--outline",
    text: t(labelKey),
    attrs: { "aria-label": t("story.listenAria") },
  });
  button.addEventListener("click", () => {
    speakText(text, language);
    if (onClick) onClick();
  });
  return button;
};
