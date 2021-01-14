import "./assets/scss/style.scss"
import { Carousel } from './app/tinder'
import { Login } from './app/login'
import settings from './assets/html/settings.html'


let board = document.querySelector('.container__wrapper')

let carousel = new Carousel(board)

let login = new Login()
console.log("piesek:" + login.dog)

const animate_settings = () => {
    document.querySelector('.view_settings').classList.toggle('slide_in')
    document.querySelector('.settings_button').classList.toggle('slide_in')
}

document.querySelector('.download').addEventListener("click", () => {
    carousel.swipe()
})
document.querySelector('.settings_button').addEventListener("click", () => {
    animate_settings()
})
document.querySelector('.view_settings').innerHTML = settings
document.querySelector('.view_settings__back').addEventListener("click", () => {
    animate_settings()
})


