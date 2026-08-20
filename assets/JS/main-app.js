"use strict";

// ================================================
// The Switch Toggle And For Save In Local Storage
// ================================================

// 1. the elements
const themeSwitcher = document.getElementById("toggleSwitch");
const circle = document.getElementById("circle");
const body = document.body;

// 2. the arrays
const positions = ["0px", "20px", "45px"];
const themes = ["dark", "light", "eco"];
let current = 0;

// 3. Status update function
function updateToggle(index) {
  // 1-3. Moving the circle
  circle.style.transform = `translateX(${positions[index]})`;
  // 2-3. Change the body class
  body.className = themes[index];
  // 3-3. Update the current variable
  current = index;
  // 4-3. Save the index in localStorage
  localStorage.setItem("themeIndex", index);
}
// 4. When the key is pressed
themeSwitcher.addEventListener("click", () => {
  const next = (current + 1) % 3;
  updateToggle(next);
});
// 5. When loading the page: Restore saved state
const savedIndex = localStorage.getItem("themeIndex");
let startIndex = 0; // default mode (dark)
if (savedIndex !== null) {
  startIndex = parseInt(savedIndex, 10);
  // We make sure the number is correct (0, 1, or 2)
  if (isNaN(startIndex) || startIndex < 0 || startIndex > 2) {
    startIndex = 0;
  }
}
// 6. Applying restored mode
updateToggle(startIndex);

// ===================
// Information Window
// ===================

// 1. get the elements
const infoBtn = document.getElementById("infoBtn");
const closeBtn = document.getElementById("closeBtn");
const infoWindow = document.getElementById("infoWindow");

// make the window open and close if the user click on the dev btn
infoBtn.addEventListener("click", function () {
  infoWindow.classList.add("open");
});
// make the window close if the user click on the [ X ] btn
closeBtn.addEventListener("click", function () {
  infoWindow.classList.remove("open");
});

// =======================
// The Calculation System
// =======================

// ==============
// 1. the screen
// ==============
let screen = document.querySelector("#screen");
screen.readOnly = true;
let secVal = screen.value;
// ===================
// 2. Digital buttons
// ===================
const numBtn = document.querySelectorAll('[data-type="number"]');
numBtn.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const numVal = parseFloat(btn.innerText);
    screen.value += numVal;
  });
});

// ===============
// 3. Calc buttons
// ===============
// 3.1 Plus
const plus = document.getElementById("plus");
plus.addEventListener("click", function () {
  handleOperator(this);
});

// 3.2 divide
const divide = document.getElementById("divide");
divide.addEventListener("click", function () {
  handleOperator(this);
});

// 3.3 multiply
const multiply = document.getElementById("multiply");
multiply.addEventListener("click", function () {
  handleOperator(this);
});

// 3.4 minus
const minus = document.getElementById("minus");
minus.addEventListener("click", function () {
  handleOperator(this);
});

function handleOperator(btn) {
  let operatorSymbol = "";
  if (btn.id === "plus") {
    operatorSymbol = "+";
  } else if (btn.id === "minus") {
    operatorSymbol = "-";
  } else if (btn.id === "multiply") {
    operatorSymbol = "*";
  } else if (btn.id === "divide") {
    operatorSymbol = "/";
  }

  // Replace the first character if the user click in one of this [+, *, /]
  let lastChar = screen.value.slice(-1);
  if (["+", "-", "*", "/"].includes(lastChar)) {
    // Replace the last operator with the new one
    screen.value = screen.value.slice(0, -1) + operatorSymbol;
  } else {
    screen.value += operatorSymbol;
  }
}
// ==================
// 4. Action buttons
// ==================

// 4.1 Reset button
let resBtn = document.getElementById("reset");
resBtn.addEventListener("click", function () {
  screen.value = "";
});

// 4.2 Remove button
let delBtn = document.getElementById("delete");
delBtn.addEventListener("click", function () {
  screen.value = screen.value.slice(0, -1);
});

// ====
// Dot
// ====

let dot = document.getElementById("dot");

// =================
// ==========================================
// 5. Calculation engine (without eval)
// ==========================================

// 5.1 Converting text to an array (numbers and operations)
function tokenize(expression) {
  let tokens = [];
  let currentNumber = "";

  for (let i = 0; i < expression.length; i++) {
    let char = expression[i];
    // If the letter is a number or a decimal point
    if ((char >= "0" && char <= "9") || char === ".") {
      currentNumber += char;
    } else {
      // If it is a calculation
      if (currentNumber !== "") {
        tokens.push(currentNumber);
        currentNumber = "";
      }
      tokens.push(char);
    }
  }
  // Add the last number
  if (currentNumber !== "") {
    tokens.push(currentNumber);
  }
  return tokens;
}

// 5.2 Matrix calculation (application of multiplication and division order)
function calculate(tokens) {
  // 1. A ring for calculating multiplication and division
  let i = 1;
  while (i < tokens.length) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      let left = parseFloat(tokens[i - 1]);
      let right = parseFloat(tokens[i + 1]);
      let result;

      if (tokens[i] === "*") {
        result = left * right;
      } else {
        if (right === 0) return "Error: Division by zero";
        result = left / right;
      }

      // Replace (number, operation, number) with the result
      tokens.splice(i - 1, 3, result.toString());
      // We don't increase i because we replaced 3 with 1 element.
    } else {
      i += 2; // We move on to the next process
    }
  }

  // 2. Addition and subtraction calculations (from left to right)
  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    let operator = tokens[i];
    let nextNum = parseFloat(tokens[i + 1]);

    if (operator === "+") result += nextNum;
    else if (operator === "-") result -= nextNum;
  }

  return result;
}

// ==========================================
// 6. Equals button (=)
// ==========================================
const equalBtn = document.getElementById("equal");
equalBtn.addEventListener("click", function () {
  let expression = screen.value;

  // If the screen is blank or only contains a process, do nothing.
  if (expression === "" || /^[\+\-\*\/]+$/.test(expression)) {
    screen.value = "0";
    return;
  }

  // 1. Analyze the text into parts
  let tokens = tokenize(expression);

  // 2. Calculate the result
  let result = calculate(tokens);

  // 3. Display the result on the screen
  screen.value = result;
});

// ==========================================
// 7. Dot button (with no duplication)
// ==========================================
const dotBtn = document.getElementById("dot");
dotBtn.addEventListener("click", function () {
  // We prevent two dots from appearing in the same number.
  // We take the last number on the screen (after the last operation).
  let parts = screen.value.split(/[\+\-\*\/]/);
  let lastNumber = parts[parts.length - 1];
  if (!lastNumber.includes(".")) {
    screen.value += ".";
  }
});
