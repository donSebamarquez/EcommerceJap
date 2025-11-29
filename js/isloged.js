document.addEventListener("DOMContentLoaded", function() {
  const user = JSON.parse(localStorage.getItem("login_success"));
  if (!user) return;

  const picKey = `profile_pic_${user.email}`;
  const savedPic = localStorage.getItem(picKey) || 'img/placeholder.png';
  const navPic = document.getElementById('navProfilePic');
  if (navPic) navPic.src = savedPic;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert(`Te extrañaremos ${user.name}`);
      localStorage.removeItem("login_success");
      localStorage.removeItem("token"); // IMPORTANTE
      window.location.href = 'login.html';
    });
  }
});
