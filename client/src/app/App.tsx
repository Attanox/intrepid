import React from "react";

import WithApollo from "./withApollo";
import TodosList from "@/components/TodosList";
import CollabArea from "@/components/CollabArea";

function App() {
  return (
    <WithApollo>
      <CollabArea>
        {(currentUser) => <TodosList currentUser={currentUser} />}
      </CollabArea>
    </WithApollo>
  );
}

export default App;
