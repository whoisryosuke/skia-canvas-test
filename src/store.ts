import { Canvas } from "skia-canvas/lib";
import create from "zustand/vanilla";

interface BearState {
  hitboxCanvas: Canvas | null;
  setHitboxCanvas: (hitboxCanvas: Canvas) => void
}
const store = create<BearState>((set) => ({
  hitboxCanvas: null,
  setHitboxCanvas: (hitboxCanvas) => set((state) => ({ hitboxCanvas })),
}));

export default store;
