document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const goSignup = document.getElementById("goSignup");
  const goLogin = document.getElementById("goLogin");

  goSignup.addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
  });

  goLogin.addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  });
});
