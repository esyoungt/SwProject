// auth.js
document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("navLogin");
  const userBox   = document.getElementById("navUserBox");
  const nickSpan  = document.getElementById("navUserNickname");
  const logoutBtn = document.getElementById("navLogoutBtn");

  // 저장된 로그인 정보 가져오기
  const saved = localStorage.getItem("fb_user");

  // ------------------------------
  // 로그인 안된 상태
  // ------------------------------
  if (!saved) {
    if (loginLink) loginLink.style.display = "inline-block";
    if (userBox)   userBox.style.display   = "none";
    return;
  }

  // ------------------------------
  // 로그인 되어 있는 상태
  // ------------------------------
  let user;
  try {
    user = JSON.parse(saved);
  } catch (err) {
    console.error("fb_user parsing failed:", err);
    localStorage.removeItem("fb_user");
    if (loginLink) loginLink.style.display = "inline-block";
    if (userBox)   userBox.style.display   = "none";
    return;
  }

  // 로그인 버튼 숨기기, 유저 UI 보이기
  if (loginLink) loginLink.style.display = "none";
  if (userBox)   userBox.style.display   = "inline-flex";

  // 닉네임 표시
  if (nickSpan) nickSpan.textContent = `${user.nickname}님`;

  // 로그아웃 기능
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const confirmed = confirm("로그아웃 하시겠습니까?");
      if (!confirmed) return;

      localStorage.removeItem("fb_user");
      location.reload(); // 화면 새로고침 (UI 즉시 반영)
    });
  }
});
