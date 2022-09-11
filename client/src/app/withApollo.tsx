import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

const link = new WebSocketLink({
  uri: import.meta.env.VITE_WS_URL,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  uri: import.meta.env.VITE_HTTP_URL,
  cache: new InMemoryCache(),
});

const WithApollo = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default WithApollo;
