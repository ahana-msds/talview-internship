

* create react app (cra) with typescript
* npm start vs npm run dev confusion
* missing node_modules and react-scripts errors
* index.html missing error
* shifting from cra to vite
* vite project creation and dev server
* tsconfig issues and fixes
* port already in use message
* devDependencies flag (-D vs -d)
* git init → add → commit → push
* nested .git problem and solution



# react learning journey – full setup and git workflow

this document records the complete process of setting up react projects using both create react app and vite, the errors faced, how they were fixed, and how git was used to manage the project.

this is meant for step-by-step understanding of what happened and why.

---

## technologies involved

| tool                   | purpose                               |
| ---------------------- | ------------------------------------- |
| html                   | browser directly understands this     |
| css                    | used for styling                      |
| javascript             | handles logic                         |
| react                  | builds ui using components            |
| typescript             | adds type safety to javascript        |
| create react app (cra) | scaffolds react project using webpack |
| vite                   | fast dev server and build tool        |
| npm                    | installs and manages packages         |
| git                    | tracks code changes                   |
| github                 | stores code online                    |

---

## part 1: creating react project using create react app

### command used

```bash
npx create-react-app react-components --template typescript
```

### what this did

this command automatically:

* created project folder
* installed react and react-dom
* installed react-scripts (webpack + babel)
* added typescript configuration
* created public and src folders

no manual react installation was required.

---

### running cra project

correct command:

```bash
npm start
```

not:

```bash
npm run dev
```

cra uses:

* react-scripts start
* webpack dev server

default url:

```
http://localhost:3000
```

---

## errors faced in cra setup

### error: react-scripts not found

reason:

* node_modules not installed

solution:

```bash
npm install
npm start
```

---

### error: index.html missing

message:

```
could not find a required file: public/index.html
```

reason:

* project structure was broken or files were deleted

solution:

* recreate project or switch to new setup using vite

---

## part 2: switching to vite (modern react setup)

### command used

```bash
npm create vite@latest
```

options selected:

* framework: react
* variant: typescript

then:

```bash
cd project-name
npm install
npm run dev
```

---

### what vite setup created

vite automatically created:

* index.html at root
* src/main.tsx
* src/app.tsx
* vite.config.ts
* tsconfig files
* package.json scripts

vite uses:

```bash
npm run dev
```

not:

```bash
npm start
```

default port:

```
http://localhost:5173
```

---

### port already in use message

message:

```
port 5173 is in use, trying another one...
```

this means:

* another app already using port
* vite automatically switches to next available port

example:

```
http://localhost:5174
```

this is normal behavior.

---

## part 3: tsconfig errors and fixes

### issue

typescript errors due to outdated or incompatible config.

example problem:

```json
"target": "es5"
```

es5 is too old for modern react + vite.

---

### fix used

updated tsconfig to:

```json
"target": "ESNext",
"moduleResolution": "Bundler"
```

this allows:

* modern javascript features
* correct vite bundling behavior

after changes:

```bash
stop server
npm run dev
```

and reload editor.

---

## part 4: common react error – invalid element type

### error message

```
element type is invalid: expected function or class but got object
```

### cause

usually due to:

* export/import mismatch
* default vs named export confusion

example mistake:

```ts
export { Component }
```

but imported as:

```ts
import Component from "./file"
```

---

### correct pattern

component file:

```ts
export default Component
```

import:

```ts
import Component from "./file"
```

all concept components were standardized to default exports.

---

## part 5: dev dependency flag confusion

### command used earlier

```bash
npm install -d package
```

### correct command

```bash
npm install -D package
```

### difference

| flag | meaning                                |
| ---- | -------------------------------------- |
| -D   | dev dependency (build tools, bundlers) |
| -d   | not a valid shortcut                   |

build tools should always go in:

```json
devDependencies
```

not production dependencies.

---

## part 6: git setup and workflow

### goal

one github repository containing many learning projects.

structure:

```
talview-internship/
├── typescript-react/
├── react-concepts/
└── node-practice/
```

only top folder should have `.git`.

---

### initialize git

inside main folder:

```bash
git init
```

creates hidden:

```
.git
```

---

### check status

```bash
git status
```

shows:

* new files
* modified files
* staged files

---

### add files

add everything:

```bash
git add .
```

add single file:

```bash
git add filename
```

---

### commit

```bash
git commit -m "added react learning projects"
```

commit saves snapshot of project.

---

### connect to github

```bash
git remote add origin https://github.com/username/repo-name.git
git remote -v
```

---

### push to github

first push:

```bash
git push -u origin main
```

next pushes:

```bash
git push
```

---

## nested git repository problem

### problem

sometimes react tools create their own git repo inside project:

```
project/
 └── .git
```

this causes:

* push errors
* commits going to wrong repo

---

### solution

delete nested .git safely:

```bash
cd project-folder
rmdir /s /q .git
```

this:

* removes git tracking
* keeps all files safe

---

## what .gitignore does

.gitignore tells git which files to ignore.

common entries:

```
node_modules
dist
.env
```

do not delete .gitignore.

---

## commands used during learning

| purpose             | command                                        |
| ------------------- | ---------------------------------------------- |
| create cra project  | npx create-react-app app --template typescript |
| run cra             | npm start                                      |
| install deps        | npm install                                    |
| create vite project | npm create vite@latest                         |
| run vite            | npm run dev                                    |
| stop server         | ctrl + c                                       |
| git init            | git init                                       |
| git add             | git add .                                      |
| git commit          | git commit -m "msg"                            |
| git push            | git push                                       |

---

## learning outcomes from this journey

this process helped understand:

* difference between cra and vite
* how dev servers work
* how react connects to browser
* how tsconfig affects builds
* how to debug setup errors
* how to properly use git with projects

setup problems are part of real development and solving them is a required skill.

---

## important takeaway

react learning is not only about writing components.
it also includes:

* environment setup
* build tools
* debugging errors
* version control



