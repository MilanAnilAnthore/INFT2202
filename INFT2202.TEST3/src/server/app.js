import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import movies from './data/movies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// set the port for the server
const PORT = 3022;

// create server instance
const app = express();

// configure body parser for JSON
app.use(express.json());

// serve static files from client folder
app.use(express.static(join(__dirname, '../client')));

// serve static files from node_modules
app.use('/node_modules', express.static(join(__dirname, '../../node_modules')));

// create router
const router = express.Router();

// GET /api/movies route
router.get('/api/movies', (req, res) => {
    try {
        let filteredMovies = [...movies];

        // Handle rating filter
        if (req.query.rating) {
            const rating = parseFloat(req.query.rating);
            if (isNaN(rating) || rating < 1 || rating > 10) {
                return res.status(400).json({
                    error: 'Rating must be a number between 1 and 10'
                });
            }
            filteredMovies = filteredMovies.filter(movie => movie.rating >= rating);
        }

        // Handle genre filter
        if (req.query.genre) {
            const genre = req.query.genre;
            const movieWithGenre = movies.some(movie =>
                movie.genre.toLowerCase() === genre.toLowerCase()
            );
            if (movieWithGenre) {
                filteredMovies = filteredMovies.filter(movie =>
                    movie.genre.toLowerCase() === genre.toLowerCase()
                );
            }
        }

        // Sort by rating (highest to lowest)
        filteredMovies.sort((a, b) => b.rating - a.rating);

        res.json(filteredMovies);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// use router
app.use('/', router);

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

