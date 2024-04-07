var LOGIN = "login"
var OWNED = "owned"
var BUY = "buy"
var OVERVIEW = "overview"
var state = LOGIN
var stocksShown=0
var showAtATime =5
var stock_list = null

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
    removeError()
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
    loginSubmit.setAttribute("class","button submit-button");
    loginSubmit.setAttribute("onclick", "submitLogin()");
    loginSubmit.innerHTML = "Login";

    var createUser = document.createElement("button");
    createUser.setAttribute("class","button submit-button");
    createUser.setAttribute("id", "createUserScreen")
    createUser.setAttribute("onclick", "showCreateUserContent()");
    createUser.innerHTML = "Create Account"

    var errorDiv = document.createElement("div")
    errorDiv.setAttribute("id","login-error")

    var lineBreak = document.createElement("br");
    lineBreak.setAttribute("id", "loginLinebreak")

    var inputDiv = document.getElementById("login");
    inputDiv.appendChild(errorDiv)
    inputDiv.appendChild(lineBreak)
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
    if(document.getElementById("login-error")!=null)
        document.getElementById("login-error").remove()
    //document.getElementById("login-error").textContent=""
}

function showCreateUserContent(){
    removeLoginContent()

    var errorDiv = document.createElement("div")
    errorDiv.setAttribute("id","login-error")

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
    loginSubmit.setAttribute("class","button submit-button");
    loginSubmit.setAttribute("onclick", "createUser()");
    loginSubmit.innerHTML = "Create Account";

    var createUser = document.createElement("button");
    createUser.setAttribute("class","button submit-button");
    createUser.setAttribute("id","createToLoginButton")
    createUser.setAttribute("onclick", "showLoginContent()");
    createUser.innerHTML = "Go Back"

    

    var lineBreak = document.createElement("br");
    lineBreak.setAttribute("id", "loginLinebreak")

    var inputDiv = document.getElementById("login");
    inputDiv.appendChild(errorDiv)
    inputDiv.appendChild(lineBreak)
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
    if(document.getElementById("login-error")!=null)
        document.getElementById("login-error").remove()
    //document.getElementById("login-error").textContent=""
}

function showTabBar(){
    var login_parent_container = document.getElementById("login-parent-container");
    login_parent_container.style.display = "none";
    var main_page = document.getElementById("main-page");
    main_page.style.display = "flex"
    var tabBar = document.getElementById("tab-bar");

    if(document.getElementById("showOwnedButton")==null){
        var showOwnedButton = document.createElement("button");
        showOwnedButton.setAttribute("class","button tab-button");
        showOwnedButton.setAttribute("id","showOwnedButton")
        showOwnedButton.setAttribute("onclick","showOwned()");
        showOwnedButton.innerHTML = "Owned Stocks"
        tabBar.appendChild(showOwnedButton);
    }
    if(document.getElementById("showBuyButton")==null){
        var showBuyButton = document.createElement("button");
        showBuyButton.setAttribute("class","button tab-button");
        showBuyButton.setAttribute("id","showBuyButton")
        showBuyButton.setAttribute("onclick","showBuy()");
        showBuyButton.innerHTML = "Buy Stocks"
        tabBar.appendChild(showBuyButton);
    }
    if(document.getElementById("showOverviewButton")==null){
        var showOverviewButton = document.createElement("button");
        showOverviewButton.setAttribute("class","button tab-button");
        showOverviewButton.setAttribute("is","showOverviewButton")
        showOverviewButton.setAttribute("onclick","showOverview()");
        showOverviewButton.innerHTML = "Overview"
        tabBar.appendChild(showOverviewButton);
    }
}

