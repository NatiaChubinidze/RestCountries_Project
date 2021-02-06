let card=document.getElementById("card");
card.addEventListener("click",(event)=>{
let toggleDiv=card.getElementsByClassName("toggle")[0];
toggleDiv.classList.toggle("d-none");
card.classList.toggle("toggleHeight")
})