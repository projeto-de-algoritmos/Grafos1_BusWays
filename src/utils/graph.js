const busWaysGraph = require('../data/data.json');

const primeNumberHash = 1031;
const isVisited = new Array(primeNumberHash);
let path = [];

const getAllPaths = (startCity, endCity) => {
  const currentPath = [];

  currentPath.push(startCity);
  dfs(startCity, endCity, currentPath);
};

const dfs = (startCity, endCity, currentPath) => {
  isVisited[hash(startCity)] = true;

  if (startCity === endCity) {
    // Como tem muitas cidades e o algoritmo está muito lento
    // (talvez uma falha de implementação), a solução atual está
    // parando após encontrar o primeiro caminho
    if (currentPath.length > 0) {
      isVisited.fill(true);
      path = [...currentPath];
      return;
    }
  }

  if (busWaysGraph[startCity]) {
    busWaysGraph[startCity].cityTrips.forEach(({ destinationCity }) => {
      if (!isVisited[hash(destinationCity)]) {
        currentPath.push(destinationCity);
        dfs(destinationCity, endCity, currentPath);
        currentPath.splice(
          busWaysGraph[startCity].cityTrips.indexOf(destinationCity),
          1,
        );
      }
    });
  }

  isVisited[hash(startCity)] = false;
};

const hash = cityName => {
  let hashNumber = 0;
  for (let i = 0; i < cityName.length; i += 1) {
    hashNumber += cityName.charCodeAt(i);
  }
  return hashNumber % primeNumberHash;
};
