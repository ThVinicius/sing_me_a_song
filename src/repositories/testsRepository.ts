import { prisma } from '../database.js'
import recommendationsFactory from '../utils/recommendationsFactory.js'

function resetDatabase() {
  return prisma.$queryRaw`TRUNCATE TABLE recommendations RESTART IDENTITY CASCADE`
}

function getRecommendationByName(name: string) {
  return prisma.recommendation.findUnique({ where: { name } })
}

function createTopTen() {
  const recommendations = () =>
    recommendationsFactory().map(recommendation =>
      prisma.recommendation.create({ data: recommendation })
    )

  return prisma.$transaction(recommendations())
}

export default { resetDatabase, getRecommendationByName, createTopTen }
