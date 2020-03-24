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
      return await response
}

async function populate(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return await response
}

function login() {
    credentials = {username: username.value, password: password.value}
    authenticate('/admin/login', credentials).then((res) => {
        console.log(res)
        if (res.status == 200) {
            window.location.pathname = '/admin'
        } else {
            alert("Wrong username or password")
        }
    })
}

password.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("login").click();
  }
}); 

