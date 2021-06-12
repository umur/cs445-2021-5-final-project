window.onload = function singlePage() {
    
 let loginForm = `<h1> Please Login</h1>
Username <input id ="username" value="mwp"/><br/>
Password <input id ="password" value="123456"/><br/>
<button type="button" id="login">Login</button>`


    document.getElementById("outlet").innerHTML = loginForm;
    document.getElementById("login").onclick = function () {

        logIn();

       async  function logIn() {

            const result = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/login", {
                method: "POST",
                headers: { 'Accept': 'application/json', "content-type": "application/json" },
                body: JSON.stringify({
                    username: document.getElementById("username").value,
                    password: document.getElementById("password").value
                })

            })
            data = await result.json();
            let token = data.token;

            if (data.status) {
                callAnimation(tokn);
            }
        }


        async function callAnimation(token) {
            document.getElementById("outlet").innerHTML = `<center><div>
        <h2> Wel come to  </h2>
         <textarea font-size:px" id ="animation" rows = "15" cols = "40"></textarea></br>
         <button id ="refresh"><strong> Refresh <strong></button>
         <button  id ="logout"> <strong>Logout<strong></button>
         </div></center>`;

            document.getElementById("logout").onclick = function () {
                clearInterval(intervalIndex);
                window.onload();
            }
            document.getElementById("refresh").onclick = function () {
                clearInterval(intervalIndex);
                logIn();
            }
            function myLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(location);
                }
            }

            async function location(position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                const Key = 'LA9LZXXesp8TM4HXt8BG36ReAxx6wWa6';
                const location_url = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${Key}&location=
                                    ${latitude}, ${longitude}&includeRoadMetadata=true&includeNearestIntersection=true`

                const geo = await fetch(location_url);
                const location = await geo.json();
                const address = await location.results[0].locations;
                document.querySelector("h2").innerHTML = `Wel Come to  ${address[0].adminArea5}
                                                        ,${address[0].adminArea3} ,${address[0].postalCode} ,
                                                         ${address[0].adminArea1} `;

            }
            myLocation();

            const refresh = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const picture = await refresh.text();
            let picList = picture.split("=====");
            let Index = -1;
            let intervalIndex = setInterval(function () {
                ++Index;
                if (Index >= picList.length) {
                    Index = 0;
                }
                document.getElementById('animation').innerHTML = picList[Index]

            }, 200);

        }
    }
}