
window.STORAGE_KEY_TOKEN="userToken";


class Api {
  baseUrlReqResIn = "https://reqres.in/api";
  baseUrlRestCountries = "https://restcountries.eu/rest";

  constructor() {
    if (localStorage.getItem(window.STORAGE_KEY_TOKEN)) {
      this._token = localStorage.getItem(window.STORAGE_KEY_TOKEN);
    }
  }
  set token(token) {
    this._token = localStorage.setItem(window.STORAGE_KEY_TOKEN, token);
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

        break;
      case "countries":
        endPointInfo.endPoint = "/v2/all";
        options.method = "GET";
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
    let baseUrl = null;
    if (api == "reqres") {
      baseUrl = this.baseUrlReqResIn;
    } else {
      baseUrl = this.baseUrlRestCountries;
      console.log(baseUrl);
    }
    try {
      console.log(`${baseUrl}${endpointInfo.endPoint}`);
      const response = await fetch(`${baseUrl}${endpointInfo.endPoint}`, data);
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
  async getAllCountries() {
    try {
      const request = this.createRequest("countries", "");
      const result = this.fetchRequest(
        "restcountries",
        request.endPointInfo,
        null
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

class Storage {
  constructor() {
    this.storage = localStorage;
  }
  setStorage(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  getStorage(key) {
    return JSON.parse(this.storage.getItem(key));
  }
  deleteStorageOnKey(key_one,key_two) {
    this.storage.removeItem(key_one);
    if(key_two){
    this.storage.removeItem(key_two);
    }
  }
}

function navigateToIndex() {
  location.replace("index.html");
}

function navigateToDashboard() {
  location.replace("dashboard.html");
}

function navigateToSignUp() {
  location.replace("sign_up.html");
}

// function storeToken(token) {
//   localStorage.setItem(window.storageKey, token);
// }

// function checkUser(){
//   const token=window.Storage.getStorage(window.storageKey);
//   console.log(token);
//   if(token){
//     navigateToDashboard();
//   } else {
//     navigateToIndex();
//   }
// }

window.ApiObject = new Api();
window.StorageObject = new Storage();

