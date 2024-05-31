export function geneticAlgorithm(distances, populationSize = 5, generations = 1000, mutationRate = 0.01) {
    const n = distances.length;

    function calculateDistance(tour) {
        let distance = 0;
        for (let i = 0; i < tour.length - 1; i++) {
            distance += distances[tour[i]][tour[i + 1]];
        }
        distance += distances[tour[tour.length - 1]][tour[0]]; // return to start
        return distance;
    }

    function initializePopulation() {
        const population = [];
        for (let i = 0; i < populationSize; i++) {
            const tour = Array.from({ length: n }, (_, index) => index).sort(() => Math.random() - 0.5);
            population.push(tour);
        }
        return population;
    }

    function fitness(tour) {
        return 1 / calculateDistance(tour);
    }

    function selectParent(population, fitnesses) {
        const tournamentSize = 5;
        const tournament = [];
        for (let i = 0; i < tournamentSize; i++) {
            const randomIndex = Math.floor(Math.random() * populationSize);
            tournament.push(population[randomIndex]);
        }
        return tournament.reduce((best, current) => fitness(current) > fitness(best) ? current : best);
    }

    function crossover(parent1, parent2) {
        const start = Math.floor(Math.random() * n);
        const end = Math.floor(Math.random() * (n - start)) + start;
        const child = new Array(n).fill(null);

        for (let i = start; i < end; i++) {
            child[i] = parent1[i];
        }

        let currentIndex = end;
        for (let i = 0; i < n; i++) {
            const city = parent2[i];
            if (!child.includes(city)) {
                if (currentIndex >= n) {
                    currentIndex = 0;
                }
                child[currentIndex++] = city;
            }
        }

        return child;
    }

    function mutate(tour) {
        for (let i = 0; i < n; i++) {
            if (Math.random() < mutationRate) {
                const j = Math.floor(Math.random() * n);
                [tour[i], tour[j]] = [tour[j], tour[i]];
            }
        }
    }

    let population = initializePopulation();

    for (let gen = 0; gen < generations; gen++) {
        const newPopulation = [];

        const fitnesses = population.map(tour => fitness(tour));

        for (let i = 0; i < populationSize; i++) {
            const parent1 = selectParent(population, fitnesses);
            const parent2 = selectParent(population, fitnesses);
            let child = crossover(parent1, parent2);
            mutate(child);
            newPopulation.push(child);
        }

        population = newPopulation;
    }

    let bestTour = population[0];
    let bestDistance = calculateDistance(bestTour);

    for (const tour of population) {
        const currentDistance = calculateDistance(tour);
        if (currentDistance < bestDistance) {
            bestTour = tour;
            bestDistance = currentDistance;
        }
    }

    return {
        distance: bestDistance,
        path: bestTour,
    };
}
