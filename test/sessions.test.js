import chai from 'chai';
import supertest from 'supertest';
import { cleanDatabase } from './setup.js';
import config from '../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.PORT}`);

describe('Sessions Router - Functional Tests', function() {
    this.timeout(5000);

    beforeEach(async function() {
        await cleanDatabase();
    });

    const mockUser = {
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        password: 'password123'
    };

    it('POST /api/sessions/register - should register a new user successfully', async () => {
        const response = await requester.post('/api/sessions/register').send(mockUser);
        
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body).to.have.property('payload');
    });

    it('POST /api/sessions/register - should fail if user already exists', async () => {
        // Primero, registrar el usuario
        await requester.post('/api/sessions/register').send(mockUser);

        // Intentar registrarlo de nuevo
        const response = await requester.post('/api/sessions/register').send(mockUser);

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('User already exists');
    });

    it('POST /api/sessions/login - should log in a user and return a cookie', async () => {
        // Primero, registrar el usuario
        await requester.post('/api/sessions/register').send(mockUser);

        const loginCredentials = {
            email: mockUser.email,
            password: mockUser.password
        };

        const response = await requester.post('/api/sessions/login').send(loginCredentials);
        
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Logged in');
        
        // Verificar que se haya establecido la cookie
        const cookie = response.headers['set-cookie'][0];
        expect(cookie).to.include('coderCookie');
    });

    it('GET /api/sessions/current - should return current user info from token', async () => {
        // Registrar y loguear para obtener la cookie
        await requester.post('/api/sessions/register').send(mockUser);
        const loginRes = await requester.post('/api/sessions/login').send({
            email: mockUser.email,
            password: mockUser.password
        });

        const cookie = loginRes.headers['set-cookie'][0];

        // Usar la cookie para la siguiente petición
        const response = await requester.get('/api/sessions/current').set('Cookie', cookie);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload.email).to.equal(mockUser.email);
        expect(response.body.payload.name).to.equal(`${mockUser.first_name} ${mockUser.last_name}`);
    });
});