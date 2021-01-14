import 'hammerjs'
import template from "../assets/html/tellonym.html"
/* LikeCarousel (c) 2019 Simone P.M. github.com/simonepm - Licensed MIT */

export class Carousel {

    constructor(element) {
        this.board = element
        this._iconsName = ["discard", "edit", "download"]
        let i
        for (i = 0; i<10; i++){
            this.push()
        }
        
        this.handle()
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
        else{
            console.log("yay")
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
        if (this.nextCard) this.nextCard.style.transform =
            'scale(' + scale + ')'

        if (e.isFinal) {

            this.isPanning = false

            let successful = false

            this.topCard.style.transition = 'transform 800ms ease-out'
            if (this.nextCard) this.nextCard.style.transition = 'transform 100ms linear'

            if (propX > 0.25 && e.direction == Hammer.DIRECTION_RIGHT) {
                successful = true
                posX = window.innerWidth + this.topCard.clientWidth

            } else if (propX < -0.25 && e.direction == Hammer.DIRECTION_LEFT) {
                successful = true
                posX = -(window.innerWidth + this.topCard.clientWidth)

            } else if (propY < -0.25 && e.direction == Hammer.DIRECTION_UP) {

                successful = true
                // get top border position
                posY = -(window.innerHeight+this.topCard.clientHeight)

            }

            if (successful) {

                // throw card in the chosen direction
                this.topCard.style.transform =
                    'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)'

                // wait transition end
                setTimeout(() => {
                    // remove swiped card
                    this.board.removeChild(this.topCard)
                    // add new card
                    this.push()
                }, 200)

            } else {

                // reset cards position and size
                this.topCard.style.transform =
                    'rotate(0deg) rotateY(0deg) scale(1)'
                if (this.nextCard) this.nextCard.style.transform =
                    'scale(0.95)'
                let icon
                for (icon in this.icons){
                    this.icons[icon].style.opacity = 0
                }
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

    swipe() {
        let topCard = this.topCard
        topCard.style.transition = 'transform 800ms ease-out'
        topCard.style.transform = 'translateX(-' + window.innerWidth  + 'px) rotate(-45deg)'
        if (this.nextCard) this.nextCard.style.transition = 'transform 300ms linear'
        topCard.classList.toggle('tellonym--active')
        topCard.querySelector('.tellonym__message--download').style.opacity = 1
        this.handle()
        setTimeout(() => {
                    this.board.removeChild(topCard)
        }, 800)
        
    }

    push() {
        let card = document.createElement('div')
        card.innerHTML = template
        fetch('https://baconipsum.com/api/?type=all-meat&sentences=1&format=text')
        .then(response => response.text()).then(result => {
            card.firstChild.querySelector(".content__text").innerHTML = result
            this.board.insertBefore(card.firstChild, this.board.childNodes[2])
            this.handle()
        })
        }
}