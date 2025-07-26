#!/bin/bash


## Run `npx expo run:android` to build the app for Android and install the debug version
## This is needed for proper hot reloading of the app

echo "⚠️ If the app is not refreshing, consider running 'npx expo run:android'"

export ADB_SERVER_SOCKET=tcp:localhost:5037
echo "ADB_SERVER_SOCKET: $ADB_SERVER_SOCKET"

cd mobile && npx expo start --dev-client --tunnel