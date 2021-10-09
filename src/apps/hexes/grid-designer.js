import HexGrid from './grid.js'
import { Point } from './hex.js'

class GridDesigner extends HexGrid{
    constructor(hexGrid){
        super(hexGrid.renderer)

        this.grid = hexGrid.grid

        this.select = false
        this.remove = false
        this.selected = new Map()

        let saveGrid = this

        let header = document.querySelector('.game-header')
        let btnSelect = document.createElement('button')        
        btnSelect.appendChild(document.createTextNode('Select'))
        btnSelect.disabled = false
        btnSelect.addEventListener('click', evt => {
            saveGrid.startSelect()
            btnSelect.disabled = true
            btnDeselect.disabled = false
            btnStop.disabled = false
        })
        header.appendChild(btnSelect)

        let btnDeselect = document.createElement('button')        
        btnDeselect.appendChild(document.createTextNode('Remove'))
        btnDeselect.disabled = false
        btnDeselect.addEventListener('click', evt => {
            saveGrid.removeSelect()
            btnSelect.disabled = false
            btnDeselect.disabled = true
            btnStop.disabled = false
        })
        header.appendChild(btnDeselect)
        
        let btnStop = document.createElement('button')
        btnStop.appendChild(document.createTextNode('Copy to clipboard'))
        btnStop.disabled = true
        btnStop.addEventListener('click', evt => {
            saveGrid.stopSelect()
            btnSelect.disabled = false
            btnDeselect.disabled = false
            btnStop.disabled = true
        })
        header.appendChild(btnStop)
    }

    handleInput(input) {
        super.handleInput(input)
        if(input.isMousePressed()){
            let { x, y } = input.getMousePosition()
            let hex = this.renderer.layout.pixelToHex(new Point(x, y))
            if(this.select){
                this.getHex(hex.q, hex.r).selected = true
                this.selected.set(this.getKey(hex.q, hex.r), hex)            
            }
            if(this.remove){
                this.getHex(hex.q, hex.r).selected = false
                this.selected.delete(this.getKey(hex.q, hex.r), hex)    
            }
        }
    }

    startSelect(){
        this.select = true
        this.remove = false
    }

    removeSelect(){
        this.select = false
        this.remove = true
    }

    stopSelect(){
        this.select = false
        this.remove = false
       
        let selection = Array.from(this.selected.values()).map(val => { return {q : val.q , r : val.r} } )
        navigator.clipboard.writeText(JSON.stringify(selection))
        alert('Copied to clipboard!')
    }
}

export default GridDesigner 