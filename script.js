window.onload = function load() {

    const loginTemplate =
        `
        
            
                <h1>Please Login</h1>
                    <label>Username:</label>
                    <input type="text" name="username" id="userid" value="mwp">
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="text" id="password" placeholder="123" value="123456">
                </div>
                <div class="form-group">
                    <button  id = "login">login</button>
                </div>
        
        `


    const animationTemplate = `
                                
                                    <h1 id = "location"></h1>
                                    <textarea id="showAnimation" cols="65" rows="30"></textarea><br><br>
                                    <button id="refresh" class="btn btn-outline-primary">Refresh Animation</button>
                                    <button type="button "class="btn btn-outline-primary" id="logout">Logout</button>
                              
                                `

    let locationAddress;
    let token;
    let lat;
    let long;
    let TimerId
    const Key = "CIvaRacHOFdlRovxkQ0tf9GpA87b407l";
    const outlet = document.getElementById("outlet");

    history.pushState({ page: "login" }, "login", "?login");
    outlet.innerHTML = loginTemplate;

    function fetchLocation() {
        navigator.geolocation.getCurrentPosition(success, (message) => {
            alert(`${message.code}, ${message.message} `);
            outlet.innerHTML = "please confirm location to see animation";
        })
        async function success(position) {
            long = position.coords.longitude;
            lat = position.coords.latitude

            try {
                let res = await fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=${Key}&location=${lat},${long}&includeRoadMetadata=true&includeNearestIntersection=true`)
                let fetchobj = await res.json()
                let address = fetchobj.results[0].locations
                locationAddress = `Welcome all from ${address[0].adminArea5},${address[0].adminArea3},${address[0].adminArea1}`
                
                document.querySelector("#location").innerHTML = locationAddress
            } catch (err) {
                outlet.innerHTML = err
            }
        }
    }
    const lgnButton = document.querySelector("#login")
    lgnButton.addEventListener("click", logInFunction);

    function logInFunction() {
        myAnimFunction()
    }
    async function myAnimFunction() {
        history.pushState({ page: "animation" }, "animation", "?animation")
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
        const refresh = document.querySelector("#refresh");
        refresh.addEventListener("clear", reloadandClearanim);

        function reloadandClearanim() {
            clearInterval(TimerId)
            getAnimation() 
        }

        const loggout = document.getElementById("logout")
        loggout.addEventListener('click', logoutAnim)
        function logoutAnim() {  
            outlet.innerHTML = loginTemplate
            const lgnbtn = document.getElementById("login");
            lgnbtn.addEventListener("click", logInFunction)
            history.pushState({ page: "login" }, "login", "?login")

        }

    }

    window.addEventListener("popstate", (event) => {
        if (event.state.page === "login") {
            clearInterval(TimerId)
            load()
        } else {
            clearInterval(TimerId)
            myAnimFunction()
        }
    })
}
