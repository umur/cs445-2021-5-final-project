// your code 
// your code here



window.onload = function login() {
    const div = document.getElementById("outlet");
    let templateLogin = `
                         <h1>Please Login</h1>
                          Username<input id = "user"  value = "mwp"/></br>
                          Password<input id = "pass" value = "123456"/></br>
                          <button id = "login">Login</button>`;


    div.innerHTML = templateLogin;




    document.getElementById("login").onclick = getUserAndPass;

    function getUserAndPass() {

        let username = document.getElementById("user").value;
        let password = document.getElementById("pass").value;

        fetching();

        async function fetching() {
            const UserId = {
                username: username,
                password: password
            }

            const login_url = "https://shrouded-badlands-76458.herokuapp.com/api/login";

            const result = await fetch(login_url, {
                method: "POST",
                headers: { 'Accept': 'application/json', "content-type": "application/json" },
                body: JSON.stringify(UserId),

            })
            const data = await result.json();
            var token = data.token;

            if (data.status) {
                animation(token);
            }
        }

        async function animation(token) {
            let templateAnimation = `
                                  <h2 id="location"></h2>
                                  <textarea id ="animation" rows = "40" cols = "70"></textarea></br>
                                  <button id ="refresh">Refresh Animation</button>
                                  <button id ="logout">Logout</button>`;

            div.innerHTML = templateAnimation;

            document.getElementById("logout").onclick = function () {
                clearInterval(intervalID);
                window.onload();
            }
            document.getElementById("refr").onclick = function () {
                clearInterval(intervalID);
                fetching();
            }
            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showCurPosition);
                }
            }
            //////////////////////////////////////////////////////////////////////
            //     <script>

            //     if ('geolocation' in navigator) {
            //         console.log('geolocation availliable');
            //         navigator.geolocation.getCurrentPosition(posittion => {

            //             const lat = posittion.coords.latitude
            //             const lon = posittion.coords.longitude
            //             document.getElementById("latitude").textContent = lat
            //             document.getElementById("longitude").textContent = lon
            //             const data = { lat, lon }
            //             const options = {

            //                 method: 'POST',
            //                 body: JSON.stringify(data),
            //                 headers: {
            //                     'Content-Type': 'application/json'
            //                 }
            //             }
            //             fetch('/api', options)
            //         })
            //     } else {
            //         console.log('geolocation not availliable')
            //     }
            // </script>

                `<div>
                         <p>
                           latitude:<span id="latitude"></span>&deg<br>
                           longitude:<span id="longitude"></span>&deg<br>
                         </p>

                 </body> `

            async function showCurPosition(position) {

                let latt = position.coords.latitude;
                let lon = position.coords.longitude;

                const apiKey = '1C6fAGNXs1ndtOUQ7YGBA0IYKznhYVpI';

                const location_url = `http://www.mapquestapi.com/geocoding/v1/reverse?
                                    key=${apiKey}&location
                                    =${latt}, ${lon}&includeRoadMetadata
                                    =true&includeNearestIntersection=true `

                const getGeoLocation = await fetch(location_url);
                const location = await getGeoLocation.json();
                const adress = await location.results[0].locations;



                document.querySelector("#location").innerHTML = `Welcome all from ${adress[0].adminArea5},${adress[0].adminArea3},${adress[0].adminArea1}`
            }
            getLocation();


            const animation_url = "https://shrouded-badlands-76458.herokuapp.com/api/animation";

            const response = await fetch(animation_url, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const animated = await response.text();
            let animPicture = animated.split("=====\n");

            let current = -1;
            let intervalID = setInterval(function () {
                ++current;
                if (current >= animPicture.length) {
                    current = 0;
                }

                document.getElementById('animation').innerHTML = animPicture[current]

            }, 200);

        }
    }
}



/*loading the login page  */
