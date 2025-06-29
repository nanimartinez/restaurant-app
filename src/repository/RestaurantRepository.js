import GenericRepository from "./GenericRepository.js";

export default class RestaurantRepository extends GenericRepository {
  constructor(dao) {
    super(dao);
  }
  
  // Métodos específicos para restaurantes:
  findRestaurantByName = (name) => {
  return this.getBy({ name: name });
  }
}