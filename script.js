// your code
let myToken;
let holder,play;
let output = `  <div class="firstPages">    <samp id="location"></samp><br>
                    <textarea  id="display" cols="30" rows="10"></textarea><br>
                    <button id="refresh">Refresh Animation</button>
                    <button id="logout">Logout</button>
</div>`

let login =`<div class="firstPage">
  User name<input type ="text"><br>
  Password<Input type ="text"><br>
  <button id = "submit">login</button>
  </div>`

  const element22 = document.querySelector("#outlet");
  element22.innerHTML = login;


let aPage = document.querySelector(".firstPage");
aPage.innerHTML;
aPage.style.border = "solid";
aPage.style.margin = "40%";
aPage.style.marginTop = "50px";
aPage.style.padding= "50px";
// let aPages = document.querySelector(".firstPages");
// aPages.innerHTML;
// aPages.style.border = "solid";
// aPages.style.margin = "40%";
// aPages.style.marginTop = "50px";
// aPages.style.padding= "50px";

const longinbtn = document.querySelector("#submit");


longinbtn.addEventListener("click", function loginfunction () {
  history.pushState({ page: 1 }, "title 1", "?page=1"); //browther ignore title
  

  const y = document.querySelector("#outlet");
  y.innerHTML = output;

  myLocation();
  getAutentication();
 
  const refreshButton = document.querySelector("#refresh");
  const display = document.querySelector("#display");
  const logout = document.querySelector("#logout");


  
  refreshButton.addEventListener('click',(animations = function (){

    fetch(`https://shrouded-badlands-76458.herokuapp.com/api/animation`,{
      method: "GET",
      headers: {
        "Content-Type": "application/text",
        Authorization: `Bearer ${myToken}`,
    }
    })
      .then((response)=>response.text())
      .then((data)=>{
          holder=data.split('=====\n')
          if(play){
            clearInterval(play)
          }    
       let animationStart = 0;
       play=setInterval(()=>{
          display.innerHTML = holder[animationStart];
          animationStart++;
          if(animationStart==holder.length){
            animationStart = 0;
          }
       },300)
      })
  })
  )
  logout.addEventListener('click',()=>{
    history.pushState("logout", "?logout");
    element22.innerHTML = login;
    const longinbtn2 = document.querySelector("#submit");
    longinbtn2.addEventListener('click',loginfunction);
    clearInterval(play);
  })
}
);

// -------------Geolocation----------------//

function myLocation() {
  let KEY = "rztfL90zbJZ19L9jNbVzQdZ8A03Q8hDt";
  navigator.geolocation.getCurrentPosition(success); //take two parameter function

  function success(position) {
    let long = position.coords.longitude;
    let lat = position.coords.latitude;
    let url = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${KEY}&location=${lat},${long}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let city = data.results[0].locations[0].adminArea5;
        let state = data.results[0].locations[0].adminArea1;
        let country = data.results[0].locations[0].adminArea3;
        let loc = document.querySelector("#location");
        loc.innerHTML = `${city},${state},${country}`;
      });
    } 
}

function getAutentication() {
  // e.preventDefault();
  let fn = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      username: "mwp",
      password:"123456"
    })
  };
  fetch("https://shrouded-badlands-76458.herokuapp.com/api/login", fn)// for test since we do not have api
  .then((res) =>res.json())
  .then(data=>{
      myToken = data.token
      animations();
  });
}