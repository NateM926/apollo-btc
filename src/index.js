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

    console.info("NETWORK STATUS: ", networkStatus);
    if (networkStatus === NetworkStatus.refetch) return "Refetching!";
    if (loading) return <p>Loading...</p>;

    const submit = (e) => {
      e.preventDefault();
      console.log("test submit");

      fetch(
        "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits"
      )
        .then((response) => response.json())
        .then((commits) => alert(JSON.stringify(commits)));

      // const requestOptions = {
      //   method: "POST",
      //   mode: "cors",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     data: "test"
      //   })
      // };
      // fetch("https://example.com/movies.json", requestOptions)
      //   .then((data) => {
      //     const jsonData = data.json();
      //     console.log(jsonData); // JSON data parsed by `data.json()` call
      //   })
      //   .catch();
    };

    if (error)
      return (
        <div>
          <p>{`Error :( ${error.message}`}</p>
          <button onClick={() => refetch()}>Refetch!</button>
          <form onSubmit={(e) => submit(e)}>
            <button type="submit">TEST SUBMIT</button>
          </form>
        </div>
      );

    return data.rates.map(({ currency, rate }) => (
      <div key={currency}>
        <p>
          {currency}: {rate}
        </p>
      </div>
    ));
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
