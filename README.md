# SnapNews

## Setting up the development environment

Refer to [docs/dev_environment.md](docs/dev_environment.md) for the dev environment setup.

## Using this monorepo

You should navigate to the appropriate directory for the module you want to work on before doing anything.

For example, to work on the mobile app, navigate to the `mobile` directory:

```powershell
cd mobile
```

Please do not run `npm install` at the root level, it will:

1. Not useful as the dependency gets installed at root and not in the appropriate directory.
2. Will break the build as the dependency is not installed in the appropriate directory.

## Running the project

The project contains the following modules, choose one:

1. [App](#Mobile-App)
2. [API](#API)
3. [Admin](#Admin)

## App

Go to the app directory by running:

```powershell
cd app
```

Install the dependencies by running:

```powershell
npm install
```

Run the app by running:

```powershell
npx expo run:android
```

Alternatively, you can start the web version by running:

```powershell
npx expo start --web
```

## API

Don't touch :)

## Admin

Don't touch for now
