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
import useUnload from "./useUnload";

function App() {
  const client = new ApolloClient({
    uri: "https://48p1r2roz4.sse.codesandbox.io",
    cache: new InMemoryCache()
  });

  // testing close event in the integration (beforeunload / onclose)
  // window.addEventListener("beforeunload", function (e) {
  //   // Cancel the event as stated by the standard.
  //   e.preventDefault();

  //   var confirmationMessage = "o/";

  //   (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  //   return confirmationMessage; //Webkit, Safari, Chrome
  // });

  function ExchangeRates() {
    useUnload((e) => {
      e.preventDefault();
      e.returnValue = "";
    });

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
        fetchPolicy: "no-cache", // testing cache policies in the integration
        notifyOnNetworkStatusChange: true
      }
    );

    if (networkStatus === NetworkStatus.refetch) return "Refetching!";
    if (loading) return <p>Loading...</p>;

    const submit = (e) => {
      e.preventDefault();
      const requestOptions = {
        method: "GET",
        headers: {
          // "Content-Type": "application/json" // this header breaks the integration
          "Content-Type": "application/x-www-form-urlencoded" // this header works in the integration
        }
      };

      fetch(
        "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits",
        requestOptions
      )
        .then((response) => response.json())
        .then((commits) => alert(JSON.stringify(commits)));
    };

    if (error)
      return (
        <div>
          <p>{`Error :( ${error.message}`}</p>
          <button onClick={() => refetch()}>Refetch!</button>
          <form onSubmit={(e) => submit(e)}>
            <button type="submit">TEST SUBMIT FETCH</button>
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
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
