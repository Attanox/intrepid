import React from "react";
import { motion, useMotionValue } from "framer-motion";
import { gql, useMutation } from "@apollo/client";
import { getColor } from "@/utils";

const CURSOR_SIZE = 30;

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

const POST_MESSAGE = gql`
  mutation ($user: String!, $name: String!, $content: String!) {
    postMessage(user: $user, name: $name, content: $content)
  }
`;

const Cursor = (
  { id, name, x, y, current } = {
    id: "0",
    name: "",
    x: 0,
    y: 0,
    current: false,
  }
) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [postMessage] = useMutation(POST_MESSAGE);

  useFocusInput(inputRef);

  const posX = useMotionValue(0);
  const posY = useMotionValue(0);

  React.useEffect(() => {
    posX.set(x - CURSOR_SIZE / 2);
  }, [x]);

  React.useEffect(() => {
    posY.set(y - CURSOR_SIZE / 2);
  }, [y]);

  const color = getColor(name);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      postMessage({
        variables: {
          user: id,
          name,
          content: inputRef.current.value,
        },
      });
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
        transformOrigin: "left",
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
      <form onSubmit={onSubmit}>
        <div
          style={{
            top: `-10px`,
            left: `10px`,
            position: "relative",
            zIndex: "999999999",
            pointerEvents: "none",
            userSelect: "none",
            background: color,
            maxWidth: "200px",
            overflow: "hidden",
          }}
          className={`bg-primary px-2 rounded-xl ${current ? "h-16" : "h-8"}`}
        >
          <h2 className="card-title">{name}</h2>
          {current ? (
            <input
              ref={inputRef}
              type="text"
              placeholder="Type here"
              className="input w-full max-w-xs h-8"
            />
          ) : null}
        </div>
      </form>
    </motion.div>
  );
};

export default Cursor;
