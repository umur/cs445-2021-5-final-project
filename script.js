window.onload = app;
window.addEventListener('popstate', app)
function app() {

  let animid;
  let token;
  let move;
  let latit;
  let longti;

  const KEY = LA9LZXXesp8TM4HXt8BG36ReAxx6wWa6;

  const loginStream = `
 <h1>Please login</h1>
 UserName <input placeholder="mwp" value="map"/> <br>
 Password <input placeholder="123" value="123456"/> <br>
 <button id='login'>Login</button>`;

  const animationStream = `
<div id="adress">Welcome</div>
<textarea name="" id="animation" cols="40" rows="10" style="font-size: 16px;"></textarea> <br>
<button id="refresh">Refresh Animation</button>
<button id="logout">Logout</button>
`;

window.addEventListener('popstate', function (event) {
  if (event.state.page === 1) {
      clearInterval(animid)
      stream();
  } else {
      clearInterval(animid)
      robotLogin();
  }
})

//fetchLogin();
stream()   
function stream() {
    let outlet = document.getElementById("#outlet");
    outlet.innerHTML = loginStream;
    
    history.pushState({
        page: 1
    }, "login", "?login")
    let button = document.getElementById("#login");
    button.addEventListener("click", fetchLogin);
  }
async function fetchLogin() {
    const result = await fetch("https://cs445-project.herokuapp.com/api/login", {
    method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": "mwp",
            "password": "123456"
        })
    })

    const myJson = await result.json()
    token = myJson.token;
    const status = myJson.status;

    if (status === true) {
        robotLogin(); 
    }
}

function robotLogin() {
  history.pushState({
      page: 2
  }, "animation", "?animation")
  outlet.innerHTML = animationStream;

  fetchAddress();
  callRobot(); 
}

function fetchAddress() {

  navigator.geolocation.getCurrentPosition(success, fail);
  
  function success(position) {
      longti = position.coords.longtude;
      latit = position.coords.latitude;
      address(); 
      loginAndOut(); 
  }
  
  function fail(msg) {
      alert(`${msg.code} ${msg.message} `);
      
      outlet.innerHTML = "need geoLocation";
  }

}
async function address() {
  const result = await fetch(`http://open.mapquestapi.com/geocoding/v1/reverse?key=${Key}&location=${latit},${longti}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      }
  })
  const position = await result.json();
  const city = position.results[0].locations[0].adminArea5;
  const state = position.results[0].locations[0].adminArea3;
  const country = position.results[0].locations[0].adminArea1;
  
  geolocation.innerHTML = `thanks  ${city}, ${state} ${country}`;
}
function loginAndOut() {
    
  let refresh = document.getElementById("#refresh");
  let logout = document.getElementById("#logout");
  logout.addEventListener("click", logoutOf);
  refresh.addEventListener("click", removeAnimation);
}
function moving() {
  const array =move.split("=====\n");
  
  let animation = document.getElementById("#animation");
  animation.innerHTML = array[0];
  
  let current = 0;
  let maximumlength = array.length;
  animid = setInterval(() => {
      animation.innerHTML = array[current];
      current++;
      if (current === maximumlength) {
          current = 0;
      }
  }, 200);
}
function removeAnimation(){
  clearInterval(animid);
  callRobot();
}
function logoutOf() {
  outlet.innerHTML = loginStream;
  token = null;
  stream(); 
}
async function callRobot() {
  const result = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation", {
      method: "GET",
      headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`

      }
  })
 move = await result.text();
  moving();
}
}









