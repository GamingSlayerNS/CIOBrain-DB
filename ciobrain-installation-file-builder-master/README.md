# CIOBrain Native

CIOBrain Native leverages Electron to combine CIOBrain and CIOBrain API into a single Desktop application. Build installers for Mac, Windows, and Linux.

## Create CIOBrain Installer

[Node.JS](https://nodejs.org/) is required for setting up.
[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) is recommended to install dependencies.

1. Clone this repository by clicking the green **Code** button and tapping the copy button next to the repo link.
![Copying repo link](https://i.imgur.com/ECjo66R.png)
2. In your terminal, navigate to a directory on your computer where you would like the project to be located at. Run `git clone https://github.com/antonhi/ciobrain-native.git`.
3. Run `cd ciobrain-native && yarn` to install dependencies.
4. Package the application based on a target platform. `yarn electron:package:mac`, `yarn electron:package:win`, and `yarn electron:package:linux` will build an installer for the application based on each platform. Run one of these commands in your terminal to create a distribution directory with the installer inside.
5. Once the installer has been created, it will be located in the `dist` directory. You can then install and run the application as normal.

## Credits
https://mmazzarolo.com/blog/2021-08-12-building-an-electron-application-using-create-react-app/
