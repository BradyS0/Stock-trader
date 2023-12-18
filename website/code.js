function setup(){

    if(document.cookie.indexOf('login=')==-1){
        showLoginContent()
        // var textInput = document.createElement("input");
        // textInput.setAttribute("type", "text");
        // textInput.setAttribute("id", "loginInput");

        // var loginSubmit = document.createElement("button");
        // loginSubmit.setAttribute("id", "loginSubmit");
        // loginSubmit.setAttribute("onclick", "submitlogin()");
        // loginSubmit.innerHTML = "Login";

        // var inputDiv = document.getElementById("login");
        // inputDiv.appendChild(textInput);
        // inputDiv.appendChild(loginSubmit);

    }else{
        showLoggedInContent();
    }
}

function showLoginContent(){
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
    loginSubmit.innerHTML = "Login";

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
    inputDiv.appendChild(createUser)
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
        document.getElementById("loginLinebreak").remove()
    document.getElementById("login-error").textContent=""
}

function showLoggedInContent(){

    // var aboveText = document.createElement("p")
    // aboveText.setAttribute("id", "aboveText");
    // aboveText.innerHTML = "New Post:</br></br>What's on your mind?"

    // var textInput = document.createElement("input");
    // textInput.setAttribute("type", "text");
    // textInput.setAttribute("id", "postInput");

    // var postSubmit = document.createElement("button");
    // postSubmit.setAttribute("id", "postSubmit");
    // postSubmit.setAttribute("onclick", "submitPost()");
    // postSubmit.innerHTML = "Post";

    // var makePostDiv = document.getElementById("makePost");
    // makePostDiv.appendChild(aboveText);
    // makePostDiv.appendChild(textInput);
    // makePostDiv.appendChild(postSubmit);

    // var logout  = document.createElement("button")
    // logout.setAttribute("id", "logoutSubmit")
    // logout.setAttribute("onclick", "logout()")
    // logout.innerHTML = "Log out"

    // var toolBarDiv = document.getElementById("toolBar")
    // toolBarDiv.appendChild(logout)
}

function removeLoggedInContent(){
    // document.getElementById("aboveText").remove();
    // document.getElementById("postInput").remove();
    // document.getElementById("postSubmit").remove();
    // document.getElementById("logoutSubmit").remove();
    // document.getElementById("tweets").innerHTML="";
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
                    removeLoginContent();
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

function submitPost(){
    var usernameInput = document.getElementById("postInput").value;
    if(usernameInput!='' && document.cookie.indexOf('login=')!=-1){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/tweet', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function(){
            if (xhr.status === 200) {
                // Request was successful, and you can access the response data in xhr.responseText
                showPosts()
                document.getElementById("postInput").value = "";
            } else {

                document.getElementById('error').textContent = 'Error posting data.';
            }
        }
        xhr.onerror = () => document.getElementById('error').textContent = 'Request failed';
        var data = { postContent: usernameInput};
        var jsonData = JSON.stringify(data);
        xhr.send(jsonData);
    }else if(document.cookie.indexOf('login=')==-1){
        document.getElementById('error').textContent = 'Permission Denied... Please login';
        removeLoggedInContent()
        showLoginContent()
    }
}

function showPosts(){
    removeError()
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/tweet', true);
    xhr.onload = function() {
        if (this.status === 200) {
            var output="";
            if (this.responseType=="{}"){
                //output='<p>No tweets yet. Why not make one!</p>';
            }else{
                var posts = JSON.parse(this.responseText);

                for(var key in posts){ 
                    output += `<tr>
                                    <td>`+posts[key]["poster"]+` posted</td>
                                    <td><input id=`+key+` value="`+posts[key]["postContent"]+`"></input></td>
                                    <td><button onclick=changePost("`+key+`")>Change</button></td>
                                    <td><button onclick=deletePost("`+key+`")>Delete</button></td>
                                </tr>
                                `;
                }
            }
            document.getElementById('tweets').innerHTML = output;
        } else {
            document.getElementById('error').textContent = 'Error fetching data.';
        }
    };
    xhr.onerror = () => document.getElementById('result').textContent = 'Request failed';
    xhr.send();
};

function changePost(key){
    var usernameInput = document.getElementById(key).value;
    if(usernameInput!='' && document.cookie.indexOf('login=')!=-1){
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', '/api/tweet/'+key, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function(){
            if (xhr.status === 200) {
                // Request was successful, and you can access the response data in xhr.responseText
                showPosts()
            } else if(xhr.status == 503){
                document.getElementById('error').textContent = 'Error changing post: Server Error';
            }else if(xhr.status == 423){
                document.getElementById('error').textContent = 'Error changing post: Please wait 2 seconds to try to change again';
            }
        }
        xhr.onerror = () => document.getElementById('error').textContent = 'Request failed';
        var data = { postContent: usernameInput, "key":key};
        var jsonData = JSON.stringify(data);
        xhr.send(jsonData);
    }else if(document.cookie.indexOf('login=')==-1){
        document.getElementById('error').textContent = 'Permission Denied... Please login';
        removeLoggedInContent()
        showLoginContent() 
    }
}

function deletePost(key){
    if(document.cookie.indexOf('login=')!=-1){
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/api/tweet/'+key, true);
        xhr.onload = function(){
            if (xhr.status === 200) {
                // Request was successful, and you can access the response data in xhr.responseText
                showPosts()
            } else if(xhr.status == 503){
                document.getElementById('error').textContent = 'Error deleting post: Server Error';
            }else if(xhr.status == 423){
                document.getElementById('error').textContent = 'Error deleting post: Please wait 2 seconds to try to change again';
            }
        }
        xhr.onerror = () => document.getElementById('error').textContent = 'Request failed';
        xhr.send();
    }else{
        document.getElementById('error').textContent = 'Permission Denied... Please login';
        removeLoggedInContent()
        showLoginContent()
        
    }
}

function logout(){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/api/login', true);
    xhr.onload = function(){
        if (xhr.status === 200) {
            // Request was successful, and you can access the response data in xhr.responseText
            removeLoggedInContent();
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
}