let balance = 500;
let currentLoan = 0.0;
let pay = 0.0;

const balanceElement = document.getElementById("balance");
const currentLoanElement = document.getElementById("currentLoan");
const payElement = document.getElementById("pay");
const titleElement = document.getElementById("title");
const descriptionElement = document.getElementById("description");
const priceElement = document.getElementById("price");
const specsElement = document.getElementById("specs");
const imgElement = document.getElementById("image");

document.getElementById("loanBtn").addEventListener("click", submitLoan);
document.getElementById("workBtn").addEventListener("click", work);
document.getElementById("transferBtn").addEventListener("click", transfer);
document
  .getElementById("buyComputerBtn")
  .addEventListener("click", buyComputer);
document.getElementById("repayBtn").addEventListener("click", repayLoan);

const selectElement = document.getElementById("selectbox");
document.getElementById("selectbox").addEventListener("change", changeComputer);

const endpoint = "https://hickory-quilled-actress.glitch.me/";

let computers = [];
let selectedComputer;
fetchComputers().then((data) => {
  computers = data;
  buildComputerSelect();
  changeComputer();
});

updateNumbers();

function updateNumbers() {
  balanceElement.innerText = "Balance: " + balance + " kr";
  currentLoanElement.innerText =
    "|| Outstanding loan: " + (currentLoan > 0 ? "-" : "") + currentLoan + "kr";
  payElement.innerText = "Pay: " + pay + " kr";
  const repayBtn = document.getElementById("repayBtn");
  if (currentLoan > 0) {
    repayBtn.style.display = "inline-block";
  } else {
    repayBtn.style.display = "none";
  }
}

function submitLoan() {
  if (currentLoan > 0) {
    alert("You need to repay your previous loan");
    return;
  }
  let takeLoan = Number(window.prompt("Enter loan amount:"));
  if (!Number.isInteger(takeLoan)) {
    alert("Entered value is not a number");
    return;
  }
  if (takeLoan == 0) {
    alert("Minimum loan amount: 1kr");
    return;
  }
  if (takeLoan > balance * 2) {
    alert("Cant get loan double your balance");
  } else {
    console.log("Approved");
    currentLoan += takeLoan;
    balance += takeLoan;
    updateNumbers();
  }
}

//2. Work
function transfer() {
  if (pay * 0.1 > currentLoan) {
    balance += pay - currentLoan;
    currentLoan = 0;
    pay = 0;
  } else {
    balance += pay * 0.9;
    currentLoan -= pay * 0.1;
    pay = 0;
  }
  updateNumbers();
}

function repayLoan() {
  if (pay >= currentLoan) {
    pay -= currentLoan;
    currentLoan = 0;
  } else {
    currentLoan -= pay;
    pay = 0;
  }
  updateNumbers();
}

function work() {
  pay += 100;
  updateNumbers();
}

// 3. Laptop
async function fetchComputers() {
  return fetch(endpoint + "/computers")
    .then((res) => {
      return res.json();
    })
    .then((computers) => {
      return computers;
    })
    .catch((error) => console.log(error));
}

function buildComputerSelect() {
  computers.forEach((computer) => {
    let op = document.createElement("option");
    op.innerText = computer.title;
    op.value = computer.id;
    selectElement.appendChild(op);
  });
}

function changeComputer() {
  let selectedID = selectElement.value;
  selectedComputer = computers[selectedID - 1];
  titleElement.innerText = selectedComputer.title;
  descriptionElement.innerText = "Features: " + selectedComputer.description;
  priceElement.innerText = "Price: " + selectedComputer.price;
  specsElement.innerText = selectedComputer.specs;
  imgElement.src = endpoint + selectedComputer.image;
}

function buyComputer() {
  if (balance >= selectedComputer.price) {
    balance -= selectedComputer.price;
    updateNumbers();
    alert("Congratulations, you have bought " + selectedComputer.title + "!");
  } else {
    alert("You do not have sufficient fund.");
  }
}
