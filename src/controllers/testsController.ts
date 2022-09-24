import { Request, Response } from 'express'
import testsService from '../services/testsService.js'

async function resetDatabase(_: Request, res: Response) {
  await testsService.resetDatabase()

  return res.sendStatus(200)
}

async function getRecommendationByName(req: Request, res: Response) {
  const { name } = req.body as { name: string }

  const recommendation = await testsService.getRecommendationByName(name)

  return res.status(200).send({ recommendation })
}

export default { resetDatabase, getRecommendationByName }
