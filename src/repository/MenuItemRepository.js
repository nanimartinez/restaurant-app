import GenericRepository from "./GenericRepository.js";

export default class MenuItemRepository extends GenericRepository {
  constructor(dao) {
    super(dao);
  }

 
  getItemsByCategory = (category) => {
  return this.getBy({ category: category });
  }
}