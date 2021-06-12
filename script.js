window.onload = myFile
function myFile() {
    const loginTemplate = `
    <dv>
    <dv>
    <!-- login title -->
        <h1>Please login</h1>
        <label>Username:</label>
        <input id="userid" type="text" value="wmp"><br><br>
    </dv>
    <dv>
    <!-- password label and button -->
        <label>Password:</label>
        <input id="password" type="text" value="123456"><br>
        <input type="button" id="login" value="Login" />
    </dv>
</dv>
  `
    const animationTemplate = `
<div>
<div>
    <h1 id="textarea"></h1>
    <textarea id="AnimationDisplay" cols="60" rows="20"></textarea><br>
    <button id="btnAnimationRef" class="button">Refresh Animation</button>
    <button type="button" id="Logout">Logout</button>
</div>
</dv>`
    let token;
    let latitude;
    let longitude;
    let locationAddress
    let TimerId
    const mapgeoKey = "0iqRkdu6twRHdAO8UJLNsX7SErO0iX7K";
    const divOutlet = document.querySelector("#outlet");
    history.pushState({ state: "loin" }, "", "?login")
    divOutlet.innerHTML = loginTemplate;
    function fetchLocation() {
        navigator.geolocation.getCurrentPosition(success, (message) => {
            alert(`${message.code}, ${message.message} `);
        })
        async function success(position) {
            longitude = position.coords.longitude;
            latitude = position.coords.latitude
            try {
                let fetchData = await fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=${mapgeoKey}&location=${latitude},${longitude}&includeRoadMetadata=true&includeNearestIntersection=true`)
                let fetchobj = await fetchData.json()
                let adrress = fetchobj.results[0].locations
                locationAddress = `Welcome all from ${adrress[0].adminArea5},${adrress[0].adminArea3},${adrress[0].adminArea1}`
                console.log(adrress)

                document.querySelector("#textarea").innerHTML = locationAddress
            } catch (err) {
                divOutlet.innerHTML = err
            }
        }
    }
    // log in button
    const lgnButton = document.querySelector("#login")
    lgnButton.addEventListener("click", logInFunction);
    function logInFunction() {
        myAnimFunction()
    }
    async function myAnimFunction() {
        //animation's history API
        history.pushState({ page: "animation" }, "", "?animation")
        divOutlet.innerHTML = animationTemplate;
        fetchLocation()
        const myOb = {"username": "mwp", "password": "123456"}
        try {
            const lg_url = "https://shrouded-badlands-76458.herokuapp.com/api/login"
            const resp = await fetch(lg_url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    // "Content-Type": "appliction/json",

                },

                body: JSON.stringify(myOb)
            })
            const jsnData = await resp.json()
            token = jsnData.token
            const status = jsnData.status
            if (status === true) {
                getAnimation()
            }
            // console.log(status)
            // console.log(token)
        } catch (error) {
            divOutlet.innerHTML = error
        }
        const animation = document.querySelector("#AnimationDisplay")
        async function getAnimation() {
            let response;
            let animArray;
            try {
                response = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/text',
                        Authorization: `Bearer ${token}`
                    }
                })
                const animSrcData = await response.text()
                animArray = animSrcData.split("=====\n")
            } catch (err) { }
            let current = 0;
            let maxLength = animArray.length
            TimerId = setInterval(() => {
                animation.innerHTML = animArray[current]
                current++
                if (current === maxLength) {
                    current = 0;
                }
            }, 200)
        }
        //loggout button
        const loggout = document.querySelector("#Logout").addEventListener('click', logoutAnim)
        function logoutAnim() {  //
            divOutlet.innerHTML = loginTemplate
            const lgnbtn = document.querySelector("#login");
            lgnbtn.addEventListener("click", logInFunction)
            history.pushState({ page: "login" }, "login", "?login")
        }
    }
   
    // document.querySelector("#btnAnimationRef").addEventListener("click", reloadandClearanim);
    const refresh = document.querySelector("#btnAnimationRef");
    refresh.addEventListener("click", reloadandClearanim);

    function reloadandClearanim() {
        clearInterval(TimerId)
        myAnimFunction()
    }
    window.addEventListener("popstate", (event) => {
        if (event.state.page === "login") {
            clearInterval(TimerId)
            myFile()
        } else {
            clearInterval(TimerId)
            myAnimFunction()
        }
    })
}
