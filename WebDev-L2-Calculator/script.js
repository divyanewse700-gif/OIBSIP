const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

let currentInput = "0";
let previousInput = "";
let operator = null;
let waitingForNewInput = false;

function updateDisplay() {
  currentDisplay.textContent = currentInput;

  if (operator && previousInput !== "") {
    previousDisplay.textContent = `${previousInput} ${getOperatorSymbol(operator)}`;
  } else {
    previousDisplay.textContent = "";
  }
}

function getOperatorSymbol(operator) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };

  return symbols[operator];
}

function enterNumber(number) {
  if (waitingForNewInput) {
    currentInput = number === "." ? "0." : number;
    waitingForNewInput = false;
    updateDisplay();
    return;
  }

  if (number === "." && currentInput.includes(".")) {
    return;
  }

  if (currentInput === "0" && number !== ".") {
    currentInput = number;
  } else {
    currentInput += number;
  }

  updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (operator && waitingForNewInput) {
        operator = selectedOperator;
        updateDisplay();
        return;
    }

    if (previousInput !== "" && operator !== null) {
        calculate();
    }

    previousInput = currentInput;
    operator = selectedOperator;
    waitingForNewInput = true;

    updateDisplay();
}

function calculate() {
  const firstNumber = parseFloat(previousInput);
  const secondNumber = parseFloat(currentInput);

  if (isNaN(firstNumber) || isNaN(secondNumber)) {
    return;
  }

  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;

    case "-":
      result = firstNumber - secondNumber;
      break;

    case "*":
      result = firstNumber * secondNumber;
      break;

    case "/":
      if (secondNumber === 0) {
        currentInput = "Cannot divide by zero";
        previousInput = "";
        operator = null;
        waitingForNewInput = true;
        updateDisplay();
        return;
      }

      result = firstNumber / secondNumber;
      break;

    default:
      return;
  }

  currentInput = String(Number(result.toFixed(10)));
  previousInput = "";
  operator = null;
  waitingForNewInput = true;

  updateDisplay();
}

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    enterNumber(button.dataset.number);
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    chooseOperator(button.dataset.operator);
  });
});

const equalsButton = document.querySelector("[data-action='equals']");

equalsButton.addEventListener("click", () => {
  if (operator === null || waitingForNewInput) {
    return;
  }

  calculate();
});

const clearButton = document.querySelector("[data-action='clear']");
const backspaceButton = document.querySelector("[data-action='backspace']");

function clearCalculator() {
    currentInput = "0";
    previousInput = "";
    operator = null;
    waitingForNewInput = false;

    updateDisplay();
}

function backspace() {
    if (waitingForNewInput) {
        return;
    }

    if (
        currentInput === "Cannot divide by zero" ||
        currentInput.length <= 1
    ) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

clearButton.addEventListener("click", clearCalculator);

backspaceButton.addEventListener("click", backspace);

updateDisplay();

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        enterNumber(key);
        return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        if (operator !== null && !waitingForNewInput) {
            calculate();
        }
        return;
    }

    if (key === "Backspace") {
        backspace();
        return;
    }

    if (key === "Escape") {
        clearCalculator();
    }
});