import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./cart/cartSlice";

const rootReducer = combineReducers({
  cart: cartSlice,
});
export default rootReducer;
