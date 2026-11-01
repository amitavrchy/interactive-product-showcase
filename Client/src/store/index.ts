import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import cartReducer from "@/features/cart/cartSlice";
import configuratorReducer from "@/features/configurator/configuratorSlice";
import authReducer from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/uiSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      configurator: configuratorReducer,
      auth: authReducer,
      ui: uiReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
