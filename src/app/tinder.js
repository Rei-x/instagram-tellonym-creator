import 'hammerjs'
import html2canvas from 'html2canvas'
import template from "../assets/html/tellonym.html"
import "../assets/scss/tellonym_download.scss"
import tellonym_download_template from "../assets/html/tellonym_download.html"
import { TellonymClient } from './login'
/* LikeCarousel (c) 2019 Simone P.M. github.com/simonepm - Licensed MIT */

export class Carousel {

    constructor(element, url) {
        this.board = element
        this._iconsName = ["discard", "edit", "download"]
        
        this.tellonym_client = new TellonymClient(url)

        this.downloader = new TellonymHandler()

        this.tellonym_actions = new TellonymActions(this)

        this.tellonym_client.getTellonyms(function(data) {
            let x 
            for (x of data){
                this.push(x.fields.text, x.pk)
            }
        }.bind(this))
    }

    handle() {
        this.cards = this.board.querySelectorAll('.tellonym--active')
        this.topCard = this.cards[this.cards.length - 1]
        this.nextCard = this.cards[this.cards.length - 2]
        
        if (this.cards.length > 0) {
            let icon
            this.icons = {}
            for (icon of this._iconsName){
                this.icons[icon] = (this.topCard.querySelector(".tellonym__message--" + icon))
            }

            // set default top card position and scale
            this.topCard.style.transform =
                'rotate(0deg) rotateY(0deg) scale(1)'

            // destroy previous Hammer instance, if present
            if (this.hammer) this.hammer.destroy()

            // listen for tap and pan gestures on top card
            this.hammer = new Hammer(this.topCard)
            this.hammer.add(new Hammer.Pan({
                position: Hammer.position_ALL,
                threshold: 0
            }))

            // pass events data to custom callbacks
            this.hammer.on('pan', (e) => {
                this.onPan(e)
            })

        }
    }


    onPan(e){
        if (!this.isPanning){

            this.board_width = this.board.clientWidth
            this.card_width = this.topCard.clientHeight

            this.isPanning = true

            // remove transition properties
            this.topCard.style.transition = null
            if (this.nextCard) this.nextCard.style.transition = null

        }
        
        // get new coordinates
        let posX = e.deltaX
        let posY = e.deltaY 
        // get ratio between swiped pixels and the axes
        let propX = posX / this.board_width
        let propY = posY / this.card_width
        // get swipe direction, left (-1) or right (1)
        let dirX = posX < 0 ? -1 : 1
        // get degrees of rotation, between 0 and +/- 45
        let deg = dirX * Math.abs(propX) * 45

        let opacity = Math.abs(propX) * 1.3

        if (propY <= -0.2){
            this.clear_opacity_without_icon('edit')
            let opacity = Math.abs(propY) * 1.3
            this.icons['edit'].style.opacity = Math.abs(opacity)
        } 
        else{
            if (dirX === 1 && propY > -0.2){
                this.clear_opacity_without_icon('discard')
                this.icons['discard'].style.opacity = Math.abs(opacity)
            }
            else if (dirX === -1 && propY > -0.2){
                this.clear_opacity_without_icon('download')
                this.icons['download'].style.opacity = Math.abs(opacity)
            }
            else if (
                    this.icons['edit'].style.opacity != 0 ||
                    this.icons['download'].style.opacity != 0 ||
                    this.icons['discard'].style.opacity != 0
                    ){
                        let icon
                        for (icon in this.icons){
                            this.icons[icon].style.opacity = 0
                        }
            }
        }
        
        // get scale ratio, between .95 and 1
        let scale = (95 + (5 * Math.abs(propX))) / 100

        // move and rotate top card
        this.topCard.style.transform =
            'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg) scale(1)'

        // scale up next card
        if (this.nextCard) this.nextCard.style.transform = 'scale(' + scale + ')'

        if (e.isFinal) {

            this.isPanning = false

            if (propX > 0.25 && e.direction == Hammer.DIRECTION_RIGHT) {

                this.tellonym_actions.set_right()
                
            } else if (propX < -0.25 && e.direction == Hammer.DIRECTION_LEFT) {

                this.tellonym_actions.set_left()
                
            } else if (propY < -0.25 && e.direction == Hammer.DIRECTION_UP) {

                this.tellonym_actions.set_up()

            } else {

                this.tellonym_actions.reset()

            }
                
        }

    }

    clear_opacity_without_icon(icon_name){
        let temp_icons = this.icons
        let icon
        delete temp_icons.icon_name
        for (icon in temp_icons){
            if (this.icons[icon].style.opacity!=0) this.icons[icon].style.opacity = 0
        }
    }

