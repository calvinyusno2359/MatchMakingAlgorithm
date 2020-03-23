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
    credentials = { username: username.value, password: password.value }
    authenticate('/admin/login', credentials).then(async(res) => {
        if (res.status == 200) {
            window.location.pathname = '/admin';
        } else {
            messageOne.textContent = "Wrong username or password";
        }
    })
}