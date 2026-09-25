// Global Data State (Mapped to LocalStorage & ER Diagram Schema)
let appState = {
  role: 'Student',
  budgetLimit: 5000,
  categories: [],
  transactions: [],
  receipts: [],
  voiceLogs: []
};

let chartInstance = null;

// Position Categories Mapping
const roleCategories = {
  'Student': ['Tuition', 'Books', 'Food', 'Pocket Money', 'Entertainment'],
  'Housewife': ['Groceries', 'Utilities', 'Medical', 'Home Maintenance', 'Savings'],
  'CEO': ['Corporate Travel', 'Payroll', 'Software Subscriptions', 'Client Meetings', 'Investments'],
  'Admin': ['System Overhead', 'Audit Logs', 'Infrastructure', 'Global Category']
};

// Initialization
window.onload = function() {
  loadFromLocalStorage();
  initCategories();
  renderUI();
};

function loadFromLocalStorage() {
  const data = localStorage.getItem('pocket360_master_db');
  if (data) {
    appState = JSON.parse(data);
  }
}

function saveToLocalStorage() {
  localStorage.setItem('pocket360_master_db', JSON.stringify(appState));
}

function switchRole() {
  appState.role = document.getElementById('userRole').value;
  initCategories();
  renderUI();
  saveToLocalStorage();
}

function initCategories() {
  const catSelect = document.getElementById('transCategory');
  catSelect.innerHTML = '';
  const cats = roleCategories[appState.role] || roleCategories['Student'];
  cats.forEach(cat => {
    let opt = document.createElement('option');
    opt.value = cat;
    opt.innerText = cat;
    catSelect.appendChild(opt);
  });
}

function setBudgetCeiling() {
  const val = parseFloat(document.getElementById('budgetLimitInput').value);
  if (!isNaN(val) && val > 0) {
    appState.budgetLimit = val;
    renderUI();
    saveToLocalStorage();
  }
}

function addTransaction(typeOverride, amountOverride, noteOverride, catOverride) {
  const type = typeOverride || document.getElementById('transType').value;
  const category = catOverride || document.getElementById('transCategory').value;
  const note = noteOverride || document.getElementById('transNote').value;
  const amount = amountOverride || parseFloat(document.getElementById('transAmount').value);

  if (!note || isNaN(amount) || amount <= 0) {
    alert("Please enter valid details!");
    return;
  }

  const transaction = {
    transaction_id: Date.now(),
    user_role: appState.role,
    type: type,
    category: category,
    note: note,
    amount: amount,
    date: new Date().toLocaleDateString()
  };

  appState.transactions.push(transaction);

  // Clear inputs
  if (!typeOverride) {
    document.getElementById('transNote').value = '';
    document.getElementById('transAmount').value = '';
  }

  renderUI();
  saveToLocalStorage();
}

function deleteTransaction(id) {
  appState.transactions = appState.transactions.filter(t => t.transaction_id !== id);
  renderUI();
  saveToLocalStorage();
}

// AI OCR Scanner Engine Simulation
function simulateOCRScan() {
  document.getElementById('aiLogText').innerText = "OCR: Processing scanned receipt image...";
  setTimeout(() => {
    const mockScannedReceipt = {
      receipt_id: Date.now(),
      merchant: "SuperMart Retail",
      extractedText: "TOTAL AMOUNT: RS 1250.00",
      confidence: "98.5%"
    };
    appState.receipts.push(mockScannedReceipt);
    addTransaction("Expense", 1250, "OCR: Bill - " + mockScannedReceipt.merchant, "Groceries");
    document.getElementById('aiLogText').innerText = `OCR Success! Attached Bill #${mockScannedReceipt.receipt_id}`;
  }, 1000);
}

