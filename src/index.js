import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache()
});

function ExchangeRates() {
  const { loading, error, data, networkStatus } = useQuery(
    gql`
      {
        rates(currency: "USD") {
          currency
          rate
        }
      }
    `,
    {
      fetchPolicy: "no-cache",
      notifyOnNetworkStatusChange: true
    }
  );

  console.info("NETWORK STATUS: ", networkStatus);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error :( ${error.message}`}</p>;

  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ));
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>Coinbase GQL Example</h2>
        <h4>no-cache mode...</h4>
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
