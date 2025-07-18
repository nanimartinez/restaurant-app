import { generateMockUser, generateMockRestaurant } from '../utils/mocks.js';
import { usersService, restaurantsService } from '../services/index.js';

const getMockedUsers = async (req, res) => {
    const users = [];
    for (let i = 0; i < 50; i++) {
        // Generamos un _id falso para simular la respuesta de Mongo
        const user = await generateMockUser();
        user._id = faker.database.mongodbObjectId(); 
        users.push(user);
    }
    res.send({ status: "success", payload: users });
};

const generateDataForDB = async (req, res) => {
    const { users: userCount, resto: restoCount } = req.query;
    const usersToCreate = parseInt(userCount) || 10;
    const restosToCreate = parseInt(restoCount) || 5;

    try {
        const userPromises = [];
        for (let i = 0; i < usersToCreate; i++) {
            userPromises.push(generateMockUser().then(user => usersService.create(user)));
        }

        const restoPromises = [];
        for (let i = 0; i < restosToCreate; i++) {
            restoPromises.push(restaurantsService.create(generateMockRestaurant()));
        }

        await Promise.all([...userPromises, ...restoPromises]);

        res.status(201).send({
            status: "success",
            message: `${usersToCreate} users and ${restosToCreate} restaurants created successfully.`
        });

    } catch (error) {
        req.logger.grave("Error generating data for DB", error);
        res.status(500).send({ status: "error", error: "Failed to generate data" });
    }
};

export default {
    getMockedUsers,
    generateDataForDB
}