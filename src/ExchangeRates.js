import React from "react";
import { NetworkStatus, useQuery, gql } from "@apollo/client";

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

export default function ExchangeRates() {
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

  if (error) {
    return (
      <div>
        <p>{`Error :( ${error.message}`}</p>
        <button onClick={() => refetch()}>Refetch!</button>
        <form onSubmit={(e) => submit(e)}>
          <button type="submit">TEST SUBMIT FETCH</button>
        </form>
      </div>
    );
  }

  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ));
}
