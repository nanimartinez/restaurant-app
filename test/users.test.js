import chai from 'chai';
import supertest from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import { cleanDatabase } from './setup.js';
import config from '../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.PORT}`);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Users Router - Functional Tests', function() {
    let testUserId;

    // Crear un usuario antes de las pruebas de GET, PUT, DELETE
    before(async function() {
        await cleanDatabase();
        const mockUser = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@test.com',
            password: 'password123'
        };
        const registerResponse = await requester.post('/api/sessions/register').send(mockUser);
        testUserId = registerResponse.body.payload;
    });

    it('GET /api/users - should get all users', async () => {
        const response = await requester.get('/api/users');
        
        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an('array');
        expect(response.body.payload.length).to.be.at.least(1);
    });

    it('GET /api/users/:uid - should get a single user by ID', async () => {
        const response = await requester.get(`/api/users/${testUserId}`);

        expect(response.status).to.equal(200);
        expect(response.body.payload._id).to.equal(testUserId);
        expect(response.body.payload.email).to.equal('john.doe@test.com');
    });

    it('PUT /api/users/:uid - should update a user', async () => {
        const updatedData = {
            last_name: 'Smith'
        };
        const response = await requester.put(`/api/users/${testUserId}`).send(updatedData);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('User updated');
        expect(response.body.payload.last_name).to.equal(updatedData.last_name);
    });

    it('POST /api/users/:uid/documents - should upload documents for a user', async () => {
        const docPath = path.resolve(__dirname, 'assets/test-document.txt');

        const response = await requester
            .post(`/api/users/${testUserId}/documents`)
            .attach('documents', docPath);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Documents uploaded successfully');
        expect(response.body.documents).to.be.an('array').with.lengthOf(1);
        expect(response.body.documents[0].name).to.equal('test-document.txt');
    });

    it('DELETE /api/users/:uid - should delete a user', async () => {
        const response = await requester.delete(`/api/users/${testUserId}`);
        
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('User deleted');

        // Verificar que ya no existe
        const getResponse = await requester.get(`/api/users/${testUserId}`);
        expect(getResponse.status).to.equal(404);
    });
});