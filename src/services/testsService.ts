import testsRepository from '../repositories/testsRepository.js'

function resetDatabase() {
  return testsRepository.resetDatabase()
}

export default { resetDatabase }
