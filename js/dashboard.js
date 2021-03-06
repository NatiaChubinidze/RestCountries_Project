const { ApiObject, StorageObject } = window;
const { STORAGE_KEY_TOKEN } = window;

const { userToken } = window;
const COUNTRY_STORAGE_KEY = "App:Country_Storage";
const SEARCH_VALUE_STORAGE_KEY = "App:Search_Value";

const logOutBtn = document.getElementById("logOut");
const outerCardDiv = document.getElementById("cards");
const searchField = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
let searchValue = "";

if (!userToken) {
  navigateToIndex();
}

class Card {
  constructor(country) {
    this.id = Math.floor(Math.random() * 100000);
    this.card = null;
    this.flagDiv = null;
    this.InfoDiv = null;
    this.toggleDiv = null;

    this.flag = country.flag;
    this.name = country.name;
    this.callingCodes = country.callingCodes;
    this.capital = country.capital;
    this.region = country.region;
    this.subregion = country.subregion;
    this.population = country.population;
    this.demonym = country.demonym;
    this.timezones = country.timezones;
    this.borders = country.borders;
    this.nativeName = country.nativeName;
    this.currencies = country.currencies;
    this.languages = country.languages;
    this.regionalBlocs = country.regionalBlocs;
  }

  createToggleDiv() {
    this.toggleDiv = document.createElement("div");
    this.toggleDiv.className = "toggle country d-none";
    this.toggleDiv.dataset.id = this.id;

    for (let i = 0; i < 9; i++) {
      const p = document.createElement("p");
      this.toggleDiv.appendChild(p);
    }

    const pNodes = this.toggleDiv.childNodes;
    pNodes[0].textContent = `Subregion: ${this.subregion}`;
    pNodes[1].textContent = `Timezones: ${this.timezones}`;
    pNodes[2].textContent = "Regional Blocs: ";
    const lastBloc = this.regionalBlocs[this.regionalBlocs.length - 1];
    this.regionalBlocs.forEach((element) => {
      pNodes[2].textContent += `${element.name}`;
      if (lastBloc.name != element.name) {
        pNodes[2].textContent += ", ";
      }
    });
    pNodes[3].textContent = "Languages: ";
    const lastLanguage = this.languages[this.languages.length - 1];
    this.languages.forEach((element) => {
      pNodes[3].textContent += `${element.name}`;
      if (lastLanguage.name != element.name) {
        pNodes[3].textContent += ", ";
      }
    });
    pNodes[4].textContent = "Currencies: ";
    const lastCurrency = this.currencies[this.currencies.length - 1];
    this.currencies.forEach((element) => {
      pNodes[4].textContent += `${element.name}`;
      if (lastCurrency.name != element.name) {
        pNodes[4].textContent += ", ";
      }
    });
    pNodes[5].textContent = "Borders: ";
    const lastBorder = this.borders[this.borders.length - 1];
    this.borders.forEach((element) => {
      pNodes[5].textContent += `${element}`;
      if (lastBorder != element) {
        pNodes[5].textContent += ", ";
      }
    });
    pNodes[6].textContent = "Calling Codes: ";
    const lastCode = this.callingCodes[this.callingCodes.length - 1];
    this.callingCodes.forEach((element) => {
      pNodes[6].textContent += `${element}`;
      if (lastCode != element) {
        pNodes[6].textContent += ", ";
      }
    });
    pNodes[7].textContent = `Demonym: ${this.demonym}`;
    pNodes[8].textContent = `Native Name: ${this.nativeName};`;

    return this;
  }

