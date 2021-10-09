import './hex-drawer.css'

import { HexItem } from './hex.js'

class HexDrawer extends HexItem {
    constructor(hexagon, renderer, engine) {
        super(hexagon, renderer)

        this.engine = engine
        this.draw = new Array({color: 'black', data: new Map()})

        this.drawing = false

        let self = this

        this.colorButtons = new Array()
        
        this.createColorButton('red')
        this.createColorButton('green')
        this.createColorButton('blue')
        this.createColorButton('yellow')
        this.createColorButton('brown')
        this.createColorButton('black')
        this.createColorButton('gray')
        
        let header = document.querySelector('.game-header')
        let btnUndo = document.createElement('button')
        btnUndo.classList.add('btn-undo')      
        btnUndo.appendChild(document.createTextNode('Undo'))
        btnUndo.disabled = true
        btnUndo.addEventListener('click', evt => {
            self.draw.pop()
            self.draw.at(-1).data.clear()
            btnUndo.disabled = self.draw.length == 1
        })
        header.appendChild(btnUndo)

        let btnSave = document.createElement('a')
        btnSave.href = '#'
        //btnSave.download = 'hex.png'
        btnSave.classList.add('btn-save')      
        btnSave.appendChild(document.createTextNode('Save'))
        btnSave.addEventListener('click', evt => {
            let context = self.engine.getContext()
            let corners = self.renderer.layout.polygonCorners(self.hexagon)
            let minX = 0
            let minY = 0
            let maxX = context.canvas.width
            let maxY = context.canvas.height
            corners.forEach(corner => {
                minX = Math.max(minX, corner.x)
                minY = Math.max(minY, corner.y)
                maxX = Math.min(maxX, corner.x)
                maxY = Math.min(maxY, corner.y)
            })
            
            let canvas = document.createElement('canvas')
            canvas.width = context.canvas.width
            canvas.height = context.canvas.height

            
            let ctx = canvas.getContext('2d')
            
            ctx.save()

            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.lineWidth = 5
            self.draw.forEach( draw => {
                ctx.beginPath()
                ctx.strokeStyle = draw.color
                Array.from(draw.data.values()).forEach( (point, idx) => {
                    if(idx > 0){
                        ctx.lineTo(point.x, point.y)
                    }else{
                        ctx.moveTo(point.x, point.y)
                    }
                })
                ctx.stroke()
                ctx.closePath()
            })
                
            ctx.restore()

            let imageData = ctx.getImageData(minX, minY, maxX - minX, maxY - minY);
            ctx.canvas.width = imageData.width
            ctx.canvas.height = imageData.height
            ctx.putImageData(imageData, 0, 0);
           
            let dataUrl = canvas.toDataURL('image/png')
            btnSave.download = 'hex.png'
            btnSave.href = dataUrl
        })
        header.appendChild(btnSave)

        this.btnUndo = btnUndo
        this.btnSave = btnSave
    }

    createColorButton(color) {
        let self = this

        let header = document.querySelector('.game-header')
        
        let btnColor = document.createElement('button')
        btnColor.appendChild(document.createTextNode(''))
        btnColor.classList.add('btn-color')      
        btnColor.classList.add(color)      
        btnColor.addEventListener('click', evt => {
            self.draw.at(-1).color = window.getComputedStyle(btnColor).getPropertyValue('background-color')
            self.colorButtons.forEach(btn => { btn.classList.remove('selected') })
            btnColor.classList.add('selected')
        })  
        header.appendChild(btnColor)

        this.colorButtons.push(btnColor)
    }

    handleInput(input) {
        if(input.isMousePressed()){
            this.drawing = true
        }
        
        if(input.isMouseReleased()){
            this.drawing = false
            this.btnUndo.disabled = false
            let color = this.draw.at(-1).color
            this.draw.push({ color : color, data: new Map() })
        }

        if(this.drawing){
            let pos = input.getMousePosition()
            let hex = this.renderer.layout.pixelToHex(pos)
            if(this.hexagon.equals(hex)){
                let key = pos.y * 0xFFFF + pos.x
                this.draw.at(-1).data.set(key, pos)    
            }
        }
    }

    update(t) {
        
    }

    render(ctx, alpha) {
        
        super.render(ctx, alpha)

        ctx.save()

        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = 5
        this.draw.forEach( draw => {
            ctx.beginPath()
            ctx.strokeStyle = draw.color
            Array.from(draw.data.values()).forEach( (point, idx) => {
                if(idx > 0){
                    ctx.lineTo(point.x, point.y)
                }else{
                    ctx.moveTo(point.x, point.y)
                }
            })
            ctx.stroke()
            ctx.closePath()
        })
            
        ctx.restore()
    }
}

export default HexDrawer