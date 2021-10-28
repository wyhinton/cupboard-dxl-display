![Cuboard](.github/CUBOARD_LOGO_CENTERED.svg)

<p align="center">
<img src = "https://github.com/wyhinton/dx_display_iframe_prototype/actions/workflows/firebase.js.yml/badge.svg">
<img src = "https://img.shields.io/badge/License-MIT-yellow.svg">
<img src = "https://badges.aleen42.com/src/typescript.svg">
<img src = "https://badges.aleen42.com/src/react.svg">
</p>

# Cuboard

**Cuboard is an open source content-sharing app built with touch screens in mind. Cuboard is a starting point for your display app project.**

Out of the box, Cuboard allows you to curate and design attractive masonry displays for digital signage. Load your content from links into a **Card**, then arrange cards to form a **Layout**. Select a layout from your layout collection, or cycle between layouts.

Your cards and layouts are provided client side by a Google Sheet, while a Google Form Embed allows you to author and save new layouts. We've provided templates for both of these, and instruction on how to connect them to them to Cuboard.

Built with React and Typescript, Cuboard has a heavy focus on providing an excellent developer experience. Components and app structure are thoroughly documented, and a high level AppConfig gives you quick access to high level design choices.

# Live Demo

- https://iframeprototype-83a96.web.app/

# Features

- Proven, scalable, and easy to understand project structure
- Written in modern React, only functional components with hooks
- Centralized and easy to debug state management with easy-peasy

# Backend Setup

To set up your custom backend, just follow these steps:

## Setup a Google Sheet for your Content

This sheet will store the list of available content to use in your display. Cuboard will fetch this sheet.

1. Create a copy of [this template google sheet](https://docs.google.com/spreadsheets/d/1BR1AQ5Zmt_o_0dOm9AvDht0G3Q6RXQUhX71Vi4H7tTU/edit?usp=sharing)
2. In your new sheet, got to File>Publish to Web. Select "Entire Document" and "Comma-seperated values (.csv)".
3. Hit the "Share" button, make sure permissions are set to "Anyone with link", then hit "Copy Link" and

## Setup a Google Form for adding New Layouts

This form allows you to push new layouts to a google sheet.

1. Create a copy of [this google form](https://docs.google.com/forms/d/1Y2621OA3qI_Cv-Tf5zZvlV0pzVQWq2XUi90odYThzeY/edit?usp=sharing).
2. Go to Responses, then click the Google Sheets Icon to connect the from to the Google Sheet.
3. Select the sheet you created in Part 1.

## Add From Links to appConfig.ts

Now connect the app to your form and sheet by supplying the links to `static/appConfig.ts`:

```typescript
const appConfig: AppConfig = {
  idleTime: process.env.NODE_ENV === "development" ? 100000000 : 10000000,
  sheetLink: YOUR_SHEET_LINK,
  formLink: YOUR_FORM_LINK,
};

export default appConfig;
```

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

### Dev Environment

When developing your Cuboard, we suggest the following plugins:

### Chrome Plugins

- [Redux DevTool](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) - for debugging application's state
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) - inspect the React component hierarchies

### Working with Iframes

- https://www.tinywebgallery.com/blog/advanced-iframe/free-iframe-checker

# Libraries

- [react-use](https://github.com/streamich/react-use#readme) - Provides useful hooks for event handling like `useIdle` and `useLongPress`
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
