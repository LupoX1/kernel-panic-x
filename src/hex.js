
import InputHandler from './input.js'
import Item from './item.js'

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Hexagon {

    constructor(q, r, s) {
        this.q = q
        this.r = r
        this.s = s || (- q - r)
    }

    equals(hex) {
        return this.q == hex.q && this.r == hex.r && this.s == hex.s
    }

    add(hex) {
        return new Hexagon(this.q + hex.q, this.r + hex.r, this.s + hex.s)
    }

    sub(hex) {
        return new Hexagon(this.q - hex.q, this.r - hex.r, this.s - hex.s)
    }

    mul(k) {
        return new Hexagon(this.q * k, this.r * k, this.s * k)
    }

    length() {
        return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2
    }

    distance(hex) {
        return this.sub(hex).length()
    }

    direction(dir) {
        return Hexagon.directions[dir]
    }

    neighbor(dir) {
        return this.add(direction(dir))
    }
}

Hexagon.directions = [
    new Hexagon(1, 0, -1),
    new Hexagon(1, -1, 0),
    new Hexagon(0, -1, 1),
    new Hexagon(-1, 0, 1),
    new Hexagon(-1, -1, 0),
    new Hexagon(0, 1, -1)
]

class Orientation {
    constructor(f0, f1, f2, f3, b0, b1, b2, b3, startAngle) {
        this.f0 = f0
        this.f1 = f1
        this.f2 = f2
        this.f3 = f3
        this.b0 = b0
        this.b1 = b1
        this.b2 = b2
        this.b3 = b3
        this.startAngle = startAngle
    }
}

Orientation.Pointy = new Orientation(Math.sqrt(3), Math.sqrt(3) / 2, 0, 3 / 2, Math.sqrt(3) / 3, -1 / 3, 0, 2 / 3, 0.5)
Orientation.Flat = new Orientation(3 / 2, 0, Math.sqrt(3) / 2, Math.sqrt(3), 2 / 3, 0, -1 / 3, Math.sqrt(3) / 3, 0)

class Layout {
    constructor(orientation, size, origin) {
        this.orientation = orientation
        this.size = size
        this.origin = origin
    }

    hexToPixel(hex) {
        let m = this.orientation
        let x = (m.f0 * hex.q + m.f1 * hex.r) * this.size.x
        let y = (m.f2 * hex.q + m.f3 * hex.r) * this.size.y
        return new Point(x + this.origin.x, y + this.origin.y)
    }

    pixelToHex(p) {
        let m = this.orientation
        let pt = new Point((p.x - this.origin.x) / this.size.x, (p.y - this.origin.y) / this.size.y)
        let q = m.b0 * pt.x + m.b1 * pt.y
        let r = m.b2 * pt.x + m.b3 * pt.y

        return this.hexRound(new Hexagon(q, r))
    }

    hexRound(hex) {
        let q = Math.round(hex.q);
        let r = Math.round(hex.r);
        let s = Math.round(hex.s);
        let q_diff = Math.abs(q - hex.q);
        let r_diff = Math.abs(r - hex.r);
        let s_diff = Math.abs(s - hex.s);
        if (q_diff > r_diff && q_diff > s_diff) {
            q = -r - s;
        } else if (r_diff > s_diff) {
            r = -q - s;
        } else {
            s = -q - r;
        }
        return new Hexagon(q, r, s);
    }

    cornerOffset(corner) {
        let size = this.size
        let angle = 2 * Math.PI * (this.orientation.startAngle + corner) / 6
        return new Point(size.x * Math.cos(angle), size.y * Math.sin(angle))
    }

    polygonCorners(hex) {
        let corners = new Array()
        let center = this.hexToPixel(hex)
        for (let i = 0; i < 6; i++) {
            let offset = this.cornerOffset(i)
            corners.push(new Point(center.x + offset.x, center.y + offset.y))
        }
        return corners
    }
}

class HexRenderer {
    constructor(layout, renderOptions) {
        this.layout = layout
        this.renderOptions = renderOptions || { debug: true }
    }

