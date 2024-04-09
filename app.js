const express = require('express');
const morgan = require('morgan');
// talk to other webservers and go get data
const axios = require('axios');

const app = express();
const port = 3000;

// Log all incoming requests using morgan's dev format
app.use(morgan('dev'));

// whenever the browser issues a get request to / it will run 12-34
app.get('/', async (req, res) => {
    try {
        const omdbID = req.query.i;
        const movieTitle = req.query.t;
        let movieData;
        // make api calls
        if (omdbID) {
            // If omdbID is provided in the query params
            movieData = await getMovieDataById(omdbID);
        } else if (movieTitle) {
            // If movieTitle is provided in the query params
            movieData = await getMovieDataByTitle(movieTitle);
        } else {
            res.status(400).send('Missing query parameter: i or t');
            return;
        }

        // Send the movie data as response
        res.json(movieData);
    } catch (error) {
        console.error('Error fetching movie data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Function to fetch movie data by ID
async function getMovieDataById(omdbID) {
    const url = `http://www.omdbapi.com/?i=${omdbID}&apikey=9c2dc4f`;
    const response = await axios.get(url);
    return response.data;
}

// Function to fetch movie data by title
async function getMovieDataByTitle(movieTitle) {
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=9c2dc4f`;
    const response = await axios.get(url);
    return response.data;
}

// Listen for incoming requests, starting the server up on port 3000
const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Export the server, make the tests work
module.exports = server; 
