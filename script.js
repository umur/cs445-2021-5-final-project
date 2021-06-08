// your code here
window.onload = function login() {
    const div = document.getElementById("outlet");
    let templateLogin = `
                         <h1>Please Login</h1>
                          Username<input id = "username"  value = "mwp"/></br>
                          Password<input id = "password" value = "123456"/></br>
                          <button id = "login">Login</button>`;
 
 
    div.innerHTML = templateLogin;
 
    document.getElementById("login").onclick = getInputs;
    document.querySelector("#login").addEventListener("click", () => history.pushState({ Page: 1 }, "", "/animationPage"));

 
    function getInputs() {
 
       let userName = document.getElementById("username").value;
       let password = document.getElementById("password").value;
 
       fetchToken();
 
       async function fetchToken() {
          const state = {
             username: userName, //mwp
             password: password  //12345
          }
 
          const login_url = 'https://shrouded-badlands-76458.herokuapp.com/api/login';
 
          const result = await fetch(login_url, {
             method: "POST",
             headers: { 'Accept': 'application/json', "content-type": "application/json" },
             body: JSON.stringify(state)
            
          })
          const data = await result.json();
          let token = data.token;
          if (data.status) {
             animation(token);
          }
       }
 
 
       async function animation(token) {
          let templateAnimation = `
                                  <h2>This is My Location</h2>
                                 <textarea id ="animation" rows = "20" cols = "60"></textarea></br>
                                <button id ="refresh">Refresh Animation</button>
                               <button id ="logout">Logout</button>`;
 
          div.innerHTML = templateAnimation;
 
          document.getElementById("logout").onclick = function () {
             //history.pushState({ Page: 1 }, "", "/login");
             clearInterval(intervalID);
             window.onload();
          }
          document.getElementById("refresh").onclick = function () {
             clearInterval(intervalID);
             fetchToken();
          }
          function getLocation() {
             if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
             }
          }
 
          async function showPosition(position) {
             let lat = position.coords.latitude;
             let lng = position.coords.longitude;
             const apiKey = 'LAvAyAA0wEwzZfTqoECxe2fxa8mDM6KT';
             const location_url = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${apiKey}&location=${lat}, 
                                    ${lng}&includeRoadMetadata=true&includeNearestIntersection=true`
 
             const getGeoLocation = await fetch(location_url);
             const location = await getGeoLocation.json();
             const adress = await location.results[0].locations;
             document.querySelector("h2").innerHTML += `<div> ${adress[0].street} ,${adress[0].adminArea5}
                                                        ,${adress[0].adminArea3} ,${adress[0].postalCode} ,
                                                         ${adress[0].adminArea1} </div>`;
 
          }
          getLocation();
 
          const animation_url = "https://shrouded-badlands-76458.herokuapp.com/api/animation";
 
          const res = await fetch(animation_url, {
             method: "GET",
             headers: {
                'Authorization': `Bearer ${token}`
             }
          })
          const picture = await res.text();
          let arrayPictures = picture.split("=====");
 
          let curNewsIndex = -1;
          let intervalID = setInterval(function () {
             ++curNewsIndex;
             if (curNewsIndex >= arrayPictures.length) {
                curNewsIndex = 0;
             }
             document.getElementById('animation').innerHTML = arrayPictures[curNewsIndex]
 
          }, 200);
 
       }
    }
 }
 
 