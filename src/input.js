
const resetMouse = (input) => {
    input['click'] = false
    input['mousedown'] = false
    input['mouseup'] = false
}

const addListener = (container, name, callback) => {
    container.addEventListener(name, callback, false)
}

class InputHandler {
    constructor(container) {
        this.container = container

        this.input = {}

        this.initListeners()
    }

    log(x) {
       //console.log(x)
    }

    isMousePressed(){
        return this.input['mousedown']
    }

    isMouseReleased(){
        return this.input['mouseup']
    }

    getMousePosition(){
        return { x : this.input['mouseX'], y : this.input['mouseY'] }
    }

    isKeyPressed(key){
        return this.input[key.code]        
    }

    resetMouse(){
        this.input['mousedown'] = false
        this.input['mouseup'] = false
    }

    initListeners() {
        this.input = {}

        const canvas = this.container.querySelector('canvas')

        addListener(this.container, 'keydown', (key) => {
            this.input[key.code] = true
            this.log(key)
        }, false)

        addListener(this.container, 'keyup', (key) => {
            this.input[key.code] = false
            this.log(key)
        }, false)

        addListener(this.container, 'mousedown', (evt) => {
            const rect = canvas.getBoundingClientRect()
            this.input['mousedown'] = true
            this.input['mouseup'] = false
            this.input['mouseX'] = evt.clientX - rect.left
            this.input['mouseY'] = evt.clientY - rect.top
            this.log(evt)
        }, false)

        addListener(this.container, 'mouseup', (evt) => {
            const rect = canvas.getBoundingClientRect()
            this.input['mousedown'] = false
            this.input['mouseup'] = true
            this.input['mouseX'] = evt.clientX - rect.left
            this.input['mouseY'] = evt.clientY - rect.top
            if (this.input['dragging']) {
                this.input['dragging'] = false
            }
            this.log(evt)
        }, false)

        addListener(this.container, 'mousemove', (evt) => {
            const rect = canvas.getBoundingClientRect()
            this.input['mouseX'] = evt.clientX - rect.left
            this.input['mouseY'] = evt.clientY - rect.top
            if (this.input['mousedown']) {
                this.input['dragging'] = true
            }
            this.log(evt)
        }, false)

        this.container.focus()
    }

}

export default InputHandler