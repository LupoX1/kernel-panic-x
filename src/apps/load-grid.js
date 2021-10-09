
import { Layout, Orientation, HexRenderer, Point } from './hexes/hex.js'
import HexGrid from './hexes/grid.js'

const mapLoader = (engine) => {
    
    let layout = new Layout(Orientation.Flat, new Point(32, 32), new Point(64, 64))
    let hexRenderer = new HexRenderer(layout)

    let coords = JSON.parse(document.querySelector('#map-data').value)

    let grid = HexGrid.FromCoords(coords, hexRenderer)
    engine.addItem(grid)
}

export default mapLoader