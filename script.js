
window.onload = function () {

    //globar declaration 
    let userToken = "";
    let TimerID;
    let mykey = "KjP5zwaRx5DO6MDhmIMI9fMtKsksKA1W";
    let longitude, latitude;
    let div = document.getElementById("outlet");




    //first window
    const loginTemplate = `<div id="logindiv">
    <h1>Please Login</h1>
    <hr><hr>
    Username: <input type="text" id="username"><br><hr>
    Password: <input type="password" id="password"><br><hr>
    <input type="button" id="login" class="btn btn-info" value="Login" > 
    
    </div>
    
    
    `
    //window after login is clicked
    const templateAnimation = ` 
    <div id="logindiv">
   

    
    <h2 id="wpage">..</h2>
    <textarea rows="20" cols="60" id="playtime" align="center"></textarea><br>
    <button type="button" id="refresh" class="btn btn-info">Refresh_Animation</button>
    <button type="button" id="logout"  class="btn btn-info">Logout</button> </div>
    
    
            `
    loginpage();
    function loginpage() {
        //login template invoked
        div.innerHTML = loginTemplate;

        //call history API
        history.pushState({ page: 1 }, "Login", "?loginPage");

        let login = document.getElementById("login")
        //add event listener to the login button
        login.addEventListener("click", myLoginFunction);

    }



    function myLoginFunction() {
        let user = document.querySelector("#username");
        let pw = document.querySelector("#password");



        let loginReq = {
            method: "POST",
            body: JSON.stringify({ username: user.value, password: pw.value }),
            headers: { "Content-Type": "application/json" }
            //headers:{Authorization: "Beare "+window.localStorage.getItem("token") }
        }
        fetch("https://shrouded-badlands-76458.herokuapp.com/api/login", loginReq)
            .then(result => result.json())
            .then(({ status, token }) => {
                console.log(status);
                console.log(token);
                if (status) {
                    nextPage();
                    //   console.log(status);
                    //   console.log(userToken);

                    userToken = token;
                    getAnimation();
                    // console.log(userToken);



                } else {

                    //Invalid Login
                    userToken = "";
                    alert("Try again!user or password is wrong")

                }
            });

        function nextPage() {
            //getAnimation();
            getlocation();


            history.pushState({
                page: 2
            }, "animation", "?playingpage")
            div.innerHTML = templateAnimation;


        }

    }

    function addEvent() {
        let logOut = document.querySelector("#logout");
        logOut.addEventListener("click", log);
        let refresh = document.querySelector("#refresh");
        refresh.addEventListener("click", refreshAnim);
    }

    function log() {
        div.innerHTML = loginTemplate;
        token = false;
        loginpage();
    }
    function refreshAnim() {
        console.log("clicked");
        clearInterval(TimerID)
        getAnimation();
    }

    // function getlocation() {
    //     getLatandLong();

    // }
    function getlocation() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition)
        }
        else {
            console.log("no support");
        }


    }
    function showPosition(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        fetch(`http://open.mapquestapi.com/geocoding/v1/reverse?key=${mykey}&location=${latitude},${longitude}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(address => address.json()).then(res => {
            let city = res.results[0].locations[0].adminArea5;
            let state = res.results[0].locations[0].adminArea3;
            let country = res.results[0].locations[0].adminArea1;
            let currentAddress = `Welcome all to, ${city}, ${state}, ${country}`;
            let welcomePage = document.querySelector("#wpage");
            welcomePage.innerHTML = currentAddress;
            addEvent();

        });



    }


    function getAnimation() {
        let playt = document.querySelector("#playtime");
        // console.log("token use",userToken);
        fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation", {
            method: "GET",
            headers: {
                "Content-Type": "application/text",
                "Authorization": `Bearer ${userToken}`
            }
        }).then(result => result.text())
            .then(data => {
                const splitdata = data.split("=====\n");
                console.log(splitdata);
                playt.innerHTML = splitdata[0];
                let next = 1;
                let maxlength = splitdata.length;
                TimerID = setInterval(() => {
                    playt.innerHTML = splitdata[next];
                    next++;
                    if (next === maxlength) {
                        next = 0;
                    }
                }, 200);

            })
    }

    window.addEventListener('popstate', function (event) {
        if (event.state.page === 1) {
            clearInterval(TimerID)
            loginpage();
        } else {
            clearInterval(TimerID)
            getAnimation();
        }
    })

}


