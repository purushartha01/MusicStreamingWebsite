const signupBtn = document.getElementById("switchToSignup");
const loginBtn = document.getElementById("switchToLogin");
const loginCmd = document.getElementById("login-cmd");
const signupCmd = document.getElementById("signup-cmd");
const formPanel = document.getElementById("form-panel");
const loginPanel = document.getElementById("login-panel");
const signupPanel = document.getElementById("signup-panel");
const signupForm = document.getElementById("signupForm");
const passwordField = document.getElementById("password");
const confirmPasswordField = document.getElementById("confirmPassword");
const emailField=document.getElementById("email-signup");


signupBtn.addEventListener("click", switchToSignupPanel);
loginBtn.addEventListener("click", switchToLoginPanel);

function switchToSignupPanel() {
  console.log("Sign Up BTN");
  formPanel.classList.remove("form-panel-right");
  loginPanel.classList.add("hide");
  signupCmd.classList.add("hide");

  formPanel.classList.add("form-panel-left");
  signupPanel.classList.remove("hide");
  loginCmd.classList.remove("hide");
}

function switchToLoginPanel() {
  console.log("Login BTN");
  formPanel.classList.remove("form-panel-left");
  signupPanel.classList.add("hide");
  loginCmd.classList.add("hide");
  formPanel.classList.add("form-panel-right");
  loginPanel.classList.remove("hide");
  signupCmd.classList.remove("hide");
}

function validatePassword(e) {
  e.preventDefault();
  if (passwordField.value === confirmPasswordField.value) {
    signupForm.submit();
    return true;
  }
  else {
    Toastify({
      text: "Passwords do not Match!",
      style: {
        "top": "50%",
        "left": "45%",
        "width": "fit-content",
        "background": "#dc45ff80",
      }
    }).showToast();
    return false;
  }


}

function ValidateEmail(mail) {
  var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (emailField.value.match(mailformat)) {
    return true;
  }
  else{
    emailField.focus();
    
    Toastify({
      text: "Enter proper Email!",
      style: {
        "top": "50%",
        "left": "45%",
        "width": "fit-content",
        "background": "#dc45ff80",
      }
    }).showToast();
    return false;
  }
}
