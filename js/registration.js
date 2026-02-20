// Real-time validation with visual feedback
function checkFirstName() {
  let fn = document.getElementById("firstName").value;
  let err = document.getElementById("firstErr");
  let input = document.getElementById("firstName");
  
  if (fn === "") {
    input.classList.remove('error', 'success');
    err.classList.remove('show');
    return true;
  }
  
  if (fn.length < 8 || !/^[A-Za-z]+$/.test(fn)) {
    input.classList.add('error');
    input.classList.remove('success');
    err.innerHTML = "Minimum 8 alphabets required";
    err.classList.add('show');
    return false;
  }
  
  input.classList.remove('error');
  input.classList.add('success');
  err.classList.remove('show');
  return true;
}

function checkLastName() {
  let ln = document.getElementById("lastName").value;
  let err = document.getElementById("lastErr");
  let input = document.getElementById("lastName");
  
  if (ln === "") {
    input.classList.remove('error', 'success');
    err.classList.remove('show');
    return true;
  }
  
  if (ln.length < 8 || !/^[A-Za-z]+$/.test(ln)) {
    input.classList.add('error');
    input.classList.remove('success');
    err.innerHTML = "Minimum 8 alphabets required";
    err.classList.add('show');
    return false;
  }
  
  input.classList.remove('error');
  input.classList.add('success');
  err.classList.remove('show');
  return true;
}

function checkUsername() {
  let u = document.getElementById("username").value;
  let err = document.getElementById("userErr");
  let input = document.getElementById("username");
  
  if (u === "") {
    input.classList.remove('error', 'success');
    err.classList.remove('show');
    return true;
  }
  
  if (!/^[A-Za-z0-9_]+$/.test(u)) {
    input.classList.add('error');
    input.classList.remove('success');
    err.innerHTML = "Only letters, numbers & underscore allowed";
    err.classList.add('show');
    return false;
  }
  
  input.classList.remove('error');
  input.classList.add('success');
  err.classList.remove('show');
  return true;
}

function checkPassword() {
  let p = document.getElementById("password").value;
  let err = document.getElementById("passErr");
  let input = document.getElementById("password");
  
  if (p === "") {
    input.classList.remove('error', 'success');
    err.classList.remove('show');
    return true;
  }
  
  const minLength = p.length >= 8;
  const hasCapital = /[A-Z]/.test(p);
  const hasSpecial = /[@$!%*?&#]/.test(p);
  
  if (!minLength || !hasCapital || !hasSpecial) {
    input.classList.add('error');
    input.classList.remove('success');
    
    let errors = [];
    if (!minLength) errors.push('minimum 8 characters');
    if (!hasCapital) errors.push('1 capital letter');
    if (!hasSpecial) errors.push('1 special symbol');
    
    err.innerHTML = "Password must contain: " + errors.join(', ');
    err.classList.add('show');
    return false;
  }
  
  input.classList.remove('error');
  input.classList.add('success');
  err.classList.remove('show');
  return true;
}

/* 3(b)(iii) DOB */
function checkDOB() {
  let dob = document.getElementById("dob").value;
  let err = document.getElementById("dobErr");
  let input = document.getElementById("dob");
  
  if (dob === "") {
    input.classList.remove('error', 'success');
    err.classList.remove('show');
    return true;
  }
  
  let d = new Date(dob);
  if (isNaN(d.getTime())) {
    input.classList.add('error');
    input.classList.remove('success');
    err.innerHTML = "Invalid Date of Birth";
    err.classList.add('show');
    return false;
  }
  
  input.classList.remove('error');
  input.classList.add('success');
  err.classList.remove('show');
  return true;
}

/* 3(b)(iii) Postal Code */
function checkPostalCode() {
  let p = document.getElementById("postal").value;
  let err = document.getElementById("postalErr");
  let input = document.getElementById("postal");
  
  if (p === "") {
    input.classList.remove('error', 'success');
    err.classList.remove('show');
    return true;
  }
  
  if (!/^[0-9]{6}$/.test(p)) {
    input.classList.add('error');
    input.classList.remove('success');
    err.innerHTML = "Postal Code must be 6 digits";
    err.classList.add('show');
    return false;
  }
  
  input.classList.remove('error');
  input.classList.add('success');
  err.classList.remove('show');
  return true;
}

/* 3(b)(iv) Mobile */
function checkMobile() {
  let m = document.getElementById("mobile").value;
  let err = document.getElementById("mobileErr");
  let input = document.getElementById("mobile");
  
  if (m === "") {
    input.classList.remove('error', 'success');
    err.classList.remove('show');
    return true;
  }
  
  if (!/^[0-9]{10}$/.test(m)) {
    input.classList.add('error');
    input.classList.remove('success');
    err.innerHTML = "Mobile number must be 10 digits";
    err.classList.add('show');
    return false;
  }
  
  input.classList.remove('error');
  input.classList.add('success');
  err.classList.remove('show');
  return true;
}

/* 3(b)(iv) Email */
function checkEmail() {
  let e = document.getElementById("email").value;
  let err = document.getElementById("emailErr");
  let input = document.getElementById("email");
  
  if (e === "") {
    input.classList.remove('error', 'success');
    err.classList.remove('show');
    return true;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    input.classList.add('error');
    input.classList.remove('success');
    err.innerHTML = "Please enter a valid email address";
    err.classList.add('show');
    return false;
  }
  
  input.classList.remove('error');
  input.classList.add('success');
  err.classList.remove('show');
  return true;
}

function validateForm() {
  // Trigger all validations
  checkFirstName();
  checkLastName();
  checkUsername();
  checkPassword();
  checkDOB();
  checkPostalCode();
  checkMobile();
  checkEmail();
  
  if (
    !checkFirstName() ||
    !checkLastName() ||
    !checkUsername() ||
    !checkPassword() ||
    !checkDOB() ||
    !checkPostalCode() ||
    !checkMobile() ||
    !checkEmail()
  ) {
    alert("Please correct the highlighted errors");
    return false;
  }
  alert("Registration Successful!");
  return true;
}

// Add real-time validation on input events
window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('firstName').addEventListener('input', checkFirstName);
  document.getElementById('lastName').addEventListener('input', checkLastName);
  document.getElementById('username').addEventListener('input', checkUsername);
  document.getElementById('password').addEventListener('input', checkPassword);
  document.getElementById('dob').addEventListener('change', checkDOB);
  document.getElementById('postal').addEventListener('input', checkPostalCode);
  document.getElementById('mobile').addEventListener('input', checkMobile);
  document.getElementById('email').addEventListener('input', checkEmail);
});
