import chai from 'chai'
import mongoose from 'mongoose'
import supertest from 'supertest'
import __dirname from '../src/path.js'
import dotenv from '../src/dotenv.js'

const expect = chai.expect

await mongoose.connect(varenv.mongo_url)

const requester = supertest('http://localhost:8000')

describe('Rutas de sesiones de usuarios (Register, Login y Current)', function () {
    let user = {}
    let cookie = {}

    it('Ruta: api/session/register con el metodo POST', async () => {
        const newUser = {
            first_name: "Federico",
            last_name: "Fernandez",
            email: "fefe@fefe.com",
            password: "fedefede",
            age: 34
        }

        const { _body, statusCode } = await requester.post('/api/sessions/register').send(newUser)
        user = _body?.payload
        user.password = newUser.password
        expect(statusCode).to.be.equal(200)

    })

    it('Ruta: api/session/login con el metodo POST', async () => {
        console.log(user)
        const result = await requester.post('/api/sessions/login').send(user)
        const cookieResult = result.headers['set-cookie'][0]

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1].split(";")[0]
        }

        expect(cookie.name).to.be.ok.and.equal('coderCookie')
        expect(cookie.value).to.be.ok
    })

    it('Ruta: api/session/current con el metodo GET', async () => {

        const { _body } = await requester.get('/api/sessions/current')
            .set('Cookie', [`${cookie.name} = ${cookie.value}`])

        console.log(_body.payload)

        expect(_body.payload.email).to.be.equal(user.email)
    })

})

/*
describe('Test CRUD de Mascotas en la ruta api/pets', function () {
    it('Ruta: api/pets metodo GET', async () => {
        const { ok, _body } = await requester.get('/api/pets')
        expect(ok).to.be.ok
    })

    it('Ruta: api/pets metodo POST', async () => {

        const newPet = {
            name: "Pirata",
            specie: "Perro",
            birthDate: '01-01-2022'
        }

        const { statusCode, _body, ok } = await requester.post('/api/pets').send(newPet)

        //expect(ok).to.be.ok
        expect(statusCode).to.be.equal(200)
        //expect(_body.status).to.be.equal('success')

    })

    it('Ruta: api/pets/withimage metodo POST', async () => {

        const newPet = {
            name: "Jengibre II",
            specie: "Gato",
            birthDate: '02-01-2022'
        }
        console.log(`${__dirname}/public/img/jengibre.jpg`)
        const { statusCode, _body } = await requester.post('/api/pets/withimage')
            .field('name', newPet.name)
            .field('specie', newPet.specie)
            .field('birthDate', newPet.birthDate)
            .field('image', `${__dirname}/public/img/jengibre.jpg`)
        console.log(_body)
        //expect(_body.payload).to.have.property('_id')
        expect(_body.payload.image).to.be.ok

    })

    it('Ruta: api/pets metodo PUT', async () => {
        const id = '666a3dd6bd414598add89b53'
        const updatePet = {
            name: "Naranjin",
            specie: 'Gato',
            birthDate: '12-25-2022'
        }
        const { statusCode } = await requester.put(`/api/pets/${id}`).send(updatePet)
        expect(statusCode).to.be.equal(200)
    })


    it('Ruta: api/pets metodo DELETE', async () => {
        const id = '666a3dd6bd414598add89b53'

        const { statusCode } = await requester.delete(`/api/pets/${id}`)
        expect(statusCode).to.be.equal(200)
    })
})*/