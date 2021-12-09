const regex = {
    // test a valid email adress
    mailCheck : (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i),

    // test a valid password : minimum 8 characters, 1 uppercase letter, one special character and 1 number
    passwordCheck : (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()+,-./:;=?@[\]^_`{|}~])[A-Za-z0-9!#$%&()+,-./:;=?@[\]^_`{|}~]{8,}$/)
}

exports.regex = regex;
