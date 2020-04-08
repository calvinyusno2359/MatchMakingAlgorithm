function authenticate() {
    var response = grecaptcha.getResponse();
    if (response.length == 0) {
        document.getElementById('g-recaptcha-error').innerHTML = '<span style="color:red;">This field is required.</span>';
        event.preventDefault();
    }
}

function verifyCaptcha() {
    document.getElementById('g-recaptcha-error').innerHTML = '';
}