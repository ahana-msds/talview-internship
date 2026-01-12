

# react project basics and workflow

## what technologies are involved?

| thing      | why it exists                             |
| ---------- | ----------------------------------------- |
| html       | browser can only understand html          |
| css        | controls how the page looks               |
| javascript | controls actions and logic                |
| react      | helps build ui using components           |
| typescript | makes javascript safer with types         |
| bundler    | converts many files into one browser file |

---

## why we need a build tool

browsers cannot understand:

* jsx
* typescript
* import/export statements

so we use a **bundler** to:

* read all files
* convert code into plain javascript
* give browser a single output file

examples of bundlers:

* webpack
* rspack
* vite

---

## step 1: create the project

open terminal and run:

```bash
npm create vite@latest
```

select:

* framework: react
* variant: typescript

then go inside project:

```bash
cd project-name
npm install
```

this installs all required packages.

---

## step 2: start development server

to run the app:

```bash
npm run dev
```

this:

* starts local server
* shows website in browser
* updates page when code changes

---

## how react runs in browser

basic flow:

```
browser
  ↓
html file
  ↓
javascript bundle
  ↓
react starts
  ↓
components render
```

browser loads html first, then javascript takes control.

---

## why components are used

components help to:

* split ui into parts
* reuse code
* manage complex pages easily

instead of one big file, we write:

* header component
* content component
* footer component

then combine them in main app.

---

## how data flows in react

react follows one direction data flow:

```
parent → child
```

parent sends data using **props**
child receives but does not change it

for changing data inside component, we use **state**.

---

## what is state

state is:

* data stored inside component
* changeable
* controls ui updates

when state changes:

* react re-renders ui
* only changed parts update

---

## what is virtual dom

react does not update browser directly.

instead:

1. react creates virtual copy of ui
2. compares old and new version
3. updates only changed elements

this makes updates faster and efficient.

---

## what is useeffect

useeffect is used when we want to:

* run code after render
* fetch data
* start timers
* clean up resources

examples of useeffect usage:

* api calls
* event listeners
* logging

---

## when does useeffect run

it depends on dependency array:

| dependency | when it runs            |
| ---------- | ----------------------- |
| none       | runs after every render |
| empty []   | runs only once          |
| [value]    | runs when value changes |

---

## why usememo and usecallback exist

they are used for performance optimization.

### usememo

used to:

* store heavy calculation result
* avoid repeating same calculation

### usecallback

used to:

* store function reference
* prevent unnecessary re-render

they should be used only when needed.

---

## what is node_modules

node_modules contains:

* all project dependencies
* large number of files

rules:

* do not upload to github
* always regenerate using npm install

---

## what is package.json

package.json contains:

* project info
* dependencies list
* run commands

example scripts:

| command       | purpose                  |
| ------------- | ------------------------ |
| npm run dev   | start development server |
| npm run build | create production files  |

---

## what is git and github

### git

git is:

* version control tool
* tracks code changes

### github

github is:

* online storage for git projects
* used for sharing code

---

## what is .git folder

.git is:

* hidden folder
* stores git history and settings

if a folder has .git:

* it is a git repository

---

## why nested git repos are bad

nested repos cause:

* push errors
* broken commit history
* confusion while uploading

best practice:

```
one main repo
  └── multiple projects inside
```

only main folder should contain .git.

---

## safe rule about deleting .git

deleting .git:

* does not delete code
* does not affect react app
* only removes git tracking

this is safe if project will be added to another repo.

---

## what is .gitignore

.gitignore is:

* text file
* tells git which files to ignore

usually contains:

```
node_modules
dist
.env
```

do not delete .gitignore.

---

## simple development workflow

1. create project
2. write components
3. run dev server
4. test in browser
5. commit changes
6. push to github

repeat this cycle for learning and building projects.

