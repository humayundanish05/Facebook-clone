// You can add interactive JS here laterdocument.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("button");

  if (loginBtn && loginBtn.textContent === "Log In") {
    loginBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll("input");
      const email = inputs[0].value.trim();
      const password = inputs[1].value.trim();

      if (email && password) {
        // Simulated login success
        window.location.href = "home.html";
      } else {
        alert("Please enter both email and password.");
      }
    });
  }
});
