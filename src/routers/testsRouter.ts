import { Router } from 'express'
import testsController from '../controllers/testsController.js'

const route = Router()

route.post('/reset', testsController.resetDatabase)

route.get('/recommendations/name', testsController.getRecommendationByName)

route.post('/recommendations/topten', testsController.createTopTen)

export default route
