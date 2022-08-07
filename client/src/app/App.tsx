import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import WithApollo from "./withApollo";
import TodosList from "@/components/TodosList";
import CollabArea from "@/components/CollabArea";

function App() {
  return (
    <WithApollo>
      <CollabArea>
        <TodosList />
      </CollabArea>
    </WithApollo>
  );
}

export default App;
