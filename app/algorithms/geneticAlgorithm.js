export function geneticAlgorithm(distances, populationSize = 5, generations = 1000, mutationRate = 0.01) {
    const n = distances.length;

    // Helper function to calculate the total distance of a tour
    function calculateDistance(tour) {
        let distance = 0;
        for (let i = 0; i < tour.length - 1; i++) {
            distance += distances[tour[i]][tour[i + 1]];
        }
        distance += distances[tour[tour.length - 1]][tour[0]]; // return to start
        return distance;
    }

    // Initialize population with random tours
    function initializePopulation() {
        const population = [];
        for (let i = 0; i < populationSize; i++) {
            const tour = Array.from({ length: n }, (_, index) => index).sort(() => Math.random() - 0.5);
            population.push(tour);
        }
        return population;
    }

    // Fitness function to evaluate a tour
    function fitness(tour) {
        return 1 / calculateDistance(tour);
    }

    // Select parent using tournament selection
    function selectParent(population, fitnesses) {
        const tournamentSize = 5;
        const tournament = [];
        for (let i = 0; i < tournamentSize; i++) {
            const randomIndex = Math.floor(Math.random() * populationSize);
            tournament.push(population[randomIndex]);
        }
        return tournament.reduce((best, current) => fitness(current) > fitness(best) ? current : best);
    }

    // Order crossover (OX)
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

    // Mutate a tour by swapping two cities
    function mutate(tour) {
        for (let i = 0; i < n; i++) {
            if (Math.random() < mutationRate) {
                const j = Math.floor(Math.random() * n);
                [tour[i], tour[j]] = [tour[j], tour[i]];
            }
        }
    }

    // Main genetic algorithm
    let population = initializePopulation();

    for (let gen = 0; gen < generations; gen++) {
        const newPopulation = [];

        // Calculate fitness for the current population
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

    // Find the best tour in the final population
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
