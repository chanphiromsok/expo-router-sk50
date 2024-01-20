import { Middleware, configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

let middlewares: Middleware[] = [];
// add logger middleware when app is running in debug mode
if (__DEV__) {
  const logger = require("redux-logger").default;
  middlewares = [logger];
}
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