  createInfoDiv() {
    this.InfoDiv = document.createElement("div");
    this.InfoDiv.className = "info country p-3";
    this.InfoDiv.dataset.id = this.id;
    const h6 = document.createElement("h6");
    h6.textContent = this.name;
    this.InfoDiv.appendChild(h6);
    for (let i = 0; i < 3; i++) {
      const p = document.createElement("p");
      this.InfoDiv.appendChild(p);
    }
    const pNodes = this.InfoDiv.childNodes;
    pNodes[1].textContent = `Population: ${this.population
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    pNodes[2].textContent = `Region: ${this.region}`;
    pNodes[3].textContent = `Capital: ${this.capital}`;
    this.InfoDiv.appendChild(this.toggleDiv);
    return this;
  }

  createFlagDiv() {
    this.flagDiv = document.createElement("div");
    this.flagDiv.className = "flag country";
    this.flagDiv.dataset.id = this.id;

    let img = document.createElement("img");
    img.setAttribute("src", this.flag);

    this.flagDiv.appendChild(img);

    return this;
  }

  createCard() {
    this.card = document.createElement("div");
    this.card.className = "card country";
    this.card.setAttribute("id", this.id);
    this.card.dataset.id = this.id;

    this.card.appendChild(this.flagDiv);
    this.card.appendChild(this.InfoDiv);

    this.CardsDiv.appendChild(this.card);
    return this;
  }
}

Card.prototype.CardsDiv = document.getElementById("cards");




(async () => {
  const result = await ApiObject.getAllCountries();
  const clonedArray = getClone(result);
  const arr = getStorageInfo();

  if (searchValue != null) {
    searchField.value = searchValue;
    if (arr) {
      generateCards(arr);
    } else {
      outerCardDiv.innerHTML = null;
    }
  } else {
    generateCards(clonedArray.slice(0, 20));
    clonedArray.splice(0, 20);
    const btn = generateLoadButton(1, clonedArray);
    outerCardDiv.appendChild(btn);
  }
  const searchArray = getClone(result);
  addSearchEventListeners(searchArray);
})();




logOutBtn.addEventListener("click", () => {
  StorageObject.deleteStorageOnKey(STORAGE_KEY_TOKEN, "");
  navigateToIndex();
});


outerCardDiv.addEventListener("click", (event) => {
  if (
    event.target.parentNode.classList.contains("country") &&
    event.target.tagName != "BUTTON"
  ) {
    const clickedCard = document.getElementsByClassName("toggleHeight")[0];
    if (clickedCard) {
      if (event.target.parentNode.dataset.id != clickedCard.dataset.id) {
        const toggleDiv = clickedCard.getElementsByClassName("toggle")[0];
        toggleDiv.classList.toggle("d-none");
        clickedCard.classList.toggle("toggleHeight");
      }
    }
    const id = event.target.parentNode.dataset.id;
    if (id != "cards") {
      let toggleDiv = null;
      const toggles = document.getElementsByClassName("toggle");
      for (let i = 0; i < toggles.length; i++) {
        if (toggles[i].dataset.id == id) {
          toggleDiv = toggles[i];
          break;
        }
      }
      const cards = document.getElementsByClassName("card");
      let card = null;
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].dataset.id == id) {
          card = cards[i];
          break;
        }
      }

      toggleDiv.classList.toggle("d-none");
      card.classList.toggle("toggleHeight");
    }
  }
});


document.addEventListener("click", (event) => {
  if (
    event.target.tagName == "BODY" ||
    event.target.classList.contains("container") ||
    event.target.classList.contains("cards")
  ) {
    const toggledCard = document.getElementsByClassName("toggleHeight")[0];
    if (toggledCard) {
      const cardAdditionalInfo = toggledCard.getElementsByClassName(
        "toggle"
      )[0];
      cardAdditionalInfo.classList.add("d-none");
      toggledCard.classList.remove("toggleHeight");
    }
  } 
});



function addSearchEventListeners(resp) {
  //******** (VERSION 1) WITH SEARCH BUTTON *****************/

  // searchBtn.addEventListener("click", () => {
  //   search(resp);
  // });

  // searchField.addEventListener("change", () => {
  //   const workArray = getClone(resp);
  //   outerCardDiv.innerHTML = null;
  //   if (searchField.value == "") {
  //     generateCards(workArray.slice(0, 20));
  //     workArray.splice(0, 20);
  //     const btn = generateLoadButton(1, workArray);
  //     outerCardDiv.appendChild(btn);
  //     StorageObject.deleteStorageOnKey(
  //       COUNTRY_STORAGE_KEY,
  //       SEARCH_VALUE_STORAGE_KEY
  //     );
  //   }
  // });

  //******** (VERSION 2) WITH DEBOUNCE *****************/

  searchField.addEventListener(
    "keyup",
    debounce(() => {
      search(resp);
    }, 1500)
  );
}






// ********** functions **************

function getStorageInfo() {
  searchValue = StorageObject.getStorage(SEARCH_VALUE_STORAGE_KEY);

  if (searchValue) {
    const list = StorageObject.getStorage(COUNTRY_STORAGE_KEY);
    let cardsArray = [];
    if (list) {
      list.forEach((element) => {
        const card = new Card(element);
        cardsArray.push(card);
      });
    }
    return cardsArray;
  }
}



function generateCards(array) {
  array.forEach((element) => {
    const card = new Card(element);
    card.createToggleDiv().createInfoDiv().createFlagDiv().createCard();
  });
}



function generateLoadButton(pageNumber, array) {
  const loadBtn = document.createElement("button");
  loadBtn.className = "btn btn-primary col-12 btn-block mt-3 loadBtn";
  loadBtn.textContent = "Load More";
  loadBtn.dataset.page = `${pageNumber}`;
  loadBtn.dataset.totalPages = `${Math.ceil(250 / 20)}`;

  let options = {
    root: null,
    rootMargin: "20px",
    threshold: 1.0,
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const { target } = entry;

        let page = parseInt(target.dataset.page);
        const totalPages = parseInt(target.dataset.totalPages);

        if (page < totalPages) {
          page++;
          target.dataset.page = page;

          const arrayToGenerate = array.slice(0, 20);
          array.splice(0, 20);
          generateCards(arrayToGenerate);
          target.remove();
          if (page != totalPages) {
            outerCardDiv.appendChild(loadBtn);
          }
        }
      }
    });
  };
  let observer = new IntersectionObserver(callback, options);

  observer.observe(loadBtn);
  return loadBtn;
}


function getClone(arr) {
  let clonedArray = [];
  for (let i = 0; i < arr.length; i++) {
    clonedArray[i] = arr[i];
  }
  return clonedArray;
}


function debounce(callback, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
}



function search(resp) {
  const workArray = getClone(resp);
  let searchedCountries = [];
  outerCardDiv.innerHTML = null;

  if (searchField.value != "") {
    const searchTerm = searchField.value.toLowerCase();
    resp.forEach((element) => {
      if (
        element.name.toString().toLowerCase().includes(searchTerm) ||
        element.capital.toString().toLowerCase() == searchTerm ||
        element.region.toString().toLowerCase() == searchTerm ||
        element.subregion.toString().toLowerCase() == searchTerm ||
        element.alpha3Code.toString().toLowerCase() == searchTerm
      ) {
        const card = new Card(element);
        let boolean = true;
        searchedCountries.forEach((element) => {
          if (element.name == card.name) {
            boolean = false;
            return;
          }
        });
        if (boolean) {
          card.createToggleDiv();
          card.createInfoDiv();
          card.createFlagDiv();
          card.createCard();
          searchedCountries.push(card);
        }
      }
    });
    StorageObject.setStorage(SEARCH_VALUE_STORAGE_KEY, searchTerm);
    StorageObject.setStorage(COUNTRY_STORAGE_KEY, searchedCountries);
  } else {
    generateCards(workArray.slice(0, 20));
    workArray.splice(0, 20);
    const btn = generateLoadButton(1, workArray);
    outerCardDiv.appendChild(btn);
    StorageObject.deleteStorageOnKey(
      COUNTRY_STORAGE_KEY,
      SEARCH_VALUE_STORAGE_KEY
    );
  }
}
