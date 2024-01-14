/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import { useReducer } from "react";
import "./style.css";
import Digit from "./Digit";
import Operationbutton from "./Operationbutton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_OPERATION: "delete-operation",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.PreviousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          Operation: payload.operation,
        };
      }
      if (state.PreviousOperand == null) {
        return {
          ...state,
          Operation: payload.operation,
          PreviousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        PreviousOperand: evaluate(state),
        Operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      if (
        state.Operation == null ||
        state.currentOperand == null ||
        state.PreviousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        PreviousOperand: null,
        Operation: null,
        currentOperand: evaluate(state),
      };

    case ACTIONS.DELETE_OPERATION:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null) return state;

      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}

function evaluate({ currentOperand, PreviousOperand, Operation }) {
  const prev = parseFloat(PreviousOperand);
  const curent = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curent)) return "";

  let computation = "";

  switch (Operation) {
    case "+":
      computation = prev + curent;
      break;
    case "-":
      computation = prev - curent;
      break;
    case "*":
      computation = prev * curent;
      break;

    case "%":
      computation = prev % curent;
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-IN", {
  maximumSignificantDigits: 3,
});

function formateOperant(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");

  if (decimal == null) return INTEGER_FORMATER.format(integer);

  return `INTEGER_FORMATER(integer)`;
}

function App() {
  const [{ currentOperand, PreviousOperand, Operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formateOperant(PreviousOperand)}
            {Operation}
          </div>
          <div className="current-operand">
            {formateOperant(currentOperand)}
          </div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_OPERATION })}>
          DEL
        </button>
        <Operationbutton operation="%" dispatch={dispatch} />
        <Digit digit="1" dispatch={dispatch} />
        <Digit digit="2" dispatch={dispatch} />
        <Digit digit="3" dispatch={dispatch} />
        <Operationbutton operation="*" dispatch={dispatch} />
        <Digit digit="4" dispatch={dispatch} />
        <Digit digit="5" dispatch={dispatch} />
        <Digit digit="6" dispatch={dispatch} />
        <Operationbutton operation="+" dispatch={dispatch} />
        <Digit digit="7" dispatch={dispatch} />
        <Digit digit="8" dispatch={dispatch} />
        <Digit digit="9" dispatch={dispatch} />
        <Operationbutton operation="-" dispatch={dispatch} />
        <Operationbutton digit="." dispatch={dispatch} />
        <Digit digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  );
}

export default App;
