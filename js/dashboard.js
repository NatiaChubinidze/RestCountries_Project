const logOutBtn = document.getElementById("logOut");
const outerCardDiv = document.getElementById("cards");

class Card {
  // <div class="card country" data-id="1234" id="card">
  //       <div class="flag country" data-id="1234">
  //         <img src="pics/cat.png" />
  //       </div>

  //       <div class="info country p-3" data-id="1234">
  //         <h5>Germany</h5>
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
    this.toggleDiv.className = "toggle country d-none p-3 pt-0";
    this.toggleDiv.dataset.id = this.id;

    for (let i = 0; i < 9; i++) {
      const p = document.createElement("p");
      this.toggleDiv.appendChild(p);
    }

    const pNodes = this.toggleDiv.childNodes;
    pNodes[0].textContent = this.subregion;
    pNodes[1].textContent = this.timezone;
    this.regionalBlocs.forEach(element=>{
        pNodes[2].textContent+=`${element.name}, `
    });;
    this.languages.forEach(element=>{
        pNodes[3].textContent+=`${element.name}, `
    });;
    this.currencies.forEach(element=>{
        pNodes[4].textContent+=`${element.name}, `
    });
    this.borders.forEach(element=>{
        pNodes[5].textContent+=`${element}, `;
    });
     this.callingCode.forEach(element=>{
        pNodes[6].textContent+=`${element}, `;
     });
    pNodes[7].textContent = this.demonym;
    pNodes[8].textContent = this.nativeName;

    return this;
  }

  createInfoDiv() {
    this.InfoDiv = document.createElement("div");
    this.InfoDiv.className = "info country p-3";
    this.InfoDiv.dataset.id = this.id;
    const h5 = document.createElement("h5");
    h5.textContent = this.country;
    this.InfoDiv.appendChild(h5);
    for (let i = 0; i < 3; i++) {
      const p = document.createElement("p");
      this.InfoDiv.appendChild(p);
    }
    const pNodes = this.InfoDiv.childNodes;
    pNodes[1].textContent = this.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    pNodes[2].textContent = this.region;
    pNodes[3].textContent = this.capital;

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
    this.card.appendChild(this.toggleDiv);
    this.CardsDiv.appendChild(this.card);
  }
}

Card.prototype.CardsDiv = document.getElementById("cards");

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
    console.log(toggleDiv);
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

logOutBtn.addEventListener("click", (event) => {
  localStorage.removeItem(window.storageKey);
  navigateToIndex();
});

// let result="";
// async function f(){
//     result = await window.Api.getAllCountries();
//     console.log(result);
//     return result;
// }
// window.onload=f();

// fetch("https://restcountries.eu/rest/v2/all").then((response)=>{
//     return response.json()
// }).then(data=>console.log(data)).catch(error=>console.log(error));

(async () => {
  const result = await window.Api.getAllCountries();
  result.forEach(element => {
      const card=new Card(element);
      card.createToggleDiv();
      card.createInfoDiv();
      card.createFlagDiv();
      card.createCard();
  });
})();
