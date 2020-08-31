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

  const [player, setPlayer] = useState(false);
  const [buzzers, setBuzzers] = useState([]);
  const [canBuzz, setCanBuzz] = useState(true);

  const quizmaster = "quizmaster";

  const buzz = () => {
    ref.push({
      player
    });
  };

  const reset = () => {
    ref.set("/", null);
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

  const DesignatePlayer = () => {
    return (
      <>
        <h1>Team Name?</h1>
        <form
          onSubmit={e => {
            setPlayer(e.target.children.namedItem("playerName").value);
          }}
        >
          <input
            name="playerName"
            onBlur={e => {
              console.log(e);
            }}
          ></input>
        </form>
        <br />
        <br />
        <button
          onClick={() => {
            setPlayer(quizmaster);
          }}
        >
          I AM THE QUIZMASTER
        </button>
      </>
    );
  };

  useEffect(() => {
    if (buzzers.indexOf(player) !== -1) {
      setCanBuzz(false);
    } else {
      setCanBuzz(true);
      player && document.getElementById("buzzerButton").focus();
    }
  });

  ref.on("value", snapshot => {
    updateBuzzers(snapshot.val());
  });

  return (
    <div className="container">
      <div className="button-container">
        {player !== quizmaster && player && (
          <>
            <h1>Team: {player}</h1>
            <button
              className="buzzer button"
              onClick={() => {
                buzz();
              }}
              disabled={!canBuzz}
              id="buzzerButton"
              autoFocus
            >
              Buzz
            </button>
          </>
        )}
        {player === quizmaster && (
          <button
            className="buzzer button"
            id="buzzerButton"
            onClick={() => {
              reset();
            }}
          >
            Reset
          </button>
        )}
        {!player && <DesignatePlayer />}
      </div>
      <div className="buzzer-container">
        {player && <BuzzerDisplay buzzers={buzzers} />}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
