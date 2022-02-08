/* eslint-disable no-console */
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://deonibus.com';
const busWaysGraph = {};
let citiesCount = 0;
let totalCities = 0;

const scrapeData = async () => {
  console.log(`Começando a crawlear o site ${baseUrl}...\n`);
  const busWays = [];

  if (process.argv.length > 2) {
    // console.log(`${baseUrl + process.argv[2]}`);
    await parseCityPage(process.argv[2]);
    saveJson(busWaysGraph);
    return;
  }

  try {
    const { data } = await axios.get(`${baseUrl}/rodoviaria`);
    const $ = cheerio.load(data);

    const cities = $('#tab-content-Centro-Oeste .station.searchable-item');
    totalCities = cities.length;
    // const dataCities = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (const city of cities) {
      await sleep(Math.floor(Math.random() * 50));
      const cityUrl = getCityUrl($, city);
      await parseCityPage(cityUrl);
    }
  } catch (err) {
    console.log(err.message);
  } finally {
    saveJson(busWaysGraph);
  }
};

const parseCityPage = async cityUrl => {
  try {
    console.log(`Extraindo dados da url -> ${baseUrl + cityUrl}...`);
    const { data } = await axios.get(baseUrl + cityUrl);
    const $ = cheerio.load(data);

    const cityTrips = [];
    const routes = $('.routes.leaving a');
    routes.map((_, route) => {
      const trip = {
        destinationCity: getDestinationCity($, route),
        tripUrl: $(route).attr('href'),
      };
      cityTrips.push(trip);
      return route;
    });

    citiesCount += 1;
    console.log(
      `Extraído com SUCESSO -> ${
        baseUrl + cityUrl
      }!!\n** Total de cidade crawleadas: ${citiesCount} de ${totalCities}\n\n`,
    );

    const cityName = getOriginCity($);
    busWaysGraph[cityName] = { cityName, cityUrl, cityTrips };
  } catch (err) {
    console.log(`PROBLEMA ao extrair ${baseUrl + cityUrl}`);
    console.log(`${err.message}\n`);
  }
};

const getCityUrl = ($, citySelector) => {
  let cityUrl = $(citySelector).attr('href');
  cityUrl = cityUrl.replaceAll(/\.|'|\(|\)/g, ''); // rodoviaria/barra---do-garcas
  cityUrl = cityUrl.replaceAll(/[-]{2,}/g, '-');
  return cityUrl;
};

const getOriginCity = $ => {
  let originCity = $('#main-logo span').text();
  [, originCity] = originCity.match(/de (.+)/);
  originCity = originCity.replace(/(.+)-(\w{2,3})$/, '$1 - $2');
  return originCity;
};

const getDestinationCity = ($, routeSelector) => {
  let destinationCity = $(routeSelector).attr('title');
  [, destinationCity] = destinationCity.match(/para (.+)/);
  return destinationCity;
};

const saveJson = () => {
  fs.writeFile(
    './src/data/data-GOIANIA.json',
    JSON.stringify(busWaysGraph),
    err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(
        'Crawler encerrado e resultado salvo no arquivo ./src/data/data.json!!',
      );
    },
  );
};

async function sleep(ms) {
  return new Promise(resolve => {
    console.log(`Dando um timeout por ${ms} milissegundo(s)...`);
    setTimeout(resolve, ms);
  });
}

scrapeData();
