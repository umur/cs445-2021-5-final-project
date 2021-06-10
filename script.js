window.onload = pageOnlaod;
function pageOnlaod() {
    let userToken;
    let timerId;
    let long, lat;
    const div = document.querySelector('#outlet');
    const loginTemplate = `
    <h2> <h2><br><b>
    userName:<input placeholder="mwp" value="mwp" id="username"/><br/><b>
    passWord:<input placeholder="123456" value="123456" id="password"/><br><br>
    <input type="button" id="login" class="btn btn-info" value="login"> <b>
    <style>
    body{
        width:400px;
        mergin:1em auto;
    }
    </style>`
    const animationTemplate = `
<div id="address" style="font-size:22px" style="font-weight">
<p id="currentLocation"></p>
<textarea id="animation" rows="20" cols="37"></textarea><br><br>
<button type="button" id="refresh" class="btn btn-info">Load Animation</button><b>
<button type="button" id="logout" class="btn btn-info">logout</button><b></div>
<style>
body{
    width:400px;
    mergin:0.5em auto;
}
</style>`
    mainLogInPage();
    function mainLogInPage() {
        div.innerHTML = loginTemplate;
        const loginB = document.getElementById('login');
        loginB.addEventListener('click', animationPage);
        history.pushState({ 'page': 1 }, "Login", '?loginPage');
    }
    async function animationPage() {
        let userName = document.querySelector('#username');
        let passWord = document.querySelector('#password');
        let loginReq = {
            method: "POST",
            body: JSON.stringify({ username: userName.value, password: passWord.value }),
            headers: { "Content-Type": "application/json" }
        }
        let result = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/login", loginReq)
        let jsonObj = await result.json();
        if (jsonObj.status) {
            openPage();
            userToken = jsonObj.token
        } else {
            alert("incorret password try again!")
        }
        function openPage() {
            geoLocationRequst();
            div.innerHTML = animationTemplate;
            history.pushState({
                page: 2
            }, "animation", "?playingpage")

            playAnimation();
            function playAnimation() {
                document.getElementById("refresh").onclick = async function () {
                    const aniamtinImg = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation", {
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    })
                    let pic = await aniamtinImg.text();

                    let splitImg = pic.split("=====\n");

                    let curNewsIndex = -1;
                    timerId = setInterval(function () {
                        ++curNewsIndex;
                        if (curNewsIndex >= splitImg.length) {
                            curNewsIndex = 0;
                        }
                        document.getElementById('animation').innerHTML = splitImg[curNewsIndex]

                    }, 300);

                    document.getElementById("logout").onclick = function () {
                        clearInterval(timerId);
                    }
                }
            }
        }
    }
    function geoLocationRequst() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(currentPostion)
        } else {
            alert("geolocation not support")
        }
        async function currentPostion(p) {
            lat = p.coords.latitude;//+ve
            long = p.coords.longitude;//-ve
            let result = await fetch(
                "http://mapquestapi.com/geocoding/v1/reverse?key=q5N7YWFQnHlQCfx0KyD5d1qoATAAFezV&location=" +
                lat +
                "," +
                long
            )
            let loca = await result.json();
            let curLocation = loca.results[0].locations[0].street;
            document.getElementById("currentLocation").innerHTML = "Welocome to " + curLocation;
            console.log(loca.results[0].locations[0].street)
        }

    }
}
