window.onload = logInPage;
let btnAnimation;
let btnLogout;

let tokenID;
let timedAnimation;
let myDiv = document.querySelector("#outlet");

function createDivElements(type, text) {
  let element = document.createElement(type);
  element.innerHTML = text;
  return element;
}

window.addEventListener("popstate", function (e) {
  // console.log("state: " + JSON.stringify(e.state));
  if (e.state.page === 1) {
    clearInterval(timedAnimation);
    logInPage();
  }
});

function logInPage() {
  document.querySelector("#outlet").textContent = "";
  history.pushState({ page: 1 }, "", "?page=login");

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
    tokenID = data.token;

    if (data.status === false) {
      console.log("Please try again!");
      h2.innerHTML = "Incorrect Username or Password";

      setTimeout(() => {
        h2.innerHTML = "";
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

  let response = await fetch(getURL);
  let data = await response.json();
  let locationData = await data;
  let country = locationData.results[0].locations[0].adminArea1;
  let state = locationData.results[0].locations[0].adminArea3;
  let city = locationData.results[0].locations[0].adminArea5;
  let welcomeMessage = `Welcome all from ${city}, ${state}, ${country}`;

  let h2 = document.createElement("h2");
  h2.innerHTML = welcomeMessage;
  h2.style = "position:absolute; top: 25px";

  document.querySelector("#outlet").appendChild(h2);
}

function animationPage() {
  document.querySelector("#outlet").textContent = "";
  history.pushState({ page: 2 }, "", "?page=animation");

  let div = createDivElements("div");
  div.innerText = "";
  div.style = "height: 75px";

  userLocationNew();

  let textarea = createDivElements("textarea");
  textarea.innerHTML = "";
  textarea.setAttribute("id", "textarea");
  textarea.setAttribute("rows", "20");
  textarea.setAttribute("cols", "75");

  btnAnimation = createDivElements("button", "Refresh Animation");
  btnLogout = createDivElements("button", "Logout");
  let br = createDivElements("br");

  document.querySelector("#outlet").appendChild(div);
  document.querySelector("#outlet").appendChild(textarea);
  document.querySelector("#outlet").appendChild(br);
  document.querySelector("#outlet").appendChild(btnAnimation);
  document.querySelector("#outlet").appendChild(btnLogout);
  clearInterval(timedAnimation);

  getData(
    " https://shrouded-badlands-76458.herokuapp.com/api/animation",
    tokenID
  );
  // .then((data) => console.log(data));
}
async function getData(url = "", token) {
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/text",
      Authorization: `Bearer ${token}`,
    },
  });
  const animation = await response.text();

  let animationArray = animation.split("=====\n");

  let start = 0;
  let end = animationArray.length;

  timedAnimation = setInterval(() => {
    document.querySelector("#textarea").textContent = animationArray[start];
    start++;
    if (start === end) {
      start = 0;
    }
  }, 200);

  btnAnimation.addEventListener("click", refreshAni);
  btnLogout.addEventListener("click", logout);
}

function refreshAni() {
  clearInterval(timedAnimation);
  getData(
    " https://shrouded-badlands-76458.herokuapp.com/api/animation",
    tokenID
  );
}

function logout() {
  //   clear the token
  clearInterval(timedAnimation);
  logInPage();
}
