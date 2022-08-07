import { gql, useMutation, useSubscription } from "@apollo/client";
import React from "react";
import { throttle } from "throttle-typescript";
import Cursor from "./Cursor";

interface Cursor {
  id: string;
  x: number;
  y: number;
}

interface Cursors {
  cursors: Cursor[];
}

const CURSORS = gql`
  subscription ($cursor: CursorInput!) {
    cursors(c: $cursor) {
      id
      x
      y
    }
  }
`;

const UPDATE_CURSOR = gql`
  mutation ($cursor: CursorInput!) {
    updateCursor(c: $cursor)
  }
`;

const DEFAULT = { id: "andi", x: 0, y: 0 };

const CollabArea = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;

  const { data } = useSubscription<Cursors>(CURSORS, {
    variables: { cursor: DEFAULT },
  });

  const [updateCursor] = useMutation(UPDATE_CURSOR);

  const onMouseMove = (e: MouseEvent) => {
    const posX = e.clientX;
    const posY = e.clientY;

    const serverPosition = {
      x: posX / window.innerWidth,
      y: posY / window.innerHeight,
    };

    updateCursor({
      variables: {
        cursor: {
          id: DEFAULT.id,
          ...serverPosition,
        },
      },
    });
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
      {data?.cursors.map((c) => {
        const posX = c.x * window.innerWidth;
        const posY = c.y * window.innerHeight;
        return <Cursor key={c.id} id={c.id} x={posX} y={posY} />;
      })}
      {children}
    </React.Fragment>
  );
};

export default CollabArea;
