import { el } from "../utils/dom.js";
import { t } from "../i18n.js";
import { speakText } from "../utils/speech.js";

const loaderMap = new WeakMap();
let mediaObserver = null;

const getObserver = () => {
  if (mediaObserver) return mediaObserver;
  mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const loader = loaderMap.get(entry.target);
        if (loader) loader();
        mediaObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "600px 0px" }
  );
  return mediaObserver;
};

const observeLazy = (element, loader) => {
  loaderMap.set(element, loader);
  getObserver().observe(element);
};

const createErrorFallback = ({ wrapper, retry }) => {
  const error = el("div", { className: "media__error" });
  error.appendChild(el("p", { text: t("media.error") }));
  error.appendChild(el("p", { className: "muted", text: t("media.diagnostic") }));
  const button = el("button", { className: "button button--outline", text: t("media.retry") });
  button.addEventListener("click", () => {
    error.remove();
    retry();
  });
  error.appendChild(button);
  wrapper.appendChild(error);
};

const renderTranscript = (text) => {
  if (!text) return null;
  const details = el("details", { className: "media__transcript" });
  const summary = el("summary", { text: t("media.transcriptLabel") });
  details.append(summary, el("p", { text }));
  return details;
};

const renderImage = ({ media, language }) => {
  const wrapper = el("figure", { className: "media media--image", attrs: { "data-media-id": media.id } });
  const img = el("img", {
    attrs: {
      loading: "lazy",
      alt: media.alt ? t(media.alt) : "",
    },
  });
  const load = () => {
    img.src = media.src;
  };
  img.addEventListener("error", () => createErrorFallback({ wrapper, retry: load }));
  observeLazy(wrapper, load);
  wrapper.appendChild(img);
  if (media.caption) wrapper.appendChild(el("figcaption", { text: t(media.caption) }));
  if (media.credit) wrapper.appendChild(el("p", { className: "muted", text: t(media.credit) }));
  return wrapper;
};

const renderVideo = ({ media }) => {
  const wrapper = el("figure", { className: "media media--video", attrs: { "data-media-id": media.id } });
  const video = el("video", {
    attrs: {
      controls: media.controls === false ? null : "controls",
      preload: media.preload || "metadata",
      poster: media.poster || null,
    },
  });
  const source = el("source", { attrs: { type: "video/mp4" } });
  const load = () => {
    source.src = media.src;
    if (media.poster) video.poster = media.poster;
    video.load();
  };
  video.addEventListener("error", () => createErrorFallback({ wrapper, retry: load }));
  if (media.captionsVtt) {
    const track = el("track", { attrs: { kind: "captions", src: media.captionsVtt, srclang: "en" } });
    video.appendChild(track);
  }
  video.appendChild(source);
  observeLazy(wrapper, load);
  wrapper.appendChild(video);
  if (media.caption) wrapper.appendChild(el("figcaption", { text: t(media.caption) }));
  if (media.credit) wrapper.appendChild(el("p", { className: "muted", text: t(media.credit) }));
  return wrapper;
};

const renderAudio = ({ media }) => {
  const wrapper = el("div", { className: "media media--audio", attrs: { "data-media-id": media.id } });
  const audio = el("audio", { attrs: { controls: media.controls === false ? null : "controls", preload: media.preload || "metadata" } });
  const source = el("source", { attrs: { type: "audio/mpeg" } });
  const load = () => {
    source.src = media.src;
    audio.load();
  };
  audio.addEventListener("error", () => createErrorFallback({ wrapper, retry: load }));
  audio.appendChild(source);
  observeLazy(wrapper, load);
  wrapper.appendChild(audio);
  if (media.caption) wrapper.appendChild(el("p", { text: t(media.caption) }));
  if (media.transcriptText) {
    const transcript = renderTranscript(t(media.transcriptText));
    if (transcript) wrapper.appendChild(transcript);
  }
  if (media.credit) wrapper.appendChild(el("p", { className: "muted", text: t(media.credit) }));
  return wrapper;
};

export const renderMediaGroup = ({ mediaItems = [], language }) => {
  const wrapper = el("div", { className: "media-group" });
  mediaItems.forEach((media) => {
    if (!media || !media.type) return;
    if (media.type === "image") wrapper.appendChild(renderImage({ media, language }));
    if (media.type === "video") wrapper.appendChild(renderVideo({ media }));
    if (media.type === "audio") wrapper.appendChild(renderAudio({ media }));
  });
  return wrapper;
};

export const renderListenButton = ({ text, language, labelKey, onClick }) => {
  const button = el("button", { className: "button button--outline", text: t(labelKey) });
  button.addEventListener("click", () => {
    speakText(text, language);
    if (onClick) onClick();
  });
  return button;
};
