import agent from '../config/supertest'
import { prisma } from '../../src/database'
import recommendationFactory from '../recommendationFactory/recommendationFactory'

beforeEach(() => prisma.$queryRaw`TRUNCATE TABLE recommendations CASCADE`)

afterAll(async () => await prisma.$disconnect())

describe('POST /', () => {
  it('criar recomendação com dados válidos', async () => {
    const data = recommendationFactory()

    const { status } = await agent.post('/recommendations/').send(data)

    const find = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    expect(status).toEqual(201)

    expect(find).not.toBeNull()
  })

  it('criar recomendação com o nome repetido', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations/').send(data)

    const find = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    const { status } = await agent.post('/recommendations/').send(data)

    expect(status).toEqual(409)

    expect(find).not.toBeNull()
  })
})
