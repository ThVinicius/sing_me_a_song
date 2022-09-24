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

async function createTopTen(_: Request, res: Response) {
  const recommendations = await testsService.createTopTen()

  return res.status(201).send(recommendations)
}

export default { resetDatabase, getRecommendationByName, createTopTen }
