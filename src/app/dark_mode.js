import logo_darkmode_src from "../assets/img/dark_mode/logo_white.svg"
import logo_whitemode_src from "../assets/img/logo.svg"
import Cookie from 'js-cookie'

const logo = document.querySelector(".header__logo")
const body = document.querySelector("body")

export function change_mode(e){
    if(e.target.checked){
        turn_on_darkmode()
    }
    else{
        turn_off_darkmode()
    }
    
}

export function turn_on_darkmode(){
    logo.src = logo_darkmode_src
    body.style = "background-color: #131313"
    Cookie.set("darkmode", "true")
}

function turn_off_darkmode(){
    logo.src = logo_whitemode_src
    body.style = ""
    Cookie.set("darkmode", "false")
}