import 'hammerjs'
import template from "./assets/tellonym.html"
/* LikeCarousel (c) 2019 Simone P.M. github.com/simonepm - Licensed MIT */

export class Carousel {

    constructor(element) {

        this.board = element
        
        // add first two cards programmatically
        this.push()
        this.push()

        // handle gestures
        this.handle()

    }

    handle() {

        // list all cards
        this.cards = this.board.querySelectorAll('.tellonym')
        this.topCard = this.cards[this.cards.length - 1]
        this.board_width = this.board.clientWidth
        this.card_width = this.topCard.clientHeight
        // get top card
        let icons_name = ["discard", "edit", "download"]
        
        // get next card
        this.nextCard = this.cards[this.cards.length - 2]

        // if at least one card is present
        if (this.cards.length > 0) {

            let icon
            this.icons = {}
            for (icon of icons_name){
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
            alert("end");
        }

    }


    onPan(e) {

        if (!this.isPanning) {

            this.isPanning = true
            this.is_opacity_zero = true
            // remove transition properties
            this.topCard.style.transition = null
            if (this.nextCard) this.nextCard.style.transition = null

        }
        
        // get new coordinates
        let posX = e.deltaX
        let posY = e.deltaY 
        // get ratio between swiped pixels and the axes
        let propX = e.deltaX / this.board_width
        let propY = e.deltaY / this.card_width
        // get swipe direction, left (-1) or right (1)
        let dirX = e.deltaX < 0 ? -1 : 1

        // get degrees of rotation, between 0 and +/- 45
        let deg = dirX * Math.abs(propX) * 45

        let opacity = Math.abs(propX) * 1.3
        if (propY <= -0.2){
            if (this.icons['download'].style.opacity!=0) this.icons['download'].style.opacity = 0
            if (this.icons['discard'].style.opacity!=0) this.icons['discard'].style.opacity = 0
            let opacity = Math.abs(propY) * 1.3
            this.icons['edit'].style.opacity = Math.abs(opacity)
        } else{
            if (this.icons['edit'].style.opacity!=0) this.icons['edit'].style.opacity = 0
            if (dirX === 1 && propY > -0.2) {
                this.icons['discard'].style.opacity = Math.abs(opacity)
            }
            else if (dirX === -1 && propY > -0.2) {
                this.icons['download'].style.opacity = Math.abs(opacity)
            }
            else if (
                    this.icons['edit'].style.opacity != 0 ||
                    this.icons['download'].style.opacity != 0 ||
                    this.icons['discard'].style.opacity != 0
                    ) {
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
            'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg) rotateY(0deg) scale(1)'

        // scale up next card
        if (this.nextCard) this.nextCard.style.transform =
            'rotate(0deg) rotateY(0deg) scale(' + scale + ')'

        if (e.isFinal) {

            this.isPanning = false

            let successful = false

            // set back transition properties
            this.topCard.style.transition = 'transform 800ms ease-out'
            if (this.nextCard) this.nextCard.style.transition = 'transform 100ms linear'

            // check threshold and movement direction
            if (propX > 0.25 && e.direction == Hammer.DIRECTION_RIGHT) {

                successful = true
                // get right border position
                posX = this.board.clientWidth+this.topCard.clientWidth

            } else if (propX < -0.25 && e.direction == Hammer.DIRECTION_LEFT) {

                successful = true
                // get left border position
                posX = -(this.board.clientWidth+this.topCard.clientWidth)

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
                    // handle gestures on new top card
                    this.handle()
                }, 200)

            } else {

                // reset cards position and size
                this.topCard.style.transform =
                    'rotate(0deg) rotateY(0deg) scale(1)'
                if (this.nextCard) this.nextCard.style.transform =
                    'rotate(0deg) rotateY(0deg) scale(0.95)'
                let icon
                for (icon in this.icons){
                    this.icons[icon].style.opacity = 0
                }
            }

        }

    }

    swipe() {
        this.topCard.style.transition = 'transform 300ms ease-out'
        this.topCard.style.transform = 'translateX(-' + window.innerWidth  + 'px) rotate(-45deg)'
        if (this.nextCard) this.nextCard.style.transition = 'transform 100ms linear'
        setTimeout(() => {
                    // remove swiped card
                    this.board.removeChild(this.topCard)
                    // add new card

                    // handle gestures on new top card
                    this.handle()
                }, 200)
    }

    push() {

        let card = document.createElement('div')
        card.innerHTML = template;
        fetch('https://baconipsum.com/api/?type=all-meat&sentences=1&format=text')
        .then(response => response.text()).then(result => {
            card.firstChild.querySelector(".content__text").innerHTML = result
            this.board.insertBefore(card.firstChild, this.board.firstChild)})
        }
}