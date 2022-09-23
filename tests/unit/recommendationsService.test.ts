import { recommendationService } from '../../src/services/recommendationsService'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'
import findRecommendationFactory from '../recommendationFactory/findRecommendationFactory'
import recommendationFactory from '../recommendationFactory/recommendationFactory'

describe('testando a função insert', () => {
  it('testando sem conflito', async () => {
    const recommendation = recommendationFactory()

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockResolvedValueOnce(null)

    jest.spyOn(recommendationRepository, 'create').mockResolvedValueOnce(null)

    await recommendationService.insert(recommendation)

    expect(recommendationRepository.findByName).toBeCalled()

    expect(recommendationRepository.create).toBeCalled()
  })

  it('testando com conflito', () => {
    const recommendation = recommendationFactory()

    const findRecommendation = findRecommendationFactory()

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockResolvedValueOnce(findRecommendation)

    const promise = recommendationService.insert(recommendation)

    expect(promise).rejects.toEqual({
      type: 'conflict',
      message: 'Recommendations names must be unique'
    })
  })
})

describe('testando a função upvote', () => {
  it('testando com id existente', async () => {
    const id = 1

    const findRecommendation = findRecommendationFactory()

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(findRecommendation)

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(null)

    await recommendationService.upvote(id)

    expect(recommendationRepository.find).toBeCalled()

    expect(recommendationRepository.updateScore).toBeCalled()
  })

  it('testando com id inexistente', () => {
    const id = 1

    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null)

    const promise = recommendationService.upvote(id)

    expect(promise).rejects.toEqual({ type: 'not_found', message: '' })
  })
})

describe('testando a função downvote', () => {
  it('testando com id existente', async () => {
    const id = 1

    const findRecommendation = findRecommendationFactory()

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(findRecommendation)

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(findRecommendation)

    await recommendationService.downvote(id)

    expect(recommendationRepository.find).toBeCalled()

    expect(recommendationRepository.updateScore).toBeCalled()
  })

  it('testando com id inexistente', () => {
    const id = 1

    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null)

    const promise = recommendationService.downvote(id)

    expect(promise).rejects.toEqual({ type: 'not_found', message: '' })
  })

  it('testando com score abaixo de -5', async () => {
    const id = 1

    const findRecommendation = findRecommendationFactory()

    findRecommendation.score = -6

    jest
      .spyOn(recommendationRepository, 'find')
      .mockResolvedValueOnce(findRecommendation)

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockResolvedValueOnce(findRecommendation)

    jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null)

    await recommendationService.downvote(id)

    expect(recommendationRepository.find).toBeCalled()

    expect(recommendationRepository.updateScore).toBeCalled()

    expect(recommendationRepository.remove).toBeCalled()
  })
})

describe('testes da função get', () => {
  it('testa o retorno dela', async () => {
    const findRecommendation = [findRecommendationFactory()]

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(findRecommendation)

    const result = await recommendationService.get()

    expect(result).toEqual(findRecommendation)
  })
})
