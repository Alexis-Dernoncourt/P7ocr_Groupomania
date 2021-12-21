const regex = {
    // test a valid email adress
    mailCheck : (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i),

    // test a valid password : minimum 8 characters, 1 uppercase letter, one special character and 1 number
    passwordCheck : (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()+,-./:;=?@[\]^_`{|}~])[A-Za-z0-9!#$%&()+,-./:;=?@[\]^_`{|}~]{8,}$/),

    // list of words to filter (insults, sql...)
    wordsFilter : (/^select$|^get$|^delete$|script|put1|putain|putin|pute|fdp|pd|^ducon$|con$|conne$|^connasse$|garce|^batar|bâtard|^encul|enkul|enqul|^salau|^bite$|^cul|couille|^chier$|dugland|glandu/i),

    isGif : (/\.gif$/i)
}

exports.regex = regex;
