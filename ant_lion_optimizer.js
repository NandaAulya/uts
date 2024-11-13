export class Ant {
    constructor(dimensions, fitnessFunction) {
        this.position = Array(dimensions).fill(0).map(() => Math.random() * 20);
        this.fitnessFunction = fitnessFunction;
        this.updateFitness();
    }

    updateFitness() {
        this.fitness = this.fitnessFunction(...this.position);
    }

    randomWalk(bounds) {
        this.position = this.position.map((pos, i) => 
            Math.floor(Math.max(0, Math.min(bounds[i], pos + (Math.random() - 0.5) * 2)))  // Pembulatan kebawah
        );
        this.updateFitness();
    }
}

export class AntLionOptimizer {
    constructor(numAnts, dimensions, fitnessFunction, lowerBounds, upperBounds, maxIterations) {
        this.population = Array(numAnts).fill(null).map(() => new Ant(dimensions, fitnessFunction));
        this.antLions = Array(numAnts).fill(null).map(() => new Ant(dimensions, fitnessFunction));
        this.dimensions = dimensions;
        this.fitnessFunction = fitnessFunction;
        this.lowerBounds = lowerBounds;
        this.upperBounds = upperBounds;
        this.maxIterations = maxIterations;
        this.elite = this.antLions[0];
        this.updateElite();
    }

    // updateGBest
    updateElite() {
        this.elite = this.antLions.reduce((best, antLion) => 
            (antLion.fitness > best.fitness) ? antLion : best, this.antLions[0]
        );
    }

    // memilih fitness paling tinggi
    rouletteWheelSelection() {
        const fitnessSum = this.antLions.reduce((sum, antLion) => sum + antLion.fitness, 0);
        let randomValue = Math.random() * fitnessSum;
        for (let antLion of this.antLions) {
            randomValue -= antLion.fitness;
            if (randomValue <= 0) return antLion;
        }
        return this.antLions[this.antLions.length - 1];
    }


    // update Fitness tertinggi
    updateAnts(iteration) {
        this.population.forEach(ant => {
            const selectedAntLion = this.rouletteWheelSelection();
            ant.randomWalk(this.upperBounds);

            if (ant.fitness > selectedAntLion.fitness) {
                selectedAntLion.position = [...ant.position];
                selectedAntLion.fitness = ant.fitness;
            }
        });
        this.updateElite();
    }


    // ini buat programnya bang
    optimize() {
        for (let i = 0; i < this.maxIterations; i++) {
            this.updateAnts(i);
        }
        return this.elite;
    }
}
