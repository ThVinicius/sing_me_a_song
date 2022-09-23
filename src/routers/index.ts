import { Router } from 'express'
import dotenv from 'dotenv'
import recommendationRouter from './recommendationRouter.js'
import testsRouter from './testsRouter.js'

dotenv.config()

const route = Router()

route.use('/recommendations', recommendationRouter)

if (process.env.NODE_ENV === 'TEST') route.use('/tests', testsRouter)

export default route
