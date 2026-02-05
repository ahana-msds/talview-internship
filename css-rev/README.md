# CSS & HTML Revision Showcase

This project is a comprehensive demonstration of modern web development fundamentals, focusing on HTML5 and CSS/SASS.

## Features Demonstrated

### Chapter 1: HTML Components
- **Semantic Structure**: Use of `<nav>`, `<header>`, `<main>`, `<section>`, and `<footer>` for clear document architecture.
- **Common Tags**: Headings, paragraphs, code snippets, and links.
- **Lists & Tables**: Styled unordered lists and comparison tables.
- **HTML5 Forms**: Modern input types (`email`), attributes (`required`, `placeholder`), and validation.

### Chapter 2: CSS & SASS
- **SASS Power**: Modular structure with variables, mixins, and nesting (found in `scss/` folder).
- **Layouts**: Advanced layouts using **CSS Grid** (cards) and **Flexbox** (navbar, rows).
- **Aesthetics**: Premium "Glassmorphism" design with backdrop filters and translucent backgrounds.
- **Interactivity**: Smooth CSS transitions and keyframe animations for polished UX.
- **Responsive Design**: Mobile-friendly styles using media queries.

## Project Structure
```text
css-rev/
├── index.html       # Main demonstration page
├── style.css        # Compiled CSS (Ready to view)
├── scss/            # SASS Source files
│   ├── abstracts/   # Variables & Mixins
│   ├── base/        # Resets & Typography
│   ├── components/  # Buttons, Cards, Forms
│   ├── layout/      # Navbar, Grid, Flex
│   └── main.scss    # Entry point
├── scripts/
│   └── main.js      # Interactive features
└── README.md        # This file
```

## How to Run
1. Simply open `index.html` in any modern web browser.
2. For SASS development: Use a SASS compiler to watch the `scss/main.scss` file and output to `style.css`.
   ```bash
   sass scss/main.scss style.css --watch
   ```

## Git Command
To add this project to your repository:
```bash
git add css-rev && git commit -m "feat: add comprehensive HTML/CSS revision showcase"
```
