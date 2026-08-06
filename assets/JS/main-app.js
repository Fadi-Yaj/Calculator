// the switch btn
const themeSwitcher = document.getElementById("toggleSwitch");
const circle = document.getElementById("circle");
const body = document.body;

// positioning the thumb based on the current theme
const positions = ["0px", "20px", "45px"];
const themes = ["dark", "light", "eco"];
let current = 0;
function updateToggle(index) {
  circle.style.transform = `translateX(${positions[index]})`;
  body.className = themes[index];

  current = index;
}

themeSwitcher.addEventListener("click", () => {
  const next = (current + 1) % 3;
  updateToggle(next);
});

updateToggle(0);

// the input of the calculator
// 1. let the input field be read-only
const showNum = document.getElementById("showNum");
showNum.readOnly = true;

// 2. if the user clicks on a button, the value of that button should be displayed in the input field
const buttons = document.querySelectorAll(".keys-wrapper .key");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // get the button action value
    let plus = document.getElementById("plus");
    let minus = document.getElementById("minus");
    let multiply = document.getElementById("multiply");
    let divide = document.getElementById("divide");
    let equal = document.getElementById("equal");
    let reset = document.getElementById("reset");
    let del = document.getElementById("delete");
    const value = button.textContent;
    // make sure that the user can only put in input numbers and operators
    // 1. numbers
    if (value >= "0" && value <= "9") {
      showNum.value += value;
    }
    // 2. dot
    // let the dot be added after the current value in the input field
    //  and the user will not be allowed to enter more thane one dot.
    else if (value === ".") {
      showNum.value += ".";
    }
    // 3. operators
    // 3.1 plus
    else if (value === plus.textContent) {
      showNum.value += "+";
    }
    // 3.2 minus
    else if (value === minus.textContent) {
      showNum.value += "-";
    }
    // 3.3 multiply
    else if (value === multiply.textContent) {
      showNum.value += "*";
    }
    // 3.4 divide
    else if (value === divide.textContent) {
      showNum.value += "/";
    }
    // 4. equal
    else if (value === equal.textContent) {
      // evaluate the expression in the input field and display the result
      showNum.value = eval(showNum.value);
      // if the input field is empty, do nothing
      if (showNum.value === "") {
        return (showNum.value = "");
      }
    }
    // 5. reset
    else if (value === reset.textContent) {
      showNum.value = "";
      // if the input field is empty, do nothing
      if (showNum.value === "") {
        showNum.value = "";
      }
    }
    // 6. delete
    else if (value === del.textContent) {
      // delete the last character in the input field
      showNum.value = showNum.value.slice(0, -1);
    }
  });
});
// test and learn local storage
function applyTheme(theme) {
  body.classList.remove(themes);
}
