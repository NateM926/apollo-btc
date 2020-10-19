import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  // NetworkStatus,
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

  // window.addEventListener("beforeunload", (ev) => {
  //   ev.preventDefault();
  //   return (ev.returnValue = "Are you sure you want to close?");
  // });

  window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = "o/";

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Webkit, Safari, Chrome
  });

  function TestIntegrationComms() {
    // chrome.app.window.current().onClosed.addListener(function (e) {
    //   console.log(e);
    // });
    // if (test != null) {
    //   alert(test.myval);
    // }
    // console.log(window);
    // alert(window.myfunc()); // Shows an alert box with "My Value!"
    // function myFunc() {
    //   // do something in JS.
    // }
    // window.register(myFunc);
    // var test = window["User"]["UploadPicture"];
    // test(e);
  }

  function ExchangeRates() {
    const { loading, error } = useQuery(
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

    // if (networkStatus === NetworkStatus.refetch) return "Refetching!";
    if (loading) return <p>Loading...</p>;

    const submit = (e) => {
      e.preventDefault();
      console.log("testing submit with reqOptions");

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

    if (true || error)
      return (
        <div>
          {/* <script language="JavaScript">{TestIntegrationComms()}</script> */}
          {TestIntegrationComms()}
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
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
