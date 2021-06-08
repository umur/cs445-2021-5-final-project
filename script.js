"use strict";

let token;
history.replaceState(null, null, "http://127.0.0.1:5500/finalproject/cs445-2021-5-final-project/index.html")


//get location promise
const getLocation = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function (pos) {
      resolve(pos)
    }, function (err) {
      reject(err)
    })
  })
}



function loginPage() {
  //create dom elements
  document.getElementById("outlet").innerHTML = "";
  // let Username = document.createElement("p")
  // let UsernameText = document.createTextNode("Username:")
  // Username.appendChild(UsernameText)
  // document.getElementById("outlet").appendChild(Username);

  let inputUser = document.createElement("input")
  inputUser.type = "text";
  inputUser.id = "textbox1"
  document.getElementById("outlet").appendChild(inputUser)

  let Password = document.createElement("p")
  // let PasswordText = document.createTextNode("Password:")
  // Password.appendChild(PasswordText)
  // document.getElementById("outlet").appendChild(Password);

  let inputPW = document.createElement("input")
  inputPW.type = "text";
  inputPW.id = "textbox2"
  document.getElementById("outlet").appendChild(inputPW)

  let button = document.createElement("button")
  button.textContent = "Login"
  button.id = "loginbutton"
  document.getElementById("outlet").appendChild(button)


  //send and receive info from server after login button click
  document.getElementById("loginbutton").addEventListener("click", function () {
    let text1 = document.querySelector("#textbox1")
    let text2 = document.querySelector("#textbox2")
    text1 = text1.value
    text2 = text2.value

    //get token 
    
    const response = fetch("https://shrouded-badlands-76458.herokuapp.com/api/login",
    {
      //send data to server with POST
      method: "POST",
      
      body: JSON.stringify(
        { username: `${text1}`, password: `${text2}` }),
        
        headers: { "Content-Type": "application/json" }
        
      })

      //how do i deal with a 403 error? Doesnt work with catch
      //setTimeout(response,1000)
      // console.log(response)
      // if(!response.ok) throw new Error("Try Again!")

      response.then(obj => obj.json())
      .then(data => {
        token = data.token
        activateAnimation()
      })
     .catch(console.log)


  })



  function activateAnimation() {
  history.replaceState(null, null, "http://127.0.0.1:5500/finalproject/cs445-2021-5-final-project/animation.html");

    //call getLocation and retrieve city and state
    getLocation().then(pos => {
      const { latitude, longitude } = pos.coords;
      fetch(`http://www.mapquestapi.com/geocoding/v1/reverse?key=t0Mv3C84GWG33NCfogPZ05mb3TjAOM0W&location=${latitude},${longitude}&includeRoadMetadata=true&includeNearestIntersection=true
        `).then(obj => obj.json())
        .then(data =>

          animationPage(data)
          //  console.log(data.results[0].locations[0].adminArea5,
          //   data.results[0].locations[0].adminArea3),
          //document.getElementById("outlet").appendChild(p)
          //  city =  data.results[0].locations[0].adminArea5,
          //  state = data.results[0].locations[0].adminArea3,

        );

    }).catch(err => {
      console.log("Cant get your location! " + err);
    })
  };
}



function activateLogin() {
 // history.back();
  history.replaceState(null, null, "http://127.0.0.1:5500/finalproject/cs445-2021-5-final-project/index.html");
}





function animationPage(data) {
  
  //hide login page elements
  document.getElementById("textbox1").style.opacity = 0
  document.getElementById("textbox2").style.opacity = 0
  document.getElementById("loginbutton").style.opacity = 0
  
  
  //insert current location data to an html element
  let label = document.createElement("LABEL")
  label.id = "location"
  label.style.fontSize = "22px";
  label.innerHTML =
  "Welcome all from " +
  data.results[0].locations[0].adminArea5 + data.results[0].locations[0].adminArea3
  
  
  //Create new html elements for animation page
  let textArea = document.createElement("textarea");
  textArea.id = "animation"
  textArea.style = "margin: 0px; height: 317px; width: 383px;"
  
  
  let refresh = document.createElement("button");
  refresh.id = "refresh"
  let logout = document.createElement("button");
  logout.id = "logout"
  refresh.textContent = "Refresh Animation"
  logout.textContent = "Logout"
  document.getElementById("outlet").appendChild(label)
  document.getElementById("outlet").appendChild(textArea)
  document.getElementById("outlet").appendChild(refresh)
  document.getElementById("outlet").appendChild(logout)
  
  
  
  
  //get animation and display animation
  fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }
  
  ).then(res => res.text()).then(text =>
    setTimeout(insertAnimation(text,textArea), 2000)
    ).catch(err=>console.log("Error: " + err))
    
    
    //Logout button listener
    logout.addEventListener("click", function () {
      document.getElementById("animation").style.opacity = 0;
      document.getElementById("refresh").style.opacity = 0;
      document.getElementById("logout").style.opacity = 0;
      
      document.getElementById("textbox1").style.opacity = 100
      document.getElementById("textbox2").style.opacity = 100
      document.getElementById("loginbutton").style.opacity = 100
      activateLogin()
      
    })
    
    //Reset animation listener
    refresh.addEventListener("click", function(){

    })
  }
  
  function insertAnimation(text,textArea){
    textArea.innerHTML = text.split("=====\n")

  }
  
  
  loginPage()
