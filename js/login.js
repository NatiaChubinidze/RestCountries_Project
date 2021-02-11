const {ApiObject,StorageObject}= window;
const {STORAGE_KEY_TOKEN}=window;
const {userToken} = window;
const form = document.getElementById("signInForm");

if(userToken){
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
    const result = await ApiObject.logIn(userInfo);
    if (result) {
      StorageObject.setStorage(STORAGE_KEY_TOKEN,result.token);
      navigateToDashboard();
    }
  }
});

form.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-link")) {
    navigateToSignUp();
  }
});
