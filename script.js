//window.onload = loadPage
window.onload = loadPage
function loadPage() {
    let state = { 'page_id': 1 };
    let title = '';
    let url = '?login';
    history.pushState(state, title, url);
    const firstDiv = document.getElementById('outlet');
    let timer;
    window.addEventListener('popstate', function (event) {
        if (event.state.page_id === 1) {
            clearInterval(timer);
            loadPage()
        }
    })

    //login page
    firstPage();
    function firstPage() {
        firstDiv.innerHTML = `<h1 class = 'header'> Please Login </h1>
          Username:<input type = "text" class = "userName" /><br><br>
          Password:<input type = "password" class = "password" /><br><br> 
          <button class = "login">Login</button><br><br>
          <h3 class='message></h3>`


        // const header = document.querySelector('.header');
        const inputUser = document.querySelector('.userName');
        const inputPassWord = document.querySelector('.password');


        //login button
        let button = document.querySelector('.login');
        button.addEventListener('click', loginToAnimation);



        //Fetching User credentials
        let statusObj;
        let tokenObj;
        async function loginToAnimation() {
            let promiseObj = (await fetch('https://shrouded-badlands-76458.herokuapp.com/api/login', {
                method: "post",
                body: JSON.stringify({ username: inputUser.value, password: inputPassWord.value }),
                headers: {
                    "Content-Type": "application/json"
                }
            }))
            const fetchedObj = await promiseObj.json();
            tokenObj = fetchedObj.token;
            statusObj = fetchedObj.status;
            if (statusObj) {
                animationPage();
                animationFetch();
            } else {
                firstPage();
            }


            //Fetch Animation
            function animationFetch() {
                fetch('https://shrouded-badlands-76458.herokuapp.com/api/animation', {
                    method: "GET",
                    headers: {
                        'content-Type': 'application/text',
                        'Authorization': `Bearer ${tokenObj}`
                    }
                })
                    .then(res => (res.text()))
                    .then(data => {
                        timer = setInterval(() => {
                            let index = data.indexOf('=====\n');
                            let temp = data.slice(0, index);
                            data = data.slice(index , data.length) + '=====\n' + temp;
                            data = data.slice(6, data.length);
                            document.querySelector('.display').innerHTML = temp.slice(0,temp.length);
                        }, 200)
                    })

            }


            // Animation page
            function animationPage() {
                let state = { 'page_id': 1 };
                let title = '';
                let url = '?animation';
                history.pushState(state, title, url);
                firstDiv.innerHTML = `<div class = "animate"> 
                      <h1 class = "location"> </h1>
                      <textarea class= "display" rows="30" cols="60" resize="vertical"> </textarea><br>
                      <button class = "refreshAnimation">Refresh Animation</button> <button class = "logout">Logout</button> 
                      </div>`
                const logout = document.querySelector(".logout");
                logout.addEventListener('click', logoutFromAnimation);
                const refreshAnimation = document.querySelector('.refreshAnimation');
                refreshAnimation.addEventListener('click', refreshAnimaPage)
                let address = document.querySelector('.location')
                
                
                geoLocation()
                function geoLocation() {
                    const successCallback = async function (position) {
                            const geoKey = 'LAvAyAA0wEwzZfTqoECxe2fxa8mDM6KT'
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;
                            const geoLocUrl =`http://open.mapquestapi.com/geocoding/v1/reverse?key=${geoKey}&location=${latitude},${longitude}&includeRoadMetadata=true&includeNearestIntersection=true`
                            fetch(geoLocUrl)
                                .then(res => res.json())
                                .then(data => {
                                    address.innerHTML = `
                           Welcome all from ${data.results[0].locations[0].adminArea5},  ${data.results[0].locations[0].adminArea3},  ${data.results[0].locations[0].adminArea1}!`
                                })
                        
                    }
                    const errorCallback = (err) => { alert(err) };
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(successCallback, errorCallback,);
                    }
                }
            }


            //Refresh Animation
            function refreshAnimaPage() {
                clearInterval(timer);
                animationFetch();
            }


            //Logout 
            function logoutFromAnimation() {
                clearInterval(timer);
                history.back()
                firstPage()
            }
        }
    }

}
 
