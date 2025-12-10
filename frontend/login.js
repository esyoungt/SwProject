// login.js
console.log("login.js loaded");

// auth.js에도 API_BASE가 있어서 이름 충돌을 피하기 위해 다른 이름 사용
const LOGIN_API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const loginBox = document.getElementById("loginForm");
  const signupBox = document.getElementById("signupForm");
  const goSignup = document.getElementById("goSignup");
  const goLogin = document.getElementById("goLogin");

  const loginForm = document.getElementById("loginFormInner");
  const signupForm = document.getElementById("signupFormInner");

  if (!loginBox || !signupBox || !loginForm || !signupForm) {
    console.warn("login / signup 요소를 찾지 못했습니다.");
    return;
  }

  // ===== 화면 전환 =====
  if (goSignup) {
    goSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginBox.style.display = "none";
      signupBox.style.display = "block";
    });
  }

  if (goLogin) {
    goLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signupBox.style.display = "none";
      loginBox.style.display = "block";
    });
  }

  // ===== 회원가입 처리 =====
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nickname = document.getElementById("signupNickname").value.trim();
    const username = document.getElementById("signupId").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!nickname || !username || !password) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    try {
      const res = await fetch(`${LOGIN_API_BASE}/signup`, {
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
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginId").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await fetch(`${LOGIN_API_BASE}/login`, {
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

      // localStorage에 유저 정보 저장
      localStorage.setItem("fcb_user", JSON.stringify(data.user));

      alert("로그인 성공");
      window.location.href = "index.html";
    } catch (err) {
      console.error("LOGIN FETCH ERROR:", err);
      alert("서버와 통신 중 오류가 발생했습니다.(로그인)");
    }
  });
});
