import mongoose from 'mongoose';
import config from '../src/config/config.js';

// Asegurarnos de que estamos en modo test
if (config.MODE !== 'test') {
    throw new Error("Las pruebas solo deben correr en modo 'test'. Verifica tu script de npm.");
}

// Limpiar todas las colecciones antes de cada test suite
export const cleanDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
};

// Conectar a la base de datos de prueba una vez
before(async function() {
    this.timeout(10000); // Aumentar timeout para la conexión inicial
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(config.MONGO_URI);
    }
});

// Desconectar después de todas las pruebas
after(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
});