    push(text, id) {
        let card = document.createElement('div')
        card.innerHTML = template

        let tellonym = card.firstChild

        tellonym.querySelector(".content__text").innerHTML = text
        tellonym.id = id

        this.board.insertBefore(tellonym, this.board.childNodes[2])
        this.handle()
        /*
        fetch('https://baconipsum.com/api/?type=all-meat&sentences=1&format=text')
        .then(response => response.text()).then(result => {
            card.firstChild.querySelector(".content__text").innerHTML = result
            this.board.insertBefore(card.firstChild, this.board.childNodes[2])
            this.handle()
        })
        */
        }
}

class TellonymActions{
    constructor(Carousel){
        this.carousel = Carousel
        
    }

    set_left(e=null){
        let topCard = this.carousel.topCard
        let tellonym_text = topCard.querySelector(".content__text").innerHTML

        this.posX = -(window.innerWidth + topCard.clientWidth)
        this.action = "download"

        this.do_animation(e)

        let text = topCard.dataset.edited ? tellonym_text : null
        this.carousel.tellonym_client.updateTellonym(topCard.id, "ACCEPTED", text=text)

        this.carousel.downloader.download(tellonym_text)
        
    }
    set_right(e=null){
        let topCard = this.carousel.topCard
        let tellonym_text = topCard.querySelector(".content__text").innerHTML

        this.posX = (window.innerWidth + topCard.clientWidth)
        this.action = "discard"

        let text = topCard.dataset.edited ? tellonym_text : null
        this.carousel.tellonym_client.updateTellonym(topCard.id, "DISCARDED", text=text)
        this.do_animation(e)
    }
    set_up(){
        let topCard = this.carousel.topCard
        this.action = "edit"
        topCard.dataset.edited = true
        let content_text = topCard.querySelector(".content__text")
        content_text.contentEditable = true
        setTimeout(function() {
            content_text.focus()
            setEndOfContenteditable(content_text)
        }, 0);
        this.reset()
    }
    do_animation(e){

        let topCard = this.carousel.topCard

        topCard.style.transition = 'transform 1500ms ease-out'
        if (this.carousel.nextCard) this.carousel.nextCard.style.transition = 'transform 100ms linear'

        let temp_style = topCard.style.transform
        topCard.style.transform = temp_style.replace(/translateX\(.*?\)/g, `translateX(${this.posX}px)`)
        
        if (e){
            topCard.style.transform += `translateX(${this.posX}px)`
            switch(e.srcElement.classList[1]){
                case "discard":
                    topCard.style.transform += 'rotate(45deg)'
                    break
                case "download":
                    topCard.style.transform += 'rotate(-45deg)'
                    break
            }
        }
        topCard.classList.toggle('tellonym--active')
        
        switch(this.action){
            case "download":
                this.carousel.icons["download"].style.opacity = 1
                break
            case "discard":
                this.carousel.icons["discard"].style.opacity = 1
                break
        }
            
        setTimeout(() => {
                    this.carousel.board.removeChild(topCard)
                    this.carousel.handle()
        }, 800)
    }
    reset(){
        let topCard = this.carousel.topCard
        let nextCard = this.carousel.nextCard

        topCard.style.transition = 'transform 500ms ease-out'
        topCard.style.transform = 'rotate(0deg) rotateY(0deg) scale(1)'

        if (nextCard) nextCard.style.transition = 'transform 100ms linear'
        if (nextCard) nextCard.style.transform = 'scale(0.95)'

        let icon
        for (icon in this.carousel.icons){
            this.carousel.icons[icon].style.opacity = 0
        }
        setTimeout(function(){
            topCard.style.transition = ''
            if (nextCard) nextCard.style.transition = ''
        }, 500)
    }
    
}


class TellonymHandler{

    constructor(){
        let div = document.createElement('div')
        div.innerHTML = tellonym_download_template
        document.body.appendChild(div.firstChild)
        this.tellonym = document.querySelector(".container-download")
    }

    download(text){
        this.tellonym.querySelector(".content__text-download").innerHTML = text
        html2canvas(this.tellonym).then(function(canvas) {
            let filename = text + "." + new Date().getTime()
            this._saveAs(canvas.toDataURL(), `${filename}.png`)
        }.bind(this));

    }

    _saveAs(uri, filename) {
    
        var link = document.createElement('a');
    
        if (typeof link.download === 'string') {
    
            link.href = uri;
            link.download = filename;
    
            document.body.appendChild(link);
    
            link.click();
    
            document.body.removeChild(link);
    
        } else {
    
            window.open(uri);
    
        }
    }
}

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}