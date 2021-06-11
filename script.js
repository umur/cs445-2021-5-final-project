window.onload = loader;
function loader() {
  // two routes templates
  const loginRoute = `<div>
  <h1>Please Login</h1>
  <span> Username: <input type="text" id="username" /> </span> <br /><br />
  <span> Password: <textarea id = "password" cols="17" rows="1" style="resize: none" ></textarea><br /><br /></span>
  <button id="loginBtn">Login</button><br /><br />
</div>`;
  const animationRoute = `
<header >You're Loggedin!</header>
<div style = "margin-left:250px ">
  <span><h4 id = "location"></h4></span>
  <textarea id="animate" rows="20" column="150" style="font-size:18"></textarea><br/>
  <span><button id="refreshBtn">Refresh Animation</button> <button id="logoutBtn">Logout</button></span>
</div>`;
  //loginRoute as default route
  document.getElementById("outlet").innerHTML = loginRoute;
  history.pushState(null, null, "login");
  //username and password eventListners
  document.querySelector("textarea").addEventListener("input", enterPassword);
  document.querySelector("input").addEventListener("input", enterUsername);
  //userCredential will hold username and password
  const userCredential = {};
  // two functions to grap the username and the password
  function enterPassword(e) {
    userCredential.password = e.target.value;
  }
  function enterUsername(e) {
    userCredential.username = e.target.value;
  }

  // post request to validate the username and password
  function main() {
    fetch("https://shrouded-badlands-76458.herokuapp.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredential),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);

        // if the username and password are wrong, the login page will remain with an appended message
        if (data.status === false) {
          document
            .querySelector("#outlet")
            .append("Wrong Username or Password, Please Try Again!");
          // else, it will change route to animationRoute
        } else {
          //remove evenListners for the login
          document
            .querySelector("textarea")
            .removeEventListener("input", enterPassword);

          //get request actual location
          function locationFinder() {
            navigator.geolocation.getCurrentPosition(success, fail);
            function success(position) {
              console.log("Longitude:" + position.coords.longitude);
              console.log("Latitude:" + position.coords.latitude);
              fetch(
                "http://www.mapquestapi.com/geocoding/v1/reverse?key=RpMEvu7bKuatZ5zFSLAWNkjGQCGl7IB8&location=30.333472,-81.470448&includeRoadMetadata=true&includeNearestIntersection=true",
                {
                  method: "GET",
                }
              )
                .then((data) => data.json())
                .then((data) => {
                  console.log(data);
                  const street = data.results[0].locations[0].street;
                  const city = data.results[0].locations[0].adminArea5;
                  const state = data.results[0].locations[0].adminArea3;
                  const country = data.results[0].locations[0].adminArea1;

                  document.getElementById(
                    "location"
                  ).innerHTML = `Welcome!! Your location is ${street}, ${city}, ${state}, ${country}`;
                });
            }
          }
          function fail(msg) {
            console.log(msg.code + msg.message);
          }

          locationFinder();
          //change of route once login successful
          document.getElementById("outlet").innerHTML = animationRoute;
          history.pushState(null, null, "animation");

          //fetching the asci animation

          fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation", {
            method: "GET",
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          })
            .then((res) => res.text())
            .then((data) => {
              console.log("animation" + data);

              let splitted = data.split("=====\n");

              for (var i = 0; i < splitted.length; i++) {
                (function (i) {
                  setTimeout(function () {
                    document.getElementById("animate").innerText = splitted[i];
                  }, 200 * i);
                })(i);
              }
              // eventListener for the refresh button
              document
                .getElementById("refreshBtn")
                .addEventListener("click", main);
              // eventListener for the logout button
              document
                .getElementById("logoutBtn")
                .addEventListener("click", loader);
            });
        }
      });
  }

  document.getElementById("loginBtn").addEventListener("click", main);
}