    render(ctx, alpha, item) {
        let hex = item.hexagon
        let corners = this.layout.polygonCorners(hex)
        let center = this.layout.hexToPixel(hex)

        ctx.save();

        ctx.lineCap = this.renderOptions.lineCap || 'round'
        ctx.lineJoin = this.renderOptions.lineJoin || 'round'
        ctx.lineWidth = this.renderOptions.lineWidth || 1
        ctx.strokeStyle = this.renderOptions.strokeStyle || 'rgba(192,192,192,1.0)'
        ctx.fillStyle = this.renderOptions.fillStyle || 'rgba(248,248,248,1.0)'
        if (item.highlight) {
            ctx.fillStyle = 'rgba(255,255,216,1.0)'
        }
        if(item.selected){
            ctx.fillStyle = 'rgba(255,192,192,1.0)'    
        }

        ctx.beginPath()
        ctx.moveTo(corners[0].x, corners[0].y)
        ctx.lineTo(corners[1].x, corners[1].y)
        ctx.lineTo(corners[2].x, corners[2].y)
        ctx.lineTo(corners[3].x, corners[3].y)
        ctx.lineTo(corners[4].x, corners[4].y)
        ctx.lineTo(corners[5].x, corners[5].y)
        ctx.closePath()

        ctx.fill()
        ctx.stroke()

        if(this.renderOptions.debug){
            ctx.font = "8px"
            ctx.textAlign = "center"
            ctx.fillStyle = "green"
            ctx.fillText(hex.q, center.x - 10, center.y + 4)
            ctx.fillStyle = "blue"
            ctx.fillText(hex.r, center.x + 10, center.y + 4)
        }

        ctx.restore()
    }
}

class HexItem extends Item {
    constructor(hexagon, renderer) {
        super()

        this.hexagon = hexagon
        this.renderer = renderer

        this.highlight = false
        this.active = true
    }

    handleInput(input) {

    }

    update(t) {

    }

    render(ctx, alpha) {
        if (this.renderer) {
            this.renderer.render(ctx, alpha, this)
        }
    }
}

class HexDrawer extends HexItem {
    constructor(hexagon, renderer) {
        super(hexagon, renderer)

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

        this.btnUndo = btnUndo
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

class HexGrid extends Item {
    constructor(renderer) {
        super()

        this.renderer = renderer
        this.active = true
        this.grid = new Map()
    }

    handleInput(input) {
        let { x, y } = input.getMousePosition()
        let hex = this.renderer.layout.pixelToHex(new Point(x, y))
        for (const [key, value] of this.grid) {
            value.highlight = value.hexagon.equals(hex)
        }
    }

    update(t) {
        for (const [key, value] of this.grid) {
            value.update(t)
        }
    }

    render(ctx, alpha) {
        for (const [key, value] of this.grid) {
            this.renderer.render(ctx, alpha, value)
        }
    }

    getKey(q, r) {
        return q * 0xFFFF + r
    }

    addHex(hex) {
        this.grid.set(this.getKey(hex.q, hex.r), new HexItem(hex))
    }

    getHex(q, r) {
        return this.grid.get(this.getKey(q, r))
    }

    removeHex(q, r) {
        this.grid.delete(this.getKey(q, r))
    }
}

HexGrid.Parallelogram = (minX, maxX, minY, maxY, renderer, type) => {
    let grid = new HexGrid(renderer)

    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if(type === 0){
                grid.addHex(new Hexagon(x, y, -x-y))
            }
            if(type === 1){
                grid.addHex(new Hexagon(-x-y, x, y))
            }
            if(type === 2){
                grid.addHex(new Hexagon(y, -x-y, x))
            }
        }
    }

    return grid
}

HexGrid.Rectangle = (width, height, renderer) => {
    let grid = new HexGrid(renderer)
    
    for (let q = 0; q < width; q++) {
        let rOffset = Math.floor(q/2); // or r>>1
        for (let r = -rOffset; r < height - rOffset; r++) {
            grid.addHex(new Hexagon(q, r))
        }
    }

    return grid
}

HexGrid.FromCoords = (coords, renderer) => {
    let grid = new HexGrid(renderer)
    
    coords.map(val => grid.addHex(new Hexagon(val.q, val.r)))

    return grid
}

class SaveGrid extends HexGrid{
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
        btnStop.appendChild(document.createTextNode('Stop'))
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
        console.log(this.selected)
        let selection = Array.from(this.selected.values()).map(val => { return {q : val.q , r : val.r} } )
        navigator.clipboard.writeText(JSON.stringify(selection))
        alert('Copied to clipboard!')
    }
}

export { Point, Hexagon, HexItem, Orientation, Layout, HexRenderer, HexGrid, SaveGrid, HexDrawer }