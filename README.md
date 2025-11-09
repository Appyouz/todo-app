# AbaTask: Todo App


> *Initial Testing Release (v1.0.0-beta.1)*

<table width="100%">
  <tr>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/Appyouz/todo-app/main/assets/screenshots/1000028850.png" width="90%" alt="Screenshot of the AbaTask todo list"/>
      <br>
     <b> Main Task List</b>
    </td>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/Appyouz/todo-app/main/assets/screenshots/1000028848.png" width="90%" alt="Screenshot of the AbaTask 20-minute focus timer"/>
      <br>
      <b>Focus Timer (20 min)</b>
    </td>
    <td align="center" width="33%">
      <img src="https://raw.githubusercontent.com/Appyouz/todo-app/main/assets/screenshots/1000028847.png" width="90%" alt="Screenshot of the AbaTask Archive list"/>
      <br>
      <b>Task Archive</b>
    </td>
  </tr>
</table>

AbaTask is a mobile todo app that helps users work without distractions. It is especially helpful for those who often put things off. The app aims to break tasks into smaller parts. It does this by limiting the number of characters for each task. This encourages users to create smaller tasks. The app also includes a simple focus timer to enhance concentration. It prevents users from navigating away until the session is over.

## Features:
* **Fixed Focus Sessions:** Start a 20-minute(pomodoro technique) timer for any task. The app keeps users focused by locking the screen until the timer ends or the task is marked as complete.
* **Time Tracking:** Tracks the actual time spent on tasks, regardless of whether they are finished successfully or not.
* **Task Management (CRUD):** Easily add, edit, complete, and archive tasks.
* **Clean UI:** A simple, high-contrast interface designed for quick task entry and focus.
* **Modular Architecture:** Built with clean, reusable components for easy maintenance.

---

## Tech Stack

* **Framework:** React Native (Expo)
* **Navigation:** Expo Router
* **State Management:** React Context 
* **Styling:** Tailwind CSS (via `Nativewind`)
* **Persistence:** AsyncStorage
* **Timers/UX:** `setInterval`, `expo-haptics` (vibration feedback)

---

## Critical Warnings & Notes

> ### No Background Notifications
**Please note:** This initial version does not include local notifications. If you switch away from the AbaTask app or lock your screen during the 20-minute focus session, you **will not** receive an alert when the timer ends. You must keep the app visible or check back manually.

> ### Data Persistence Note
Data (tasks, archives) is stored locally on your device using **AsyncStorage**. While stable, this is a beta. **Uninstalling the app will delete all local data.**

---

## Installation & Distribution

### 1. Direct Sideloading (Testing/Beta)

This is the simplest way to test the app without using the Google Play Store.

1. **Download:** Download the latest **`abatask-v1.0.0-beta.1.apk`** file from the [Releases page](https://github.com/Appyouz/todo-app/releases/tag/v1.0.0-beta.1).
2. **Sideload:** On your Android device, go to **Settings** and temporarily allow installation from "Unknown Sources" or the browser you used to download the file.
3. **Install:** Tap the downloaded file to install the application.

### 2. Building from Source (Developers)

To run the project locally:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Appyouz/todo-app.git
    cd todo-app
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Run the application (in Expo Go):**
    ```bash
    npx expo start
    ```
A QR code will appear in your terminal or web browser. **Scan this QR code** using the **Expo Go** app on your Android or iOS device to quickly load the application for live development and testing.

---

## Building a Standalone APK

To create the distribution files using **Expo Application Services (EAS) Build**, follow these steps.

### For Sideloading (`.apk` file):

This uses the `preview` profile to create a standard, sideloadable `.apk` file for testing. Make sure to install [eas-cli](https://docs.expo.dev/build/setup/).
```bash
# Make sure eas.json is set up with "buildType": "apk" in the preview profile
eas build --platform android --profile preview
```
