
window.onload = function windColl() {

    const loginTemplate =
        `
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">         
        <div class="container">
        <div id="form">
              <div class="form-group">
                <h1>Please Login</h1>
                    <label>Username:</label>
                    <input type="text" name="username" id="userid" value="mwp">
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="text" id="password" placeholder="123" value="123456">
                </div>
                <div class="form-group">
                    <button class="btn btn-success" id = "login">login</button>
                </div>
        </div>
        <style>
    
           #form{
        margin-right: 25%;
          margin-left: 25%;
          margin-top: 40px;
          padding-bottom:100px;
          border-radius: 6%;
               background-image: url("./loginpic.jpg");
               background-repeat: no-repeat;
                background-size: cover;
           }
       
          body
          {
               margin-top: 50px;
          background-image: url("./loginp.png");
               background-repeat: no-repeat;
                background-size: cover;
            position: relative;
            z-index: 100;
            padding-bottom:100px
            text-align: center;
        }
        .btn
        {
    margin-left:258px
        }
        .btn{
    margin-top:39px

        }
        .btn{
            padding-top:60px
        }

        .btn{
            border-radius: 16%;
        }
        
    </style>
        
        `



    const animationTemplate = `
                                <div class="anm">
                                    <h1 id = "location"></h1>
                                    <textarea id="showAnimation" cols="65" rows="30"></textarea><br><br>
                                    <button id="refresh" class="btn btn-outline-primary">Refresh Animation</button>
                                    <button type="button "class="btn btn-outline-primary" id="logout">Logout</button>
                                </div>
                                <style>
                                
                                h1{
                                    font-size:24px
                                }
                                h1{
                                    color:white
                                }
                                
                             
                                body{
                                background-image: url("./assync.gif");
                                 background-repeat: no-repeat;
                                        background-size: cover;
                                        resize:both

                                }
                                </style>
                                `

    let locationAddress;
    let token;
    let latitude;
    let longitude;
    let TimerId
    const Key = "qjQKyplDWgEdemjtCWWQMyKctLOUwEgN";
    const outlet = document.getElementById("outlet");

    history.pushState({ page: "login" }, "login", "?login");// adding login page to the browser's session history stack// reference:-?https://www.programmersought.com/article/93597378708/
    outlet.innerHTML = loginTemplate;

    function fetchLocation() {
        navigator.geolocation.getCurrentPosition(success, (message) => {
            alert(`${message.code}, ${message.message} `);
            outlet.innerHTML = "please confirm location to see play animation";
        })
        async function success(position) {
            longitude = position.coords.longitude;
            latitude = position.coords.latitude

            try {
                let fetchJson = await fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=${Key}&location=${latitude},${longitude}&includeRoadMetadata=true&includeNearestIntersection=true`)
                let fetchobj = await fetchJson.json()
                let adrs = fetchobj.results[0].locations
                locationAddress = `Welcome all from ${adrs[0].adminArea5},${adrs[0].adminArea3},${adrs[0].adminArea1}`
                // console.log(adrs)
                // locationAddress.style.backgroundcolor = "white"
                document.querySelector("#location").innerHTML = locationAddress
            } catch (err) {
                outlet.innerHTML = err
            }
        }
    }
    const lgnButton = document.querySelector("#login")
    lgnButton.addEventListener("click", logInFunction);

    function logInFunction() {
        myAnimFunction()// //The login function holds all the DOM elements for the credential page.
    }
    async function myAnimFunction() {
        history.pushState({ page: "animation" }, "animation", "?animation")//animation's hisstory session
        outlet.innerHTML = animationTemplate;
        fetchLocation()
        try {
            const response = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/login", {
                method: "POST",
                headers: {
                    "content-type": "appliction/json"
                },
                body: JSON.stringify({
                    "username": "mwp",
                    "password": "123456"
                })
            })
            const jsn = await response.json()
            token = jsn.token
            const status = jsn.status

            if (status === true) {
                getAnimation()
            }

        } catch (err) {
            outlet.innerHTML = err
        }
        const animation = document.getElementById("showAnimation")
        async function getAnimation() {
            let response;
            let animArray;
            try {
                response = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation", {
                    method: "GET",
                    headers: {
                        "content-type": "application/text",
                        Authorization: `Bearer ${token}`
                    }
                })
                const animSrcData = await response.text()
                animArray = animSrcData.split("=====\n")
            } catch (err) { }
            let current = 0;
            let maxLength = animArray.length
            TimerId = setInterval(() => {
                document.getElementById("showAnimation").innerHTML = animArray[current]
                animation.innerHTML = animArray[current]
                current++
                if (current === maxLength) {
                    current = 0;
                }
            }, 200)

        }
        //to refresh the page
        const refresh = document.querySelector("#refresh");
        refresh.addEventListener("clear", reloadandClearanim);

        function reloadandClearanim() {
            clearInterval(TimerId)
            getAnimation() //fetches animation from 
        }

        //Log out the page
        const loggout = document.getElementById("logout")
        loggout.addEventListener('click', logoutAnim)
        function logoutAnim() {  //
            outlet.innerHTML = loginTemplate
            const lgnbtn = document.getElementById("login");
            lgnbtn.addEventListener("click", logInFunction)
            history.pushState({ page: "login" }, "login", "?login")

        }

    }

    window.addEventListener("popstate", (event) => {
        if (event.state.page === "login") {
            clearInterval(TimerId)
            windColl()
        } else {
            clearInterval(TimerId)
            myAnimFunction()
        }
    })




}
