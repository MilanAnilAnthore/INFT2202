// Fetch movies from the API
async function fetchMovies(genre = null, rating = null) {
    try {
        const params = new URLSearchParams();
        if (genre) params.append('genre', genre);
        if (rating) params.append('rating', rating);

        const url = new URL('/api/movies', window.location.origin);
        url.search = params.toString();

        const headers = new Headers({
            'Accept': 'application/json'
        });

        const request = new Request(url, {
            method: 'GET',
            headers: headers
        });

        const response = await fetch(request);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch movies');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Insert movies into table
function insertMoviesIntoTable(table, movies) {
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (movies.length === 0) {
        table.classList.add('d-none');
        document.querySelector('.alert').classList.remove('d-none');
        return;
    }

    table.classList.remove('d-none');
    document.querySelector('.alert').classList.add('d-none');

    movies.forEach(movie => {
        const row = tbody.insertRow();

        // Insert cells
        row.insertCell(0).textContent = movie.title;
        row.insertCell(1).textContent = movie.genre;
        row.insertCell(2).textContent = new Date(movie.release_date * 1000).toDateString();
        row.insertCell(3).textContent = movie.director;
        row.insertCell(4).textContent = movie.rating;

        // Apply color based on rating
        if (movie.rating <= 2) {
            row.classList.add('table-danger');
        } else if (movie.rating <= 5) {
            row.classList.add('table-warning');
        } else if (movie.rating <= 8) {
            row.classList.add('table-primary');
        } else {
            row.classList.add('table-success');
        }
    });
}

// Update footer with name and current year
document.querySelector('footer span').textContent =
    `Milan - ${new Date().getFullYear()}`;

// Set up event listeners
const table = document.querySelector('table');
const genreSelector = document.getElementById('genre-selector');
const ratingSelector = document.getElementById('rating-selector');

async function updateMovies() {
    try {
        const genre = genreSelector.value;
        const rating = ratingSelector.value;
        const movies = await fetchMovies(genre, rating);
        insertMoviesIntoTable(table, movies);
    } catch (error) {
        console.error('Error:', error);
        table.classList.add('d-none');
        const alert = document.querySelector('.alert');
        alert.classList.remove('d-none');
        alert.textContent = error.message;
    }
}

genreSelector.addEventListener('change', updateMovies);
ratingSelector.addEventListener('change', updateMovies);

// Initial load
updateMovies();

