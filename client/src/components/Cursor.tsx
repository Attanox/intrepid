import React from "react";
import { motion, useMotionValue } from "framer-motion";

export const COLORS = {
  red: { default: "#FF3366", dim: "#501D2A" },
  yellow: { default: "#FFBB00", dim: "#503F10" },
  blue: { default: "#0088FF", dim: "#103250" },
  green: { default: "#22DD88", dim: "#194832" },
  orange: { default: "#FF8800", dim: "#503210" },
  pink: { default: "#FF0099", dim: "#501037" },
  purple: { default: "#AA44FF", dim: "#3B2150" },
};

const CURSOR_SIZE = 30;
const COSMOS = [
  { cosmo: "🪐", color: COLORS.orange },
  { cosmo: "🛰", color: COLORS.pink },
  { cosmo: "🌌", color: COLORS.purple },
  { cosmo: "🌍", color: COLORS.orange },
  { cosmo: "🌙", color: COLORS.yellow },
  { cosmo: "☀", color: COLORS.yellow },
  { cosmo: "🛸", color: COLORS.green },
  { cosmo: "🚀", color: COLORS.blue },
  { cosmo: "☄", color: COLORS.red },
  { cosmo: "⭐", color: COLORS.red },
];

const getCosmo = (id: string) => {
  const index = (id?.charCodeAt(0) || 0) % COSMOS.length;
  return COSMOS[index];
};

const Cursor = ({ id, x, y } = { id: "0", x: 0, y: 0 }) => {
  const posX = useMotionValue(0);
  const posY = useMotionValue(0);

  React.useEffect(() => {
    posX.set(x - CURSOR_SIZE / 2);
  }, [x]);

  React.useEffect(() => {
    posY.set(y - CURSOR_SIZE / 2);
  }, [y]);

  return (
    <motion.div
      style={{
        y: posY,
        x: posX,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        position: "absolute",
        zIndex: "999999999",
        pointerEvents: "none",
        fontSize: 16,
        userSelect: "none",
        background: getCosmo(id).color.dim,
        boxShadow: `inset 0px 0px 0px 2px ${
          getCosmo(id).color.default
        }, 0px 8px 16px rgba(0,0,0,0.4)`,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {getCosmo(id).cosmo}
    </motion.div>
  );
};

export default Cursor;
