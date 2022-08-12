import { gql, useMutation, useSubscription } from "@apollo/client";
import React from "react";
import { throttle } from "throttle-typescript";
import Cursor from "./Cursor";
import UserEnter from "./UserEnter";

interface Cursor {
  id: string;
  name: string;
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
      name
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

const DELETE_CURSOR = gql`
  mutation ($id: ID!) {
    deleteCursor(id: $id)
  }
`;

const useUpdateCursor = (id: string, name: string) => {
  const [updateCursor] = useMutation(UPDATE_CURSOR);

  const [visible, setVisible] = React.useState(false);

  const hideCursor = () => setVisible(false);
  const showCursor = () => setVisible(true);

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
          id,
          name,
          ...serverPosition,
        },
      },
    });
  };
  const onThrottledMouseMove = React.useCallback(throttle(onMouseMove, 30), [
    id,
  ]);

  React.useEffect(() => {
    document.addEventListener("mousemove", onThrottledMouseMove);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);

    return () => {
      document.removeEventListener("mousemove", onThrottledMouseMove);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
    };
  }, [id]);

  return { visible };
};

const useRemoveUser = (userID: string) => {
  const [deleteCursor] = useMutation(DELETE_CURSOR);

  const onUserLeaving = async (event: Event) => {
    event.preventDefault();

    await deleteCursor({
      variables: {
        id: userID,
      },
    });

    return true;
  };

  React.useEffect(() => {
    window.onunload = onUserLeaving;

    return () => {
      window.onunload = null;
    };
  }, [userID]);

  return null;
};

const CollabArea = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;

  const [currentUser, setCurrentUser] = React.useState({ id: "", name: "" });

  const { data } = useSubscription<Cursors>(CURSORS, {
    variables: {
      cursor: { id: currentUser.id, name: currentUser.name, x: 0, y: 0 },
    },
    shouldResubscribe: !!currentUser.id,
    skip: !currentUser.id,
  });

  const { visible } = useUpdateCursor(currentUser.id, currentUser.name);

  useRemoveUser(currentUser.id);

  return (
    <React.Fragment>
      <UserEnter setCurrentUser={setCurrentUser} />
      {data?.cursors.map((c) => {
        const posX = c.x * window.innerWidth;
        const posY = c.y * window.innerHeight;
        const isCurrent = currentUser.id === c.id;

        if (isCurrent && !visible) return null;

        return (
          <Cursor
            key={c.id}
            id={c.id}
            name={c.name}
            current={isCurrent}
            x={posX}
            y={posY}
          />
        );
      })}

      {/* <Cursor
        id={Date.now().toString()}
        name={"John"}
        current={false}
        x={50}
        y={50}
      />

      <Cursor
        id={(Date.now() * 2).toString()}
        name={"Geo"}
        current={true}
        x={250}
        y={250}
      /> */}

      {children}
    </React.Fragment>
  );
};

export default CollabArea;
