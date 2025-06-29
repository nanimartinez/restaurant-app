import { Router } from "express";
import restaurantsController from "../controllers/restaurants.controller.js";

const router = Router();

// Endpoint para obtener todos los restaurantes y crear uno nuevo
router.route('/')
    .get(restaurantsController.getAllRestaurants)
    .post(restaurantsController.createRestaurant);

// Endpoints para un restaurante específico por ID
router.route('/:rid')
    .get(restaurantsController.getRestaurantById)
    .put(restaurantsController.updateRestaurant)
    .delete(restaurantsController.deleteRestaurant);

export default router;