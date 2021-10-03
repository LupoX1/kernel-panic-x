var log = object => {
    let element = document.querySelector('#debugContainer')
    element.innerHTML = JSON.stringify(object)
}

const debugWindow = () => {
    let debugContainer = document.createElement('div')
    debugContainer.id = 'debugContainer'
    debugContainer.style.position = 'fixed'
    debugContainer.style.top = 0
    debugContainer.style.left = 0
    debugContainer.style.right = 0
    debugContainer.style.height = '32px'
    debugContainer.style.borderWidth = '1px'
    debugContainer.style.borderStyle = 'solid'
    debugContainer.style.borderColor = 'red'
    debugContainer.style.backgroundColor = 'rgba(255, 128, 128, 0.9)'
    document.body.appendChild(debugContainer)
}