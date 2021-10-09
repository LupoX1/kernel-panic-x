import Item from '../../core/item.js'
import { Hexagon, HexItem, Point } from './hex.js'

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
        let rOffset = Math.floor(q/2);
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

export default HexGrid