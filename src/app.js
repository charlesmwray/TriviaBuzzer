import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as firebase from "firebase";
const db = firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: "trivia-537c7.firebaseapp.com",
  databaseURL: "https://trivia-537c7.firebaseio.com",
  projectId: "trivia-537c7",
  storageBucket: "trivia-537c7.appspot.com",
  messagingSenderId: "766632424445",
  appId: "1:766632424445:web:a4ade7f224860595c39f94"
});

import "./styles/styles.scss";

const App = () => {
  const ref = firebase.database().ref("/buzz");
  const urlParams = new URLSearchParams(window.location.search);
  const player = urlParams.get("p") || false;

  const [buzzers, setBuzzers] = useState([]);
  const [canBuzz, setCanBuzz] = useState(true);
  let snap = "";

  const buzz = () => {
    ref.push({
      player
    });
  };

  const reset = () => {
    ref.set("/", null);
  };

  const BuzzerDisplay = props => {
    if (props.buzzers.length > 0) {
      return props.buzzers.map(b => {
        if (b) {
          return (
            <div className="buzzer" key={`${b}1`}>
              {b}
            </div>
          );
        } else {
          return "";
        }
      });
    } else {
      return "";
    }
  };

  const updateBuzzers = data => {
    const newBuzzers = data ? Object.keys(data) : [];
    const buzzersUpdate = [];

    if (newBuzzers.length > 0) {
      newBuzzers.map(b => {
        buzzersUpdate.push(data[b].player);
      });

      if (JSON.stringify(buzzers) !== JSON.stringify(buzzersUpdate)) {
        setBuzzers(buzzersUpdate);
      }
    }
  };

  useEffect(() => {
    if (buzzers.indexOf(player) !== -1) {
      setCanBuzz(false);
    } else {
      setCanBuzz(true);
    }
  });

  ref.on("value", snapshot => {
    updateBuzzers(snapshot.val());
  });

  return (
    <div className="container">
      <div className="button-container">
        {player && (
          <button
            className="large button"
            onClick={() => {
              buzz();
            }}
            disabled={!canBuzz}
            id="buzzerButton"
            autoFocus
          >
            Buzz
          </button>
        )}
        {!player && (
          <button
            className="large button"
            onClick={() => {
              reset();
            }}
          >
            Reset
          </button>
        )}
      </div>
      <div className="buzzer-container">
        <BuzzerDisplay buzzers={buzzers} />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
