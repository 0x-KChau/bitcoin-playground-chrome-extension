# Disclamer 

This is an open-source Bitcoin Playground Chrome extension under the terms of the MIT LICENSE. Written in `TypeScript` and bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Various open source libraries are being used, including but not limited to `bip39`, `bitcoinjs-lib`, and `wallet-address-validator`. They are the three major 3rd party libraries apart from React.

# Getting Started

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


## Upload Chrome/Brave extension

1. After `yarn build`
2. Open the Extension Management page by navigating to chrome://extensions.
3. Enable Developer Mode by clicking the toggle switch next to Developer mode.
4. Click the Load unpacked button and select the extension directory (`/build` directory).

See the section about [Chrome Extentions](https://developer.chrome.com/docs/extensions/mv3/getstarted/) for more information.
