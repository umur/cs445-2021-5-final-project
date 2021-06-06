// let text1 =  document.createElement("h1");
// text1.innerHTML = "Please login";
// document.body.append(text1)
// let userLabel =  document.createElement("label");
// userLabel.innerHTML = "Enter Username: ";
// document.body.append(userLabel)
// let userInput =  document.createElement("input");
// document.body.append(userInput);

// let br = document.createElement('p');
// document.body.append(br);

// let passLabel =  document.createElement("label");
// passLabel.innerHTML = "Enter Password: ";
// document.body.append(passLabel)
// let passInput =  document.createElement("input");
// document.body.append(passInput)

// let br2 = document.createElement('p');
// document.body.append(br2); 
// let btn =  document.createElement("BUTTON");
// btn.innerHTML = "Login";
// document.body.append(btn)

// let div = document.querySelector("#outlet");
// div.appendChild(text1,userLabel)

loginPage = `<h3>Please Login</h3>
<label for="user">Username: </label>
<input id="user" type="text"><br><br>
<label  for="pass">Password :</label>
<input id="pass" type="text"><br><br>
<button id="loginBtn">Login</button>`

let mainDiv = document.getElementById("outlet");
mainDiv.innerHTML = loginPage;
mainDiv.style.marginLeft = '40%'
mainDiv.style.marginTop = '20%';

let loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click',()=>{
    console.log('clicked')
})
