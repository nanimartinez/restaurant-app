import Users from "../dao/Users.dao.js";
import MenuItemsDAO from "../dao/MenuItems.dao.js"; 
import OrdersDAO from "../dao/Orders.dao.js"; 
import RestaurantsDAO from "../dao/Restaurants.dao.js"; 

import UserRepository from "../repository/UserRepository.js";
import MenuItemRepository from "../repository/MenuItemRepository.js"; 
import OrderRepository from "../repository/OrderRepository.js";       
import RestaurantRepository from "../repository/RestaurantRepository.js"; 

export const usersService = new UserRepository(new Users());
export const menuItemsService = new MenuItemRepository(new MenuItemsDAO());
export const ordersService = new OrderRepository(new OrdersDAO());
export const restaurantsService = new RestaurantRepository(new RestaurantsDAO());