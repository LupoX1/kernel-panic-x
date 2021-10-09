
import { Layout, Orientation, HexRenderer, Point } from './hexes/hex.js'
import HexGrid from './hexes/grid.js'
import GridDesigner from './hexes/grid-designer.js'

const mapDrawer = (engine) => {
    const renderOptions = {
        lineCap : 'round',
        lineJoin : 'round',
        lineWidth : 1,
        strokeStyle : 'rgba(192,192,192,1.0)',
        fillStyle :   'rgba(248,248,248,1.0)',
        highlight :   'rgba(255,255,192,1.0)',
        selected :    'rgba(56,56,56,1.0)'
    }

    let layout = new Layout(Orientation.Flat, new Point(32, 32), new Point(64, 64))
    let hexRenderer = new HexRenderer(layout, renderOptions)

    let grid = HexGrid.Rectangle(28, 12, hexRenderer)
    engine.addItem(new GridDesigner(grid))
}

export default mapDrawer