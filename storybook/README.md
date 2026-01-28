# storybook project

this project is a standalone demonstration of storybook and chromatic implementation. it contains a library of components designed for a web application.

## project structure

- **src/components/button**: contains the button component, its styles, and storybook stories.
- **src/components/input**: contains a custom text input field with error handling.
- **src/components/card**: contains a group component that demonstrates composition with other atoms.

## how to run

1. **install dependencies**:
   navigate to this folder and run `npm install`.

2. **launch storybook**:
   run `npm run storybook` to start the interactive component explorer.

3. **build storybook**:
   run `npm run build-storybook` to generate a static version of the library.

## chromatic integration

to use chromatic for visual regression testing:
1. create an account at chromatic.com.
2. run `npx chromatic --project-token=<your-token>` to upload your components for pixel-by-pixel review.

## learning objectives

- understand component-driven development (cdd).
- learn how to document components using stories.
- implement visual regression testing to catch css bugs early.
