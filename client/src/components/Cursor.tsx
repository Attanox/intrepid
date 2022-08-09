import React from "react";
import { motion, useMotionValue } from "framer-motion";

export const COLORS = ["#E779C1", "#58C7F3", "#71EAD2", "#F3CC30", "#E24056"];

const CURSOR_SIZE = 30;

const getColor = (id: string) => {
  const index = (id?.charCodeAt(0) || 0) % COLORS.length;
  return COLORS[index];
};

function CursorSvg({ color }: { color: string }) {
  return (
    <svg
      width={CURSOR_SIZE}
      height={CURSOR_SIZE}
      viewBox="0 0 24 36"
      fill="none"
    >
      <path
        fill={color}
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
      />
    </svg>
  );
}

const useFocusInput = (input: React.RefObject<HTMLInputElement>) => {
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "/") {
      input?.current?.focus();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);

    return () => document.removeEventListener("keyup", handleKeyUp);
  }, [input?.current]);

  return {};
};

const Cursor = (
  { id, x, y, current } = { id: "0", x: 0, y: 0, current: false }
) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  useFocusInput(inputRef);

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);

  React.useEffect(() => {
    posX.set(x - CURSOR_SIZE / 2);
  }, [x]);

  React.useEffect(() => {
    posY.set(y - CURSOR_SIZE / 2);
  }, [y]);

  const color = getColor(id);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputRef.current?.value);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.blur();
    }
  };

  return (
    <motion.div
      style={{
        top: "0",
        left: "0",
        position: "absolute",
        zIndex: "999999999",
        pointerEvents: "none",
        userSelect: "none",
      }}
      initial={{ x: posX.get(), y: posY.get() }}
      animate={{ x: posX.get(), y: posY.get() }}
      transition={{
        type: "spring",
        damping: 30,
        mass: 0.8,
        stiffness: 350,
      }}
    >
      <CursorSvg color={color} />
      <form
        style={{
          top: `-10px`,
          left: `10px`,
          position: "relative",
          zIndex: "999999999",
          pointerEvents: "none",
          userSelect: "none",
          background: color,
          borderRadius: "10px",
          padding: "5px 10px",
        }}
        onSubmit={onSubmit}
      >
        <span>{id}</span>
        {current && (
          <input
            ref={inputRef}
            type="text"
            placeholder="Type here"
            className="input w-full max-w-xs mt-2"
          />
        )}
      </form>
    </motion.div>
  );
};

export default Cursor;
