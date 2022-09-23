export default function findRecommendationFactory(
  score: number = 0,
  id: number = 0
) {
  return {
    id,
    name: 'teste',
    youtubeLink: 'https://google.com',
    score
  }
}
