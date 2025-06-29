import { restaurantsService } from "../services/index.js";

/**
 * Obtiene todos los restaurantes.
 */
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantsService.getAll();
        res.send({ status: "success", payload: restaurants });
    } catch (error) {
        req.logger.grave("Error al obtener todos los restaurantes:", error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};

/**
 * Obtiene un restaurante por su ID.
 */
const getRestaurantById = async (req, res) => {
    try {
        const { rid } = req.params;
        const restaurant = await restaurantsService.getBy({ _id: rid });

        if (!restaurant) {
            req.logger.warn(`Restaurante no encontrado con ID: ${rid}`);
            return res.status(404).send({ status: "error", error: "Restaurant not found" });
        }
        res.send({ status: "success", payload: restaurant });
    } catch (error) {
        req.logger.grave(`Error al obtener el restaurante con ID: ${req.params.rid}`, error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};

/**
 * Crea un nuevo restaurante.
 */
const createRestaurant = async (req, res) => {
    try {
        const { name, address, phone } = req.body;
        if (!name) {
            return res.status(400).send({ status: "error", error: "Incomplete values: name is required" });
        }
        const newRestaurant = {
            name,
            address,
            phone,
        };
        const result = await restaurantsService.create(newRestaurant);
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        req.logger.grave("Error al crear un nuevo restaurante:", error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};

/**
 * Actualiza un restaurante existente.
 */
const updateRestaurant = async (req, res) => {
    try {
        const { rid } = req.params;
        const updateBody = req.body;

        const restaurant = await restaurantsService.getBy({ _id: rid });
        if (!restaurant) {
            req.logger.warn(`Intento de actualizar restaurante no encontrado con ID: ${rid}`);
            return res.status(404).send({ status: "error", error: "Restaurant not found" });
        }

        const result = await restaurantsService.update(rid, updateBody);
        res.send({ status: "success", message: "Restaurant updated", payload: result });
    } catch (error) {
        req.logger.grave(`Error al actualizar el restaurante con ID: ${req.params.rid}`, error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};

/**
 * Elimina un restaurante por su ID.
 */
const deleteRestaurant = async (req, res) => {
    try {
        const { rid } = req.params;
        const result = await restaurantsService.delete(rid);

        if (!result) {
            req.logger.warn(`Intento de eliminar restaurante no encontrado con ID: ${rid}`);
            return res.status(404).send({ status: "error", error: "Restaurant not found" });
        }
        
        res.send({ status: "success", message: "Restaurant deleted" });
    } catch (error) {
        req.logger.grave(`Error al eliminar el restaurante con ID: ${req.params.rid}`, error);
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
};


export default {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};