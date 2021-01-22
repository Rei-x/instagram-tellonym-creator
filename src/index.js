import "./assets/scss/style.scss"
import { Carousel } from './app/tinder'
import { Login } from './app/login'
import settings from './assets/html/settings.html'




let board = document.querySelector('.container__wrapper')

let login = new Login()

var checkExist = setInterval(function() {
    if (login.logged == true) {
        window.carousel = new Carousel(board)
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


