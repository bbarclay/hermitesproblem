# Hermite's Problem - Interactive Paper & Test Environment

This project presents an interactive web-based representation of research on Hermite's Problem, featuring interactive mathematical visualizations and a JavaScript-based testing environment for algorithms.

## Features

- Complete research paper with LaTeX mathematics
- Interactive demonstrations of mathematical concepts
- Terminal-like test environment for running algorithm tests directly in the browser
- Visualization of test results and algorithm performance

## Project Structure

The project is built as a modern React application using Vite:

- `src/pages/` - Main page components
- `src/components/` - Reusable UI components
- `src/assets/` - Static assets like images
- `src/components/TestImplementations.js` - JavaScript implementations of the algorithms

## Getting Started

### Prerequisites

- Node.js 16+
- npm 7+

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/hermites-problem.git
   cd hermites-problem/github-pages-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser at `http://localhost:5173/`

## Deployment

This project is set up to be deployed to GitHub Pages:

1. Build the project
   ```
   npm run build
   ```

2. Copy build files to the GitHub Pages folder
   ```
   npm run deploy
   ```

3. Commit and push changes to GitHub

## Testing Environment

The interactive testing environment allows users to:

1. Run tests for the three algorithm implementations:
   - HAPD Algorithm
   - Matrix Approach
   - Modified sin²-Algorithm

2. Adjust parameters of the cubic polynomial and test criteria

3. Compare algorithm performance and visualize results

### Available Terminal Commands

- `help` - Display available commands
- `run <test>` - Run a specific test (hapd, matrix, sinsquared, all)
- `set <parameter> <value>` - Set a test parameter value
- `show [parameter]` - Show all parameters or a specific one
- `clear` - Clear the terminal
- `reset` - Reset parameters to default values

## Technologies Used

- React 19
- Vite
- React Router
- KaTeX for LaTeX rendering
- Chart.js for data visualization
- Bootstrap 5 for UI components

## License

[MIT License](LICENSE)

## Acknowledgements

- Charles Hermite for the original mathematical problem
- All researchers who have contributed to the field of algebraic number theory
