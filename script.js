// your code
window.onload = loginAminApp;
function loginAminApp() {
  const pageView = document.querySelector("#outlet");
  let token;
  let timerId;
  const geokey = `1jwCRc01HYt6VS4GQSVQTMxsHTAIHqGt`;

  const loginElements = `<div class="log-form">
    <h1 >Please Login</h1>
    Username : <input type="text" value="mwp" id="username" /><br><br>
    Password : <input type="text"  value="123456" id="password"/><br><br>
    <button type="button" class="btn" id="login">Login</button><br>
  </div><!--end log form -->`;

  const animationElements = `<div id="location"> welcome to ASCII Animation</div>
  <textarea id="#loading" rows="20" cols="50"></textarea><br>
  <button id="refresh" >Refresh Animation</button>
  <button id="logOut"> LogOut </button>`;

  pageView.innerHTML = loginElements;

  history.pushState("login", null, "?/login");

  const loginButon = document.querySelector("#login");
  loginButon.addEventListener("click", (_heed) => {
    history.pushState(
      {
        page: "login",
      },
      null,
      "?animationPage"
    );
    loginPage();
  });

  async function loginPage() {
    try {
      let username = document.querySelector("#username").value;
      let password = document.querySelector("#password").value;
      let logObject = {
        username: username,
        password: password,
      };

      pageView.innerHTML = animationElements;

      let response = await fetch(
        " https://shrouded-badlands-76458.herokuapp.com/api/login ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(logObject),
        }
      );

      let result = await response.json();
      token = result.token;
      console.log(token);

      getAnimation();

      geoLocation();

      document.querySelector("#refresh").addEventListener("click", (_heed) => {
        if (timerId) clearInterval(timerId);
        getAnimation();
      });
      const refresh = document.querySelector("#refresh");
      refresh.addEventListener("click", (_heed) =>
        history.pushState(
          {
            page: "refresh",
          },
          null,
          "?/refrashAnimation"
        )
      );
    } catch (error) {
      console.log(`Error message : ${error}`);
    }
  }

  async function getAnimation() {
    try {
      let getAnimation = await fetch(
        "https://shrouded-badlands-76458.herokuapp.com/api/animation",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let animation = await getAnimation.text();

      let animationArray = animation.split("=====\n");
      let index = 0;
      timerId = setInterval((_heed) => {
        document.querySelector("#loading").value = animationArray[index];
        index++;

        if (index == animationArray.length) {
          index = 0;
        }
      }, 200);

      document.querySelector("#logOut").addEventListener("click", (_heed) => {
        pageView.innerHTML = loginElements;

        const logOutButton = document.querySelector("#logOut");
        logOutButton.addEventListener("click", (_heed) =>
          history.pushState(
            {
              page: "logOut",
            },
            null,
            "?/login"
          )
        );

        token = null;

        animationArray.splice(index, animationArray.length - 1);

        clearInterval(timerId);
      });
    } catch (error) {
      console.log(`Error message : ${error}`);
    }
  }

  async function geoLocation() {
    try {
      navigator.geolocation.getCurrentPosition(success);

      async function success(position) {
        let long = position.coords.longitude;
        let lat = position.coords.latitude;

        let geoResponse =
          await fetch(`http://www.mapquestapi.com/geocoding/v1/reverse?key=${geokey}
                       &location=${lat},${long}&includeRoadMetadata=true&includeNearestIntersection=true`);
        let location = await geoResponse.json();
        const city = location.results[0].locations[0].adminArea5;
        const state = location.results[0].locations[0].adminArea3;
        const country = location.results[0].locations[0].adminArea1;

        document.querySelector(
          "#location"
        ).innerHTML = `Welcome all from ${city},${state},${country}`;
      }
    } catch (error) {
      document.querySelector(
        "#location"
      ).innerHTML = `Welcome all to  SPA !! Your location is not defined`;
      console.log(error);
    }
  }

  window.addEventListener("popstate", (_heed) => {
    if (history.page == "login") {
      pageView.innerHTML = loginElements;
    } else if (history.page == "animation") {
      pageView.innerHTML = loginElements;
    } else if (history.page == null) {
      pageView.innerHTML = loginElements;
    }
  });
}
