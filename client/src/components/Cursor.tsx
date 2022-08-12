import React from "react";
import { motion, useMotionValue } from "framer-motion";
import { gql, useMutation, useSubscription } from "@apollo/client";

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

interface Message {
  id: string;
  content: string;
  user: string;
}

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      content
      user
    }
  }
`;

const POST_MESSAGE = gql`
  mutation ($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
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
  const { data } = useSubscription<{ messages: Message[] }>(GET_MESSAGES);

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
      <form
        style={{
          top: `-10px`,
          left: `10px`,
          position: "relative",
          zIndex: "999999999",
          pointerEvents: "none",
          userSelect: "none",
          background: "transparent",
        }}
        onSubmit={onSubmit}
        className="bg-primary h-24"
      >
        <div
          style={{ borderRadius: "10px 0 0 10px", width: "20px" }}
          className="left absolute top-0 bottom-0 left-0 bg-red-500 "
        ></div>
        <motion.div
          style={{ width: "1px", left: "19px" }}
          animate={{
            scaleX: [62, 124, 62],
          }}
          transition={{ repeat: Infinity }}
          className="center absolute top-0 bottom-0 bg-yellow-500 origin-left"
        ></motion.div>
        <motion.div
          style={{
            borderRadius: "0 10px 10px 0",
            width: "20px",
          }}
          animate={{
            translateX: ["58px", "116px", "58px"],
          }}
          transition={{ repeat: Infinity }}
          className="right absolute top-0 bottom-0 bg-blue-500"
        ></motion.div>
        <h2 className="relative top-1 left-2 card-title">{name}</h2>
        {current ? (
          <motion.input
            ref={inputRef}
            type="text"
            placeholder="Type here"
            className="relative top-2 left-2 input w-full max-w-xs"
          />
        ) : (
          <div className="relative top-2 left-2 flex flex-col">
            {data?.messages.map((message) => {
              if (message.user !== id) return null;

              return <span key={message.id}>{message.content}</span>;
            })}
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default Cursor;
