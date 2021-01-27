import "./assets/scss/style.scss"
import { Carousel } from './app/tinder'
import { Login } from './app/login'
import settings from './assets/html/settings.html'
import { change_mode, turn_on_darkmode } from './app/dark_mode'
import Cookie from 'js-cookie'


var mode

if (window.location.href.includes("192.168.0.100")){
    mode = "dev"
    console.log("Development mode")
}
else{
    mode = "prod"
}

const url = mode == "prod" ? "https://lit-scrubland-16305.herokuapp.com/api" : "https://192.168.0.100:8000/api"

let board = document.querySelector('.container__wrapper')

let login = new Login(url)

var checkExist = setInterval(function() {
    if (login.logged == true) {
        window.carousel = new Carousel(board, url)
       clearInterval(checkExist);
    }
 }, 200);

const animate_settings = () => {
    document.querySelector('.view_settings').classList.toggle('slide_in')
    document.querySelector('.settings_button').classList.toggle('slide_in')
}

document.querySelector('.download').addEventListener("click", (e) => {
    window.carousel.tellonym_actions.set_left(e=e)
})
document.querySelector('.edit').addEventListener("click", (e) => {
    window.carousel.tellonym_actions.set_up(e)
})
document.querySelector('.discard').addEventListener("click", (e) => {
    window.carousel.tellonym_actions.set_right(e=e)
})

document.querySelector('.settings_button').addEventListener("click", () => {
    animate_settings()
})
document.querySelector('.view_settings').innerHTML = settings
document.querySelector('.view_settings__back').addEventListener("click", () => {
    animate_settings()
})

document.querySelector('.darkmode_switch').addEventListener("change", (e) => {
    change_mode(e)
})

if(Cookie.get("darkmode") == "true"){
    turn_on_darkmode()
    document.querySelector('.darkmode_switch').checked = true
}
