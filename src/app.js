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

import Input from "./components/input";

import { Button, Container, Row, Col, ListGroup } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
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
    const BuzzerItems = properties => {
      const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const colors = shuffleArray([
        ["#BBE6E4", "#222"],
        ["#F0F6F6", "#222"],
        ["#FF66B3", "#fff"],
        ["#172A3A", "#fff"],
        ["#47A0FF", "#fff"]
      ]);

      return properties.items.map((b, i) => {
        if (b) {
          return (
            <ListGroup.Item
              style={{
                backgroundColor: colors[i][0],
                color: colors[i][1]
              }}
              key={i}
            >
              {b}
            </ListGroup.Item>
          );
        } else {
          return "";
        }
      });
    };
    if (props.buzzers.length > 0) {
      return (
        <ListGroup className="buzzer-items">
          <BuzzerItems items={props.buzzers} />
        </ListGroup>
      );
    } else {
      return "";
    }
  };

  const DesignatePlayer = () => {
    return (
      <>
        <h1>What's your team name?</h1>
        <form onSubmit={e => {}}>
          <Input
            id="playerName"
            button={{
              label: "Go!",
              onClick: e => {
                setPlayer(document.getElementById("playerName").value);
              }
            }}
          />
        </form>
        <br />
        <br />
        <Button
          variant="dark"
          onClick={() => {
            setPlayer(quizmaster);
          }}
        >
          I AM THE QUIZMASTER
        </Button>
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
    <Container fluid="sm">
      {player !== quizmaster && player && (
        <>
          <Row>
            <Col sm="12">
              <h1>Team: {player}</h1>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <Button
                onClick={() => {
                  buzz();
                }}
                disabled={!canBuzz}
                id="buzzerButton"
                autoFocus
                variant="danger"
                size="lg"
              >
                Buzz
              </Button>
            </Col>
            <Col sm="6">
              <BuzzerDisplay buzzers={buzzers} />
            </Col>
          </Row>
        </>
      )}
      {player === quizmaster && (
        <>
          <Row>
            <Col sm="12">
              <h1>Quizmaster</h1>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <Button
                variant="primary"
                id="buzzerButton"
                size="lg"
                onClick={() => {
                  reset();
                }}
              >
                Reset
              </Button>
            </Col>
            <Col sm="6">
              <BuzzerDisplay buzzers={buzzers} />
            </Col>
          </Row>
        </>
      )}
      {!player && <DesignatePlayer />}
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
