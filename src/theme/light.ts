/** Direction the light comes FROM. The stone photos were shot lit from the upper-left. */
export interface Light {
  x: number;
  y: number;
}

export const DEFAULT_LIGHT: Light = { x: -0.7, y: -0.7 };
