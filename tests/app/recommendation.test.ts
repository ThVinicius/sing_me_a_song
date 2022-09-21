import agent from '../config/supertest'
import { prisma } from '../../src/database'
import recommendationFactory from '../recommendationFactory/recommendationFactory'

beforeEach(() => prisma.$queryRaw`TRUNCATE TABLE recommendations CASCADE`)

afterAll(async () => await prisma.$disconnect())

describe('POST /recommendations', () => {
  it('criar recomendação com dados válidos', async () => {
    const data = recommendationFactory()

    const { status } = await agent.post('/recommendations').send(data)

    const find = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    expect(status).toEqual(201)

    expect(find).not.toBeNull()
  })

  it('criar recomendação com o nome repetido', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    const find = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    const { status } = await agent.post('/recommendations').send(data)

    expect(status).toEqual(409)

    expect(find).not.toBeNull()
  })
})

describe('GET /recommendations', () => {
  it('criar recomendação com dados válidos', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    const { body } = await agent.get('/recommendations')

    expect(body).toBeInstanceOf(Array)
  })
})

describe('POST /recommendations/:id/upvote', () => {
  it('criar voto com id válido', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    const { id } = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    const result = await agent.post(`/recommendations/${id}/upvote`)

    const { score } = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    expect(result.status).toEqual(200)

    expect(score).toEqual(1)
  })

  it('criar voto com id inexistente', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    let { id } = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    id++

    const { status } = await agent.post(`/recommendations/${id}/upvote`)

    expect(status).toEqual(404)
  })
})
