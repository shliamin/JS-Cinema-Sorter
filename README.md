# MovieMaster - Advanced Movie Discovery & Sorting App

[![Demo](https://img.shields.io/badge/Demo-Live-green.svg)](https://your-demo-link.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> A sophisticated movie discovery application showcasing modern web development practices, advanced sorting algorithms, and beautiful UI/UX design.

## 🌟 Features

### 🎬 Movie Discovery
- **Real-time Search**: Search through millions of movies and TV shows using the OMDB API
- **Smart Filtering**: Filter by year, type (movies/series/episodes), and various criteria
- **Local Fallback**: Works offline with included Star Wars movie collection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### ❤️ Personal Collection
- **Favorites System**: Save movies to your personal favorites collection
- **Persistent Storage**: Favorites are saved locally and persist between sessions
- **Quick Management**: Easy add/remove functionality with visual feedback

### 🔄 Algorithm Visualization
- **Multiple Sorting Algorithms**: 
  - Bubble Sort (Educational demonstration)
  - Quick Sort (Efficient for large datasets)
  - Merge Sort (Stable sorting algorithm)
  - Insertion Sort (Simple and efficient for small datasets)
- **Performance Metrics**: Real-time comparison of algorithm performance
- **Visual Feedback**: See sorting algorithms in action with highlighting

### 🎨 Modern UI/UX
- **Clean Design**: Modern, professional interface with smooth animations
- **Dark/Light Theme**: Automatic theme adaptation (coming soon)
- **Interactive Elements**: Hover effects, smooth transitions, and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation support

### 📱 Technical Features
- **Progressive Web App**: Can be installed on devices
- **Performance Optimized**: Lazy loading, efficient rendering, and minimal bundle size
- **Cross-browser Compatible**: Works on all modern browsers
- **SEO Friendly**: Proper meta tags and structured data

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: OMDB API key for extended search functionality

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/moviemaster.git
   cd moviemaster
   ```

2. **Open the application**
   ```bash
   # Simply open index.html in your browser, or
   # Use a local server for best experience:
   
   # With Python
   python -m http.server 8000
   
   # With Node.js
   npx serve .
   
   # With Live Server (VS Code extension)
   # Right-click index.html → Open with Live Server
   ```

3. **Optional: Add OMDB API Key**
   - Get a free API key from [OMDB API](http://www.omdbapi.com/apikey.aspx)
   - Replace `YOUR_API_KEY` in `index.js` with your actual API key
   - This enables full movie search functionality

## 📖 Usage Guide

### 🔍 Discovering Movies
1. **Search**: Use the search bar to find movies, TV shows, or specific titles
2. **Filter**: Apply filters for year, type, and sorting preferences
3. **Browse**: Explore the default Star Wars collection or search results
4. **Details**: Click on any movie card to view detailed information

### ❤️ Managing Favorites
1. **Add Favorites**: Click the heart icon on any movie card
2. **View Collection**: Switch to the "Favorites" tab to see your saved movies
3. **Remove Favorites**: Click the heart icon again to remove from favorites

### 🧮 Algorithm Demonstration
1. **Choose Algorithm**: Select from Bubble, Quick, Merge, or Insertion Sort
2. **Set Criteria**: Choose to sort by title or year
3. **Execute**: Click ascending or descending to see the algorithm in action
4. **Compare**: View performance metrics to understand algorithm efficiency

## 🛠️ Technical Implementation

### Architecture
```
MovieMaster/
├── index.html          # Main application structure
├── style.css           # Modern CSS with custom properties
├── index.js            # ES6+ JavaScript application logic
├── star_wars_movies.json  # Sample movie data
└── README.md           # Documentation
```

### Key Technologies
- **Vanilla JavaScript (ES6+)**: Modern JavaScript features and best practices
- **CSS Grid & Flexbox**: Responsive layout systems
- **CSS Custom Properties**: Maintainable theming system
- **Fetch API**: Modern AJAX for data retrieval
- **LocalStorage**: Client-side data persistence
- **Font Awesome**: Professional iconography

### Sorting Algorithms

#### Bubble Sort O(n²)
- **Best for**: Educational purposes, small datasets
- **Characteristics**: Simple implementation, stable sorting
- **Use case**: Demonstrating basic sorting concepts

#### Quick Sort O(n log n)
- **Best for**: Large datasets, general-purpose sorting
- **Characteristics**: Efficient, in-place sorting, not stable
- **Use case**: Production applications with large data

#### Merge Sort O(n log n)
- **Best for**: When stability is required, large datasets
- **Characteristics**: Stable, predictable performance, requires extra space
- **Use case**: Sorting objects where order of equal elements matters

#### Insertion Sort O(n²)
- **Best for**: Small datasets, nearly sorted data
- **Characteristics**: Simple, stable, efficient for small lists
- **Use case**: Sorting small arrays or as hybrid with other algorithms

## 🎨 Design System

### Color Palette
```css
--primary-color: #2563eb     /* Blue - Primary actions */
--secondary-color: #64748b   /* Slate - Secondary elements */
--accent-color: #f59e0b      /* Amber - Highlights */
--success-color: #10b981     /* Emerald - Success states */
--error-color: #ef4444       /* Red - Error states */
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Scale**: Modular scale for consistent hierarchy

### Spacing & Layout
- **Grid System**: CSS Grid with auto-fit columns
- **Spacing**: 8px base unit for consistent spacing
- **Border Radius**: 4 size variants for different components
- **Shadows**: 4 elevation levels for depth

## 🚧 Future Enhancements

### Planned Features
- [ ] **Dark Mode Toggle**: User-selectable theme switching
- [ ] **Advanced Filters**: Genre, rating, director, cast filtering
- [ ] **User Reviews**: Rate and review movies
- [ ] **Watchlist**: Separate watchlist from favorites
- [ ] **Social Features**: Share favorites and reviews
- [ ] **PWA Features**: Offline support, push notifications
- [ ] **Data Visualization**: Charts for collection analytics
- [ ] **Export/Import**: Backup and restore favorites

### Performance Optimizations
- [ ] **Virtual Scrolling**: Handle large movie lists efficiently
- [ ] **Image Lazy Loading**: Load images as needed
- [ ] **Service Worker**: Caching for offline functionality
- [ ] **Bundle Optimization**: Code splitting and minification

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/your-username/moviemaster.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to Your Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Include screenshots if applicable
   - Reference any related issues

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OMDB API** for providing comprehensive movie data
- **Font Awesome** for beautiful icons
- **Google Fonts** for the Inter typeface
- **Star Wars** for inspiring the sample dataset
- **Open Source Community** for tools and inspiration

## 📞 Contact

- **Portfolio**: [your-portfolio.com](https://your-portfolio.com)
- **LinkedIn**: [your-linkedin](https://linkedin.com/in/your-profile)
- **Email**: your.email@example.com

---

**Built with ❤️ and modern web technologies**


