// let text1 =  document.createElement("h1");
// text1.innerHTML = "Please login";
// document.body.append(text1)
// let userLabel =  document.createElement("label");
// userLabel.innerHTML = "Enter Username: ";
// document.body.append(userLabel)
// let userInput =  document.createElement("input");
// document.body.append(userInput);

// let br = document.createElement('p');
// document.body.append(br);

// let passLabel =  document.createElement("label");
// passLabel.innerHTML = "Enter Password: ";
// document.body.append(passLabel)
// let passInput =  document.createElement("input");
// document.body.append(passInput)

// let br2 = document.createElement('p');
// document.body.append(br2);
// let btn =  document.createElement("BUTTON");
// btn.innerHTML = "Login";
// document.body.append(btn)

// let div = document.querySelector("#outlet");
// div.appendChild(text1,userLabel)

const loginPage = `
<div id="loginDiv"><h3>Please Login</h3><hr><br>
<label for="user">Username: </label>
<input id="user" type="text"><br><br>
<label  for="pass">Password :</label>
<input id="pass" type="text"><br><br>
<button id="loginBtn">Login</button></div>`;

const animationPage = `<div id="anamtion">
<span ><strong id="mylocation"></strong></span><br><hr>
<textarea name="" id="display" cols="35" rows="15"></textarea><br><br>
<button id="refresh">Refresh Animation</button>
<button id="logout">LogOut</button>
</div>`;

const key = `kgwCfjylCzg0GhWKC2aaaMcLIc10aIQO`;
let playAnimation, animationString;
let myToken;
let mainDiv = document.getElementById("outlet");
mainDiv.innerHTML = loginPage;
let loginDiv = document.getElementById("loginDiv");
loginDiv.classList.add("area");


let loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", 
function loginUI() {
  console.log("clicked");
  history.pushState("AnimationPage", "?animation");
  mainDiv.innerHTML = animationPage;
  userLocation();
  loginAccess();

  let animDiv = document.getElementById("anamtion");
  animDiv.classList.add("area");

  let display = document.getElementById("display");
  let logoutBtn = document.getElementById("logout"); 
  let refreshBtn = document.getElementById("refresh");
  

  refreshBtn.addEventListener(
    "click",
    (animation = function () {
      fetch(`https://shrouded-badlands-76458.herokuapp.com/api/animation`, {
        method: "GET",
        headers: {
          "content-type": "application/text",
          Authorization: `Bearer ${myToken}`,
        },
      })
        .then((respond) => respond.text())
        .then((data) => {
          console.log(data);
          animationString = data.split("=====\n");
          if (playAnimation) {
            clearInterval(playAnimation);
          }
          let start = 0;
          playAnimation = setInterval(() => {
            display.innerHTML = animationString[start];
            start++;
            if (start === animationString.length) {
              start = 0;
            }
          }, 300);
        });
    })
  );
  logoutBtn.addEventListener('click', function (){
    history.pushState("LoginPage","/login","?loginPage")
    mainDiv.innerHTML = loginPage;
    let loginDiv2 = document.getElementById("loginDiv");
    loginDiv2.classList.add("area");
    let loginBtn2 = document.getElementById("loginBtn");
    loginBtn2.addEventListener('click',loginUI);
    clearInterval(playAnimation);
});
});






let mylocation;
let myLong, myLati;
function userLocation() {
  navigator.geolocation.getCurrentPosition(function (thisPosition) {
    myLong = thisPosition.coords.longitude;
    myLati = thisPosition.coords.latitude;
    console.log(myLong);
    let geoLocationUrl = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${myLati},${myLong}`;
    fetch(geoLocationUrl)
      .then((respond) => respond.json())
      .then((data) => {
        console.log(data);
        let street = data.results[0].locations[0].street;
        let city = data.results[0].locations[0].adminArea5;
        let state = data.results[0].locations[0].adminArea3;
        mylocation = document.getElementById("mylocation");
        mylocation.innerHTML = `You are at ${street}, ${city}, ${state}`;
      });
  });
}


function loginAccess() {
  let url = "https://shrouded-badlands-76458.herokuapp.com/api/login";
  fetch(url, {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username: "mwp",
      password: "123456",
    }),
  })
    .then((respond) => respond.json())
    .then((data) => {
      myToken = data.token;
      animation();
    });
}
