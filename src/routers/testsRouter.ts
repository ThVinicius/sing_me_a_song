import { Router } from 'express'
import testsController from '../controllers/testsController.js'

const route = Router()

route.post('/reset', testsController.resetDatabase)

route.get('/recommendations/name', testsController.getRecommendationByName)

export default route
