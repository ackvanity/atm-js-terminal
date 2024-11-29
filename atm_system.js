
const prompt = require('prompt-sync')();
const fs = require('fs');

function emailcheck(email) {
  const emailchar = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailchar.test(email);
}


//Fungsi untuk membuat akun
function createacc(accounts) {
    
  let name = prompt("Input your name:");
  while (!name) {
    console.log("Kindly try inputing the name again.");
    name = prompt("Input your name:");
  }

  let account = prompt("Input your account number:");

  let email = prompt("Input your email address:");
  while (!email || !emailcheck(email)) {
    console.log("Kindly provide a valid email address.");
    email = prompt("Input your email address:");
  }

  let password = "";
  while (password.length < 4) {
    password = prompt("Create a strong password of at least 4 characters:");
    if (password.length < 4) {
      console.log("Password must consists of at least 4 characters.");
      return;
    }
  }

  let confirmpassw = "";
  while (confirmpassw !== password) {
    confirmpassw = prompt("Confirm your password:");
    if (confirmpassw !== password) {
      console.log("Password is different, please try inputing again.");
    }
  }

  console.log("Account successfully activated. Welcome, " + name + "!");
  accounts[account] ={
    name, balance: 0, pin: password
  }
}


function changePassword(accountNumber,accounts) {
  let password = prompt("Enter your previous password:");
  if (password !== accounts[accountNumber].pin) {
    console.log("Incorrect password. Please enter the password correctly.");
    return; 
  }

  let passwnew = prompt("New password (at least be 5 characters)):");
  while (passwnew.length !== 4 || isNaN(passwnew)) {
    console.log("Invalid password, password must be at least 5 characters.");
    passwnew = prompt("New password (at least be 5 characters)):");
  }

  let passwconfirm = prompt("Confirm your new password:");
  while (passwconfirm !== passwnew) {
    console.log("Passwords are different, kindly try again.");
    passwconfirm = prompt("Confirm your new passwrd:");
  }

  accounts[accountNumber].pin = passwnew
  saveAccounts(accounts); 
  console.log("PIN change successful!");
}


// Fungsi untuk membaca data akun dari file
function loadAccounts() {
  let accounts = {};
  if (fs.existsSync('data.txt')) {
    const data = fs.readFileSync('data.txt', 'utf8');
    const lines = data.split('\n');
    lines.forEach(line => {
      if(line.length === 0)return;
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

function withdrawFund(accountNumber, accounts){
  const amount = parseFloat(prompt("Enter amount: "));

  if(isNaN(amount) || amount <= 0){
    console.log("Error: invalid amount!");
    return;
  }

  if(accounts[accountNumber].balance < amount) {
    console.log("Error: Insufficient funds!");
    return;
  }

  accounts[accountNumber].balance -= amount;
  console.log(`Successfully withdrawn ${amount} from your account`);
  saveAccounts(accounts);
}

function depositFund(accountNumber, accounts){
  const amount = parseFloat(prompt("Enter amount: "));

  if(isNaN(amount) || amount <= 0){
    console.log("Error: invalid amount!");
    return;
  }

  accounts[accountNumber].balance += amount;
  console.log(`Successfully deposited ${amount} from your account`);
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
  let accounts = loadAccounts(); // we might need to make new accounts, or reload the database!

    const r = prompt("Create Account? [yes/no]")
    if (r == "yes") {
      createacc(accounts);
    } 
  let accountNumber = null;
  while (!accountNumber) {
    accountNumber = login(accounts);
  }

  while (true) {
    console.log('\n=== ATM Menu ===');
    console.log('1. Balance Inquiry');
    console.log('2. Fund Transfer');
    console.log('3. Withdraw');
    console.log('4. Deposit');
    console.log('5. Create Account');
    console.log('6. Change Password');
    console.log('7. Exit');
    console.log("S. Force-save the database with current data");
    console.log("R. Reopen current data from file");

    const choice = prompt('Enter your choice: ');

    if (choice === '1') {
      balanceInquiry(accountNumber, accounts);
    } else if (choice === '2') {
      fundTransfer(accountNumber, accounts);
    } else if (choice === '3') {
      withdrawFund(accountNumber, accounts);
    } else if (choice === '4') {
      depositFund(accountNumber, accounts); 
    } else if (choice === '5') {
      createacc(accounts);
    } else if (choice === '6') {
      changePassword(accountNumber, accounts);
    }  else if (choice === '7') {
      console.log('Exiting...');
     break;
    } else if (choice === 'S') {
      saveAccounts(accounts);
    } else if (choice === 'R') {
      accounts = loadAccounts();
    } else {
      console.log('Invalid choice, please try again.');
    }
  }
}

// Jalankan program utama
main();