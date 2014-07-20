# apimock
A simple and easy-to-use http proxy. Does your project depend on 3rd party APIs? Don't let your productivity suffer by frequent down times. Capture the responses, adjust them to your needs and off you go! Everything is stored as plain text files. Looking to automate your tests? Make them stable, predictable and completely independent from external data providers.

Inspired by an excellent blogpost at [coderwall](https://coderwall.com/p/ss80vw).

[[toc]]

## Features
* handles GET and POST requests
* customizable MIME types, tested with json and xml
* externalize your project configuration (you don't have to deal with apimock's own files)
* high transparency, no database, just plain text files

## Get Started
1. Install Node.js [Node.js](http://nodejs.org)
2. cd to apimock's root directory and run `npm start`

## Usage
1. Create a configuration file in a directory of your choice
2. In your application replace links to 3rd-party API(s) with a url of the apimock, for ex.:  `http://localhost:8082`
3. Start apimock:  `start.sh your_config_dir`

Done. All requests towards the 3rd-party API(s) are mediated via apimock. When an API call is made, apimock either returns a previously saved response, or proceeds with the request, captures and saves the API response.

## Examples
### HTTP GET
Suppose your application is a simple dictionary powered by [Glosbe API](http://glosbe.com/a-api). The complete app is available at `examples/directory`.

Here is how the API is used (copy-paste from Glosbe documentation):
* Translate Polish 'witaj' into English, output format is json: http://glosbe.com/gapi/translate?from=pol&dest=eng&format=json&phrase=witaj&pretty=true
* Translate English 'cat' into French, include example sentences as well, output is xml: http://glosbe.com/gapi/translate?from=eng&dest=fra&format=xml&phrase=cat&pretty=true

Now, let's take a look at how to break a direct dependency on Glosbe API by using apimock.

#### 1. Create a configuration file
`examples/dictionary/config/default.json`:
```
{
    "Server": {
        "host": "localhost",
        "port": 8082
    },
    "Routes": [
        {
            "url": "http://glosbe.com/gapi/translate",
            "source": "/data",
            "target": "/api",
            "type": "application/json"
        }
    ]
}
```

#### 2. Replace links to 3rd-party API with apimock
`examples/dictionary/routes/index.js`:

```javascript
var apiUrl = 'http://localhost:8082/api?from=' + from + '&dest=' + to + '&format=json&phrase=' + word + '&pretty=true';
```

#### 3. Start apimock
A custom start-up script comes in handy, see `examples/dictionary/start.sh`:

```bash
nohup ../../start.sh $(pwd)/config  > ./logs/apimock.log 2>&1 &
npm start
```

#### 4. Make a few API calls and observe the saved responses
Use the dictionary app to make a few translation and note how responses are being saved.

`examples/dictionary/config/data/`:
```
api%3Ffrom%3Deng%26dest%3Dpol%26format%3Djson%26phrase%3Dhello%26pretty%3Dtrue
api%3Ffrom%3Deng%26dest%3Dpol%26format%3Djson%26phrase%3Dhi%26pretty%3Dtrue
api%3Ffrom%3Deng%26dest%3Dspa%26format%3Djson%26phrase%3D%26pretty%3Dtrue
api%3Ffrom%3Deng%26dest%3Dspa%26format%3Djson%26phrase%3Dhello%26pretty%3Dtrue
api%3Ffrom%3Deng%26dest%3Dspa%26format%3Djson%26phrase%3Dhow%26pretty%3Dtrue
api%3Ffrom%3Dpol%26dest%3Deng%26format%3Djson%26phrase%3Dwitaj%26pretty%3Dtrue
```
Open any of the saved responses in a text editor and make changes to the response data. Note, that your modified translations are used instead of the actual API responses. That proves apimock works as it should and uses cached data instead of making calls to the underlying API.

### HTTP POST
Let's take a look at a simple login form to see how POST requests are handled. The complete app is available at `examples/simple-login`.

Here is the deal:
* The app comprises a web client and an authentication service
* The client exposes a simple login form
* The captured details are submitted to the authentication service
* The service responds either with full user details or an error message

Example of a successfull validation:
```json
{  
   "username":"thedude",
   "details":{  
      "firstName":"John",
      "lastName":"Doe",
      "email":"thedude@gmail.com",
      "balance":"100$"
   },
   "valid":true
}
```
Example of an error message:
```json
{  "username":"tom", "details":{}, "valid":false }
```
Once again you can mediate access to the authentication service via the apimock and capture the received responses to POST requests.

apimock configuration:
```
{
    "Server": {
        "host": "localhost",
        "port": 8082
    },
    "Routes": [
        {
            "url": "http://localhost:8081/login",
            "source": "/data",
            "target": "/login",
            "suffix": ".json",
            "type": "application/json",
            "method": "POST",
            "postMap": ["username"]
        }
    ]
}    
```
Notice the extra configuration options `"method": "POST"` and `"postMap": ["username"]`. These are essential for the correct response recording and matching. `"method": "POST"` makes the apimock aware of the fact that the settings relate to HTTP POST. Secondly, the `"postMap": ["username"]` suggests how to match the POST request body against cached files or how to store the received response if no match is found. Again, an example is worth a thousand words:

1. The client submits a POST requests providing `tom` as username
```json
{  "username":"tom" }
```
2. The request is intercepted by apimock, which at this time has no corresponding data, so it let's the authentication service process the request
3. The authentication service has no records about the user `tom` and returns therefore an error message:
```json
{  "username":"tom", "details":{}, "valid":false }
```
4. The response is captured by apimock and, in sync with the hint specified in the `postMap` setting, saves it as `username_tom.json`:
```json
{  "username":"tom", "details":{}, "valid":false }
```
From this point on, apimock will never go back to the authentication service to obtain details of that user. Instead, it replies back to the client with whatever is stored as `username_tom.json`. This way you can easily modify the persisted response and turn the error message into a fictional valid user:

~~{  "username":"tom", "details":{}, "valid":false }~~

```json
{  
   "username":"tom",
   "details":{  
      "firstName":"Tomas",
      "lastName":"Zezula",
      "email":"zezulatomas@gmail.com",
      "balance":"1000$"
   },
   "valid":true
}
```

