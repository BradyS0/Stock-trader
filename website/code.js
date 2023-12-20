function setup(){

    if(document.cookie.indexOf('session-token=')==-1){
        showLoginContent()
    }else{
        showLoggedInContent();
    }
}

function showLoginContent(){
    var login_parent_container = document.getElementById("login-parent-container");
    login_parent_container.style.display = "flex";
    removeCreateUserContent()
    var usernameInput = document.createElement("input");
    usernameInput.setAttribute("type", "text");
    usernameInput.setAttribute("id", "usernameInput");
    usernameInput.setAttribute("class","input-box");
    usernameInput.setAttribute("placeholder","Username")

    var passwordInput = document.createElement("input");
    passwordInput.setAttribute("id", "passwordInput");
    passwordInput.setAttribute("class","input-box");
    passwordInput.setAttribute("type","password")
    passwordInput.setAttribute("placeholder","Password")


    var loginSubmit = document.createElement("button");
    loginSubmit.setAttribute("id", "loginSubmit");
    loginSubmit.setAttribute("class","submit-button");
    loginSubmit.setAttribute("onclick", "submitLogin()");
    loginSubmit.innerHTML = "Login";

    var createUser = document.createElement("button");
    createUser.setAttribute("class","submit-button");
    createUser.setAttribute("id", "createUserScreen")
    createUser.setAttribute("onclick", "showCreateUserContent()");
    createUser.innerHTML = "Create Account"

    var lineBreak = document.createElement("br");
    lineBreak.setAttribute("id", "loginLinebreak")

    var inputDiv = document.getElementById("login");
    inputDiv.appendChild(usernameInput);
    inputDiv.appendChild(lineBreak);
    inputDiv.appendChild(passwordInput);
    inputDiv.appendChild(lineBreak);
    inputDiv.appendChild(loginSubmit);
    inputDiv.appendChild(createUser)

}

function removeLoginContent(){
    if(document.getElementById("usernameInput")!=null)
        document.getElementById("usernameInput").remove();
    if(document.getElementById("passwordInput")!=null)
        document.getElementById("passwordInput").remove();
    if(document.getElementById("loginSubmit")!=null)
        document.getElementById("loginSubmit").remove();
    if(document.getElementById("createUserScreen")!=null)
        document.getElementById("createUserScreen").remove();
    if(document.getElementById("loginLinebreak")!=null)
        document.getElementById("loginLinebreak").remove()
    document.getElementById("login-error").textContent=""
}

function showCreateUserContent(){
    removeLoginContent()
    var usernameInput = document.createElement("input");
    usernameInput.setAttribute("type", "text");
    usernameInput.setAttribute("id", "usernameInput");
    usernameInput.setAttribute("class","input-box");
    usernameInput.setAttribute("placeholder","Username")

    var passwordInput = document.createElement("input");
    passwordInput.setAttribute("id", "passwordInput");
    passwordInput.setAttribute("class","input-box");
    passwordInput.setAttribute("type","password")
    passwordInput.setAttribute("placeholder","Password")

    var passwordInput2 = document.createElement("input");
    passwordInput2.setAttribute("id", "passwordInput2");
    passwordInput2.setAttribute("class","input-box");
    passwordInput2.setAttribute("type","password")
    passwordInput2.setAttribute("placeholder","Retype Password")


    var loginSubmit = document.createElement("button");
    loginSubmit.setAttribute("id", "createSubmit");
    loginSubmit.setAttribute("class","submit-button");
    loginSubmit.setAttribute("onclick", "createUser()");
    loginSubmit.innerHTML = "Create Account";

    var createUser = document.createElement("button");
    createUser.setAttribute("class","submit-button");
    createUser.setAttribute("id","createToLoginButton")
    createUser.setAttribute("onclick", "showLoginContent()");
    createUser.innerHTML = "Go Back"

    var lineBreak = document.createElement("br");
    lineBreak.setAttribute("id", "loginLinebreak")

    var inputDiv = document.getElementById("login");
    inputDiv.appendChild(usernameInput);
    inputDiv.appendChild(lineBreak);
    inputDiv.appendChild(passwordInput);
    inputDiv.appendChild(lineBreak);
    inputDiv.appendChild(passwordInput2);
    inputDiv.appendChild(lineBreak);
    inputDiv.appendChild(loginSubmit);
    inputDiv.appendChild(createUser);
}

function removeCreateUserContent(){
    if(document.getElementById("usernameInput")!=null)
        document.getElementById("usernameInput").remove();
    if(document.getElementById("passwordInput")!=null)
        document.getElementById("passwordInput").remove();
    if(document.getElementById("passwordInput2")!=null)
        document.getElementById("passwordInput2").remove();
    if(document.getElementById("createSubmit")!=null)
        document.getElementById("createSubmit").remove();
    if(document.getElementById("createSubmit")!=null)
        document.getElementById("createSubmit").remove();
    if(document.getElementById("createToLoginButton")!=null)
        document.getElementById("createToLoginButton").remove();
    if(document.getElementById("loginLinebreak")!=null)
        document.getElementById("loginLinebreak").remove();
    document.getElementById("login-error").textContent=""
}

