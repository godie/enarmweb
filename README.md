# ENARM Web Application

## Project Description

This project is a web application designed to help users prepare for the ENARM exam. It includes features such as user authentication, exam simulations, case studies, and progress tracking.

## Installation

To install the project dependencies, navigate to the project directory in your terminal and run:

```bash
npm install
```

Alternatively, if you are using Yarn:

```bash
yarn install
```

## Running the Project

To start the development server and run the project locally, use the following command:

```bash
npm start
```

Or, if you are using Yarn:

```bash
yarn start
```

This will typically open the application in your default web browser at `http://localhost:3000`.

## Configuration

### Google Analytics

*   **GA ID:** `UA-2989088-15`
*   **Location:** The Google Analytics ID is configured in the file `src/components/AnalyticsTracker.js`.

### Facebook Integration

*   **Facebook App ID:** `401225480247747`
*   **Location:** The Facebook App ID is configured in the file `src/components/facebook/FacebookLoginContainer.js`. It is also used as a prop in the `src/components/facebook/FacebookComments.js` component.