// AI Voice Intelligence Engine Simulation
function simulateVoiceInput() {
  // Real Voice Assistant using Web Speech API
function simulateVoiceInput() {// Real Voice Assistant using Web Speech API
function simulateVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    alert("Aapka browser Voice Recognition support nahi karta. Please Google Chrome use karein.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'hi-IN'; // Hindi aur English dono samjhega
  recognition.interimResults = false;

  const statusText = document.getElementById('aiLogText');
  statusText.innerText = "🎙️ Sun raha hoon... Boliye (e.g. Spent 500 on Food)";
  statusText.style.color = "#3b82f6";

  recognition.start();

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    statusText.innerText = `Aawaz mili: "${transcript}"`;
    statusText.style.color = "#10b981";

    // Text se amount (numbers) nikalna
    const numbers = transcript.match(/\d+/);
    const amount = numbers ? parseFloat(numbers[0]) : 100;

    // Transaction History mein add karna
    const currentRole = document.getElementById('userRole').value;
    const newTrans = {
      id: Date.now(),
      type: 'Expense',
      category: 'Food',
      note: `Voice: ${transcript}`,
      amount: amount,
      role: currentRole
    };

    transactions.push(newTrans);
    saveAndRender();
  };

  recognition.onerror = function(event) {
    statusText.innerText = "❌ Mic Error / Permission Denied. Redo karein.";
    statusText.style.color = "#ef4444";
  };
}

    };

    transactions.push(newTrans);
    saveAndRender();
  };

  recognition.onerror = function(event) {
    statusText.innerText = "❌ Mic Error / Permission Denied. Redo karein.";
    statusText.style.color = "#ef4444";
  };



function renderUI() {
  // 1. Role Check
  document.getElementById('userRole').value = appState.role;
  document.getElementById('adminPanel').style.display = (appState.role === 'Admin') ? 'block' : 'none';

  // 2. Budget Ceiling Display
  document.getElementById('budgetText').innerText = `Current Monthly Ceiling Limit: ₹${appState.budgetLimit.toFixed(2)}`;

  // 3. Transactions Calculation
  let totalIncome = 0;
  let totalExpense = 0;

  const listEl = document.getElementById('transactionList');
  listEl.innerHTML = '';

  appState.transactions.forEach(t => {
    if (t.type === 'Income') totalIncome += t.amount;
    if (t.type === 'Expense') totalExpense += t.amount;

    let li = document.createElement('li');
    li.className = `transaction-item ${t.type === 'Income' ? 'item-income' : 'item-expense'}`;
    li.innerHTML = `
      <div>
        <strong>${t.note}</strong> <span class="ai-badge">${t.category}</span><br>
        <small style="color: #64748b;">${t.date} | Role: ${t.user_role}</small>
      </div>
      <div>
        <strong style="color: ${t.type === 'Income' ? 'var(--success)' : 'var(--danger)'}">
          ${t.type === 'Income' ? '+' : '-'} ₹${t.amount.toFixed(2)}
        </strong>
        <button onclick="deleteTransaction(${t.transaction_id})" class="btn-danger" style="margin-left:10px; padding: 4px 8px;">X</button>
      </div>
    `;
    listEl.appendChild(li);
  });

  // 4. Over-Budget Alert Threshold Logic (80%)
  const alertBox = document.getElementById('budgetAlert');
  const threshold = appState.budgetLimit * 0.8;
  if (totalExpense >= threshold && appState.budgetLimit > 0) {
    alertBox.style.display = 'block';
    alertBox.innerText = `⚠️ Budget Alert: Expenses (₹${totalExpense.toFixed(2)}) have reached 80%+ of Limit (₹${appState.budgetLimit.toFixed(2)})!`;
  } else {
    alertBox.style.display = 'none';
  }

  // 5. Render Chart.js Analytics
  renderChart(totalIncome, totalExpense);
}

function renderChart(income, expense) {
  const ctx = document.getElementById('budgetChart').getContext('2d');
  const remaining = Math.max(0, appState.budgetLimit - expense);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Expenses', 'Remaining Target', 'Total Income'],
      datasets: [{
        data: [expense, remaining, income],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function exportCSV() {
  let csv = 'ID,Role,Type,Category,Note,Amount,Date\n';
  appState.transactions.forEach(t => {
    csv += `${t.transaction_id},${t.user_role},${t.type},${t.category},"${t.note}",${t.amount},${t.date}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Pocket360_Report_${appState.role}.csv`;
  a.click();
}

function toggleTheme() {
  const body = document.body;
  if (body.getAttribute('data-theme') === 'light') {
    body.removeAttribute('data-theme');
  } else {
    body.setAttribute('data-theme', 'light');
  }
}

function clearAllData() {
  if (confirm("System Admin Action: Are you sure you want to delete all stored data?")) {
    localStorage.removeItem('pocket360_master_db');
    location.reload();
  }
}