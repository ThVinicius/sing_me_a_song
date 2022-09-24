import testsRepository from '../repositories/testsRepository.js'

function resetDatabase() {
  return testsRepository.resetDatabase()
}

function getRecommendationByName(name: string) {
  return testsRepository.getRecommendationByName(name)
}

function createTopTen() {
  return testsRepository.createTopTen()
}

export default { resetDatabase, getRecommendationByName, createTopTen }
