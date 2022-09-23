import { recommendationService } from '../../src/services/recommendationsService'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'
import findRecommendationFactory from '../recommendationFactory/findRecommendationFactory'
import recommendationFactory from '../recommendationFactory/recommendationFactory'
import recommendations from '../recommendationFactory/recommendationsFactory'

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

    return expect(promise).rejects.toEqual({
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

    return expect(promise).rejects.toEqual({ type: 'not_found', message: '' })
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

    return expect(promise).rejects.toEqual({ type: 'not_found', message: '' })
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

    return expect(result).toEqual(findRecommendation)
  })
})

describe('testes da função getTop', () => {
  it('testa o retorno dela', async () => {
    const amount = 10

    const findRecommendation = [findRecommendationFactory()]

    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockResolvedValueOnce(findRecommendation)

    const result = await recommendationService.getTop(amount)

    return expect(result).toEqual(findRecommendation)
  })
})

describe('testes da função getRandom', () => {
  it('retornando uma recomendação com score maior que 10', async () => {
    const score1 = 12
    const score2 = 0

    const expectRecommendations = recommendations.expectRecommendations(score1)

    const fillersRecommendations =
      recommendations.fillersRecommendations(score2)

    const allRecommendations = [
      ...fillersRecommendations,
      ...expectRecommendations
    ]

    const mathRandomValue = 0.5

    const filterRecommentations = () => {
      if (mathRandomValue < 0.7) {
        return allRecommendations.filter(item => item.score > 10)
      }

      return allRecommendations.filter(item => item.score <= 10)
    }

    jest.spyOn(Math, 'random').mockReturnValueOnce(mathRandomValue)

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(filterRecommentations())

    const result = await recommendationService.getRandom()

    return expect(expectRecommendations).toContain(result)
  })

  it('retornando uma recomendação com score menor ou igual a 10', async () => {
    const score1 = 0
    const score2 = 12

    const expectRecommendations = recommendations.expectRecommendations(score1)

    const fillersRecommendations =
      recommendations.fillersRecommendations(score2)

    const allRecommendations = [
      ...fillersRecommendations,
      ...expectRecommendations
    ]

    const mathRandomValue = 0.8

    const filterRecommentations = () => {
      if (mathRandomValue < 0.7) {
        return allRecommendations.filter(item => item.score > 10)
      }

      return allRecommendations.filter(item => item.score <= 10)
    }

    jest.spyOn(Math, 'random').mockReturnValueOnce(mathRandomValue)

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(filterRecommentations())

    const result = await recommendationService.getRandom()

    return expect(expectRecommendations).toContain(result)
  })

  it('nenhuma recomendação cadastrada', () => {
    const allRecommendations = []

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(allRecommendations)
      .mockResolvedValueOnce(allRecommendations)

    const promise = recommendationService.getRandom()

    return expect(promise).rejects.toEqual({ type: 'not_found', message: '' })
  })

  it('mathRandom abaixo de 0.7 e nenhuma recomendação acima de 10', async () => {
    const score1 = 0
    const score2 = 2

    const expectRecommendations = recommendations.expectRecommendations(score1)

    const fillersRecommendations =
      recommendations.fillersRecommendations(score2)

    const allRecommendations = [
      ...fillersRecommendations,
      ...expectRecommendations
    ]

    const mathRandomValue = 0.5

    const filterRecommentations = () => {
      if (mathRandomValue < 0.7) {
        return allRecommendations.filter(item => item.score > 10)
      }

      return allRecommendations.filter(item => item.score <= 10)
    }

    jest.spyOn(Math, 'random').mockReturnValueOnce(mathRandomValue)

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(filterRecommentations())
      .mockResolvedValueOnce(allRecommendations)

    const { score } = await recommendationService.getRandom()

    return expect(score).toBeLessThan(10)
  })

  it('mathRandom maior ou igual a 0.7 e nenhuma recomendação abaixo de 10', async () => {
    const score1 = 11
    const score2 = 13

    const expectRecommendations = recommendations.expectRecommendations(score1)

    const fillersRecommendations =
      recommendations.fillersRecommendations(score2)

    const allRecommendations = [
      ...fillersRecommendations,
      ...expectRecommendations
    ]

    const mathRandomValue = 0.9

    const filterRecommentations = () => {
      if (mathRandomValue < 0.7) {
        return allRecommendations.filter(item => item.score > 10)
      }

      return allRecommendations.filter(item => item.score <= 10)
    }

    jest.spyOn(Math, 'random').mockReturnValueOnce(mathRandomValue)

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockResolvedValueOnce(filterRecommentations())
      .mockResolvedValueOnce(allRecommendations)

    const { score } = await recommendationService.getRandom()

    return expect(score).toBeGreaterThanOrEqual(10)
  })
})
