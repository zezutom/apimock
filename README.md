apimock
=======

A simple API mock based on Node.js and Express. Credit goes to [coderwall](https://coderwall.com/p/ss80vw).

Features
--------
Loads text files (JSON) from filesystem and maps them as responses to HTTP GET calls.

Get Started
-----------
You are going to need Node.js and Express as the corner stones, as well as a bunch of useful modules.

1. Download and install Node.js in whatever way suits you best:
  * Go to the [project site](http://nodejs.org), download an installer and run it
  * on Mac OS / Linux run `brew install node`
2. Install Express by running `npm install -g express`. Should you hit failures just run the same command using `sudo`
3. To be able to generate the app you also have to install a module called express-generator, hence: `npm install -g express-generator`
4. Go to the install directory `cd apimock` and install (locally! i.e. without the `-g` option) a module called glob: `npm install glob`

Usage
-----
1. Add your JSON files to the directory `/test/mocks/api`
2. Go to the install directory: `cd apimock`
3. Fetch all of the dependencies: `npm install` 
4. Finally, start the app:
  * `npm start` (a restart is required every time any change is made) OR
  * `nodemon app.js` (only requires a restart if a new file has been added to the app)

In the web browser go to `http://127.0.0.1:8080`
  * The page will complain there is no mapping for '/', but that's okay

Test it out! Use the example data to verify the saved responses have been correctly mapped:
  * `http://127.0.0.1:8080/api/customers`
  * `http://127.0.0.1:8080/api/friends`

