import Req from "../Req";

export default {
  getProfile: async () => {
    return await Req.get("/user/profile");
  },
  login: async (data: any) => {
    return await Req.post("/user/login", data);
  },
  register: async (data: any) => {
    return await Req.post("/user/register", data);
  },
  logout: async () => {
    return await Req.get("/user/logout");
  },
  updateProfile: async (data: any) => {
    return await Req.put("/user/profile", data);
  },
};
