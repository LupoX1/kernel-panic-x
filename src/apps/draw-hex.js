
import { Layout, Orientation, HexRenderer, Hexagon, Point } from './hexes/hex.js'
import HexDrawer from './hexes/hex-drawer.js'

const hexDrawer = (engine) => {

    let layout = new Layout(Orientation.Flat, new Point(256, 256), new Point(engine.width/2, engine.height/2))
    let hexRenderer = new HexRenderer(layout, { debug: false})
    
    let hex = new Hexagon(0,0)
    let hexItem = new HexDrawer(hex, hexRenderer, engine)

    engine.addItem(hexItem)
}

export default hexDrawer