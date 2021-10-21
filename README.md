[![Firebase CI](https://github.com/wyhinton/dx_display_iframe_prototype/actions/workflows/firebase.js.yml/badge.svg)](https://github.com/wyhinton/dx_display_iframe_prototype/actions/workflows/firebase.js.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: Typescript](https://badges.aleen42.com/src/typescript.svg)](https://badges.aleen42.com/src/typescript.svg)
[![Framework: React](https://badges.aleen42.com/src/react.svg)](https://badges.aleen42.com/src/react.svg)


# Cuboard
Cuboard is an open source content-sharing app built with touch screens in mind. Cuboard allows you to curate and design attractive masonry grids for touch displays. Types of content you can display include iframes, videos, and images. Cuboard is designed to be lightweight as possible, and requires no dedicated backend. See [Set Up](#Set Up) for details.


# Features
- Proven, scalable, and easy to understand project structure
- Written in modern React, only functional components with hooks 
- A variety of custom light-weight UI components such as datepicker, modal, various form elements etc
- State management with easy-peasy

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
- [Libraries](#libraries)

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
- TBD
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
Describe the shape of JavaScript values to the TypeScript compiler. Or put another way, it is the way to describe, (usually in an external file), the types present in an external JavaScript code. Allows us to use javascript libaries which lack type definitions.
## Firebase
### ```firebase.json```
Configuration options for our firebase project. Notably the ```public``` is set to our ```build``` folder rather than ```public```. We need to build our project with ```yarn build``` if we want our deployment to update with changes from our ```src```.
### ```.firebaserc```
Specifies the deploy target for our app, in this case, my personal project in my personal firebase account, "studentmapdisplay".
## Eslint
### ```.eslintrc```
- TBD
### ```.eslintignore```
- TBD
## JSDoc
### ```jsdoc.conf.json```
Configures jsdoc settings.
### ```README_TEMPLATE.hbs```
Provides jsdoc-to-markdown with a template format. 

# Libraries
- [react-use](https://github.com/streamich/react-use#readme) - Provides useful hooks for event handling like ```useIdle``` and ```useLongPress```
- [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) - Draggable and resizable grid layout with responsive breakpoints. Used for editing and display our card layotus.
- [evergreen-ui](https://github.com/segmentio/evergreen) - React UI framework. Provides some  componets for things like Buttons, Menus, etc., that work well with the projects design language. Allows us to avoid having to basic UI components from scratch. 
- [easy-peasy](https://github.com/ctrlplusb/easy-peasy) - Redux wrapper which allows us to design clear, centralized state managment for our application.

# Learning Resources
### react-grid-layout
- ["React grid layout from TypeScript" codesandbox example](https://codesandbox.io/s/react-grid-layout-from-typescript-forked-46zp2)
### Github Actions 
- [Deploy React Application To Firebase Using GitHub Actions](https://www.youtube.com/watch?v=kLEp5tGDqcI)
### Typescript 
- [Five tips I wish I knew when I started with Typescript](https://codeburst.io/five-tips-i-wish-i-knew-when-i-started-with-typescript-c9e8609029db)
- [Learn TypeScript #6, Advanced Classes](https://www.youtube.com/watch?v=OaxeCPWTdcA)
# Components

## Classes

<dl>
<dt><a href="#Background">Background</a></dt>
<dd></dd>
<dt><a href="#Button">Button</a></dt>
<dd></dd>
<dt><a href="#CardInfo">CardInfo</a></dt>
<dd></dd>
<dt><a href="#ViewCard">ViewCard</a></dt>
<dd></dd>
<dt><a href="#CardGrid">CardGrid</a></dt>
<dd></dd>
<dt><a href="#Clock">Clock</a></dt>
<dd></dd>
<dt><a href="#DropDownMenu">DropDownMenu</a></dt>
<dd></dd>
<dt><a href="#IFrameView">IFrameView</a></dt>
<dd></dd>
<dt><a href="#Toolbar">Toolbar</a></dt>
<dd></dd>
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

|  |
|
| 

<a name="Background"></a>

## Background
**Kind**: global class  
**Component**:   
<a name="new_Background_new"></a>

### new Background()
<p>Background with particle animation.</p>

<a name="Button"></a>

## Button
**Kind**: global class  
**Component**:   
<a name="new_Button_new"></a>

### new Button()
<p>Wraps an Evergreen UI Button.</p>

<a name="CardInfo"></a>

## CardInfo
**Kind**: global class  
**Component**:   
<a name="new_CardInfo_new"></a>

### new CardInfo()
<p>Formats text from a CardData object, including it's title and source url.</p>

<a name="ViewCard"></a>

## ViewCard
**Kind**: global class  
**Component**:   
<a name="new_ViewCard_new"></a>

### new ViewCard()
<p>Wraps card content.</p>

<a name="CardGrid"></a>

## CardGrid
**Kind**: global class  
**Component**:   
<a name="new_CardGrid_new"></a>

### new exports.CardGrid()
<p>Responsible for managing the layout of card components. Accesses a list of available card data from the store, then maps them into Card Components</p>
<pre class="prettyprint source"><code> {availableCards.map((card: CardData, i: number) => {
  console.log(i.toString());
  return (
  &lt;div key={i.toString()}>
    &lt;ViewCard data={card} key={i.toString()}>
      &lt;IFrameView src={rand&lt;string>(testSources)} />
      &lt;/ViewCard>
      &lt;/div>
    );
  })}
</code></pre>

<a name="Clock"></a>

## Clock
**Kind**: global class  
**Component**:   
<a name="new_Clock_new"></a>

### new Clock()
<p>Simple clock widget for displaying the current time.</p>

<a name="DropDownMenu"></a>

## DropDownMenu
**Kind**: global class  
**Component**:   
<a name="new_DropDownMenu_new"></a>

### new DropDownMenu()
<p>Wraps an Evergreen UI DropDownMenu.</p>

<a name="IFrameView"></a>

## IFrameView
**Kind**: global class  
**Component**:   
<a name="new_IFrameView_new"></a>

### new IFrameView()
<p>Minimal warpper for an <iframe>. Can be toggled between a full screen, active view, and a regular card view.</p>

**Example**  
```js
const my_url = "https://www.youtube.com/embed/tgbNymZ7vqY";
return(
 <IFrameView src = {my_url}/>
)
```
<a name="Toolbar"></a>

## Toolbar
**Kind**: global class  
**Component**:   
<a name="new_Toolbar_new"></a>

### new Toolbar()
<p>Wraps navigation controls</p>


* * *

# Documentation




&copy; 2016-Present NCSU