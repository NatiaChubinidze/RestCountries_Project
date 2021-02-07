window.storageKey = "userToken";

class Api {
  baseUrlReqResIn = "https://reqres.in/api";
  baseUrlRestCountries = "https://restcountries.eu/rest";

  constructor() {
    if (localStorage.getItem(window.storageKey)) {
      this._token = localStorage.getItem(storageKey);
    }
  }
  set token(token) {
    this._token = localStorage.setItem(window.storageKey, token);
  }
  get token() {
    return this._token;
  }

  createRequest(activity, data) {
    const endPointInfo = {
      endPoint: null,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    };
    switch (activity) {
      case "login":
        endPointInfo.endPoint = "/login";
        break;
      case "register":
        endPointInfo.endPoint = "/register";
        console.log(endPointInfo.endPoint);
        break;
      default:
        endPointInfo.endPoint = "";
    }
    if (data && options.method !== "GET") {
      options.body = JSON.stringify(data);
    }
    return {
      endPointInfo,
      options,
    };
  }

  async fetchRequest(api, endpointInfo, data = {}) {
    const baseUrl=null;
    if (api == "reqres") {
      this.baseUrl = this.baseUrlReqResIn;
    } else {
      baseUrl = this.baseUrlRestCountries;
    }
    try {
      console.log(`${this.baseUrl}${endpointInfo.endPoint}`);
      const response = await fetch(
        `${this.baseUrl}${endpointInfo.endPoint}`,
        data
      );
      const result = await response.json();

      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async logIn(data) {
    try {
      const request = this.createRequest("login", data);
      const result = this.fetchRequest(
        "reqres",
        request.endPointInfo,
        request.options
      );
      return result;
    } catch (error) {
      console.log("login error", error);
    }
  }
  async register(data) {
    try {
      const request = this.createRequest("register", data);
      const result = this.fetchRequest(
        "reqres",
        request.endPointInfo,
        request.options
      );
      return result;
    } catch (error) {
      console.log("registration error", error);
    }
  }
}


function navigateToIndex(){
  location.replace("index.html");
}

function storeToken(token){
  localStorage.setItem(window.storageKey,token);
}
function navigateToDashboard(){
location.replace("dashboard.html");
}

function navigateToSignUp(){
  location.replace("sign_up.html");
}

window.Api = new Api();
