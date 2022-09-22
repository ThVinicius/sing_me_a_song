import { prisma } from '../database.js'

function resetDatabase() {
  return prisma.$queryRaw`TRUNCATE TABLE recommendations RESTART IDENTITY CASCADE`
}

function getRecommendationByName(name: string) {
  return prisma.recommendation.findUnique({ where: { name } })
}

export default { resetDatabase, getRecommendationByName }
