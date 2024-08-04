let populationSize = 2500;
let population = [];
let goal;
let percentageOfFitParents = 0.1;
let populationCounter = 0;
let populationStartPoint;
let bestFitness = 0;
let avgFitness = 0;
let maxFitness = 42;
let fitnessHistory = { best: [], avg: [] };
let obstacles = [];
let chart; // Declare the chart variable globally

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);

    populationStartPoint = { x: width / 2, y: height * 0.92 };
    goal = { x: width / 2, y: 30 };

    let numBars = 5;
    let barWidth = width / numBars;
    let gapSize = 20;
    for (let i = 0; i < numBars; i++) {
        let x = i * barWidth + gapSize / 2;
        let y = height / 2;
        let obstacleWidth = barWidth - gapSize;
        let obstacleHeight = 10;
        obstacles.push(new Obstacle(x, y, obstacleWidth, obstacleHeight));
    }

    for (let i = 0; i < populationSize; i++) {
        let dna = new DNA(populationStartPoint.x, populationStartPoint.y);
        dna.genesis();
        population.push(dna);
    }

    initializeChart();

    updateChart();
    updateInfoPanel();
}

function checkMoves() {
    return population.every(dna => dna.moves.length === 0);
}

function generateTieredPopulation(parents, populationSize, topPercent = 0.2) {
    // Ensure parents are sorted by fitness (best to worst)
    parents.sort((a, b) => b.fitnessValue - a.fitnessValue);

    // Find best fitness value
    let bestFitness = parents[0].fitnessValue;

    // Calculate the number of top parents to select
    let topCount = Math.ceil(parents.length * topPercent);
    let topParents = parents.slice(0, topCount);

    let newPopulation = [];
    let totalTiers = topParents.length;

    // Calculate the total tier weight sum for proportional distribution
    let totalWeight = (totalTiers * (totalTiers + 1)) / 2;

    // Fill the new population
    while (newPopulation.length < populationSize) {
        for (let i = 0; i < topParents.length; i++) {
            let parent = topParents[i];
            let weight = (topParents.length - i) / totalWeight;
            let clones = Math.ceil(weight * populationSize);

            for (let j = 0; j < clones; j++) {
                if (newPopulation.length < populationSize) {
                    let newIndividual = new DNA(populationStartPoint.x, populationStartPoint.y);
                    newIndividual.genes = [...parent.genes];
                    newIndividual.moves = [...parent.moves];
                    newIndividual.adjustMutationRate(bestFitness, maxFitness);
                    newIndividual.mutate();
                    newPopulation.push(newIndividual);
                } else {
                    break;
                }
            }
        }
    }

    return newPopulation;
}

function draw() {
    background(240); // Clear the canvas

    if (checkMoves()) {
        populationCounter++;
        let newPopulation = [];
        let elitePopulation = [];

        for (let i = 0; i < population.length; i++) {
            population[i].fitness(goal);
        }

        // Number of elites to carry over to the next generation
        let eliteCount = Math.floor(populationSize * 0.05); // 5% of the population

        // Sort parents by fitness
        population.sort((a, b) => b.fitnessValue - a.fitnessValue);

        // Carry over the elite individuals
        for (let i = 0; i < eliteCount; i++) {
            // Clone the elite DNA to avoid carrying over the same object reference
            let eliteClone = new DNA(populationStartPoint.x, populationStartPoint.y);
            eliteClone.genes = [...population[i].genes];
            eliteClone.moves = [...population[i].genes]; // Reset moves to full gene sequence
            eliteClone.fitnessValue = population[i].fitnessValue; // Keep fitness value
            eliteClone.collided = false; // Reset collision status
            eliteClone.adjustMutationRate(bestFitness, maxFitness); // Adjust mutation rate
            elitePopulation.push(eliteClone);
        }

        // Generate the rest of the population
        newPopulation = generateTieredPopulation(population, populationSize, percentageOfFitParents);
        newPopulation = [...elitePopulation, ...newPopulation];

        
        // Calculate and record fitness statistics
        bestFitness = population[0].fitnessValue;
        avgFitness = population.reduce((sum, p) => sum + p.fitnessValue, 0) / population.length;

        fitnessHistory.best.push(bestFitness);
        fitnessHistory.avg.push(avgFitness);

        updateChart();
        updateInfoPanel();

        population = newPopulation;
    }
    
        // Set text properties
        textSize(12);
        textFont('Arial');
        textAlign(CENTER, CENTER);
        fill(0);
    
        // Draw the goal
        fill(200, 200, 200);
        rect(goal.x, goal.y, 10, 10);
        fill(0);
        text('Target', goal.x, goal.y - 15); // Label the goal
    
        // Draw the start point
        fill(250, 250, 250);
        rect(populationStartPoint.x, populationStartPoint.y, 10, 10);
        fill(0);
        text('Home', populationStartPoint.x, populationStartPoint.y - 15); // Label the home point
    
        // Draw barriers (obstacles)
        fill(220, 220, 220);
        for (let i = 0; i < obstacles.length; i++) {
            fill(220, 220, 220);
            rect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
            fill(0);
            text('Barrier', obstacles[i].x + obstacles[i].width / 2, obstacles[i].y - 10); // Label the barriers
        }
    
        // Draw each individual in the population
        fill(0);
        for (let i = 0; i < population.length; i++) {
            for (let j = 0; j < obstacles.length; j++) {
                if (population[i].checkCollision(obstacles[j])) {
                    population[i].moves = []; // Stop the agent's movement
                    population[i].collided = true; // Mark as collided
                    population[i].x = populationStartPoint.x; // Reset to start point x
                    population[i].y = populationStartPoint.y; // Reset to start point y
                }
            }
            population[i].move();
            population[i].draw();
        }
    
    }

function updateInfoPanel() {
    let lastBestFitness = fitnessHistory.best[fitnessHistory.best.length - 1] || 0;
    let lastAvgFitness = fitnessHistory.avg[fitnessHistory.avg.length - 1] || 0;
    let mutationRateDisp = population[0].mutationRate * 100;

    document.getElementById('generation').innerText = `Generation: ${populationCounter}`;
    document.getElementById('best-fitness').innerText = `Best Fitness: ${lastBestFitness.toFixed(2)}`;
    document.getElementById('average-fitness').innerText = `Average Fitness: ${lastAvgFitness.toFixed(2)}`;
    document.getElementById('mutation-rate').innerText = `Mutation Rate: ${mutationRateDisp.toFixed(2)}%`;
}

function initializeChart() {
    let ctx = document.getElementById('fitness-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Best Fitness',
                data: [],
                borderColor: 'green',
                fill: false
            }, {
                label: 'Average Fitness',
                data: [],
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Generation'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Fitness'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart() {
    chart.data.labels.push(populationCounter);
    chart.data.datasets[0].data.push(bestFitness);
    chart.data.datasets[1].data.push(avgFitness);
    chart.update();
}