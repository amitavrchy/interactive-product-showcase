import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  colorName: string;
  colorHex: string;
  cushion: string;
  engraving: string;
  caseFinish: string;
  unitPrice: number;
  qty: number;
  image?: string;
};

type CartState = {
  lines: CartLine[];
};

const initialState: CartState = { lines: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addLine(state, action: PayloadAction<Omit<CartLine, "qty"> & { qty?: number }>) {
      const incoming = action.payload;
      const existing = state.lines.find((l) => l.key === incoming.key);
      if (existing) {
        existing.qty += incoming.qty ?? 1;
      } else {
        state.lines.push({ ...incoming, qty: incoming.qty ?? 1 });
      }
    },
    setQty(state, action: PayloadAction<{ key: string; qty: number }>) {
      const line = state.lines.find((l) => l.key === action.payload.key);
      if (!line) return;
      line.qty = Math.max(1, action.payload.qty);
    },
    removeLine(state, action: PayloadAction<string>) {
      state.lines = state.lines.filter((l) => l.key !== action.payload);
    },
    clearCart(state) {
      state.lines = [];
    },
  },
});

export const { addLine, setQty, removeLine, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartCount = (s: { cart: CartState }) =>
  s.cart.lines.reduce((n, l) => n + l.qty, 0);

export const selectCartTotal = (s: { cart: CartState }) =>
  s.cart.lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
