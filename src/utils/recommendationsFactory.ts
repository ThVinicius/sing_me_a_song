import { Recommendation } from '@prisma/client'

type IRecommendation = Omit<Recommendation, 'id'>

export default function recommendationsFactory(): IRecommendation[] {
  const recommendations = []

  for (let i = 1; i <= 10; i++) {
    const score = 2 * i

    const key = i

    const recommendation = {
      name: `Falamansa - Xote dos Milagres ${key}`,
      youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
      score
    }

    recommendations.push(recommendation)
  }

  return recommendations
}
