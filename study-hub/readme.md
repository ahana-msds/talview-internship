

# studyhub – html, css, sass & tailwind project

## project overview

studyhub is a simple, responsive web project created to demonstrate core frontend web development concepts using:

* html5
* css3
* sass (css preprocessor)
* tailwind css

the project focuses on clean structure, semantic markup, modular styling, and responsive design, making it suitable for beginners and academic evaluation.

---

## objective

* understand and apply semantic html
* learn css fundamentals including layout and responsiveness
* use sass for scalable and maintainable css
* implement the same ui using tailwind css
* maintain clear separation of concerns

---

## project structure

```
studyhub/
│
├── index.html
├── css/
│   ├── styles.scss
│   └── styles.css
│
├── tailwind/
│   ├── tailwind.config.js
│   └── tailwind.html
```

---

## file-wise explanation

### index.html

this is the main html file of the project.

concepts covered:

* basic html document structure
* semantic html tags (header, nav, main, section, footer)
* tables for structured data
* forms for user input
* lists (ul, li)
* html5 attributes (required, type, meta viewport)

purpose:
defines the content and structure of the web page without styling logic.

---

### css/styles.scss

this is the sass source file used to write modular and reusable css.

concepts covered:

* variables for colors and spacing
* mixins for reusable layout logic
* nesting
* flexbox for layout
* box model (margin, padding, border)
* transitions and hover effects
* media queries for responsive design

purpose:
improves maintainability and scalability of css by reducing repetition.

---

### css/styles.css

this is the compiled css file generated from styles.scss.

concepts covered:

* standard css3 rules
* browser-readable styling
* responsive design using media queries

purpose:
this file is used by the browser to apply styles, since browsers cannot read sass directly.

---

### tailwind/tailwind.config.js

this file is the configuration file for tailwind css.

concepts covered:

* tailwind content scanning
* theme customization
* extending default tailwind styles

purpose:
controls how tailwind generates utility classes and allows customization.

---

### tailwind/tailwind.html

this file contains the tailwind css implementation of the same ui.

concepts covered:

* utility-first css
* flexbox and spacing utilities
* responsive-ready classes
* hover and transition utilities
* minimal custom css usage

purpose:
demonstrates how the same layout can be built without writing traditional css.

---

## concepts implemented summary

html:

* semantic structure
* tables, forms, lists
* accessibility-friendly inputs

css:

* selectors and cascading
* box model
* flexbox layout
* transitions and hover effects
* media queries

sass:

* variables
* mixins
* nesting
* reusable styles

tailwind:

* utility-first styling
* responsive layouts
* faster ui development

---

## outcome

this project demonstrates:

* clear separation of structure and styling
* use of modern frontend practices
* ability to switch between traditional css and utility-based css
* strong foundational understanding of frontend development

---

## conclusion

the studyhub project serves as a complete beginner-to-intermediate example covering html, css, sass, and tailwind css, making it suitable for learning, practice, and academic submission.

---