function showTabBar(){
    var login_parent_container = document.getElementById("login-parent-container");
    login_parent_container.style.display = "none";
    var main_page = document.getElementById("main-page");
    main_page.style.display = "flex"

    var showOwnedButton = document.createElement("button");
    showOwnedButton.setAttribute("class","tab-button");
    showOwnedButton.setAttribute("onclick","showOwned()");
    showOwnedButton.innerHTML = "Owned Stocks"
    
    var showBuyButton = document.createElement("button");
    showBuyButton.setAttribute("class","tab-button");
    showBuyButton.setAttribute("onclick","showBuy()");
    showBuyButton.innerHTML = "Buy Stocks"

    var showOverviewButton = document.createElement("button");
    showOverviewButton.setAttribute("class","tab-button");
    showOverviewButton.setAttribute("onclick","showOverview()");
    showOverviewButton.innerHTML = "Overview"

    var tabBar = document.getElementById("tab-bar");
    tabBar.appendChild(showOwnedButton);
    tabBar.appendChild(showBuyButton);
    tabBar.appendChild(showOverviewButton);
}

function removeTabBar(){
    var elements = document.getElementsByClassName("tab-button");
    for (var i = 0; i < elements.length; i++) {
        // Do something with each element
        elements[i].remove();
    }
}

function showLoggedInContent(){
    showTabBar()
    var logout  = document.createElement("button")
    logout.setAttribute("id", "logoutSubmit")
    logout.setAttribute("onclick", "logout()")
    logout.innerHTML = "Log out"

    var toolBarDiv = document.getElementById("toolBar")
    toolBarDiv.appendChild(logout)
}

function removeLoggedInContent(){
    removeTabBar()
    document.getElementById("logoutSubmit").remove()
}

function createUser(){
    var usernameInput = document.getElementById("usernameInput").value;
    var passwordInput = document.getElementById("passwordInput").value;
    var passwordInput2 = document.getElementById("passwordInput2").value;
    if(usernameInput!=''&&usernameInput!=null&&passwordInput!=''&&passwordInput!=null&&passwordInput2!=''&&passwordInput2!=null){
        if(passwordInput==passwordInput2){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/create-user', true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function(){
                if (xhr.status === 200) {
                    // Request was successful, and you can access the response data in xhr.responseText
                    removeCreateUserContent();
                    showLoggedInContent();
                } else if(xhr.status === 409) {
                    document.getElementById('login-error').textContent = 'Username taken';
                }else{
                    document.getElementById('login-error').textContent = 'Error logging in.';
                }
            }
            xhr.onerror = () => document.getElementById('login-error').textContent = 'Request failed';
            var data = { 'username': usernameInput,'password':passwordInput};
            var jsonData = JSON.stringify(data);
            xhr.send(jsonData);
        }else{
            document.getElementById('login-error').textContent = 'Passwords do not match';
        }
    }
}

function submitLogin(){
    var usernameInput = document.getElementById("usernameInput").value;
    var passwordInput = document.getElementById("passwordInput").value;
    if(usernameInput!='' && usernameInput!=null && passwordInput!='' && passwordInput!=null){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/login', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function(){
            if (xhr.status === 200) {
                // Request was successful, and you can access the response data in xhr.responseText
                removeLoginContent();
                showLoggedInContent();
            }else if(xhr.status === 401 || xhr.status === 404) {
                document.getElementById('login-error').textContent = 'Wrong username or password';
            }else if(xhr.status === 400) {
                document.getElementById('login-error').textContent = 'Error logging in.';
            }
        }
        xhr.onerror = () => document.getElementById('login-error').textContent = 'Request failed';
        var data = { 'username': usernameInput,'password':passwordInput};
        var jsonData = JSON.stringify(data);
        xhr.send(jsonData);
    }
}

function logout(){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/api/login', true);
    xhr.onload = function(){
        if (xhr.status === 200) {
            // Request was successful, and you can access the response data in xhr.responseText
            removeLoggedInContent();
            var login_parent_container = document.getElementById("login-parent-container");
            login_parent_container.style.display = "flex";
            showLoginContent();
        } else {
            document.getElementById('error').textContent = 'Error logging out.';
        }
    }
    xhr.onerror = () => document.getElementById('error').textContent = 'Request failed';
    xhr.send();
    
}

function removeError(){
    document.getElementById("error").textContent="";
}

function changeColour(){
    var newColour = document.getElementById("cValue").value;
    document.body.style.color = newColour;
    var elements = document.getElementsByClassName("submit-button");
    // Loop through the collection
    for (var i = 0; i < elements.length; i++) {
      // Do something with each element
      elements[i].style.backgroundColor = newColour;
    }
}