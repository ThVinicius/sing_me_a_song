import { recommendationService } from '../../src/services/recommendationsService'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'

describe('testando a função insert', () => {
  it('testando sem conflito', async () => {
    const recommendation = {
      name: 'teste',
      youtubeLink: 'https://google.com'
    }

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockResolvedValueOnce(null)

    jest.spyOn(recommendationRepository, 'create').mockResolvedValueOnce(null)

    await recommendationService.insert(recommendation)

    expect(recommendationRepository.findByName).toBeCalled()

    expect(recommendationRepository.create).toBeCalled()
  })

  it('testando com conflito', async () => {
    const recommendation = {
      name: 'teste',
      youtubeLink: 'https://google.com'
    }

    const findRecommendation = {
      id: 1,
      name: 'teste',
      youtubeLink: 'https://google.com',
      score: 0
    }

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
