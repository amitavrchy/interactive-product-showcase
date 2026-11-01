import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ConfiguratorState = {
  productId: string;
  slug: string;
  colorHex: string;
  colorName: string;
  cushion: "cloud" | "studio" | "sport";
  engraving: string;
  caseFinish: "soft" | "hard" | "none";
  exploded: boolean;
};

const initialState: ConfiguratorState = {
  productId: "prod-nova-h1",
  slug: "nova-h1",
  colorHex: "#F5F0E8",
  colorName: "Sand",
  cushion: "cloud",
  engraving: "",
  caseFinish: "soft",
  exploded: false,
};

const configuratorSlice = createSlice({
  name: "configurator",
  initialState,
  reducers: {
    hydrateConfig(_, action: PayloadAction<Partial<ConfiguratorState>>) {
      return { ...initialState, ...action.payload };
    },
    setProduct(
      state,
      action: PayloadAction<{ productId: string; slug: string; colorHex?: string; colorName?: string }>,
    ) {
      state.productId = action.payload.productId;
      state.slug = action.payload.slug;
      if (action.payload.colorHex) state.colorHex = action.payload.colorHex;
      if (action.payload.colorName) state.colorName = action.payload.colorName;
    },
    setColor(state, action: PayloadAction<{ hex: string; name: string }>) {
      state.colorHex = action.payload.hex;
      state.colorName = action.payload.name;
    },
    setCushion(state, action: PayloadAction<ConfiguratorState["cushion"]>) {
      state.cushion = action.payload;
    },
    setEngraving(state, action: PayloadAction<string>) {
      state.engraving = action.payload.slice(0, 16);
    },
    setCaseFinish(state, action: PayloadAction<ConfiguratorState["caseFinish"]>) {
      state.caseFinish = action.payload;
    },
    setExploded(state, action: PayloadAction<boolean>) {
      state.exploded = action.payload;
    },
    toggleExploded(state) {
      state.exploded = !state.exploded;
    },
  },
});

export const {
  hydrateConfig,
  setProduct,
  setColor,
  setCushion,
  setEngraving,
  setCaseFinish,
  setExploded,
  toggleExploded,
} = configuratorSlice.actions;

export default configuratorSlice.reducer;

export function configToQuery(c: ConfiguratorState) {
  const params = new URLSearchParams();
  params.set("color", c.colorHex.replace("#", ""));
  params.set("cushion", c.cushion);
  params.set("case", c.caseFinish);
  if (c.engraving) params.set("engrave", c.engraving);
  return params.toString();
}

export function queryToConfig(search: string): Partial<ConfiguratorState> {
  const params = new URLSearchParams(search);
  const color = params.get("color");
  const cushion = params.get("cushion") as ConfiguratorState["cushion"] | null;
  const caseFinish = params.get("case") as ConfiguratorState["caseFinish"] | null;
  const engraving = params.get("engrave");
  return {
    ...(color ? { colorHex: `#${color}` } : {}),
    ...(cushion ? { cushion } : {}),
    ...(caseFinish ? { caseFinish } : {}),
    ...(engraving ? { engraving } : {}),
  };
}
