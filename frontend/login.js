// login.js
console.log("login.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const loginBox = document.getElementById("loginForm");
  const signupBox = document.getElementById("signupForm");
  const goSignup = document.getElementById("goSignup");
  const goLogin = document.getElementById("goLogin");

  if (!loginBox || !signupBox) {
    console.warn("loginForm / signupForm 요소를 찾지 못했습니다.");
    return;
  }

  // 화면 전환
  goSignup.addEventListener("click", () => {
    loginBox.style.display = "none";
    signupBox.style.display = "block";
  });

  goLogin.addEventListener("click", () => {
    signupBox.style.display = "none";
    loginBox.style.display = "block";
  });

  // ===== 회원가입 처리 =====
  const signupForm = signupBox.querySelector("form");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nickname = signupForm
      .querySelector("input[placeholder='닉네임을 입력하세요']")
      .value.trim();
    const username = signupForm
      .querySelector("input[placeholder='아이디를 입력하세요']")
      .value.trim();
    const password = signupForm
      .querySelector("input[placeholder='비밀번호를 입력하세요']")
      .value.trim();

    if (!nickname || !username || !password) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, username, password }),
      });

      const data = await res.json();
      console.log("signup result:", data);

      if (!data.success) {
        alert(data.message || "회원가입 실패");
        return;
      }

      alert("회원가입 완료. 이제 로그인하세요.");
      signupForm.reset();
      signupBox.style.display = "none";
      loginBox.style.display = "block";
    } catch (err) {
      console.error("SIGNUP FETCH ERROR:", err);
      alert("서버와 통신 중 오류가 발생했습니다.(회원가입)");
    }
  });

  // ===== 로그인 처리 =====
  const loginForm = loginBox.querySelector("form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginForm
      .querySelector("input[placeholder='아이디를 입력하세요']")
      .value.trim();
    const password = loginForm
      .querySelector("input[placeholder='비밀번호를 입력하세요']")
      .value.trim();

    if (!username || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("login result:", data);

      if (!data.success) {
        alert(data.message || "로그인 실패");
        return;
      }

      // 🔥 여기! localStorage 키 이름을 fcb_user 로 통일
      localStorage.setItem("fcb_user", JSON.stringify(data.user));

      alert("로그인 성공");
      window.location.href = "index.html";
    } catch (err) {
      console.error("LOGIN FETCH ERROR:", err);
      alert("서버와 통신 중 오류가 발생했습니다.(로그인)");
    }
  });
});
