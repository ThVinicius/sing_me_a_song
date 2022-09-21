import { Router } from 'express'
import testsController from '../controllers/testsController.js'

const route = Router()

route.post('/reset-database', testsController.resetDatabase)

export default route
