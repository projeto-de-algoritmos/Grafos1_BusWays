const fs = require("fs");
const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://deonibus.com';

const scrapeData = async function () {
    const busWays = [];

    try {
        const { data } = await axios.get(`${baseUrl}/rodoviaria`);
        const $ = cheerio.load(data);

        const cities = $(".station.searchable-item");
        Promise.all(cities.map(async (_, city) => {
            const cityUrl = $(city).attr("href");
            const cityRoutes = await parseCityPage(cityUrl);
            if (cityRoutes) busWays.push(cityRoutes);
        })).then(() => {
            saveJson(busWays);
        });
    } catch (err) {
        console.log(err.message);
    }
}

const parseCityPage = async function (cityUrl) {
    try {
        const { data } = await axios.get(baseUrl + cityUrl);
        const $ = cheerio.load(data);

        const cityTrips = [];
        const routes = $(".routes.leaving a");
        routes.map((_, route) => {
            const trip = {
                "destinationCity": getDestinationCity($, route),
                "tripUrl": $(route).attr("href"),
            }
            cityTrips.push(trip);
        });

        return {
            "originCity": getOriginCity($),
            "cityTrips": cityTrips,
        };
    } catch (err) {
        console.log(`Problema ao extrair ${baseUrl + cityUrl}`)
        console.log(err.message);
    }
}

const getOriginCity = function ($) {
    let originCity = $("#main-logo span").text();
    originCity = originCity.match(/de (.+)/)[1]
    return originCity;
}

const getDestinationCity = function ($, routeSelector) {
    let destinationCity = $(routeSelector).attr("title");
    destinationCity = destinationCity.match(/para (.+)/)[1]
    return destinationCity;
}

const saveJson = function (busWays) {
    fs.writeFile("./src/data/data.json", JSON.stringify(busWays, null, 2), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Successfully written data to file");
    });
}

scrapeData();