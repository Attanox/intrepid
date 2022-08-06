import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import WithApollo from "./withApollo";
import TodosList from "@/components/TodosList";

function App() {
  return (
    <WithApollo>
      <TodosList />
    </WithApollo>
  );
}

export default App;
