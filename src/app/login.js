import login_template from '../assets/html/login.html'

export class Login{

    constructor(){
        this.dog = "Jerry"
        console.log(this.dog)
        this.login_view = document.querySelector('.login')
        this.login_view.innerHTML = login_template
        this.submit_button = document.querySelector(".login__button")
        this.submit_button.addEventListener("click", this.login.bind(this))
    }

    login(e){
        e.preventDefault()
        console.log(this)
        this.login_view.classList.add('hidden')
    }
    
}