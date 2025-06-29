import GenericRepository from "./GenericRepository.js";

export default class OrderRepository extends GenericRepository {
  constructor(dao) {
    super(dao);
  }

  // Métodos específicos para pedidos:
  getOrdersByStatus = (status) => {
  return this.getAll({ status: status });
  };
}