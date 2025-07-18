import { faker } from '@faker-js/faker';
import { createHash } from './index.js';

// Genera un usuario falso con las especificaciones requeridas
export const generateMockUser = async () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: await createHash('coder123'), // Contraseña encriptada
        role: faker.helpers.arrayElement(['user', 'admin']),
        orders: [], // Array de pedidos vacío
    };
};

// Genera un restaurante falso
export const generateMockRestaurant = () => {
    return {
        name: faker.company.name(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        menu: [],
    };
};