import { Router } from 'express'
import testsController from '../controllers/testsController.js'

const route = Router()

route.post('/tests/reset', testsController.resetDatabase)

route.get(
  '/tests/recommendations/name',
  testsController.getRecommendationByName
)

export default route
