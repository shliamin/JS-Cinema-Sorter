// ===== MOVIE DISCOVERY APP =====
class MovieDiscoveryApp {
    constructor() {
        this.movies = [];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.currentAlgorithm = 'bubble';
        this.isSearching = false;
        this.sortMetrics = { comparisons: 0, swaps: 0, time: 0 };
        
        this.init();
    }

    init() {
        this.loadStarWarsData();
        this.bindEvents();
        this.updateFavoritesCount();
    }

    // ===== DATA LOADING =====
    async loadStarWarsData() {
        try {
            const response = await fetch('star_wars_movies.json');
            const data = await response.json();
            this.movies = data.map(movie => ({
                ...movie,
                id: movie.imdbID || Math.random().toString(36)
            }));
            this.displayMovies(this.movies);
            this.updateResultsCount(`Showing ${this.movies.length} Star Wars movies`);
        } catch (error) {
            console.error('Error loading Star Wars data:', error);
            this.showError('Failed to load movie data');
        }
    }

    async searchMovies(query, year = '', type = '') {
        if (!query.trim()) {
            this.loadStarWarsData();
            return;
        }

        this.showLoading(true);
        this.isSearching = true;

        try {
            // Using OMDB API - you'll need to get a free API key
            const apiKey = 'YOUR_API_KEY'; // Replace with actual API key
            let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;
            
            if (year) url += `&y=${year}`;
            if (type) url += `&type=${type}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === 'True') {
                this.movies = data.Search.map(movie => ({
                    ...movie,
                    id: movie.imdbID
                }));
                this.displayMovies(this.movies);
                this.updateResultsCount(`Found ${this.movies.length} movies for "${query}"`);
            } else {
                this.movies = [];
                this.displayMovies([]);
                this.updateResultsCount('No movies found');
            }
        } catch (error) {
            console.error('Error searching movies:', error);
            // Fallback to local search in Star Wars data
            await this.searchLocally(query);
        } finally {
            this.showLoading(false);
            this.isSearching = false;
        }
    }

    async searchLocally(query) {
        try {
            const response = await fetch('star_wars_movies.json');
            const data = await response.json();
            
            const filteredMovies = data.filter(movie =>
                movie.Title.toLowerCase().includes(query.toLowerCase())
            );
            
            this.movies = filteredMovies.map(movie => ({
                ...movie,
                id: movie.imdbID || Math.random().toString(36)
            }));
            
            this.displayMovies(this.movies);
            this.updateResultsCount(`Found ${this.movies.length} Star Wars movies matching "${query}"`);
        } catch (error) {
            this.showError('Failed to search movies');
        }
    }

    async getMovieDetails(imdbID) {
        try {
            const apiKey = 'YOUR_API_KEY'; // Replace with actual API key
            const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`);
            const data = await response.json();
            
            if (data.Response === 'True') {
                return data;
            } else {
                // Fallback to basic info if API fails
                return this.movies.find(movie => movie.id === imdbID);
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return this.movies.find(movie => movie.id === imdbID);
        }
    }

    // ===== DISPLAY METHODS =====
    displayMovies(movies, container = 'movies-grid') {
        const grid = document.getElementById(container);
        
        if (!movies || movies.length === 0) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-film"></i><h3>No movies found</h3><p>Try a different search term</p></div>';
            return;
        }

