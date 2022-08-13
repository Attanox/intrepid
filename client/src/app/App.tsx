import React from "react";

import WithApollo from "./withApollo";
import TodosList from "@/components/TodosList";
import CollabArea from "@/components/CollabArea";
import Messages from "@/components/Messages";

function App() {
  return (
    <WithApollo>
      <CollabArea>
        <TodosList />
        <Messages />
      </CollabArea>
    </WithApollo>
  );
}

export default App;
