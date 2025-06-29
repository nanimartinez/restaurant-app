
import UsersDAO from "../dao/User.dao.js"; 
import MenuItemsDAO from "../dao/MenuItems.dao.js";
import OrdersDAO from "../dao/Order.dao.js"; 
import RestaurantsDAO from "../dao/Restaurant.dao.js"; 

import UserRepository from "../repository/UserRepository.js";
import MenuItemRepository from "../repository/MenuItemRepository.js";
import OrderRepository from "../repository/OrderRepository.js";
import RestaurantRepository from "../repository/RestaurantRepository.js";


export const usersService = new UserRepository(new UsersDAO());
export const menuItemsService = new MenuItemRepository(new MenuItemsDAO());
export const ordersService = new OrderRepository(new OrdersDAO());
export const restaurantsService = new RestaurantRepository(new RestaurantsDAO());