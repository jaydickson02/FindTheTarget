class obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        rect(this.x, this.y, this.width, this.height);
    }
}


