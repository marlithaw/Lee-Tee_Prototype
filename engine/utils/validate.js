export const validateEpisode = (episode) => {
  const errors = [];
  if (!episode?.id) errors.push("Episode id missing");
  if (!episode?.sections?.length) errors.push("Episode sections missing");
  return errors;
};
