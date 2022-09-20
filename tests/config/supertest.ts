import supertest from 'supertest'
import app from '../../src/app'

const agent = supertest(app)

export default agent
