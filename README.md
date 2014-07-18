apimock
=======

A simple and easy-to-use http proxy. Does your project depend on 3rd party APIs? Don't let your productivity suffer by frequent down times. Capture the responses, adjust them to your needs and off you go! Everything is stored as plain text files. Looking to automate your tests? Make them stable, predictable and completely independent from external data providers.

Inspired by an excellent blogpost at [coderwall](https://coderwall.com/p/ss80vw).

Features
--------
* handles GET and POST requests
* customizable MIME types, tested with json and xml
* externalize your project configuration (you don't have to deal with apimock's own files)
* high transparency, no database, just plain text files

Get Started
-----------
1. Install Node.js [Node.js](http://nodejs.org)
2. cd to apimock's root directory and run `npm start`

Usage
-----
1. Create a configuration file in a directory of your choice
2. In your application replace links to 3rd-party API(s) with a url of the apimock, for ex.:  `http://localhost:8082`
3. Start apimock:  `start.sh your_config_dir`

Done. All requests towards the 3rd-party API(s) are mediated via apimock. When an API call is made, apimock either returns a previously saved response, or proceeds with the request, captures and saves the API response.

### Example
TBC



