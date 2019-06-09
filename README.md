# Demo ngChess

Frontend project in Angular 7 for a chess web application.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.5.

The master of this repository is currently deployed on Heroku and available at https://demochess.herokuapp.com (you can use preloaded accounts demo/demo or demo2/demo2). _**Note**: The first load could take a couple of minutes (since the server could be sleeping)_.

# Features

- Account register 
- Play live against another online users
- Play against computer engine on different difficulty levels (Stockfish 10).
- Dashboard with your match history statistics and ELO rating progression
- Board analysis and review of played matches (using Stockfish as analysis module) with opening recognition.
- Over 3k puzzles of different complexity to solve.

# Tech

Most important libraries used:

* [StompJS]
* [ChartJs]
* [Angular Material]
* [NgBootStrap]
* [AngularForms]
* [AngularSvgIcon]
* [AngularAnimations]

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

_**Note:** You will need to change in `src/assets/config/config.dev.json` the URL of the backend spring-boot server with your correct one._

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


