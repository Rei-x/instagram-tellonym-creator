import login_template from '../assets/html/login.html'
import src_loading_image from '../assets/img/login/loading.svg'
import Cookie from 'js-cookie'

export class Login{

    constructor(url){
        this.url = url
        this.logged = false
        this.auth = Cookie.get("__Auth")
        this.username = Cookie.get("__Username")

        this.login_view = document.querySelector('.login')

        if (!!this.auth && !!this.username){
            this.login_view.classList.add("hidden")
            this.logged = true
        }
        
        this.login_view.innerHTML = login_template

        this.alert = document.querySelector('.alert')
        this.submit_button = document.querySelector(".login__button")
        this.form = document.querySelector('.login__form')
        this.form.addEventListener("submit", this.login.bind(this))
        
    }

    login(e){
        e.preventDefault()
        
        let loading_image = document.createElement('img')
        loading_image.src = src_loading_image
        loading_image.classList.add('login__loading')

        let old_submit_HTML = this.submit_button.innerHTML

        this.submit_button.innerHTML = loading_image.outerHTML

        const formData = new FormData(document.querySelector('.login__form'))

        let login_url = this.url + "/login/"
        
        
        fetch(login_url, {
            method: 'POST',
            credentials: 'include',
            body:   formData
        })
        .then(response => response.json())
        .then(result => {
            if(result['Success'] == true){

                this.auth = result['Auth']
                this.username = result['Username']

                Cookie.set("__Auth", this.auth, { expires: 730 })
                Cookie.set("__Username", this.username, { expires: 730 })
                
                this.alert.classList.add('alert--hidden')
                this.login_view.classList.add('fade')

                setTimeout( function(){
                    this.login_view.classList.add('hidden')
                    this.logged = true
                }.bind(this), 500)
            }
            else if(result['Success'] == false){
                this.alert.innerHTML = result['Error']
                this.alert.classList.remove('alert--hidden')
            }

            this.submit_button.innerHTML = old_submit_HTML
        })
        .catch(function(error){
            this.alert.innerHTML = "Błąd serwera"
                this.alert.classList.remove('alert--hidden')
            this.submit_button.innerHTML = old_submit_HTML
        }.bind(this))

    }
    
}

export class TellonymClient{

    constructor(url){
        this.url = url
        this.list_endpoint = "/list/"
        this.update_endpoint = "/patch/"
    }

    getTellonyms(callback) {
        const url = this.url + this.list_endpoint
        this.username = Cookie.get("__Username")
        this.auth = Cookie.get("__Auth")
        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Auth': this.auth,
                'Username': this.username
              }
        })
        .then(response => {
            if(response.status == 200){
                return response.json()
            }
            else{
                Cookie.remove("__Auth")
                Cookie.remove("__Username")
                window.location.reload()
            }
            })
        .then(data => {
            callback(data)
        })
        .catch((e) => {
            console.log("Niezalogowany", e)
        })
    }
    updateTellonym(tellonym_id, state, text=null) {
        this.username = Cookie.get("__Username")
        this.auth = Cookie.get("__Auth")
        const url = this.url + this.update_endpoint + tellonym_id + "/"
        const body = {"state": state}
        if(text){
            body.text = text
        }

        fetch(url, {
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Auth': this.auth,
                'Username': this.username
              }
        })
        .then(response => {
            /*
            if (response.status == 204){
                console.log("udało się")
            }
            */
        })
        .catch((e) => {
            console.log("Error", e)
        })
    }

}