import { prisma } from '../database.js'

function resetDatabase() {
  return prisma.$queryRaw`TRUNCATE TABLE recommendations RESTART IDENTITY CASCADE`
}

export default { resetDatabase }
