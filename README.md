# PCM App

PCM is a Aries mobile agent app. This is a project that has been created to focus the community's efforts towards a central open source project. Various different organizations and people have expressed interest in a open source community project to help focus efforts to help prevent duplication of work between projects. PCM is also intended to help get complex or specific use-case projects started faster by cloning and having a basis of an Aries agent.

## Code

This project utilizes [Aries Framework Javascript (AFJ)](https://github.com/hyperledger/aries-framework-javascript) and [indy-sdk-react-native](https://github.com/hyperledger/indy-sdk-react-native).

## Project State

### Platform

PCM currently is built on React Native 0.66.4

As of now PCM targets Android API 30.0.2

iOS targets iOS 10.0+.PCM can only be run on physical devices as of right now.

## Install

1. React Native Setup:
   - React Native installation instructions are documented [here](https://reactnative.dev/docs/environment-setup).
   - (iOS) Install [Cocoa Pods](https://cocoapods.org/)
2. Clone the Bifold repo and install its dependencies:
   ```sh
   git clone https://code.vereign.com/gaiax/pcm/app/-/tree/develop
   cd APP
   npm install
   ```
3. (iOS) iOS specific install:
   - Install iOS Pods:
     ```sh
     cd ios
     pod install
     ```
   - In the /ios directory, open the project workspace file in Xcode.
     Once the project is open, navigate to the project's Signing & Capabilities tab and apply your personal Apple Developer Account or your organization's team to target AriesBifold and target AriesBifoldTests.
   - Adjust the bundle identifier if needed.

## Configure

In the root directory add an `.env.development` file containing:

## Run

- Launch the metro bundler:
  ```sh
  npm run start
  ```
- Open a second terminal and run:
  - (Android)
    ```sh
    npm run android
    ```
  - (iOS)
    ```sh
    npm run ios
    ```
  - (iOS) Via Xcode:
    Choose your physical iOS device as the destination. Click the "Play" button to Build and Run.

**NOTE: PCM does not work on iOS simulators** -- use a physical device instead.

### Advanced Configuration

#### Mediator

In order to use PCM, you must have a mediator to use with the app. Bifold is configured to use 'Implicit' mediation and requires a mediator that supports the [coordinate-mediation protocol](https://github.com/hyperledger/aries-rfcs/tree/main/features/0211-route-coordination).
Bifold by default utilizes the [Indicio Public Mediator](https://indicio-tech.github.io/mediator/), which utilizes ACA-Py. For running your own ACA-Py mediator more details can be found [here](https://github.com/hyperledger/aries-cloudagent-python/blob/main/Mediation.md).

## Troubleshooting

#### Hot Reloading

Hot reloading may not work correctly with instantiated Agent objects. Reloading (`r`) or reopening the app may work. Any changes made to native modules require you to re-run the compile step.

### Dependency Issues, Native Module Linking Issues, or Usage Issues

If you end up changing dependencies or structures, you may need to perform the following steps:

#### Android

```sh
rm -rf node_modules
npm install
```

Clean the Android build:

```sh
cd android
./gradlew clean
cd ..
```

Start and clean the Metro cache:

```sh
npm run start
```

In your second terminal, you can now run:

```sh
npm run android
```

## License

[Apache License Version 2.0](./LICENSE)
