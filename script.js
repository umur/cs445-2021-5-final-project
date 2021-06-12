// your code 

window.onload = function(){

  const loginpage = `<div style="border: 2px solid rgb(222, 230, 231);">
  <h2>Please login</h2>
  <form id="form" > 
      <label>username</label>
      <input type="text" value="mwp" class="username"> <br>
      <label>password</label>
      <input type="text" value="123456" class="password"><br>
      <button id="login">login</button>
  </form> 
  <br>
</div>`
const animation = `
<div class="welcome">
<h4 id="welcome"></h4> </div>

<div class="animation">
<textarea class="textarea" id="textarea"  rows="10" cols="50"></textarea> <br>
<button class="refresh" id="refresh"> Refresh Animation</button>
<button  id="logout">Logout</button>
</div>`

document.getElementById("outlet").innerHTML = loginpage;

const button1 = document.getElementById("login")
button1.addEventListener('click',()=> history.pushState({page:1},"","?page=1&login"))
//logoutbtn.addEventListener('click',() =>history.pushState({page:2},"","?page=2"))
const refreshbtn = document.getElementById("refresh");

document.getElementsByClassName("#animation")
const data = {"username": "mwp",
  "password":123456
  }
  let token = ""
 async function sendrequest () {
 let result = await fetch("https://shrouded-badlands-76458.herokuapp.com/api/login",{method:'POST',
 body:JSON.stringify( {"username": "mwp",
 "password":123456
 }),  headers:{'content-type':'application/json'}} );
let result2 = await result.json()
token =  result2.token
return result2
  }
async function receiverequest (){
let resultrcv =  await fetch("https://shrouded-badlands-76458.herokuapp.com/api/animation",
{method:'GET',headers:{
    "Authorization": `Bearer ${token}`} } )
    let tokenresult = resultrcv.text()
    //console.log(tokenresult)
    return tokenresult
}
button1.addEventListener('click', animationchange)

// address from lat and long
let outputlocation ="Welcome all from "
 fetch(`http://www.mapquestapi.com/geocoding/v1/reverse?key=YRKzE5ny7ImpiaGl9iN0lcGiHkUdfd9M&location=32.935116799999996,-96.7376896&includeRoadMetadata=true&includeNearestIntersection=true`
).then((result)=>result.json())
.then((result)=>{ return result.results[0].locations[0].adminArea5+" ,"+result.results[0].locations[0].adminArea3+" "+
result.results[0].locations[0].adminArea1})
.then((result)=>{ outputlocation += result 
console.log(outputlocation)}
)
let jugler = ` o\n/#\\\n_|_`

function alertFunc() {
 document.getElementById("textarea").innerHTML = jugler
}
function animationchange(){
  document.getElementById("outlet").innerHTML = animation;
  document.getElementById("welcome").innerHTML = outputlocation
  setInterval(()=>{ document.getElementById("textarea").innerHTML = jugler}, 200)
  sendrequest()}
  let logoutbtn = document.getElementById("logout")
  logoutbtn.addEventListener('click',()=>{document.getElementById("outlet").innerHTML = loginpage;
}) 

}