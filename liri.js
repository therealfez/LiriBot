require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

function searchApi(command) {
    switch (command) {
        case 'concert-this':
            const artist = encodeURI(process.argv.slice(3).join("%20"));
            axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
                .then(function (response) {
                    for(var i = 0; i <response.data.length; i++) {
                    console.log(`
                    Venue: ${response.data[i].venue.name}
                    Location: ${response.data[i].venue.city} ${response.data[i].venue.region}, ${response.data[i].venue.country}
                    Date: ${moment(response.data[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A')}
                    

=====================================================================================================================
                    `)
                    }
                })
            break;
        case 'spotify-this-song':
            const song = encodeURI(process.argv.slice(3).join("+"));

            spotify.search({ type: 'track', query: song })
                .then(function (response) {

                    console.log(`
                    Artist: ${response.tracks.items[0].artists[0].name}
                    Song Title: ${response.tracks.items[0].name}
                    Album: ${response.tracks.items[0].album.name}
                    Spotify URL: ${response.tracks.items[0].external_urls.spotify}
                    `)
                })
            break;
        case 'movie-this':
            const movie = encodeURI(process.argv.slice(3).join("+"));
            axios.get("https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy")
                .then(function (response) {
                    console.log(`
                    Title: ${response.data.Title}
                    Year: ${response.data.Year}
                    IMDB Rating: ${response.data.Ratings[0].Value}
                    Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}
                    Country: ${response.data.Country}
                    Language: ${response.data.Language}
                    Plot: ${response.data.Plot}
                    Actors: ${response.data.Actors}
                    `)
                })
            break;
        case 'do-what-it-says':
            fs.readFile('random.txt', 'utf8', function (err, data) {

                if (err) {
                    return console.log(err);
                }
                const dataArr = data.split(',');
                const command = dataArr[0];
                const search = dataArr[1];

                console.log(command, search)

            });
            break;

        default:
            console.log('Unknown command! Please enter concert-this, spotify-this-song, movie-this or do-what-it-says.')

    }
}

searchApi(process.argv[2]);