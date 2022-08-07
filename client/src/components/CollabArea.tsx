import { gql, useMutation, useSubscription } from "@apollo/client";
import React from "react";
import { throttle } from "throttle-typescript";
import Cursor from "./Cursor";
import UserEnter from "./UserEnter";

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

interface Props {
  children(currentUser: string): React.ReactElement;
}

const CollabArea = (props: Props) => {
  const { children } = props;

  const [currentUser, setCurrentUser] = React.useState("");

  const { data } = useSubscription<Cursors>(CURSORS, {
    variables: { cursor: { id: currentUser, x: 0, y: 0 } },
    shouldResubscribe: !!currentUser,
    skip: !currentUser,
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
          id: currentUser,
          ...serverPosition,
        },
      },
    });
  };
  const onThrottledMouseMove = React.useCallback(throttle(onMouseMove, 30), [
    currentUser,
  ]);

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
      <UserEnter setCurrentUser={setCurrentUser} />
      {data?.cursors.map((c) => {
        const posX = c.x * window.innerWidth;
        const posY = c.y * window.innerHeight;
        return <Cursor key={c.id} id={c.id} x={posX} y={posY} />;
      })}
      {children(currentUser)}
    </React.Fragment>
  );
};

export default CollabArea;
