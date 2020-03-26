const username = document.getElementById('username')
const password = document.getElementById('password')
const messageOne = document.getElementById('message')

async function authenticate(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response;
}

function login() {
    var response = grecaptcha.getResponse();
    if (response.length == 0) {
        document.getElementById('g-recaptcha-error').innerHTML = '<span style="color:red;">This field is required.</span>';
        return;
    }
    credentials = { username: username.value, password: password.value }
    authenticate('/admin/login', credentials).then(async(res) => {
        if (res.status == 200) {
            window.location.pathname = '/admin';
        } else {
            alert("Wrong username or password");
        }
    });
}

function verifyCaptcha() {
    document.getElementById('g-recaptcha-error').innerHTML = '';
}

password.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("login").click();
    }
});