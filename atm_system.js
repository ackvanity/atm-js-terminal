const prompt = require('prompt-sync')();
const fs = require('fs');

// Fungsi untuk membaca data akun dari file
function loadAccounts() {
  let accounts = {};
  if (fs.existsSync('data.txt')) {
    const data = fs.readFileSync('data.txt', 'utf8');
    const lines = data.split('\n');
    lines.forEach(line => {
      const [accountNumber, name, balance, pin] = line.split(',');
      accounts[accountNumber] = {
        name,
        balance: parseFloat(balance),
        pin
      };
    });
  }
  return accounts;
}

// Fungsi untuk menyimpan data akun ke file
function saveAccounts(accounts) {
  let data = '';
  for (const [accountNumber, dataObj] of Object.entries(accounts)) {
    data += `${accountNumber},${dataObj.name},${dataObj.balance},${dataObj.pin}\n`;
  }
  fs.writeFileSync('data.txt', data);
}

// Fungsi untuk menampilkan saldo
function balanceInquiry(accountNumber, accounts) {
  console.log(`Your current balance is: ${accounts[accountNumber].balance}`);
}

// Fungsi untuk melakukan transfer dana antar akun
function fundTransfer(accountNumber, accounts) {
  const targetAccount = prompt('Enter the target account number: ');
  
  if (!accounts[targetAccount]) {
    console.log('Error: Target account not found.');
    return;
  }

  const amount = parseFloat(prompt('Enter amount to transfer: '));

  if (isNaN(amount) || amount <= 0) {
    console.log('Error: Invalid amount.');
    return;
  }

  if (accounts[accountNumber].balance < amount) {
    console.log('Error: Insufficient balance.');
    return;
  }

  accounts[accountNumber].balance -= amount;
  accounts[targetAccount].balance += amount;

  console.log(`Transfer successful! ${amount} has been transferred to account ${targetAccount}.`);
  saveAccounts(accounts);
}

// Fungsi untuk login dan mengecek PIN
function login(accounts) {
  const accountNumber = prompt('Enter your account number: ');
  const pin = prompt('Enter your PIN: ');

  if (accounts[accountNumber] && accounts[accountNumber].pin === pin) {
    console.log('Login successful!');
    return accountNumber;
  } else {
    console.log('Invalid account number or PIN. Please try again.');
    return null;
  }
}

// Program utama
function main() {
  const accounts = loadAccounts();

  let accountNumber = null;
  while (!accountNumber) {
    accountNumber = login(accounts);
  }

  while (true) {
    console.log('\n=== ATM Menu ===');
    console.log('1. Balance Inquiry');
    console.log('2. Fund Transfer');
    console.log('3. Exit');

    const choice = prompt('Enter your choice: ');

    if (choice === '1') {
      balanceInquiry(accountNumber, accounts);
    } else if (choice === '2') {
      fundTransfer(accountNumber, accounts);
    } else if (choice === '3') {
      console.log('Exiting...');
      break;
    } else {
      console.log('Invalid choice, please try again.');
    }
  }
}

// Jalankan program utama
main();
