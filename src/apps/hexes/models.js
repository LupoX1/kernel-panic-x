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
        if(item.selected){
            ctx.fillStyle = this.renderOptions.selected ||'rgba(255,255,255,1.0)'    
        }
        if (item.highlight) {
            ctx.fillStyle = this.renderOptions.highlight || 'rgba(255,255,216,1.0)'
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

export { Point, Hexagon, Orientation, Layout, HexRenderer }