// login.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("login.js loaded");

  const loginBox   = document.getElementById("loginForm");
  const signupBox  = document.getElementById("signupForm");
  const goSignup   = document.getElementById("goSignup");
  const goLogin    = document.getElementById("goLogin");
  const loginForm  = document.getElementById("loginFormInner");
  const signupForm = document.getElementById("signupFormInner");

  if (!loginBox || !signupBox || !loginForm || !signupForm) {
    console.error("필수 엘리먼트를 찾지 못했습니다.");
    return;
  }

  // 🔹 이미 로그인된 상태면(정보가 저장돼 있으면) 콘솔에만 찍어둠
  //   원하면 여기서 바로 index.html로 redirect해도 됨
  const savedUser = localStorage.getItem("fb_user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    console.log("이미 로그인된 사용자:", user);
    // 자동으로 홈으로 보내고 싶으면 주석 해제:
    // window.location.href = "index.html";
  }

  // 처음엔 로그인 화면
  loginBox.style.display  = "block";
  signupBox.style.display = "none";

  // 화면 전환
  goSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginBox.style.display  = "none";
    signupBox.style.display = "block";
  });

  goLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupBox.style.display = "none";
    loginBox.style.display  = "block";
  });

  // ========= 회원가입 처리 =========
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nickname = document.getElementById("signupNickname").value.trim();
    const username = document.getElementById("signupId").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!nickname || !username || !password) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    console.log("signup 요청 데이터:", { nickname, username, password });

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, username, password }),
      });

      const result = await response.json();
      console.log("signup 응답:", response.status, result);

      if (response.ok && result.success) {
        alert(result.message || "회원가입 완료");

        // 입력 초기화
        document.getElementById("signupNickname").value = "";
        document.getElementById("signupId").value = "";
        document.getElementById("signupPassword").value = "";

        // 로그인 화면으로
        signupBox.style.display = "none";
        loginBox.style.display  = "block";
      } else {
        alert("회원가입 실패: " + (result.message || result.error || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("signup fetch 오류:", err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  });

  // ========= 로그인 처리 =========
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginId").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!username || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    console.log("login 요청 데이터:", { username, password });

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      console.log("login 응답:", response.status, result);

      if (response.ok && result.success) {
        // 🔹 로그인 정보 localStorage에 저장 (로그인 상태 유지)
        // 로그인 성공 후
        localStorage.setItem("user", JSON.stringify(data.user));


        alert(`${result.user.nickname}님, 로그인 성공!`);

        // 🔹 홈 화면으로 이동 (login.html / index.html 같은 폴더 기준)
        window.location.href = "index.html";
      } else {
        alert("로그인 실패: " + (result.message || result.error || "아이디/비밀번호를 확인하세요."));
      }
    } catch (err) {
      console.error("login fetch 오류:", err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  });
});
