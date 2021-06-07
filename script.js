// your code
let tag2 = document.createElement("form");
let text22 = document.createTextNode("Password");
tag2.appendChild(text22);
tag2.id = "form";
let element22 = document.querySelector("#outlet");
element22.appendChild(tag2);

// let tag1 = document.createElement("p");
// let text2 = document.createTextNode("Password");
// tag1.appendChild(text2);
// let element2 = document.querySelector("#form");
// element2.appendChild(tag1);

let user = document.createElement("INPUT");
user.setAttribute("type", "text");
// user.setAttribute("value", "username!");
user.id = "users";
document.body.appendChild(user);
let userElement = document.querySelector("#form");
userElement.appendChild(user);

let password = document.createElement("INPUT");
password.setAttribute("type", "text");
// password.setAttribute("value", "username");
password.id = "pswd";
document.body.appendChild(password);
let passwordElement = document.querySelector("#form");
passwordElement.appendChild(password);

let login = document.createElement("button");
let text = document.createTextNode("Login");
login.appendChild(text);
login.id = "submit";
let loginElement = document.querySelector("#form");
loginElement.appendChild(login);

const form = document.querySelector("form");
form.addEventListener("submit", postData);

function postData(e) {
  e.preventDefault();
  const users = document.querySelector("#users").value;
  const pswd = document.querySelector("#pswd").value;
  const config = {
    method: "POST",
    body: JSON.stringify({ users: "1", pswd: 3 }),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch("https://jsonplaceholder.typicode.com/comments", config)// for test since we do not have api
  .then((res) =>res.json())
  .then(data=>{
      for(i of data){
          console.log(i);
      }
  });

// const longinbtn = document.querySelector("#submit");

// longinbtn.addEventListener("click", (_) => {
//   history.pushState({ page: 1 }, "title 1", "?page=1"); //browther ignore title
//   let output = `    <samp id="location"></samp><br>
//                     <textarea  id="display" cols="30" rows="10"></textarea><br>
//                     <button id="refresh">Refresh Animation</button>
//                     <button id="logout">Logout</button>`;

//   const y = document.querySelector("#outlet");
//   y.innerHTML = output;

//   animationlocation();
// });

window.addEventListener("popstate", function (event) {
  console.log("state: " + JSON.stringify(event.state));
});

// -------------Geolocation----------------//

// function animationlocation() {
//   let KEY = "rztfL90zbJZ19L9jNbVzQdZ8A03Q8hDt";
//   navigator.geolocation.getCurrentPosition(success); //take two parameter function

//   function success(position) {
//     let long = position.coords.longitude;
//     let lat = position.coords.latitude;
//     let url = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${KEY}&location=${lat},${long}`;
//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         let city = data.results[0].locations[0].adminArea5;
//         let state = data.results[0].locations[0].adminArea1;
//         let country = data.results[0].locations[0].adminArea3;
//         let loc = document.querySelector("#location");
//         loc.innerHTML = `${city},${state},${country}`;
//       });
//   }
// }
