const axios = require('axios');
const cheerio = require('cheerio');

class Crawler {
    constructor() {
        this.base_url = 'https://deonibus.com';
    }

    async scrapeData() {
        try {
            const start_url = this.base_url + '/rodoviaria';
            const { data } = await axios.get(start_url);
            const $ = cheerio.load(data);
            const cities = $(".station.searchable-item");
            cities.each((_, city) => {
                const city_url = $(city).attr("href");
                this.parseCityPage(city_url);
            })
        } catch (err) {
            console.log(err);
        }
    }

    async parseCityPage(city_url) {
        try{
            const { data } = await axios.get(this.base_url + city_url);
            const $ = cheerio.load(data);
            const routes = $(".routes.leaving a");
            console.log(routes.length);
        } catch (err) {
            console.log(err);
        }
    }
}

new Crawler().scrapeData();