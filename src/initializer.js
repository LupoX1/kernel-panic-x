
let initialized = false

const initialize = () => {

    if (initialized) {
        return
    }

    const vendors = ['webkit', 'moz']
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    let lastTime = 0
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback, element) => {
            let currTime = performance.now()
            let timeToCall = Math.max(0, 16 - (currTime - lastTime))
            let id = setTimeout(() => {
                callback(currTime + timeToCall)
            }, timeToCall)
            lastTime = currTime + timeToCall
            return id
        }
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (id) => {
            clearTimeout(id)
        }
    }

    initialized = true

}

export default initialize