export function validateEpisodeData(episode) {
  if (!episode?.sections) {
    throw new Error('Episode data missing sections');
  }
}
