const logOutBtn=document.getElementById("logOut");

let card=document.getElementById("card");
card.addEventListener("click",(event)=>{
let toggleDiv=card.getElementsByClassName("toggle")[0];
toggleDiv.classList.toggle("d-none");
card.classList.toggle("toggleHeight")
});

logOutBtn.addEventListener("click",(event)=>{
    localStorage.removeItem(window.storageKey);
    navigateToIndex();
})