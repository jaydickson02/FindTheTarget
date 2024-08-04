class DNA {
    constructor(x, y, maxMoves = 1000, mutationRate = 0.1, velocity = 5) {
        this.x = x;
        this.y = y;
        this.maxMoves = maxMoves;
        this.genes = [];
        this.moves = [];
        this.mutationRate = mutationRate;
        this.velocity = velocity;
        this.fitnessValue = 0; // Store the fitness value
        this.collided = false; // Track if the agent has collided
    }

    genesis() {
        let numberOfMoves = this.maxMoves;
        for (let i = 0; i < numberOfMoves; i++) {
            let move = Math.floor(random(8));
            this.genes.push(move);
        }

        this.moves = [...this.genes];
    }

    scrambleGenes(parents) {
        this.genes = [];
        let totalParentMoves = 0;

        parents.forEach(parent => {
            totalParentMoves += parent.genes.length;
        });

        let averageParentMoves = Math.floor(totalParentMoves / parents.length);
        let variation = Math.floor(random(-averageParentMoves / 4, averageParentMoves / 4));
        let totalMoves = Math.min(averageParentMoves + variation, this.maxMoves);

        for (let i = 0; i < totalMoves; i++) {
            let parent = parents[Math.floor(random(parents.length))];
            let move = parent.genes[i % parent.genes.length];
            this.genes.push(move);
        }

        this.moves = [...this.genes];
    }

    mutate() {
        this.genes = this.genes.map(gene => random() < this.mutationRate ? Math.floor(random(8)) : gene);
        this.moves = [...this.genes];
    }

    adjustMutationRate(bestFitness, maxFitness, minRate = 0.01, maxRate = 0.1) {
        let fitnessRatio = bestFitness / maxFitness;
        this.mutationRate = maxRate - fitnessRatio * (maxRate - minRate);
    }

    fitness(target) {
        let distanceToTarget = dist(this.x, this.y, target.x, target.y);
        this.fitnessValue = (1 / (distanceToTarget + 1)) * 100; // Storing the fitness value
        return this.fitnessValue;
    }

    checkCollision(obstacle) {
        // Check for canvas boundaries
        if (this.x <= 0 || this.x >= width || this.y <= 0 || this.y >= height) {
            return true;
        }

        // Check for collision with obstacles
        if (this.x > obstacle.x &&
            this.x < obstacle.x + obstacle.width &&
            this.y > obstacle.y &&
            this.y < obstacle.y + obstacle.height) {
            return true;
        }

        return false;
    }

    move() {
        if (this.moves.length === 0) return;

        let vel = this.velocity;
        switch (this.moves[0]) {
            case 0: this.y -= vel; break;
            case 1: this.x += vel; break;
            case 2: this.y += vel; break;
            case 3: this.x -= vel; break;
            case 4: this.x += vel; this.y -= vel; break;
            case 5: this.x += vel; this.y += vel; break;
            case 6: this.x -= vel; this.y += vel; break;
            case 7: this.x -= vel; this.y -= vel; break;
        }

        this.moves.shift();
    }

    draw() {
        ellipse(this.x, this.y, 3, 3);
    }
}