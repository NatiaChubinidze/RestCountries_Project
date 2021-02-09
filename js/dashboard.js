const countryStorageKey="App:Country_Storage";
const searchValueStorageKey="App:Search_Value";

const logOutBtn = document.getElementById("logOut");
const outerCardDiv = document.getElementById("cards");
const searchField = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
let searchValue="";
let searchedCountries=[];

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
    this.country = country.name;
    this.callingCode = country.callingCodes;
    this.capital = country.capital;
    this.region = country.region;
    this.subregion = country.subregion;
    this.population = country.population;
    this.demonym = country.demonym;
    this.timezone = country.timezones;
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
    pNodes[1].textContent = `Timezones: ${this.timezone}`;
    pNodes[2].textContent="Regional Blocs: ";
    this.regionalBlocs.forEach((element) => {
      pNodes[2].textContent += `${element.name}, `;
    });
    pNodes[3].textContent="Languages: ";
    this.languages.forEach((element) => {
      pNodes[3].textContent += `${element.name}, `;
    });
    pNodes[4].textContent="Currencies: ";
    this.currencies.forEach((element) => {
      pNodes[4].textContent += `${element.name}, `;
    });
    pNodes[5].textContent="Borders: ";
    this.borders.forEach((element) => {
      pNodes[5].textContent += `${element}, `;
    });
    pNodes[6].textContent="Calling Codes: ";
    this.callingCode.forEach((element) => {
      pNodes[6].textContent += `${element}, `;
    });
    pNodes[7].textContent = `Demonym: ${this.demonym}`;
    pNodes[8].textContent = `Native Name: ${this.nativeName};`

    return this;
  }

  createInfoDiv() {
    this.InfoDiv = document.createElement("div");
    this.InfoDiv.className = "info country p-3";
    this.InfoDiv.dataset.id = this.id;
    const h6 = document.createElement("h6");
    h6.textContent = this.country;
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
  const arr=getStorage();
  if(searchValue.toString()!="null"){
    searchField.value=searchValue;
    if(arr){
      arr.forEach(element=>{
        element.createToggleDiv();
        element.createInfoDiv();
        element.createFlagDiv();
        element.createCard();
      })
    } else {outerCardDiv.innerHTML=null;}
  } else{

  result.forEach((element) => {
    const card = new Card(element);
    card.createToggleDiv();
    card.createInfoDiv();
    card.createFlagDiv();
    card.createCard();
  });
  }
  addSearchEventListeners(result);
})();

logOutBtn.addEventListener("click", (event) => {
  localStorage.removeItem(window.storageKey);
  navigateToIndex();
});
outerCardDiv.addEventListener("click", (event) => {
  if (event.target.parentNode.classList.contains("country")) {
    console.log(event.target.parentNode);
    const id = event.target.parentNode.dataset.id;
    console.log(id);
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
    if (searchField.value != "") {
      outerCardDiv.innerHTML=null;
      const searchTerm = searchField.value;

      resp.forEach((element) => {
        Object.values(element).forEach((value) => {
          if (value == searchTerm) {
            const card = new Card(element);
            card.createToggleDiv();
            card.createInfoDiv();
            card.createFlagDiv();
            card.createCard();
            searchedCountries.push(element);
          }
        });
      });
      setStorage(searchTerm,searchedCountries);
    } else{
      resp.forEach((element) => {
        const card = new Card(element);
        card.createToggleDiv();
        card.createInfoDiv();
        card.createFlagDiv();
        card.createCard();
        setStorage(null,resp);
      });
    }
  });
  searchField.addEventListener("change",()=>{
    if(searchField.value==""){
      resp.forEach((element) => {
        const card = new Card(element);
        card.createToggleDiv();
        card.createInfoDiv();
        card.createFlagDiv();
        card.createCard();
        setStorage(null,resp);
      });
    }
  });
}


function getStorage(){
  searchValue=localStorage.getItem(searchValueStorageKey);

if(searchValue){
  const list=JSON.parse(localStorage.getItem(countryStorageKey));
  let cardsArray=[];
  if(list){
  list.forEach(element=>{
    const card=new Card(element);
    cardsArray.push(card);
  })
}
  return cardsArray;
}
}

function setStorage(item,array){
localStorage.setItem(searchValueStorageKey,item);
localStorage.setItem(countryStorageKey,JSON.stringify(array));
}
