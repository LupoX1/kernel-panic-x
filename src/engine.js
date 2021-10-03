import initialize from "./initializer.js"
import InputHandler from './input.js'

class Core {

    constructor(width, height, input, context) {
        this.config = {
            debug: false,
            tps: 25,
            maxFrameSkip: 5
        }

        this.running = false
        this.width = width
        this.height = height
        this.ctx = context
        this.input = input
        this.items = new Map()
    }

    handleInput() {
        for (const [i, item] of this.items) {
            if (item.toDelete) {
                this.deleteItem(i)
                continue
            }
            if (item.active && item.handleInput) {
                item.handleInput(this.input)
            }
        }
        this.input.resetMouse()
    }

    update(t) {
        for (const [i, item] of this.items) {
            if (item.toDelete) {
                this.deleteItem(i)
                continue
            }
            if (item.active && item.update) {
                item.update(t)
            }
        }
    }

    render(alpha) {
        this.ctx.clearRect(0, 0, this.width, this.height)
        
        this.ctx.save()

        for (const [i, item] of this.items) {
            if (item.toDelete) {
                this.deleteItem(i)
                continue
            }
            if (item.visible && item.render) {
                item.render(this.ctx, alpha)
            }
        }

        this.ctx.restore()
    }

    start() {
        this.running = true

        let dt = 1000 / this.config.tps;
        let currentTime = performance.now();
        let accumulator = 0
        let t = 0

        let loop = (timestamp) => {

            this.handleInput()

            let newTime = performance.now()
            let frameTime = newTime - currentTime
            if (frameTime > 1000 / this.config.maxFrameSkip) {
                frameTime = 1000 / this.config.maxFrameSkip
            }
            currentTime = newTime
            accumulator += frameTime
            while (accumulator >= dt) {
                this.update(dt)
                accumulator -= dt
                t += dt
            }

            let alpha = accumulator / dt
            this.render(alpha)

            if (this.running) {
                window.requestAnimationFrame(loop)
            }
        }

        loop(performance.now())
    }

    stop() {
        this.running = false
    }

    addItem(item) {
        this.items.set(item.id, item)
    }

    deleteItem(item) {
        this.items.delete(item.id)
    }

    getContext() {
        return this.ctx
    }
}

const setup = () => {
    initialize()

    const canvas = document.createElement('canvas')
    if (typeof (canvas.getContext) === undefined) {
        throw new Error('not canvas')
    }

    let container = document.createElement('div')
    container.classList.add('game-box')
    container.appendChild(canvas)
    document.body.appendChild(container)

    const input = new InputHandler(container)

    let width = window.getComputedStyle(container).getPropertyValue('width').replace('px', '')
    let height = window.getComputedStyle(container).getPropertyValue('height').replace('px', '')

    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    let context = canvas.getContext('2d')
    
    const scale = window.devicePixelRatio
    canvas.width = Math.floor(width * scale)
    canvas.height = Math.floor(height * scale)
    context.scale(scale, scale)

    let core = new Core(width, height, input, context)

    let header = document.createElement('div')
    header.classList.add('game-header')
    let closeButton = document.createElement('button')
    closeButton.append(document.createTextNode('Close'))
    closeButton.style.float = 'right'
    closeButton.addEventListener('click', evt => {
        core.stop()
        header.remove()
        container.remove()
    })
    header.appendChild(closeButton)
    document.body.appendChild(header)

    core.start()
    return core
}

export default setup