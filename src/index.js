import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  NetworkStatus,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

function App() {
  const client = new ApolloClient({
    uri: "https://48p1r2roz4.sse.codesandbox.io",
    cache: new InMemoryCache()
  });

  function ExchangeRates() {
    const { loading, error, data, networkStatus, refetch } = useQuery(
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

    console.log(data, refetch);
    console.info("NETWORK STATUS: ", networkStatus);
    if (networkStatus === NetworkStatus.refetch) return "Refetching!";
    if (loading) return <p>Loading...</p>;

    const submit = (e, useJson) => {
      e.preventDefault();
      console.log("testing submit with reqOptions");

      const requestOptions = {
        method: "GET",
        // mode: "cors",
        headers: {
          "Content-Type": "application/json"
          // "Content-Type": "application/x-www-form-urlencoded"
        }
        // body: JSON.stringify({
        //   answer: 42
        // })
      };

      fetch(
        "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits",
        requestOptions
      )
        .then((response) => response.json())
        .then((commits) => alert(JSON.stringify(commits)));
    };

    // TODO: remove defaulting to test submit fetch
    if (true || error)
      return (
        <div>
          {/* <p>{`Error :( ${error.message}`}</p>
          <button onClick={() => refetch()}>Refetch!</button> */}
          <form onSubmit={(e) => submit(e)}>
            <button type="submit">TEST SUBMIT FETCH</button>
          </form>
        </div>
      );

    // return data.rates.map(({ currency, rate }) => (
    //   <div key={currency}>
    //     <p>
    //       {currency}: {rate}
    //     </p>
    //   </div>
    // ));
  }

  return (
    <ApolloProvider client={client}>
      <div>
        <h2>Coinbase GQL Example</h2>
        <h4>no-cache fetchPolicy...</h4>
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
