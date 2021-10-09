
import { Layout, Orientation, HexRenderer, Point } from './hexes/hex.js'
import HexGrid from './hexes/grid.js'
import GridDesigner from './hexes/grid-designer.js'

const mapDrawer = (engine) => {
    let layout = new Layout(Orientation.Flat, new Point(32, 32), new Point(64, 64))
    let hexRenderer = new HexRenderer(layout)

    let grid = HexGrid.Rectangle(28, 12, hexRenderer)
    engine.addItem(new GridDesigner(grid))
}

export default mapDrawer