let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("form");
const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const ctx = document.getElementById("chart").getContext("2d");

let chart;

// Save to LocalStorage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render UI
function render() {
  list.innerHTML = "";

  transactions.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - Rp ${item.amount} (${item.category})
      <button data-id="${item.id}">X</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      deleteTransaction(item.id);
    });

    list.appendChild(li);
  });

  updateBalance();
  updateChart();
}

// Update total balance
function updateBalance() {
  const total = transactions.reduce((sum, item) => sum + item.amount, 0);
  balanceEl.textContent = total;
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(item => item.id !== id);
  saveData();
  render();
}

// Update chart
function updateChart() {
  const categories = { Food: 0, Transport: 0, Fun: 0 };

  transactions.forEach(t => {
    categories[t.category] += t.amount;
  });

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories)
      }]
    }
  });
}

// Handle form submit
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (!name || !amount || !category) {
    alert("Please fill all fields");
    return;
  }

  const newItem = {
    id: Date.now(),
    name,
    amount: parseFloat(amount),
    category
  };

  transactions.push(newItem);
  saveData();
  form.reset();
  render();
});

// Initial render
render();