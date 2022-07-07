class DNA {
    constructor(x, y, maxMoves = 500, mutatutionRate = 0.1, velocity = 5) {
        this.x = x;
        this.y = y;
        this.maxMoves = maxMoves;
        this.genes = [];
        this.moves = [];
        this.mutatutionRate = mutatutionRate;
        this.velocity = velocity;
    }

    genesis() {
        //randomly generate the movement charecteristics
        let numberOfMoves = Math.floor(random(0, this.maxMoves));
        for (let i = 0; i < numberOfMoves; i++) {
            let move = Math.floor(random(0, 8)); //Corresponds to the 8 possible directions. 0 = up, 1 = right, 2 = down, 3 = left, 4 = up-right, 5 = down-right, 6 = down-left, 7 = up-left
            this.genes.push(move);
        }

        this.moves = [...this.genes];
    }

    scrambleGenes(parents) {
        this.genes = [];

        let totalParentMoves = 0;

        //find parents average number of moves
        for (let i = 0; i < parents.length; i++) {
            totalParentMoves += parents[i].genes.length;
        }

        let averageParentMoves = Math.floor(totalParentMoves / parents.length);

        //add random variation to average number of moves
        let variation = Math.floor(random(-averageParentMoves / 4, averageParentMoves / 4));

        let totalMoves = averageParentMoves + variation;

        if (totalMoves > this.maxMoves) {
            totalMoves = this.maxMoves;
        }

        //generate new genes
        for (let i = 0; i < totalMoves; i++) {
            let parent = Math.floor(random(0, parents.length));
            let move = parents[parent].genes[i];
            this.genes.push(move);
        }

        this.moves = [...this.genes];

    }

    //Add something to mutate number of moves
    mutate() {
        for (let i = 0; i < this.genes.length; i++) {
            if (random(0, 1) < this.mutatutionRate) {
                this.genes[i] = Math.floor(random(0, 8));
            }
        }

        this.moves = [...this.genes];
    }

    fitness(target) {

        let distanceToTarget = dist(this.x, this.y, target.x, target.y);
        let exponential = distanceToTarget ** 2;

        let fitness = 10000000 / exponential
        return fitness;
    }

    checkCollision(obstacle) {
        if (this.x > obstacle.x && this.x < obstacle.x + obstacle.width && this.y > obstacle.y && this.y < obstacle.y + obstacle.height) {
            return true;
        }
        return false;
    }

    move() {
        let vel = this.velocity;
        let x = this.x;
        let y = this.y;
        let move = this.moves[0];
        switch (move) {
            case 0:
                y -= vel; //up
                break;
            case 1:
                x += vel; //right
                break;
            case 2:
                y += vel; //down
                break;
            case 3:
                x -= vel; //left
                break;
            case 4:
                x += vel; //right-up
                y -= vel;
                break;
            case 5:
                x += vel; //down-right
                y += vel;
                break;
            case 6:
                x -= vel; //down-left
                y += vel;
                break;
            case 7:
                x -= vel; //up-left
                y -= vel;
                break;
        }
        this.x = x;
        this.y = y;
        this.moves.shift();
    }

    draw() {
        ellipse(this.x, this.y, 3, 3);
    }
}