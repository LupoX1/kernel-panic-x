let itemId = 0

const nextItemId = () => {
    return itemId++
}

class Item {
    constructor() {
        this.id = nextItemId()
        this.visible = true
        this.active = false
        this.toDelete = false
    }

    handleInput(input) {

    }

    update(t) {

    }

    render(ctx, alpha) {
  
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    setToDelete() {
        this.toDelete = true;
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

}

export default Item