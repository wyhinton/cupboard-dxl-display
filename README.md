[![Firebase CI](https://github.com/wyhinton/dx_display_iframe_prototype/actions/workflows/firebase.js.yml/badge.svg)](https://github.com/wyhinton/dx_display_iframe_prototype/actions/workflows/firebase.js.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: Typescript](https://badges.aleen42.com/src/typescript.svg)](https://badges.aleen42.com/src/typescript.svg)
[![Framework: React](https://badges.aleen42.com/src/react.svg)](https://badges.aleen42.com/src/react.svg)


# D.H. Hill Touch Display Web App
A large interactive NEC V864Q 86”display with infrared touch screen that: 1) presents a collection of interactive and non-interactive data and visualization media to DXL patrons and 2) serves as a presentation tool for impromptu gatherings. (For fall of 2020 all content for the screen will be static on a slide deck, due the COVID 19 response)

# Live Demo
- https://iframeprototype-83a96.web.app/
# Table of Contents
- [Quick Start](#quick-start)
- [Dev Environment](#dev-environment)
  - [Chrome Plugins](#chrome-plugins)
  - [VSCode](#vs-code)
  - [CLIs](#clis)
- [Available Scripts](#available-scripts)
- [Components](#components)
- [Configs](#configs)
- [Documentation](#documentation)

# Quick Start

1. Clone the repository and change directory.

```
git clone https://github.com/wyhinton/dx_display_iframe_prototype.git
cd dx_display_iframe_prototype
```

2. Install yarn dependencies

```
yarn install
```

3. Run the app locally.

```
yarn start
```

# Dev Environment
## Chrome Plugins 
- [Redux DevTool](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) - for debugging application's state
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) - inspect the React component hierarchies 
## VSCode
## CLIs 
- git
- yarn

# Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn doc`
Outputs a README.md via the jsdoc-to-markdown package. See [Documentation](#documentation) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Configs
## Typescript
### ```tsconfig.json```
Describes the settings type script compiler with use for the project. This projects tsconfig is the default one geneated by ```npx create-react-app my-app --template typescript```. For a full list of settings see [this page](https://www.typescriptlang.org/tsconfig) from the official typescript docs. 
### ```decs.d.ts```
Describe the shape of JavaScript values to the TypeScript compiler. Or put another way, it is the way to describe, (usually in an external file), the types present in an external JavaScript code. Allows us to use javascript libaries which like type definitions.
## Firebase
### ```firebase.json```
Configuration options for our firebase project. Notably the ```public``` is set to our ```build``` folder rather than ```public```. We need to build our project with ```yarn build``` if we want our deployment to update with changes from our ```src```.
### ```.firebaserc```
Specifies the deploy target for our app, in this case, my personal project in my personal firebase account, "studentmapdisplay".
## Eslint
### ```.eslintrc```
### ```.eslintignore```
## JSDoc
### ```jsdoc.conf.json```
Configures jsdoc settings.
### ```README_TEMPLATE.hbs```
Provides jsdoc-to-markdown with a template format. 

# Components


## Classes

<dl>
<dt><a href="#CardInfo">CardInfo</a></dt>
<dd></dd>
<dt><a href="#CardGrid">CardGrid</a></dt>
<dd></dd>
<dt><a href="#Clock">Clock</a></dt>
<dd></dd>
<dt><a href="#IFrameView">IFrameView</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#Button">Button()</a></dt>
<dd><p>Button Element which wraps and Evergreen UI Button</p></dd>
</dl>

## Interfaces

<dl>
<dt><a href="#AppDataModel">AppDataModel</a></dt>
<dd><p>Core app model</p></dd>
</dl>

<a name="AppDataModel"></a>

## AppDataModel
<p>Core app model</p>

**Kind**: global interface  
<a name="CardInfo"></a>

## CardInfo
**Kind**: global class  
**Component**:   
<a name="new_CardInfo_new"></a>

### new CardInfo()
<p>Formats text from a CardData object, including it's title and source url.</p>

<a name="CardGrid"></a>

## CardGrid
**Kind**: global class  
**Component**:   
<a name="new_CardGrid_new"></a>

### new exports.CardGrid()
<p>Responsible for managing the layout of card components. Accesses a list of available card data from the store, then maps them into Card Components</p>

<a name="Clock"></a>

## Clock
**Kind**: global class  
**Component**:   
<a name="new_Clock_new"></a>

### new Clock()
<p>Simple clock widget for displaying the current time.</p>

<a name="IFrameView"></a>

## IFrameView
**Kind**: global class  
**Component**:   
<a name="new_IFrameView_new"></a>

### new IFrameView()
<p>Minimal warpper for an <iframe>. Can be toggled between a full screen, active view, and a regular card view.</p>

**Example**  
```js
const my_url = "https://www.youtube.com/embed/tgbNymZ7vqY";return( <IFrameView src = {my_url}/>)
```
<a name="Button"></a>

## Button()
<p>Button Element which wraps and Evergreen UI Button</p>

**Kind**: global function  

* * *

# Documentation

# Learning Resources
- https://www.youtube.com/watch?v=kLEp5tGDqcI
- https://codeburst.io/five-tips-i-wish-i-knew-when-i-started-with-typescript-c9e8609029db
- https://www.youtube.com/watch?v=OaxeCPWTdcA

&copy; 2016-Present NCSU