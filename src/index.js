import './index.css'
import './hexdrawer.css'

import setup from './engine.js'

import { Layout, Orientation, HexRenderer, Hexagon, HexItem, Point, HexGrid, SaveGrid, HexDrawer } from './hex.js'

const mapDrawer = (engine) => {
    let layout = new Layout(Orientation.Flat, new Point(32, 32), new Point(64, 64))
    let hexRenderer = new HexRenderer(layout)

    let grid = HexGrid.Rectangle(28, 12, hexRenderer)
    engine.addItem(new SaveGrid(grid))
}

const mapLoader = (engine) => {
    
    let layout = new Layout(Orientation.Flat, new Point(32, 32), new Point(64, 64))
    let hexRenderer = new HexRenderer(layout)

    let coords = JSON.parse(document.querySelector('#map-data').value)

    let grid = HexGrid.FromCoords(coords, hexRenderer)
    engine.addItem(grid)
}

const hexDrawer = (engine) => {

    let layout = new Layout(Orientation.Flat, new Point(256, 256), new Point(engine.width/2, engine.height/2))
    let hexRenderer = new HexRenderer(layout, { debug: false})
    
    let hex = new Hexagon(0,0)
    let hexItem = new HexDrawer(hex, hexRenderer)

    engine.addItem(hexItem)
}

const tle1572 = (engine) => {
    let layout = new Layout(Orientation.Flat, new Point(32, 32), new Point(64, 64))
    let hexRenderer = new HexRenderer(layout)
    
    let coords = [{"q":0,"r":1},{"q":0,"r":2},{"q":0,"r":3},{"q":1,"r":2},{"q":1,"r":1},{"q":1,"r":0},{"q":2,"r":0},{"q":2,"r":1},{"q":2,"r":2},{"q":3,"r":1},{"q":3,"r":0},{"q":3,"r":-1},{"q":4,"r":-1},{"q":4,"r":0},{"q":4,"r":1},{"q":5,"r":-2},{"q":5,"r":-1},{"q":5,"r":0},{"q":6,"r":-2},{"q":6,"r":-1},{"q":6,"r":0},{"q":7,"r":-2},{"q":7,"r":-1},{"q":7,"r":0},{"q":8,"r":-1},{"q":8,"r":-2},{"q":8,"r":-3},{"q":9,"r":-2},{"q":9,"r":-3},{"q":9,"r":-4},{"q":10,"r":-4},{"q":10,"r":-3},{"q":10,"r":-2},{"q":11,"r":-4},{"q":11,"r":-3},{"q":11,"r":-2},{"q":12,"r":-5},{"q":12,"r":-4},{"q":12,"r":-3},{"q":13,"r":-5},{"q":13,"r":-4},{"q":13,"r":-3},{"q":14,"r":-5},{"q":14,"r":-4},{"q":14,"r":-3}]

    let grid = HexGrid.FromCoords(coords, hexRenderer)
    engine.addItem(grid)    
}

let calls = new Map()
calls.set('map-drawer', mapDrawer)
calls.set('map-loader', mapLoader)
calls.set('hex-drawer', hexDrawer)
calls.set('tle1572', tle1572)

let buttons = document.querySelectorAll('button.btn-launch')
buttons.forEach(btn => {
    btn.addEventListener('click', evt => {
        let engine = setup()
        calls.get(btn.id)(engine)
    })
})

hexDrawer(setup())