


window.onload = function login() {
   const div = document.getElementById("outlet");
   let pageLout1 = `
        <center> <div>
         <h1>Please Login</h1>
        <p style="display:inline;color:blue" ><strong> Username:<strong></p>
        <input id = "username"  value = "mwp"/></br></br>
        <p style="display:inline;color:blue"><strong> Password:<strong></p>
        <input id = "password" value = "123456"/></br></br>
         <button style="background-color:gray" id = "login"><strong>Login<strong></button>
         </div><center>`;


   div.innerHTML = pageLout1;

   document.getElementById("login").onclick = myInputs;

   function myInputs() {

      let userName = document.getElementById("username").value;
      let password = document.getElementById("password").value;

      myTokens();

      async function myTokens() {
         const state = {
            username: userName, 
            password: password  
         }

         const login_url = "https://shrouded-badlands-76458.herokuapp.com/api/login";

         const result = await fetch(login_url, {
            method: "POST",
            headers: { 'Accept': 'application/json', "content-type": "application/json" },
            body: JSON.stringify(state)

         })
         const data = await result.json();
         var token = data.token;

         if (data.status) {
            getAnimation(token);
         }
      }


      async function getAnimation(token) {
         let pageLout2 = `
             <center><div>
            <h2>Welcome to Fairfield</h2>
             <textarea style="background-color:aqua;color:blue;font-size:14px" 
             id ="animation" rows = "15" cols = "40"></textarea></br>
             <button style="background-color:gray" id ="refresh"><strong>
             Refresh Animation<strong></button>
             <button style="background-color:gray" id ="logout">
             <strong>Logout<strong></button>
             </div></center>`;

         div.innerHTML = pageLout2;

         document.getElementById("logout").onclick = function () {
            clearInterval(intervalID);
            window.onload();
         }
         document.getElementById("refresh").onclick = function () {
            clearInterval(intervalID);
            myTokens();
         }
         function myLocation() {
            if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(myPosition);
            }
         }

         async function myPosition(position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            const apiKey = 'KAqPGLkZJFjYJp3yfcB5Jsn4kPjGeJ7s';
            const location_url = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${apiKey}&location=
                                   ${lat}, ${lng}&includeRoadMetadata=true&includeNearestIntersection=true`

            const getGeoLocation = await fetch(location_url);
            const location = await getGeoLocation.json();
            const adress = await location.results[0].locations;
            document.querySelector("h2").innerHTML += `<div style = "color : #1E90FF;"> ${adress[0].street} ,${adress[0].adminArea5}
                                                       ,${adress[0].adminArea3} ,${adress[0].postalCode} ,
                                                        ${adress[0].adminArea1} </div>`;

         }
         myLocation();

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

