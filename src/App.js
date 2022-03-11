import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './index.css';


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      //case: type 0 when 0 is typed = no change
      if (action.payload.digit === "0" && state.currentOperand === "0") { return state }
      //case: type '.' when 0 = "0."
      if (action.payload.digit === "." && state.currentOperand === "0")
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${action.payload.digit}`
        }
      //case: when '.' is typed with no input, output: '0.1'
      if (action.payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: `0${action.payload.digit}`
        };
      }
      //case: type '.' when already typed = no change
      if (action.payload.digit === "." && state.currentOperand.includes(".")) { return state }
      //case: when a non-zero digit is followed by '0' = change output to non-zero digit value
      if (action.payload.digit != "0" && state.currentOperand === "0") return {
        ...state,
        currentOperand: action.payload.digit
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) { return state }
      
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      }

    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if(state.currentOperand == null) {return state}
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) { return state }

      return {
        ...state,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  let result = 0;
  switch (operation) {
    case '+':
      result = previous + current;
      break;
    case '-':
      result = previous - current;
      break;
    case '/':
      result = previous / current;
      break;
    case 'x':
      result = previous * current;
      break;
  }
  return result.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-container">
      <h1>calc</h1>
      <div className='output'>
        <div className='previous-operand'>{previousOperand} {operation} </div>
        <div className='current-operand'>{currentOperand}</div>
      </div>
      <div className='button-container'>
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })} id="del">DEL</button>
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch}></OperationButton>
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch}></OperationButton>
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <OperationButton operation="/" dispatch={dispatch}></OperationButton>
        <OperationButton operation="x" dispatch={dispatch}></OperationButton>
        <button className='span-two' id="reset" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>RESET</button>
        <button className='span-two' id="equals" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  );
}

export default App;