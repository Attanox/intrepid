import React from "react";
import { throttle } from "throttle-typescript";
import Cursor from "./Cursor";

const CollabArea = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;

  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const onMouseMove = (e: MouseEvent) => {
    const posX = e.clientX;
    const posY = e.clientY;

    const serverPosition = {
      x: posX / window.innerWidth,
      y: posY / window.innerHeight,
    };

    setPosition({ x: posX, y: posY });
  };
  const onThrottledMouseMove = React.useCallback(throttle(onMouseMove, 30), []);

  React.useEffect(() => {
    document.addEventListener("mousemove", onThrottledMouseMove);

    return () => {
      document.removeEventListener("mousemove", onThrottledMouseMove);
    };
  });

  return (
    <React.Fragment
    // onMouseLeave={() => setVisible(false)}
    // onMouseEnter={() => setVisible(true)}
    >
      <Cursor id="andi" x={position.x} y={position.y} />
      {/* {Object.values(cursors).map((cursor) => (
        <Cursor
          key={cursor.id}
          id={cursor.id}
          x={cursor.x}
          y={cursor.y}
        />
      ))}
      {visible && (
        <Cursor id={instance.currentUserId || ""} x={pos.x} y={pos.y} />
      )} */}
      {children}
    </React.Fragment>
  );
};

export default CollabArea;
