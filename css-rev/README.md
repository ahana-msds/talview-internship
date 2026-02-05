# CSS & HTML Revision Project (css-rev)

This project is a comprehensive demonstration of core HTML, CSS, and SASS concepts, designed for quick revision and functional understanding.

## Project Structure

```text
css-rev/
├── index.html              # Main dashboard to navigate all demos
├── html/                   # Demonstration HTML files
│   ├── basic-elements.html # Chapter 1: Basic tags, links, images
│   ├── lists-tables.html   # Chapter 1: Lists and tables
│   ├── forms.html          # Chapter 1: HTML forms & validation
│   ├── semantic-html5.html # Chapter 1: Semantic layout & HTML5 tags
│   ├── css-basics.html     # Chapter 2: Selectors, Box Model, Typography
│   ├── css-layout.html     # Chapter 2: Flexbox, Grid, Positioning
│   ├── css-visuals.html    # Chapter 2: Transitions & Animations
│   └── sass-demo.html      # Chapter 2: SASS Features
├── css/                    # Stylesheets for each demo
├── sass/                   # SASS source files
└── assets/                 # (Optional) Static assets
```

## How to Run the Demonstrations

### 1. Simple Browser Execution
You can open the `index.html` file directly in any modern web browser:
- **Mac**: Right-click `index.html` -> Open With -> Google Chrome / Safari.
- **Terminal**: Run `open index.html` from the `css-rev` directory.

### 2. Live Server (Recommended)
If you have **VS Code**, use the **Live Server** extension:
1. Open this folder in VS Code.
2. Right-click `index.html`.
3. Select "Open with Live Server".

## Concepts Covered

### HTML
- **Semantic Layout Tags**: Tags that define the meaning and structure of web content (e.g., `<header>`, `<footer>`) instead of just its visual appearance.
- **Complex Table Structures**: Organizing data into rows and columns using specialized tags like `<thead>`, `<tbody>`, and `<tfoot>` for better accessibility and data grouping.
- **Multi-input Forms**: Interactive areas where users provide data using various types (text, email, radio, etc.) with built-in rules to ensure data is correct.
- **Hierarchical Heading Systems**: Using `<h1>` through `<h6>` tags to create a logical "table of contents" for your page content so users and search engines can follow it.

### CSS & SASS
- **Flexbox**: A one-dimensional layout method for arranging items in rows or columns that automatically adjusts spacing and alignment.
- **CSS Grid**: A two-dimensional layout system that allows you to align content into rows and columns simultaneously for more advanced page designs.
- **Interactive Animations**: Visual effects like **3D transforms** (flipping objects) and **keyframes** (gradual movement) that make the UI feel alive and responsive.
- **SASS Mixins**: Reusable blocks of CSS code that act like functions, allowing you to apply groups of styles multiple times without repeating code.
- **SASS Nesting**: A shorthand way of writing CSS where you place child selectors inside parent selectors to match the structure of your HTML.
- **SASS Inheritance**: A method using `@extend` to let one CSS selector share the same set of styles as another, reducing code duplication.

## SASS Compilation
The SASS demo uses a pre-compiled `css/sass-demo.css` file. To re-compile or watch for changes, use:
```bash
sass sass/main.scss css/sass-demo.css --watch
```

---
