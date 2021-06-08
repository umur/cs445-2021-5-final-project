window.onload = logInPage;

let tokenID;
let myDiv = document.querySelector("#outlet");

function createDivElements(type, text) {
  let element = document.createElement(type);
  element.innerHTML = text;
  return element;
}

function logInPage() {
  console.log("login-page Clicked");
  document.querySelector("#outlet").textContent = "";
  history.pushState({ page: 1 }, "", "?page=1");

  let h1 = createDivElements("h1", "Please login");

  let snap1 = createDivElements("snap", "Username: ");

  let input1 = createDivElements("input");
  input1.setAttribute("placeholder", "Enter Username");
  input1.setAttribute("id", "username");
  input1.value = "mwp";
  let br1 = createDivElements("br");

  let snap2 = createDivElements("snap", "password: ");
  let input2 = createDivElements("input");
  input2.setAttribute("placeholder", "Enter Password");
  input2.setAttribute("type", "password");
  input2.setAttribute("id", "password");
  input2.value = 123456;
  let br2 = createDivElements("br");

  let button = createDivElements("input");
  button.setAttribute("type", "button");
  button.setAttribute("value", "submit");
  button.setAttribute("id", "submit-btn");

  document.querySelector("#outlet").appendChild(h1);
  document.querySelector("#outlet").appendChild(snap1);
  document.querySelector("#outlet").appendChild(input1);
  document.querySelector("#outlet").appendChild(br1);
  document.querySelector("#outlet").appendChild(snap2);
  document.querySelector("#outlet").appendChild(input2);
  document.querySelector("#outlet").appendChild(br2);
  document.querySelector("#outlet").appendChild(button);

  button.addEventListener("click", submitted);
}

function submitted() {
  //   document.querySelector("#submit-btn");
  let usernameInput = document.querySelector("#username").value;
  let passwordInput = document.querySelector("#password").value;

  let h2 = createDivElements("h2", "");
  myDiv.appendChild(h2);

  async function postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });
    return response.json();
  }

  const mydata = { username: usernameInput, password: passwordInput };

  postData(
    "https://shrouded-badlands-76458.herokuapp.com/api/login",
    mydata
  ).then((data) => {
    console.log(data);
    tokenID = data.token;

    if (data.status === false) {
      console.log("Please try again!");
      h2.innerHTML = "Incorrect Username or Password";

      setTimeout(() => {
        h2.innerHTML = "";
        // animationPage();
      }, 3000);
    } else {
      animationPage();
    }
  });
}

async function userLocationNew() {
  let loca = await new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
  let { latitude: lat, longitude: lng } = loca.coords;

  let myKey = "HkNMLlrytjUgy3XYLEdlIdKA09yvLFLH";

  let getURL = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${myKey}&location=${lat},${lng}&includeRoadMetadata=true&includeNearestIntersection=true`;

  let x = await fetch(getURL);
  let y = await x.json();
  let z = await y;
  let country = z.results[0].locations[0].adminArea1;
  let state = z.results[0].locations[0].adminArea3;
  let city = z.results[0].locations[0].adminArea5;
  let welcomeMessage = `Welcome all from ${city}, ${state}, ${country}`;
  console.log(welcomeMessage);
  let h2 = document.createElement("h2");
  h2.innerHTML = welcomeMessage;
  h2.style = "position:relative; bottom: 250px";

  document.querySelector("#outlet").appendChild(h2);
}

function animationPage() {
  console.log("animation-page Clicked");
  document.querySelector("#outlet").textContent = "";
  history.pushState({ page: 2 }, "", "?page=2");

  let div = createDivElements("div");
  div.innerText = "";
  div.style = "height: 75px";

  userLocationNew();

  let textarea = createDivElements("textarea");
  textarea.innerHTML = "hi";
  textarea.setAttribute("id", "textarea");
  textarea.setAttribute("rows", "10");
  textarea.setAttribute("cols", "50");

  let btnAnimation = createDivElements("button", "Refresh Animation");
  let btnLogout = createDivElements("button", "Logout");
  let br = createDivElements("br");

  document.querySelector("#outlet").appendChild(div);
  document.querySelector("#outlet").appendChild(textarea);
  document.querySelector("#outlet").appendChild(br);
  document.querySelector("#outlet").appendChild(btnAnimation);
  document.querySelector("#outlet").appendChild(btnLogout);

  btnAnimation.addEventListener("click", refreshAni);
  btnLogout.addEventListener("click", logout);

  const myToken = { Authorization: "Bearer: " + tokenID };

  fetch(" https://shrouded-badlands-76458.herokuapp.com/api/animation", {
    headers: myToken,
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => console.log(data));
  // console.log(tokenID);

  // async function getData(url = "", token) {
  //   const response = await fetch(url, {
  //     header: token,
  //   });
  //   console.log(response);
  //   return response.json();
  // }

  // getData(
  //   " https://shrouded-badlands-76458.herokuapp.com/api/animation",
  //   myToken
  // ).then((data) => console.log(data));
}

// let getPosition = function () {
//   return new Promise((res, rej) => {
//     navigator.geolocation.getCurrentPosition(res, rej);
//   });
// };
// getPosition().then((pos) => console.log(pos.coords));

function refreshAni() {
  async function getData(url = "", token) {
    const response = await fetch(url, {
      headers: token,
    });
    return response.json();
  }
  const myToken = { Authorization: tokenID };
  getData(
    " https://shrouded-badlands-76458.herokuapp.com/api/animation",
    myToken
  ).then((data) => console.log(data));

  console.log("Refresh Ani");
  //   clear current animation
  // fetch request to get new animation frames and start new interca;
  //   also fetch for users current location - send long and lat and get city, state, country ... display welcome message

  //   Animation string consists of ASCII chars,
  //   frames are separated with "=====\n",
  //   you will need to break the frames and
  // load one frame at a time in the textarea every 200ms.
}
function logout() {
  console.log("logout");
  //   clear the token
  logInPage();
}

window.addEventListener("popstate", function (e) {
  console.log("state: " + JSON.stringify(e.state));
});
