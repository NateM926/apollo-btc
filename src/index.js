import React from "react";
import { render } from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import useUnload from "./useUnload";
import ExchangeRates from "./ExchangeRates";

function App() {
  useUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  const client = new ApolloClient({
    uri: "https://48p1r2roz4.sse.codesandbox.io",
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <div>
        <h2>Coinbase GQL Example</h2>
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
