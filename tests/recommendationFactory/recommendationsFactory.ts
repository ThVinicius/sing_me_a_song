import findRecommendationFactory from './findRecommendationFactory'

type IRecommendations = {
  id: number
  name: string
  youtubeLink: string
  score: number
}[]

function expectRecommendations(index: number): IRecommendations {
  const expectRecommendations = []

  for (let i = index; i < index + 2; i++) {
    const id = i

    const score = i

    expectRecommendations.push(findRecommendationFactory(score, id))
  }

  return expectRecommendations
}

function fillersRecommendations(index: number): IRecommendations {
  const recommendationsFillers = []

  for (let i = index; i < index + 8; i++) {
    const id = i

    const score = i

    recommendationsFillers.push(findRecommendationFactory(score, id))
  }

  return recommendationsFillers
}

export default { expectRecommendations, fillersRecommendations }
