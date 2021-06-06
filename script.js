// your code
let tag2 = document.createElement("form");
let text22 = document.createTextNode("Password");
tag2.appendChild(text22);
tag2.id = "form";
let element22 = document.querySelector("#outlet");
element22.appendChild(tag2);

let tag1 = document.createElement("p");
let text2 = document.createTextNode("Password");
tag1.appendChild(text2);
let element2 = document.querySelector("#form");
element2.appendChild(tag1);

let user = document.createElement("INPUT");
user.setAttribute("type", "text");
// user.setAttribute("value", "username!");
user.id = "users";
document.body.appendChild(user);
let userElement = document.querySelector("#form");
userElement.appendChild(user);

let password = document.createElement("INPUT");
password.setAttribute("type", "text");
// password.setAttribute("value", "username");
password.id = "pswd";
document.body.appendChild(password);
let passwordElement = document.querySelector("#form");
passwordElement.appendChild(password);

let login = document.createElement("button");
let text = document.createTextNode("Login");
login.appendChild(text);
login.id = "submit";
let loginElement = document.querySelector("#form");
loginElement.appendChild(login);

login.addEventListener("click", (_) => {
  history.pushState({ page: 1 }, "title 1", "?page=1"); //browther ignore title

  const form = document.querySelector("form");
  form.addEventListener("submit", postData);

  function postData(e) {
    e.preventDefault();
    const users = document.querySelector("#users").value;
    const pswd = document.querySelector("#pswd").value;
    const config = {
      method: "POST",
      body: JSON.stringify({ user: "user", password: 123 }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("https://jsonplaceholder.typicode.com/comments", config)
      .then((res) => res.json())
    //   .then((data) => {console.log(data)
        .then(()=>{


           
                const button1 = document.querySelector("#submit");
                button1.addEventListener("click", (_) => {
                  history.pushState({ page: 2 }, "title 2", "?page=2"); //browther ignore title
                     let x = `<P> tessssssssssss</p>`;
                      const y = document.querySelector("#tag1");
                      y.innerHTML = x;
                      y.style.color = "blue";
                });
              


        
      });
  }

});

window.addEventListener("popstate", function (event) {
  console.log("state: " + JSON.stringify(event.state));
});
