window.onload = function runApplication() {
    const div = document.getElementById("outlet");
    loadLoginPage();

    // ====== FUNCTIONS ======
    function loadLoginPage() {
        // --- loginTemplate ---
        div.innerHTML = `
        <div>
            <h1>Please Login</h1>
            <label for="username"><strong>Username:<strong></label>
            <input type="text" id="username" value = "mwp"/>
            <br>
            <label for="password"><strong>Password:<strong></label>
            <input type="password" id="password" value="123456"/></br></br>
            <button id="login">Login</button>
        </div>`;

        document.getElementById("login").addEventListener("click", login);
        history.pushState({page: 1}, "login", "?login");
    }

    async function login() {
        const credentials = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        };
        const loginUrl = "https://shrouded-badlands-76458.herokuapp.com/api/login";

        const result = await fetch(loginUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await result.json();
        let {status: loginStatus} = data;
        if (loginStatus) {
            let {token} = data;
            // console.log(`STATUS: ${loginStatus}, token: ${token}`)
            await animate(token);

        } else {
            showAlert('failure', "Login Failure");
        }
    }

    async function animate(token) {
        let intervalId;
        const div = document.getElementById("outlet");
        // --- animationTemplate ---
        div.innerHTML = `
        <div>
            <h2 id="header">Fairfield Animators Gala</h2>
            <textarea id="animation" rows="25" cols="40"></textarea>
            </br>
            <button id="refresh">Refresh Animation</button>
            <button id="logout">Logout</button>
        </div>`;

        history.pushState({page: 2}, "animation", "?animation");
        fetchGeolocation();

        document.getElementById("logout").addEventListener("click", function () {
            clearInterval(intervalId);
            loadLoginPage();
        });
        document.getElementById("refresh").addEventListener("click", async function () {
            clearInterval(intervalId);
            intervalId = await fetchAnimation(token);
        });

        intervalId = await fetchAnimation(token);
    }

    async function fetchAnimation(token) {
        const animationUrl = "https://shrouded-badlands-76458.herokuapp.com/api/animation";

        const response = await fetch(animationUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const fullAnimation = await response.text();
        let animationStillImages = fullAnimation.split("=====");

        /**
         * "Set Interval" Contributed by jfriend00 (https://stackoverflow.com/users/816620/jfriend00)
         * https://stackoverflow.com/questions/7439519/setinterval-to-loop-through-array-in-javascript/7440323
         * */
        let loopIndex = -1;
        return setInterval(function () {
            ++loopIndex;
            if (loopIndex >= animationStillImages.length) {
                loopIndex = 0;
            }
            document.getElementById("animation").innerHTML =
                animationStillImages[loopIndex];
        }, 200);
    }

    function fetchGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(currentPosition);
        } else {
            showAlert('failure', "GeoLocation not supported!");
        }

        async function currentPosition(position) {
            let {latitude, longitude} = position.coords;
            const apiKey = "9r5Xw9fGbrzbMyiVJNG5rVsobE1yCGTb";
            let location_url = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${apiKey}&location=${latitude},${longitude}`;
            const getGeoLocation = await fetch(location_url);
            const geoLocationResponse = await getGeoLocation.json();
            const {locations} = await geoLocationResponse.results[0];
            const {street, adminArea3, postalCode, adminArea1, adminArea5} = locations[0];
            console.log(`${street}, ${adminArea5}, ${adminArea3}, 
                  ${postalCode}, ${adminArea1}`);
            document.getElementById("header").innerHTML += `
            <div style = "color : rgba(108,20,226,0.82);">
                  <h5>Location: ${street}, ${adminArea5}, ${adminArea3},${postalCode}, ${adminArea1}</h5>
            </div>`;
        }
    }

    const showAlert = (type, msg) => {
        hideAlert();
        const alertSuccessCss = `
              background-color: #dff0d8;
              border-color: #d6e9c6;
              color: #3c763d;`;
        const alertFailureCss = `
              background-color: #f2dede;
              border-color: #ebccd1;
              color: #a94442;`;
        const alertDismissibleCss = `
              padding-right: 35px;
              position: relative;
              top: -2px;
              right: -21px;
              color: inherit;`;
        let alertStyle;
        if (type === "failure") {
            alertStyle = alertFailureCss;
        } else if (type === "success") {
            alertStyle = alertSuccessCss;
        }

        const markup = `
        <div class="alert" style="${alertStyle} ${alertDismissibleCss}" role="alert">${msg} 
            <button type="button" aria-label="Close">
                <span aria-hidden="true">×</span>
            </button>
        </div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
        window.setTimeout(hideAlert, 4000);
    }

    const hideAlert = () => {
        const el = document.querySelector('.alert');
        if (el) el.parentElement.removeChild(el);
    }

};
