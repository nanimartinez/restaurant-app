import chai from 'chai';
import supertest from 'supertest';
import { cleanDatabase } from './setup.js';
import config from '../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.PORT}`);

describe('Restaurants Router - Functional Tests', function() {
    let createdRestaurantId;

    beforeEach(async function() {
        await cleanDatabase();
        // Crear un restaurante para pruebas de GET, PUT, DELETE
        const mockRestaurant = {
            name: 'The Test Kitchen',
            address: '123 Test Ave',
            phone: '555-0123'
        };
        const res = await requester.post('/api/restaurants').send(mockRestaurant);
        createdRestaurantId = res.body.payload._id;
    });

    it('POST /api/restaurants - should create a new restaurant', async () => {
        const newRestaurant = {
            name: 'The New Place',
            address: '456 New St'
        };
        const response = await requester.post('/api/restaurants').send(newRestaurant);
        
        expect(response.status).to.equal(201);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload.name).to.equal(newRestaurant.name);
    });

    it('GET /api/restaurants - should get all restaurants', async () => {
        const response = await requester.get('/api/restaurants');

        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an('array');
        expect(response.body.payload.length).to.be.at.least(1);
    });

    it('GET /api/restaurants/:rid - should get a single restaurant by ID', async () => {
        const response = await requester.get(`/api/restaurants/${createdRestaurantId}`);

        expect(response.status).to.equal(200);
        expect(response.body.payload._id).to.equal(createdRestaurantId);
        expect(response.body.payload.name).to.equal('The Test Kitchen');
    });

    it('PUT /api/restaurants/:rid - should update a restaurant', async () => {
        const updatedData = {
            name: 'The Updated Kitchen'
        };
        const response = await requester.put(`/api/restaurants/${createdRestaurantId}`).send(updatedData);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Restaurant updated');
        expect(response.body.payload.name).to.equal(updatedData.name);
    });

    it('DELETE /api/restaurants/:rid - should delete a restaurant', async () => {
        const response = await requester.delete(`/api/restaurants/${createdRestaurantId}`);
        
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Restaurant deleted');

        // Verificar que ya no existe
        const getResponse = await requester.get(`/api/restaurants/${createdRestaurantId}`);
        expect(getResponse.status).to.equal(404);
    });
});