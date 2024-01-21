import Req from "../Req";

export default {
  getOrders: async () => {
    return await Req.get("/order");
  },
  getOrder: async (id: number) => {
    return await Req.get(`/order/${id}`);
  },
  createOrder: async (data: any) => {
    return await Req.post("/order", data);
  },
  updateOrder: async (data: any) => {
    return await Req.put("/order", data);
  },
  deleteOrder: async (id: number) => {
    return await Req.remove(`/order/${id}`);
  },
};