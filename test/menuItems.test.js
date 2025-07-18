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

describe('MenuItems Router - Functional Tests', function() {
    let testMenuItemId;

    beforeEach(async function() {
        await cleanDatabase();
        const mockMenuItem = {
            name: "Test Tacos",
            price: 9.99,
            category: "Plato Principal"
        };
        const res = await requester.post('/api/menu-items').send(mockMenuItem);
        testMenuItemId = res.body.payload._id;
    });

    it('POST /api/menu-items - should create a new menu item', async () => {
        const newMenuItem = {
            name: "New Burrito",
            price: 12.50,
            category: "Plato Principal",
            description: "A very large burrito"
        };
        const response = await requester.post('/api/menu-items').send(newMenuItem);
        
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload.name).to.equal(newMenuItem.name);
    });
    
    it('POST /api/menu-items/withimage - should create a menu item with an image', async () => {
        const imagePath = path.resolve(__dirname, 'assets/test-image.png');
        
        const response = await requester.post('/api/menu-items/withimage')
            .field('name', 'Pizza with Image')
            .field('price', '15.00')
            .field('category', 'Plato Principal')
            .attach('menuImage', imagePath);

        expect(response.status).to.equal(200);
        expect(response.body.payload.image).to.include('img/menu-items/');
        expect(response.body.payload.name).to.equal('Pizza with Image');
    });

    it('GET /api/menu-items - should get all menu items', async () => {
        const response = await requester.get('/api/menu-items');

        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an('array');
        expect(response.body.payload.length).to.be.at.least(1);
    });

    it('PUT /api/menu-items/:mid - should update a menu item', async () => {
        const updatedData = {
            price: 10.99
        };
        const response = await requester.put(`/api/menu-items/${testMenuItemId}`).send(updatedData);

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Menu item updated');
    });

    it('DELETE /api/menu-items/:mid - should delete a menu item', async () => {
        const response = await requester.delete(`/api/menu-items/${testMenuItemId}`);
        
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Menu item deleted');
    });
});