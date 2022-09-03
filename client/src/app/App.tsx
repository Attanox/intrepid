import React from "react";

import WithApollo from "./withApollo";
import TodosList from "@/components/TodosList";
import CollabArea from "@/components/CollabArea";
import Messages from "@/components/Messages";

function App() {
  return (
    <WithApollo>
      <CollabArea>
        <div className="w-full h-screen p-2 flex flex-col md:flex-row items-center justify-between">
          <TodosList />
          <div className="h-4 w-4" />
          <Messages />
        </div>
      </CollabArea>
    </WithApollo>
  );
}

export default App;
