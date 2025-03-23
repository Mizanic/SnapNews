## Configurating Dev Environment

### Prerequisites

Recommended configuration:

-   Node.js
-   Git
-   IDE of your choice
-   Terminal (Windows Terminal)

Based upon you OS choose one of the following:

-   Windows
-   MacOS

## Windows: Getting Started


### 1. Install Microsoft Terminal

1. Get Microsoft Windows Terminal from [here](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-us&gl=us)
2. Install Microsoft Windows Terminal

### 2. Install Winget

WinGet the Windows Package Manager is available on Windows 11, modern versions of Windows 10, and Windows Server 2025 as a part of the App Installer. The App Installer is a System Component delivered and updated by the Microsoft store on Windows Desktop versions, and via Updates on Windows Server 2025.

Check if you have Winget installed by running `winget --version` in your terminal.

If you don't have it installed, you can install it by running the below in your PowerShell terminal:

```powershell
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
```

### 3. Install NVM for Windows

1. Get NVM for Windows from [here](https://github.com/coreybutler/nvm-windows/releases/download/1.2.2/nvm-setup.exe). 
2. Install NVM using the installer.
3. Restart your terminal and check if NVM is installed by running `nvm --version`
4. Use NVM to install NodeJS 22 by running `nvm use 22`
5. Check if NodeJS is installed by running `nvm list`
6. Restart your terminal and if paths are configured correctly, run `node -v`

### 2. Installing Git

1. Use Winget to install Git by running `winget install --id Git.Git -e --source winget`
2. Check if Git is installed by running `git --version`

### 3. Installing IDE

1. Install VSCode from [here](https://code.visualstudio.com/download). Do not use Winget and it's VSCode version is quite old.
2. Install the following extensions:
    - Prettier  (esbenp.prettier-vscode)
    - ESLint (dbaeumer.vscode-eslint)
    - NPM Intellisense (christian-kohler.npm-intellisense)

### 4. Install Android Studio and Platform Tools (Pending)

1. Install Android Studio from [here](https://developer.android.com/studio)
2. Install Platform Tools
3. Configure Android SDK Path

### 5. Install Java JDK

1. Install Java by running `winget install Microsoft.OpenJDK.21`
2. Check if Java is installed by running `java -version`

### 6. Setup Emulator (Optional)

1. Create AVD (Android Virtual Device)
2. Create AVD with Pixel 6 Pro API 33
3. Start AVD

## Starting the project

1. Clone the repository by running `git clone https://github.com/entropic-tech/SnapNews.git`
2. Navigate to appropriate directory by running `cd SnapNews/<module>`
3. Install dependencies by running `npm install`
4. Start the project by running `npx expo run:android`


### Running the project

1. Start the project by running `npx expo run:android`

## Pre Commit Checks - To be configured (Pending)

1. Prettier
2. ESLint


