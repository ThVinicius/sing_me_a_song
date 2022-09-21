import { Request, Response } from 'express'
import testsService from '../services/testsService.js'

async function resetDatabase(_: Request, res: Response) {
  await testsService.resetDatabase()

  return res.sendStatus(200)
}

export default { resetDatabase }
