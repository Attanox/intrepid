import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const WithApollo = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default WithApollo;
