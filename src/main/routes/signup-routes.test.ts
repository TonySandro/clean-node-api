import request from 'supertest'
import app from '../config/app'

describe('Signup routes', () => {
    test('Should return an account on success', async () => {

        await request(app)
            .post('/api/signup')
            .send({
                name: 'Tony',
                email: 'tonysduarte101@gmail.com',
                password: 'tonytony123',
                passwordConfimation: 'tonytony123'
            })
            .expect(200)
    })
})
