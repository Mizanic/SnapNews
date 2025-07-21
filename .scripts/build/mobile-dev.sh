#!/bin/bash

export ADB_SERVER_SOCKET=tcp:localhost:5037
echo "ADB_SERVER_SOCKET: $ADB_SERVER_SOCKET"

cd mobile && npx expo start --dev-client --tunnel