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
let playAnimation, animationString,myToken;

const mainDiv = document.getElementById("outlet");
mainDiv.innerHTML = loginPage;
const loginDiv = document.getElementById("loginDiv");
loginDiv.classList.add("area");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function loginUI() {
  history.pushState("AnimationPage", "?animation");
  mainDiv.innerHTML = animationPage;
  userLocation();
  getToken();

  const animDiv = document.getElementById("anamtion");
  animDiv.classList.add("area");

  const display = document.getElementById("display");
  const logoutBtn = document.getElementById("logout");
  const refreshBtn = document.getElementById("refresh");

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
        //   console.log(data);
          animationString = data.split("=====\n");
          if (playAnimation) {
            clearInterval(playAnimation);
          }
          let initalAmin = 0;
          playAnimation = setInterval(() => {
            display.innerHTML = animationString[initalAmin];
            initalAmin++;
            if (initalAmin === animationString.length) {
              initalAmin = 0;
            }
          }, 300);
        });
    })
  );
  logoutBtn.addEventListener("click", function () {
    history.pushState("LoginPage", "/login", "?loginPage");
    mainDiv.innerHTML = loginPage;
    let loginDiv2 = document.getElementById("loginDiv");
    loginDiv2.classList.add("area");
    let loginBtn2 = document.getElementById("loginBtn");
    loginBtn2.addEventListener("click", loginUI);
    clearInterval(playAnimation);
  });
});

//User location
let mylocation;
let myLong, myLati;
function userLocation() {
  navigator.geolocation.getCurrentPosition(function (thisPosition) {
    myLong = thisPosition.coords.longitude;
    myLati = thisPosition.coords.latitude;
    // console.log(myLong);
    let geoLocationUrl = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${key}&location=${myLati},${myLong}`;
    fetch(geoLocationUrl)
      .then((respond) => respond.json())
      .then((data) => {
        // console.log(data);
        let country = data.results[0].locations[0].adminArea1;
        let city = data.results[0].locations[0].adminArea5;
        let state = data.results[0].locations[0].adminArea3;
        mylocation = document.getElementById("mylocation");
        mylocation.innerHTML = `You are at  ${city}, ${state}, ${country},`;
      });
  });
}


function getToken() {
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
