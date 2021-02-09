const form = document.getElementById("signInForm");
const userToken = localStorage.getItem(window.storageKey);


if (userToken) {
  navigateToDashboard();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  userInfo = {
    email: document.getElementById("inputEmail").value,
    password: document.getElementById("inputPassword").value,
  };

  if (userInfo.email == "" || userInfo.password == "") {
    console.error(
      "Info is missing. Please, fill in both fields (email and password)"
    );
  } else {
    const result = await window.Api.logIn(userInfo);
    if (result) {
      storeToken(result.token);
      navigateToDashboard();
    }
  }
});

form.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-link")) {
    navigateToSignUp();
  }
});
