const countryStorageKey = "App:Country_Storage";
const searchValueStorageKey = "App:Search_Value";

const logOutBtn = document.getElementById("logOut");
const outerCardDiv = document.getElementById("cards");
const searchField = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
let searchValue = "";
let searchedCountries = [];

class Card {
  // <div class="card country" data-id="1234" id="card">
  //       <div class="flag country" data-id="1234">
  //         <img src="pics/cat.png" />
  //       </div>

  //       <div class="info country p-3" data-id="1234">
  //         <h6>Germany</h6>
  //         <p>Population</p>
  //         <p>Region</p>
  //         <p>Capital</p>
  //       </div>

  //       <div class="toggle country d-none p-3 pt-0" data-id="1234">
  //         <p>Subregion</p>
  //         <p>Timezone</p>
  //         <p>Regional Blocks</p>
  //         <p>Languages</p>
  //         <p>Currencies</p>
  //         <p>Borders</p>
  //         <p>Calling Code</p>
  //         <p>Demonym</p>
  //         <p>Native Name</p>
  //       </div>
  //     </div>

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
    this.regionalBlocs.forEach((element) => {
      pNodes[2].textContent += `${element.name}, `;
    });
    pNodes[3].textContent = "Languages: ";
    this.languages.forEach((element) => {
      pNodes[3].textContent += `${element.name}, `;
    });
    pNodes[4].textContent = "Currencies: ";
    this.currencies.forEach((element) => {
      pNodes[4].textContent += `${element.name}, `;
    });
    pNodes[5].textContent = "Borders: ";
    this.borders.forEach((element) => {
      pNodes[5].textContent += `${element}, `;
    });
    pNodes[6].textContent = "Calling Codes: ";
    this.callingCodes.forEach((element) => {
      pNodes[6].textContent += `${element}, `;
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
  }
}

Card.prototype.CardsDiv = document.getElementById("cards");

(async () => {
  const result = await window.Api.getAllCountries();
  const clonedArray = getClone(result);
  const arr = getStorage();

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

logOutBtn.addEventListener("click", (event) => {
  localStorage.removeItem(window.storageKey);
  navigateToIndex();
});
outerCardDiv.addEventListener("click", (event) => {
  if (
    event.target.parentNode.classList.contains("country") &&
    event.target.tagName != "BUTTON"
  ) {
    const id = event.target.parentNode.dataset.id;

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
});

function addSearchEventListeners(resp) {
  searchBtn.addEventListener("click", () => {
    const workArray = getClone(resp);

    searchedCountries = [];
    outerCardDiv.innerHTML = null;

    if (searchField.value != "") {
      const searchTerm = searchField.value.toLowerCase();

      resp.forEach((element) => {
        Object.values(element).forEach((value) => {
          if (typeof value == "string") {
            const searchValue = value.toString().toLowerCase();

            if (searchValue.search(searchTerm) != -1) {
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
          }
        });
      });
      setStorage(searchTerm, searchedCountries);
    } else {
      generateCards(workArray.slice(0, 20));
      workArray.splice(0, 20);
      const btn = generateLoadButton(1, workArray);
      outerCardDiv.appendChild(btn);
      localStorage.removeItem(countryStorageKey);
      localStorage.removeItem(searchValueStorageKey);
    }
  });

  searchField.addEventListener("change", () => {
    const workArray = getClone(resp);
    outerCardDiv.innerHTML = null;
    if (searchField.value == "") {
      generateCards(workArray.slice(0, 20));
      workArray.splice(0, 20);
      const btn = generateLoadButton(1, workArray);
      outerCardDiv.appendChild(btn);
      localStorage.removeItem(countryStorageKey);
      localStorage.removeItem(searchValueStorageKey);
    }
  });
}

function getStorage() {
  searchValue = JSON.parse(localStorage.getItem(searchValueStorageKey));

  if (searchValue) {
    const list = JSON.parse(localStorage.getItem(countryStorageKey));
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

function setStorage(item, array) {
  localStorage.setItem(searchValueStorageKey, JSON.stringify(item));
  localStorage.setItem(countryStorageKey, JSON.stringify(array));
}

function generateCards(array) {
  array.forEach((element) => {
    const card = new Card(element);
    card.createToggleDiv();
    card.createInfoDiv();
    card.createFlagDiv();
    card.createCard();
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
