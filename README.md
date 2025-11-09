# Joyzai Tree Visualizer

🌐 **Live Demo:** [https://joyzai-tree-visualizer.vercel.app/](https://joyzai-tree-visualizer.vercel.app/)

A beautiful Angular-based tree visualizer application that converts JSON data into interactive hierarchical tree structures. Visualize complex data relationships with an intuitive interface featuring node animations, tooltips, and responsive design.

## Features

- 📊 **Interactive Tree Visualization**: Convert JSON objects into visual tree structures
- 🎨 **Modern UI**: Clean, responsive design with black and grey color palette
- 🔍 **Tooltips**: Hover over node labels to see full names
- ✨ **Animations**: Smooth fade-in animations when nodes appear
- 📱 **Responsive**: Works seamlessly on different screen sizes
- 🎯 **Centered Layout**: Tree is automatically centered in the viewport
- 📜 **Scrollable**: Automatic scrolling when tree exceeds viewport size

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.x or higher) - [Download Node.js](https://nodejs.org/)
- **Yarn** package manager - [Install Yarn](https://yarnpkg.com/getting-started/install)
- **Angular CLI** (will be installed globally or used via yarn)

## Step-by-Step Setup Instructions

### Step 1: Clone the Repository

If you haven't already, clone or download this repository to your local machine:

```bash
git clone https://github.com/thevueeguy/joyzai-tree-visualizer.git
cd joyzai-tree-visualizer
```

### Step 2: Install Node.js and Yarn (if not already installed)

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version for your operating system
3. Run the installer and follow the installation wizard
4. Install Yarn globally:

```bash
npm install -g yarn
```

5. Verify installation by opening a terminal and running:

```bash
node --version
yarn --version
```

You should see version numbers for both commands.

### Step 3: Install Dependencies

Navigate to the project directory and install all required dependencies:

```bash
yarn install
```

**Note:** This may take a few minutes as it downloads all Angular packages and dependencies.

### Step 4: Start the Development Server

Once dependencies are installed, start the Angular development server:

```bash
yarn start
```

The application will compile and start. You should see output similar to:

```
✔ Browser application bundle generation complete.
Initial chunk files   | Names         |  Size
...
** Angular Live Development Server is listening on localhost:4200 **
```

### Step 5: Open in Browser

1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Navigate to: **http://localhost:4200**
3. The Joyzai Tree Visualizer application should load

### Step 6: Visualize a Tree

1. In the left panel (30% of screen), you'll see a textarea for JSON input
2. Enter JSON data in the following format:

```json
{
  "a": ["b", "c"],
  "b": ["d", "e"],
  "c": ["f", "g"]
}
```

**Important:** The JSON must be an object where all values are arrays.

3. Click the **"Visualize"** button
4. The tree will appear in the right panel (70% of screen)
5. Hover over node labels to see tooltips with full names

## Usage Examples

### Example 1: Simple Tree
```json
{
  "root": ["child1", "child2"],
  "child1": ["grandchild1"],
  "child2": ["grandchild2", "grandchild3"]
}
```

### Example 2: Complex Hierarchy
```json
{
  "CEO": ["CTO", "CFO", "CMO"],
  "CTO": ["Dev Lead", "QA Lead"],
  "CFO": ["Accountant"],
  "CMO": ["Marketing Manager"]
}
```

## Available Scripts

- `yarn start` - Start the development server (runs on http://localhost:4200)
- `yarn build` - Build the application for production
- `yarn watch` - Build and watch for file changes
- `yarn test` - Run unit tests

## Project Structure

```
joyzai-tree-visualizer/
├── src/
│   ├── app/
│   │   ├── tree-visualizer/
│   │   │   ├── tree-visualizer.ts      # Main component logic
│   │   │   ├── tree-visualizer.html    # Component template
│   │   │   └── tree-visualizer.scss    # Component styles
│   │   ├── app.ts                       # Root component
│   │   └── app-module.ts                # App module
│   └── styles.scss                      # Global styles
├── package.json                          # Project dependencies
└── README.md                            # This file
```

## Technologies Used

- **Angular 20** - Frontend framework
- **TypeScript** - Programming language
- **Tailwind CSS** - Utility-first CSS framework
- **Angular Animations** - For smooth node animations
- **SVG** - For rendering tree graphics

## Troubleshooting

### Port 4200 Already in Use

If you get an error that port 4200 is already in use:

```bash
# Kill the process using port 4200 (macOS/Linux)
lsof -ti:4200 | xargs kill -9

# Or use a different port
ng serve --port 4201
```

### Module Not Found Errors

If you encounter module not found errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install
```

### Build Errors

If you encounter build errors:

```bash
# Clear Angular cache
rm -rf .angular
yarn start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.

---

**Happy Visualizing! 🌳**