function removeTabBar(){
    var elements = document.getElementsByClassName("tab-button");
    for (var i = 0; i < elements.length; i++) {
        // Do something with each element
        elements[i].remove();
        //console.log(elements[i].id)
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

    showOwned()
}

function removeLoggedInContent(){
    removeTabBar()
    document.getElementById("logoutSubmit").remove()
    document.getElementById('main-content').innerHTML = "";
}

function showOwned(){
    if(state==BUY)
        removeStockSearch()
    state = OWNED

    removeError()
    document.getElementById('main-content').innerHTML = "";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/ownedStocks', true);
    xhr.onload = function() {
        if (this.status === 200) {
            var output="";
            console.log(this.responseText)
            if (this.responseText == '{}'){
                output='<p>No owned stocks. Try buying some!</p>';
            }else{
                var stocks = JSON.parse(this.responseText);
                for(var stock in stocks){ 
                    output += `<tr>
                                    <td>`+stocks[stock]["ticker"]+`</td>
                                    <td>`+stocks[stock]["name"]+`</td>
                                    <td> Quantity `+stocks[stock]["quantity"]+`</td>
                                    <td> Current Price `+stocks[stock]["price"]+`</td>
                                    <td><input></input></td>
                                </tr>
                                `;
                }
            }
            document.getElementById('main-content').innerHTML = output;
            stock_list = stocks
        } else {
            document.getElementById('error').textContent = 'Error fetching data.';
        }
    };
    xhr.onerror = () => document.getElementById('error').textContent = 'Request failed';
    xhr.send();
};

function showBuy(){
    state = BUY
    removeError()
    document.getElementById('main-content').innerHTML = "";
    var header = document.createElement("h2")
    header.setAttribute("id", "searchHeader")
    header.innerHTML = "Find Stocks"

    var searchBar = document.createElement("input")
    searchBar.setAttribute("type","text")
    searchBar.setAttribute("id","stockSearchInput")
    searchBar.setAttribute("class", "input-box")

    var searchSubmit = document.createElement("button")
    searchSubmit.setAttribute("class","button submit-button")
    searchSubmit.setAttribute("id", "searchSubmit")
    searchSubmit.setAttribute("onclick", "searchStock()")
    searchSubmit.innerHTML = "Look up"
    
    var searchBarDiv = document.getElementById("stock-search")
    searchBarDiv.appendChild(header)
    searchBarDiv.appendChild(searchBar)
    searchBarDiv.appendChild(searchSubmit)
};

function removeStockSearch(){
    document.getElementById("searchHeader").remove()
    document.getElementById("stockSearchInput").remove()
    document.getElementById("searchSubmit").remove()
}

function searchStock(){
    var input = document.getElementById("stockSearchInput").value
    console.log(input)
    if(input!='' && input!=null){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/searchStocks', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (this.status === 200) {
                var output="";
                console.log(this.responseText)
                if (this.responseText=='"{}"'){
                    output="<p>Can't find any stocks matching your search</p>";
                }else{
                    var stocks = JSON.parse(this.responseText);
                    var counter=0
                    output = "<table>"
                    for (var stock in stocks) {
                        output +=   `<tr>
                                        <td>${stocks[stock]["ticker"]}</td>
                                        <td>${stocks[stock]["name"]}</td>
                                        <td>Current Price ${stocks[stock]["price"]}</td>
                                        <td><input type="number" id="${stocks[stock]["stockID"]}" class="dynamicInputBox"></td>
                                        <td id="${stocks[stock]["stockID"]}total">Total: $0</td>
                                        <td><button onclick="buyStock('${stocks[stock]["stockID"]}')">Buy</button></td>
                                    </tr>`;
                    }
                    output += "</table>"; // End the table
                }
                document.getElementById('main-content').innerHTML = output;

                stock_list = stocks
                console.log(stocks)
                addListenersToInputBoxes()
            } else {
                document.getElementById('error').textContent = 'Error fetching data.';
            }
        };
        xhr.onerror = () => document.getElementById('error').textContent = 'Request failed';
        var data = { 'input': input};
        var jsonData = JSON.stringify(data);
        xhr.send(jsonData);
    }
}

function showOverview(){
    if(state==BUY)
        removeStockSearch()
    state = OVERVIEW
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
            if(state == BUY)
                removeStockSearch()
            state = LOGIN
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
    var elements = document.getElementsByClassName("button");
    // Loop through the collection
    for (var i = 0; i < elements.length; i++) {
      // Do something with each element
      elements[i].style.backgroundColor = newColour;
    }
}

function buyStock(stockID){
    var input = document.getElementById(stockID).value
    console.log(input)
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/buyStock', true);
    xhr.onload = function(){
        if (xhr.status === 200) {
            // Request was successful, and you can access the response data in xhr.responseText
            
        } else {
            document.getElementById('error').textContent = 'Error buying stock.';
        }
    }
    xhr.onerror = () => document.getElementById('error').textContent = 'Request failed';
    var data = { 'input': input};
    var jsonData = JSON.stringify(data);
    xhr.send(jsonData);
}

function addListenersToInputBoxes() {
    const inputBoxes = document.querySelectorAll('.dynamicInputBox');

    inputBoxes.forEach(function(inputBox) {
        inputBox.addEventListener('input', function(event) {
            const outputID = inputBox.id+"total"
            const outputEntry = document.getElementById(outputID)
            const inputValue = parseFloat(inputBox.value)
            const price = parseFloat(stock_list[inputBox.id]["price"])
            console.log(price)
            console.log(inputValue)
            outputEntry.innerHTML = "Total: $"+(inputValue*price).toFixed(2)
        });
    });
}