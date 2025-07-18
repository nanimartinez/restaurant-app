import chai from 'chai';
import supertest from 'supertest';
import { cleanDatabase } from './setup.js';
import config from '../src/config/config.js';

const expect = chai.expect;
const requester = supertest(`http://localhost:${config.PORT}`);

describe('Orders Router - Functional Tests', function() {
    let testUserId, testRestaurantId, testMenuItemId, testOrderId;

    // Setup: Crear un usuario, un restaurante y un item de menú
    before(async function() {
        this.timeout(6000); // Aumentar timeout para el setup complejo
        await cleanDatabase();

        // 1. Crear Usuario
        const userRes = await requester.post('/api/sessions/register').send({
            first_name: 'Order',
            last_name: 'Tester',
            email: 'order.tester@test.com',
            password: 'password123'
        });
        testUserId = userRes.body.payload;

        // 2. Crear Restaurante
        const restoRes = await requester.post('/api/restaurants').send({
            name: 'The Order Spot'
        });
        testRestaurantId = restoRes.body.payload._id;
        
        // 3. Crear Item de Menú
        const menuItemRes = await requester.post('/api/menu-items').send({
            name: "Order Item",
            price: 15.00,
            category: "Plato Principal"
        });
        testMenuItemId = menuItemRes.body.payload._id;
    });

    it('POST /api/orders - should create a new order', async () => {
        const orderPayload = {
            userId: testUserId,
            restaurantId: testRestaurantId,
            items: [
                { menuItemId: testMenuItemId, quantity: 2 }
            ]
        };

        const response = await requester.post('/api/orders').send(orderPayload);
        
        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload.totalPrice).to.equal(30.00); // 15.00 * 2
        expect(response.body.payload.user).to.equal(testUserId);
        
        // Guardar el ID del pedido para las siguientes pruebas
        testOrderId = response.body.payload._id;
    });

    it('GET /api/orders - should get all orders', async () => {
        const response = await requester.get('/api/orders');

        expect(response.status).to.equal(200);
        expect(response.body.payload).to.be.an('array');
        expect(response.body.payload.length).to.be.at.least(1);
    });

    it('GET /api/orders/:oid - should get a single order by ID', async () => {
        const response = await requester.get(`/api/orders/${testOrderId}`);

        expect(response.status).to.equal(200);
        expect(response.body.payload._id).to.equal(testOrderId);
        expect(response.body.payload.items[0].menuItem.name).to.equal("Order Item");
    });

    it('PATCH /api/orders/:oid - should update the status of an order', async () => {
        const newStatus = { status: 'preparing' };
        
        const response = await requester.patch(`/api/orders/${testOrderId}`).send(newStatus);
        
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Order status updated');

        // Verificar que el estado se actualizó
        const getResponse = await requester.get(`/api/orders/${testOrderId}`);
        expect(getResponse.body.payload.status).to.equal('preparing');
    });
});