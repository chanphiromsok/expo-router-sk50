import { createSlice } from "@reduxjs/toolkit";

type CartItemType = {
  product: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
};
const initialState = {
  cartItems: [],
} as {
  cartItems: CartItemType[];
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
    },
    removeFromCart: (state, action) => {
      const item = action.payload;
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== item.product
      );
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;