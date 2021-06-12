"use strict";
/*eslint-disable*/

window.addEventListener('load', function finalProject() {
    let tokenId, animationID, textId, longitude, latitude, keyId = "";

    const myLogin = `<h1>Please login</h1><br/>
             username: <input type="text" value="mwp" id="input1" /> <br/>
             password: <input type="text" value="123" id="input2" /> <br/>
             <button type="button" id="login">Login</button>`

    const myAnimation = `<h1 id="locationTitle"> </h1>
             <textarea type="text" id="outputDiv" cols="60" rows="15" style="font-size: 18px;"></textarea></br>
             <button type="button" id="animation">Refresh Animation</button>
             <button type="button" id="logout">Logout</button>`


    window.addEventListener('popstate', function () {
        if (history.state === null) {
            document.getElementById("outlet").innerHTML = myLogin;
            document.getElementById("login").addEventListener('click', findToken);

        }
        else {
            clearInterval(animationID)
            textId = history.state
            let count = 0
            animationID = setInterval(() => {
                document.getElementById("outputDiv").innerHTML = textId[count];
                count++;
                if (count == textId.length) {
                    count = 0;
                }
            }, 200)
        }
    })

    firstPage();

    function firstPage() {
        document.getElementById("outlet").innerHTML = myLogin;
    }

    document.getElementById("login").addEventListener('click', tokenView);

    async function tokenView() {

        try {

            let response2 = await fetch('https://shrouded-badlands-76458.herokuapp.com/api/login',
                {
                    method: `POST`,
                    headers: { 'content-Type': 'application/json' },
                    body: JSON.stringify({ username: "mwp", password: "123" })
                })

            response2 = await response2.json();
            //console.log(response2) it shows me false sothat I can't proceed !!!
            tokenId = response2.token;
            if (response2.status === true) {
                animationDisplay();
            }
        }
        catch (error) {
            console.log(error);
        }

    }

    function animationDisplay() {

        navigator.geolocation.getCurrentPosition(success, fail);

        function fail() {
            console.log('Fail to get your location. Try again please.');
        }

        function success(position) {
            longitude = (position.coords.longitude).toFixed(6);
            latitude = (position.coords.latitude).toFixed(6);

            async function findLocation() {
                try {

                    let response1 = await fetch(`http://open.mapquestapi.com/geocoding/v1/reverse`,
                        {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        })

                    // var urlParams = new URLSearchParams(window.location.search);

                    // console.log(urlParams.has('post')); 
                    // console.log(urlParams.get('action'));
                    // console.log(urlParams.getAll('action'));
                    // console.log(urlParams.toString()); 
                    // console.log(urlParams.append('active', '1'));
                    
                    response1 = await response1.json();
                    console.log(response1)
                    const city = response1.results[0].locations[0].adminArea5;
                    const state = response1.results[0].locations[0].adminArea3;
                    const country = response1.results[0].locations[0].adminArea1;
                    document.getElementById('locationTitle').innerHTML = `Welcome all from ${city}, ${state}, ${country}!!`;
                }
                
                catch (error) {
                    console.log(error);
                }
            }

            findLocation();

        }


        document.getElementById("outlet").innerHTML = myAnimation;

        getAnimation();

        async function getAnimation() {
            try {

                let response3 = await fetch('https://shrouded-badlands-76458.herokuapp.com/api/animation',
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/text', Authorization: `Bearer ${tokenId}` },
                    })

                textId = await response3.text();

                playAnimation();
                async function playAnimation() {
                    textId = await textId.split("=====\n");
                    let count = 0;
                    history.pushState(textId, "animation", "?animation");
                    animationID = await setInterval(() => {
                        document.getElementById("outputDiv").innerHTML = textId[count];
                        count++;
                        if (count == textId.length) {
                            count = 0;
                        }
                    }, 200)
                }
            }

            catch (err) {
                console.log(err);
            }
        }

        animation.addEventListener("click", async function () {
            await clearInterval(animationID);
            getAnimation();
        });

        logout.addEventListener("click", async function () {
            document.getElementById("outlet").innerHTML = myLogin;
            window.location.replace(currentPage);
            history.replaceState({ page: 1 }, "login", "?page=1");
        });
    }
})

















