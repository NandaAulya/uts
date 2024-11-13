export class Ant {
    constructor(numCities, fitnessFunction, distances) {
        this.distances = distances;
        this.fitnessFunction = fitnessFunction;

        // Atur agar rute selalu dimulai dari kota awal (0) dan kembali ke kota awal
        const route = [...Array(numCities).keys()].slice(1); // Daftar kota, kecuali kota awal
        this.position = [0, ...this.shuffle(route), 0]; // Rute dimulai dan diakhiri di kota 0
        this.updateFitness();
    }

    updateFitness() {
        this.fitness = -this.fitnessFunction(this.position, this.distances); // Negatif karena kita ingin jarak minimum
    }

    // randomWalk() {
    //     // Hanya mengacak kota selain kota awal dan kota akhir
    //     const route = this.position.slice(1, -1); // Ambil bagian yang dapat diacak
    //     this.shuffle(route);
    //     this.position = [0, ...route, 0]; // Pasang kembali kota awal di awal dan akhir
    //     this.updateFitness();
    // }

    randomWalk() {
        // Cobalah untuk menukar lebih dari dua kota secara acak, kecuali kota pertama dan terakhir
        for (let k = 0; k < 3; k++) {
            let i, j;
            do {
                i = Math.floor(Math.random() * (this.position.length - 2)) + 1; // Hindari indeks pertama dan terakhir
                j = Math.floor(Math.random() * (this.position.length - 2)) + 1;
            } while (i === j);
    
            [this.position[i], this.position[j]] = [this.position[j], this.position[i]];
        }
        this.updateFitness();
    }
    

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}


export class AntLionOptimizer {
    constructor(numAnts, numCities, fitnessFunction, distances, maxIterations) {
        this.population = Array(numAnts).fill(null).map(() => new Ant(numCities, fitnessFunction, distances));
        this.antLions = Array(numAnts).fill(null).map(() => new Ant(numCities, fitnessFunction, distances));
        this.fitnessFunction = fitnessFunction;
        this.distances = distances;
        this.maxIterations = maxIterations;
        this.elite = this.antLions[0];
        this.updateElite();
    }

    updateElite() {
        this.elite = this.antLions.reduce((best, antLion) => 
            (antLion.fitness > best.fitness) ? antLion : best, this.antLions[0]
        );
    }

    rouletteWheelSelection() {
        const fitnessSum = this.antLions.reduce((sum, antLion) => sum + antLion.fitness, 0);
        let randomValue = Math.random() * fitnessSum;
        for (let antLion of this.antLions) {
            randomValue -= antLion.fitness;
            if (randomValue <= 0) return antLion;
        }
        return this.antLions[this.antLions.length - 1];
    }

    updateAnts(iteration) {
        this.population.forEach(ant => {
            const selectedAntLion = this.rouletteWheelSelection();
            ant.randomWalk();

            if (ant.fitness > selectedAntLion.fitness) {
                selectedAntLion.position = [...ant.position];
                selectedAntLion.fitness = ant.fitness;
            }
        });
        this.updateElite();
    }

    optimize() {
        for (let i = 0; i < this.maxIterations; i++) {
            this.updateAnts(i);
        }
        return this.elite;
    }
}
