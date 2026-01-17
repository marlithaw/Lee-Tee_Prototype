export const getEpisodeId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("episode") || "episode1";
};
