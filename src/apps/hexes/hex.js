import Item from '../../core/item.js'
import { Hexagon, Point, Orientation, Layout, HexRenderer } from './models.js'

class HexItem extends Item {
    constructor(hexagon, renderer) {
        super()

        this.hexagon = hexagon
        this.renderer = renderer

        this.highlight = false
        this.active = true
    }

    render(ctx, alpha) {
        if (this.renderer) {
            this.renderer.render(ctx, alpha, this)
        }
    }
}

export { Point, Hexagon, HexItem, Orientation, Layout, HexRenderer}