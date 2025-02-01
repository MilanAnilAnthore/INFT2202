// Import the movies data from movies.js
import { movies } from "../data/movies.js";

console.log("Loaded movies:", movies);

const allMoviesTable = document.querySelector("#all-movies-container table");
const pinnedMoviesTable = document.querySelector("#pinned-movies-container table");
const allMoviesAlert = document.querySelector("#all-movies-container .alert");
const pinnedMoviesAlert = document.querySelector("#pinned-movies-container .alert");

// Take pinned movies from local storage
function getPinnedMoviesFromStorage() {
    return JSON.parse(localStorage.getItem("pinnedMovies")) || [];
}

// Save pinned movies to local storage
function savePinnedMoviesToStorage(pinnedMovies) {
    localStorage.setItem("pinnedMovies", JSON.stringify(pinnedMovies));
}

// Function to populate the table with movie data
function insertMoviesIntoTable(eleTable, movies) {
    movies.sort((a, b) => b.rating - a.rating);
    
    const tbody = eleTable.querySelector("tbody");
    tbody.innerHTML = "";
    
    movies.forEach(movie => {
        if (movie.genre === "Drama") return;
        

        // Insert movie details into their columns
        const row = tbody.insertRow();
        row.insertCell(0).textContent = movie.title;
        row.insertCell(1).textContent = movie.genre;
        row.insertCell(2).textContent = new Date(movie.release_date * 1000).toLocaleDateString();
        row.insertCell(3).textContent = movie.director;
        row.insertCell(4).textContent = movie.rating;
        
        const buttonCell = row.insertCell(5);
        const button = document.createElement("button");
        button.classList.add("btn");
        
        let pinnedMovies = getPinnedMoviesFromStorage();
        let isPinned = pinnedMovies.some(m => m.title === movie.title);
        
        // Set button and icon look
        button.classList.add(isPinned ? "btn-danger" : "btn-primary");
        button.innerHTML = isPinned ? '<i class="fas fa-times"></i>' : '<i class="fas fa-thumbtack"></i>';
        
        button.addEventListener("click", () => {
            let updatedMovies = isPinned 
                ? pinnedMovies.filter(m => m.title !== movie.title) 
                : [...pinnedMovies, movie];
            
            savePinnedMoviesToStorage(updatedMovies);
            location.reload();
        });
        
        buttonCell.appendChild(button);
        
        // Apply row color considering the rating of movie
        if (movie.rating <= 2) row.classList.add("table-danger");
        else if (movie.rating <= 5) row.classList.add("table-warning");
        else if (movie.rating <= 8) row.classList.add("table-primary");
        else row.classList.add("table-success");
    });
    
    eleTable.classList.remove("d-none");
}

// Take pinned movies from storage and display them
const pinnedMovies = getPinnedMoviesFromStorage();
console.log("Pinned movies:", pinnedMovies);

// Show an alert if no pinned movies exist, otherwise populate the table
if (pinnedMovies.length === 0) pinnedMoviesAlert.classList.remove("d-none");
else {
    pinnedMoviesAlert.classList.add("d-none");
    insertMoviesIntoTable(pinnedMoviesTable, pinnedMovies);
}

if (movies.length === 0) allMoviesAlert.classList.remove("d-none");
else {
    allMoviesAlert.classList.add("d-none");
    insertMoviesIntoTable(allMoviesTable, movies);
}
