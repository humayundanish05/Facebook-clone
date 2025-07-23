console.log("JS Loaded");
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("button");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll("input");
      const email = inputs[0].value.trim();
      const password = inputs[1].value.trim();

      if (email && password) {
        // Simulate successful login
        alert("Login successful!");
        window.location.href = "home.html";
      } else {
        alert("Please enter both email and password.");
      }
    });
  } else {
    alert("Login button not found.");
  }
});
