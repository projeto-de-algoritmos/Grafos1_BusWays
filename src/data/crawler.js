const fs = require("fs");
const axios = require('axios');
const cheerio = require('cheerio');

const base_url = 'https://deonibus.com';

const scrapeData = async function () {
    const busWays = [];

    try {
        const { data } = await axios.get(`${base_url}/rodoviaria`);
        const $ = cheerio.load(data);

        const cities = $(".station.searchable-item");
        Promise.all(cities.map(async (_, city) => {
            const city_url = $(city).attr("href");
            const cityRoutes = await parseCityPage(city_url);
            busWays.push(cityRoutes);
        })).then(() => {
            saveJson(busWays);
        });
    } catch (err) {
        console.log(err);
    }
}

const parseCityPage = async function (city_url) {
    try {
        const { data } = await axios.get(base_url + city_url);
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
        console.log(err);
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