        grid.innerHTML = movies.map(movie => this.createMovieCard(movie)).join('');
    }

    createMovieCard(movie) {
        const isFavorite = this.favorites.some(fav => fav.id === movie.id);
        const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
            ? movie.Poster 
            : 'https://via.placeholder.com/300x450/e2e8f0/64748b?text=No+Image';

        return `
            <div class="movie-card" data-id="${movie.id}">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="app.toggleFavorite('${movie.id}', event)">
                    <i class="fas fa-heart"></i>
                </button>
                <img src="${posterUrl}" alt="${movie.Title}" class="movie-poster" 
                     onerror="this.src='https://via.placeholder.com/300x450/e2e8f0/64748b?text=No+Image'">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <div class="movie-meta">
                        <span class="movie-type">${movie.Type || 'Movie'}</span>
                        <span class="movie-year">${movie.Year}</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateResultsCount(message) {
        document.getElementById('results-count').textContent = message;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const moviesGrid = document.getElementById('movies-grid');
        
        if (show) {
            loading.style.display = 'flex';
            moviesGrid.style.display = 'none';
        } else {
            loading.style.display = 'none';
            moviesGrid.style.display = 'grid';
        }
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.querySelector('p').textContent = message;
        errorElement.style.display = 'flex';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    // ===== FAVORITES MANAGEMENT =====
    toggleFavorite(movieId, event) {
        event.stopPropagation();
        
        const movie = this.movies.find(m => m.id === movieId);
        if (!movie) return;

        const favoriteIndex = this.favorites.findIndex(fav => fav.id === movieId);
        
        if (favoriteIndex > -1) {
            this.favorites.splice(favoriteIndex, 1);
        } else {
            this.favorites.push(movie);
        }

        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        this.updateFavoriteButtons();
        
        // Update favorites tab if it's active
        if (document.getElementById('favorites-tab').classList.contains('active')) {
            this.displayFavorites();
        }
    }

    updateFavoritesCount() {
        document.getElementById('favorites-count').textContent = this.favorites.length;
    }

    updateFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const movieId = btn.closest('.movie-card').dataset.id;
            const isFavorite = this.favorites.some(fav => fav.id === movieId);
            btn.classList.toggle('active', isFavorite);
        });
    }

    displayFavorites() {
        const favoritesGrid = document.getElementById('favorites-grid');
        
        if (this.favorites.length === 0) {
            favoritesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>No favorites yet</h3>
                    <p>Start exploring movies and add them to your favorites!</p>
                </div>
            `;
        } else {
            favoritesGrid.innerHTML = this.favorites.map(movie => this.createMovieCard(movie)).join('');
        }
    }

    // ===== SORTING ALGORITHMS =====
    bubbleSort(arr, key, order = 'asc') {
        this.sortMetrics = { comparisons: 0, swaps: 0, time: 0 };
        const startTime = performance.now();
        
        const sortedArr = [...arr];
        const len = sortedArr.length;
        
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                this.sortMetrics.comparisons++;
                
                const condition = order === 'asc' 
                    ? this.compareValues(sortedArr[j][key], sortedArr[j + 1][key]) > 0
                    : this.compareValues(sortedArr[j][key], sortedArr[j + 1][key]) < 0;
                
                if (condition) {
                    [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
                    this.sortMetrics.swaps++;
                }
            }
        }
        
        this.sortMetrics.time = performance.now() - startTime;
        return sortedArr;
    }

    quickSort(arr, key, order = 'asc') {
        this.sortMetrics = { comparisons: 0, swaps: 0, time: 0 };
        const startTime = performance.now();
        
        const sortedArr = [...arr];
        
        const partition = (low, high) => {
            const pivot = sortedArr[high][key];
            let i = low - 1;
            
            for (let j = low; j < high; j++) {
                this.sortMetrics.comparisons++;
                
                const condition = order === 'asc'
                    ? this.compareValues(sortedArr[j][key], pivot) <= 0
                    : this.compareValues(sortedArr[j][key], pivot) >= 0;
                
                if (condition) {
                    i++;
                    [sortedArr[i], sortedArr[j]] = [sortedArr[j], sortedArr[i]];
                    this.sortMetrics.swaps++;
                }
            }
            
            [sortedArr[i + 1], sortedArr[high]] = [sortedArr[high], sortedArr[i + 1]];
            this.sortMetrics.swaps++;
            return i + 1;
        };
        
        const quickSortHelper = (low, high) => {
            if (low < high) {
                const pi = partition(low, high);
                quickSortHelper(low, pi - 1);
                quickSortHelper(pi + 1, high);
            }
        };
        
        quickSortHelper(0, sortedArr.length - 1);
        this.sortMetrics.time = performance.now() - startTime;
        return sortedArr;
    }

    mergeSort(arr, key, order = 'asc') {
        this.sortMetrics = { comparisons: 0, swaps: 0, time: 0 };
        const startTime = performance.now();
        
        const merge = (left, right) => {
            const result = [];
            let i = 0, j = 0;
            
            while (i < left.length && j < right.length) {
                this.sortMetrics.comparisons++;
                
                const condition = order === 'asc'
                    ? this.compareValues(left[i][key], right[j][key]) <= 0
                    : this.compareValues(left[i][key], right[j][key]) >= 0;
                
                if (condition) {
                    result.push(left[i]);
                    i++;
                } else {
                    result.push(right[j]);
                    j++;
                }
                this.sortMetrics.swaps++;
            }
            
            return result.concat(left.slice(i)).concat(right.slice(j));
        };
        
        const mergeSortHelper = (array) => {
            if (array.length <= 1) return array;
            
            const mid = Math.floor(array.length / 2);
            const left = mergeSortHelper(array.slice(0, mid));
            const right = mergeSortHelper(array.slice(mid));
            
            return merge(left, right);
        };
        
        const result = mergeSortHelper([...arr]);
        this.sortMetrics.time = performance.now() - startTime;
        return result;
    }

    insertionSort(arr, key, order = 'asc') {
        this.sortMetrics = { comparisons: 0, swaps: 0, time: 0 };
        const startTime = performance.now();
        
        const sortedArr = [...arr];
        
        for (let i = 1; i < sortedArr.length; i++) {
            const current = sortedArr[i];
            let j = i - 1;
            
            while (j >= 0) {
                this.sortMetrics.comparisons++;
                
                const condition = order === 'asc'
                    ? this.compareValues(sortedArr[j][key], current[key]) > 0
                    : this.compareValues(sortedArr[j][key], current[key]) < 0;
                
                if (condition) {
                    sortedArr[j + 1] = sortedArr[j];
                    this.sortMetrics.swaps++;
                    j--;
                } else {
                    break;
                }
            }
            
            sortedArr[j + 1] = current;
            if (j + 1 !== i) this.sortMetrics.swaps++;
        }
        
        this.sortMetrics.time = performance.now() - startTime;
        return sortedArr;
    }

    compareValues(a, b) {
        // Handle string comparison for titles
        if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        }
        
        // Handle numeric comparison for years
        const numA = parseInt(a);
        const numB = parseInt(b);
        
        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
        }
        
        // Fallback to string comparison
        return String(a).localeCompare(String(b));
    }

    sortMovies(criteria, order) {
        if (this.movies.length === 0) return;
        
        let sortedMovies;
        
        switch (this.currentAlgorithm) {
            case 'quick':
                sortedMovies = this.quickSort(this.movies, criteria === 'year' ? 'Year' : 'Title', order);
                break;
            case 'merge':
                sortedMovies = this.mergeSort(this.movies, criteria === 'year' ? 'Year' : 'Title', order);
                break;
            case 'insertion':
                sortedMovies = this.insertionSort(this.movies, criteria === 'year' ? 'Year' : 'Title', order);
                break;
            default:
                sortedMovies = this.bubbleSort(this.movies, criteria === 'year' ? 'Year' : 'Title', order);
        }
        
        this.displayMovies(sortedMovies, 'algorithm-grid');
        this.showPerformanceMetrics();
    }

    showPerformanceMetrics() {
        const metricsContainer = document.getElementById('performance-metrics');
        metricsContainer.style.display = 'block';
        
        document.getElementById('sort-time').textContent = `${this.sortMetrics.time.toFixed(2)}ms`;
        document.getElementById('comparisons-count').textContent = this.sortMetrics.comparisons.toLocaleString();
        document.getElementById('swaps-count').textContent = this.sortMetrics.swaps.toLocaleString();
    }

    // ===== MODAL FUNCTIONALITY =====
    async showMovieModal(movieId) {
        const modal = document.getElementById('movie-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading movie details...</p></div>';
        modal.classList.add('active');
        
        try {
            const movieDetails = await this.getMovieDetails(movieId);
            this.renderMovieDetails(movieDetails, modalBody);
        } catch (error) {
            modalBody.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i><p>Failed to load movie details</p></div>';
        }
    }

    renderMovieDetails(movie, container) {
        const posterUrl = movie.Poster && movie.Poster !== 'N/A' 
            ? movie.Poster 
            : 'https://via.placeholder.com/300x450/e2e8f0/64748b?text=No+Image';

        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <img src="${posterUrl}" alt="${movie.Title}" class="modal-movie-poster"
                     onerror="this.src='https://via.placeholder.com/300x450/e2e8f0/64748b?text=No+Image'">
            </div>
            <h2 class="modal-movie-title">${movie.Title}</h2>
            <div class="modal-movie-meta">
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Year</span>
                    <span class="modal-meta-value">${movie.Year}</span>
                </div>
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Type</span>
                    <span class="modal-meta-value">${movie.Type || 'Movie'}</span>
                </div>
                ${movie.Genre ? `
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Genre</span>
                    <span class="modal-meta-value">${movie.Genre}</span>
                </div>
                ` : ''}
                ${movie.Director ? `
                <div class="modal-meta-item">
                    <span class="modal-meta-label">Director</span>
                    <span class="modal-meta-value">${movie.Director}</span>
                </div>
                ` : ''}
                ${movie.imdbRating ? `
                <div class="modal-meta-item">
                    <span class="modal-meta-label">IMDB Rating</span>
                    <span class="modal-meta-value">${movie.imdbRating}/10</span>
                </div>
                ` : ''}
            </div>
            ${movie.Plot && movie.Plot !== 'N/A' ? `
            <div class="modal-movie-plot">
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">Plot</h4>
                <p>${movie.Plot}</p>
            </div>
            ` : ''}
        `;
    }

    closeModal() {
        document.getElementById('movie-modal').classList.remove('active');
    }

    // ===== EVENT HANDLERS =====
    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Filters
        document.getElementById('sort-filter').addEventListener('change', (e) => {
            this.applySorting(e.target.value);
        });

        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Algorithm selection
        document.querySelectorAll('.algorithm-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.algorithm-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentAlgorithm = e.target.dataset.algorithm;
            });
        });

        // Sort controls
        document.getElementById('sort-asc').addEventListener('click', () => {
            const criteria = document.getElementById('sort-criteria').value;
            this.sortMovies(criteria, 'asc');
        });

        document.getElementById('sort-desc').addEventListener('click', () => {
            const criteria = document.getElementById('sort-criteria').value;
            this.sortMovies(criteria, 'desc');
        });

        // Modal events
        document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('modal-overlay').addEventListener('click', () => this.closeModal());

        // Movie card clicks
        document.addEventListener('click', (e) => {
            const movieCard = e.target.closest('.movie-card');
            if (movieCard && !e.target.closest('.favorite-btn')) {
                this.showMovieModal(movieCard.dataset.id);
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.toggle('active', tab.id === `${tabName}-tab`);
        });

        // Load tab-specific content
        if (tabName === 'favorites') {
            this.displayFavorites();
        } else if (tabName === 'algorithms') {
            this.displayMovies(this.movies, 'algorithm-grid');
        }
    }

    handleSearch() {
        const query = document.getElementById('search-input').value;
        const year = document.getElementById('year-filter').value;
        const type = document.getElementById('type-filter').value;
        
        this.searchMovies(query, year, type);
    }

    applySorting(sortValue) {
        if (!sortValue || this.movies.length === 0) return;
        
        const [criteria, order] = sortValue.split('-');
        const key = criteria === 'title' ? 'Title' : 'Year';
        
        const sortedMovies = this.bubbleSort(this.movies, key, order);
        this.displayMovies(sortedMovies);
    }

    clearFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('year-filter').value = '';
        document.getElementById('type-filter').value = '';
        document.getElementById('sort-filter').value = 'title-asc';
        
        this.loadStarWarsData();
    }
}

// ===== INITIALIZE APP =====
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new MovieDiscoveryApp();
});

// ===== GLOBAL FUNCTIONS FOR INLINE EVENT HANDLERS =====
window.app = {
    toggleFavorite: (movieId, event) => app.toggleFavorite(movieId, event)
};
