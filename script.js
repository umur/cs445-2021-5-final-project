// const express = require("express");
// const app = express();
// app.use(
//     cors({origin: "*"})
// );
// const {cors} = cors;
const outlet = document.querySelector("#outlet");
function userLogIn(){
    let out= outlet.innerHTML = `<div id=logInPage>
    <h2> Please Log In </h2>
    <input id="userName" placeholder="User Name" /> <br> <br> 
    <input id="password" type="password" placeholder="password"/> <br> <br>
    <button id="btn">  LogIn </button>
    </div>
    `
    return out;
}

userLogIn()
const btn = document.querySelector("#btn").addEventListener("click", sub)
document.querySelector("#btn").addEventListener("click", ()=> history.pushState({Page:1},"","?AnimationPage"));
const userName = document.querySelector("#userName");
const password = document.querySelector("#password")
function sub(e){
    console.log(userName.value, password.value)
   out= outlet.innerHTML = `<div "id=outlet" >
   <div class=output></div>
   <h3>Welcome to Fairfield</h3>
   <textarea rows="10",cols="50" ></textarea><br><br>
   <button id="btn1">Refresh Animation</button>   <button>logout</logout>
   
   </div>`
   
  return out   
}
let key ='LAvAyAA0wEwzZfTqoECxe2fxa8mDM6KT'

function geoLocator(){
    navigator.geolocation.getCurrentPosition(pos=>{
        const lat= pos.coords.latitude;
        const log = pos.coords.longitude;
        console.log(lat, log)

    })
}
geoLocator()

