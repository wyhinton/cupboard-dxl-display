![Cuboard](https://raw.githubusercontent.com/NCSU-Libraries/cupboard-dxl-display/0b90de8f971c45bd8ceb366ae63aeb7fa82fdc20/public/CUBOARD_LOGO_CENTERED.svg)

<p align="center">
<img src = "https://github.com/wyhinton/dx_display_iframe_prototype/actions/workflows/firebase.js.yml/badge.svg">
<img src = "https://img.shields.io/badge/License-MIT-yellow.svg">
<img src = "https://badges.aleen42.com/src/typescript.svg">
<img src = "https://badges.aleen42.com/src/react.svg">
</p>

# Cupboard

**Cupboard is an open source content display app built with touch screens in mind. Deploy your beautiful Cupboard display to GitHub Pages in no time with our installation and setup tutorial, no javascript or react experience required!**

# Live Demo

- https://github.com/NCSU-Libraries/cupboard-dxl-display

# Features

- Author and save new masonry Layouts
- Display images, iframe embeds, entire webpages, or videos
- Fully featured Editor allows you to resize, delete, and add cards to a layout visually
- Attractive design and streamlined user interface
- Proven, scalable, and easy to understand project structure

# Design

Out of the box, Cupboard allows you to curate and design attractive masonry displays for digital signage. Load your content from links into a **Card**, then arrange cards to form a **Layout**. Select a layout from your layout collection, or cycle between layouts.

Your cards and layouts are provided client side by a Google Sheet, while a Google Form Embed allows you to author and save new layouts. We've provided templates for both of these, and instruction on how to connect them to them to Cupboard.

# Backend Setup

To set up your custom backend, just follow these steps:

## Setup a Google Sheet for your Content

VIDEO

### Dev Environment

When developing your Cuboard, we suggest the following plugins:

### Chrome Plugins

- [Redux DevTool](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) - for debugging application's state
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) - inspect the React component hierarchies

### Working with Iframes

- https://www.tinywebgallery.com/blog/advanced-iframe/free-iframe-checker

# Libraries

- [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) - Draggable and resizable grid layout with responsive breakpoints. Used for editing and display our card layotus.
- [evergreen-ui](https://github.com/segmentio/evergreen) - React UI framework. Provides some componets for things like Buttons, Menus, etc., that work well with the projects design language. Allows us to avoid having to basic UI components from scratch.
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

&copy; 2016-Present NCSU
