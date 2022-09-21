import agent from '../config/supertest'
import { prisma } from '../../src/database'
import recommendationFactory from '../recommendationFactory/recommendationFactory'
import top5Factory from '../recommendationFactory/top5Factory'

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

describe('POST /recommendations/:id/downvote', () => {
  it('remover ponto com id válido', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    const { id } = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    const result = await agent.post(`/recommendations/${id}/downvote`)

    const { score } = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    expect(result.status).toEqual(200)

    expect(score).toEqual(-1)
  })

  it('remover ponto com id inexistente', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    let { id } = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    id++

    const { status } = await agent.post(`/recommendations/${id}/downvote`)

    expect(status).toEqual(404)
  })

  it('remover recomendação com voto abaixo de -5', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    const { id } = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    await prisma.recommendation.update({
      where: { id },
      data: { score: -5 }
    })

    const { status } = await agent.post(`/recommendations/${id}/downvote`)

    const recommendation = await prisma.recommendation.findUnique({
      where: { id }
    })

    expect(status).toEqual(200)

    expect(recommendation).toBeNull()
  })
})

describe('GET /recommendations', () => {
  it('buscar recomendações existente', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    const { body } = await agent.get('/recommendations')

    expect(body).toBeInstanceOf(Array)
  })
})

describe('GET /recommendations/:id', () => {
  it('buscar recomendação com id válido', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    const recommendation = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    const { body, status } = await agent.get(
      `/recommendations/${recommendation.id}`
    )

    expect(status).toEqual(200)

    expect(body).toEqual(recommendation)
  })

  it('buscar recomendação com id inválido', async () => {
    const data = recommendationFactory()

    await agent.post('/recommendations').send(data)

    let { id } = await prisma.recommendation.findUnique({
      where: { name: data.name }
    })

    id++

    const { status } = await agent.get(`/recommendations/${id}`)

    expect(status).toEqual(404)
  })
})

describe('GET /recommendations/top/:amount', () => {
  it('busca top 3', async () => {
    const data = top5Factory()

    const [top1, top2, top3] = await prisma.$transaction(
      data.map(item => prisma.recommendation.create({ data: item }))
    )

    const { body } = await agent.get(`/recommendations/top/3`)

    expect(body).toEqual([top1, top2, top3])
  })
})
