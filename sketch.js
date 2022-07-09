// Setup Values
let populationSize = 2500;
let population = [];
let goal;
let percentageOfFitParents = 0.2;
let populationCounter = 0;
let populationStartPoint;
let bestFitness = 0;
let blockade;



function windowResized() {
    resizeCanvas(windowWidth - 100, windowHeight - 100);
}

function setup() {

    createCanvas(windowWidth - 100, windowHeight - 100);
    frameRate(60);

    populationStartPoint = { x: width / 2, y: height * 0.92 };
    goal = { x: width / 2, y: 10 };

    //Initialise the obstacle
    blockade = new Obstacle(width * 0.333, height / 2, width * 0.333, 10)

    //Genesis
    for (let i = 0; i < populationSize; i++) {
        let dna = new DNA(populationStartPoint.x, populationStartPoint.y);
        dna.genesis();
        population.push(dna);
    }
}

//Sort the population by fitness
function SortbyFitness() {
    for (let i = 0; i < population.length; i++) {
        for (let j = 0; j < population.length; j++) {
            if (population[i].fitness(goal) > population[j].fitness(goal)) {
                let temp = population[i];
                population[i] = population[j];
                population[j] = temp;
            }
        }
    }
}

//Check if the population has reached run out of moves
function checkMoves() {
    let largest = 0;
    for (let i = 0; i < population.length; i++) {
        if (population[i].moves.length > largest) {
            largest = population[i].moves.length;
        }
    }

    if (largest > 0) {
        return largest;
    } else {
        return true;
    }
}

//Find the best parents in the population
function findBestParents() {
    let parents = []
    SortbyFitness(); //Sorts the population by fitness
    let numberOfSelectedParents = Math.floor(population.length * percentageOfFitParents)
    for (let i = 0; i < numberOfSelectedParents; i++) {
        for (let j = 0; j < (numberOfSelectedParents - i + 1) ** 2; j++) {
            parents.push(population[i]);
        }
        return parents;
    }
}

function draw() {
    background(255);

    //Generate new population
    if (checkMoves() == true) {
        populationCounter++;
        let parents = findBestParents();
        console.log(parents);
        population = []; //reset population

        bestFitness = parents[0].fitness(goal);

        //Generate Children
        for (let i = 0; i < populationSize; i++) {
            let dna = new DNA(populationStartPoint.x, populationStartPoint.y)
            dna.scrambleGenes(parents);
            dna.mutate();
            population.push(dna);
        }

    }

    //Check for collisions
    for (let i = 0; i < population.length; i++) {
        if (population[i].checkCollision(blockade)) {
            population[i].moves = [];
            population[i].x = populationStartPoint.x;
            population[i].y = populationStartPoint.y;
        }
    }
    //draw the goal
    fill(255, 0, 0);
    ellipse(goal.x, goal.y, 10, 10);

    //draw the start point
    fill(0, 255, 0);
    ellipse(populationStartPoint.x, populationStartPoint.y, 10, 10);

    //Draw Population
    fill(0);
    for (let i = 0; i < population.length; i++) {
        population[i].move();
        population[i].draw();
    }

    //Draw Obstacle
    fill(0, 0, 255);
    rect(blockade.x, blockade.y, blockade.width, blockade.height);

    //draw the population counter
    fill(0);
    textSize(20);
    text("Generation: " + populationCounter, 10, 20);

    //show the largest number of moves
    textSize(10);
    text("Largest Number of Moves: " + checkMoves(), 10, 40);

    //show the best fitness
    textSize(10);
    text("Best Fitness: " + Math.floor(bestFitness), 10, 60);

    //show the framerate
    textSize(10);
    text("Framerate: " + frameRate().toFixed(2), 10, 80);


}
