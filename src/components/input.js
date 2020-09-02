import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

const Input = props => {
  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder={props.placeholder}
        aria-label={props.placeholder}
        onBlur={props.onBlur}
        id={props.id}
      />
      <InputGroup.Append>
        <Button variant="outline-primary" onClick={props.button.onClick}>
          {props.button.label}
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};

export default Input;
