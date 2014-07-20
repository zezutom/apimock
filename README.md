# apimock
A simple and easy-to-use http proxy. Does your project depend on 3rd party APIs? Don't let your productivity suffer by frequent down times. Capture the responses, adjust them to your needs and off you go! Everything is stored as plain text files. Looking to automate your tests? Make them stable, predictable and completely independent from external data providers.

Inspired by an excellent blogpost at [coderwall](https://coderwall.com/p/ss80vw).

## Contents

- [Features](#features)
- [Get Started](#get-started)
- [Configuration](#configuration)
  - [Server](#server)
  - [Routes](#routes)
    - [Common Attributes](#common-attributes)
    - [GET Handling](#get-handling)
    - [POST Handling](#post-handling)
- [Examples](#examples)
  - [HTTP GET](#http-get)
  - [HTTP POST](#http-post)

## Features
* handles GET and POST requests
* customizable MIME types, tested with json and xml
* externalize your project configuration (you don't have to deal with apimock's own files)
* high transparency, no database, just plain text files

## Get Started
1. Install Node.js [Node.js](http://nodejs.org)
2. cd to apimock's root directory and run `npm install`
3. Create a configuration file in a directory of your choice
4. In your application replace links to 3rd-party API(s) with a url of the apimock, for ex.:  `http://localhost:8082`
5. Start apimock:  `start.sh your_config_dir`

Done. All requests towards the 3rd-party API(s) are mediated via apimock. When an API call is made, apimock either returns a previously saved response, or proceeds with the request, captures and saves the API response.

## Configuration
In the configuration directory of your choice, create a file called `default.json`. Example:
```
{
    "Server": {
        "host": "localhost",
        "port": 8082
    },
    "Routes": [
        {
            "url": "http://3rd-party-api.com",
            "source": "/data",
            "target": "/api",
            "type": "application/json"
        },
        {
            "url": "http://3rd-party-api.com",
            "source": "/data",
            "target": "/login",
            "type": "application/json",
            "method": "POST",
            "postMap": ["username"]
        },
        {
            "url": "http://3rd-party-api.com",
            "source": "/data",
            "target": "/account",
            "type": "application/json",
            "method": "POST",
            "postMap": ["accountNumber"]
        },
        ...
    ]
}
```
As you can see the configuration file comprises two main sections `Server` and `Routes`. Let's talk about each in detail.
### Server
```
{
    "Server": {
        "host": "localhost",
        "port": 8082
    } 
    ...
}
```
The `Server` determines the hostname and the port the apimock will be running on. 

#### host
Typically, you will want to run it locally, thus `localhost` or `127.0.0.1` will suffice. In certain cases you might want to run it on a dedicated server. For instance, when you use apimock as data storage for a larger test automation.

#### port
I typically have ports 8080 and 8081 occupied by some kind of a web server (Tomcat, Jetty etc.), so I made the port 8082 the default. Feel free to change it to whatever port number you are comfortable with.


### Routes
```
{
   ...
    "Routes": [
        {
            "url": "http://3rd-party-api.com",
            "source": "/data",
            "target": "/api",
            "type": "application/json"
        },
        {
            "url": "http://3rd-party-api.com",
            "source": "/data",
            "target": "/login",
            "type": "application/json",
            "method": "POST",
            "postMap": ["username"]
        },
        {
            "url": "http://3rd-party-api.com",
            "source": "/data",
            "target": "/account",
            "type": "application/json",
            "method": "POST",
            "postMap": ["accountNumber"]
        },
        ...
    ]
}
```
You can have as many routes as you want. It all depends on how many 3rd party APIs you connect to, and how each of them is used. There are essentially two types of routes: one type deals with HTTP GET whereas the other one is suited for HTTP POST. Let's take a look what both of route types have in common and then what makes them specific.

#### Common Attributes
```
  {
      "url": "http://3rd-party-api.com",
      "source": "/data",
      "target": "/api",
      "type": "application/json",
      "suffix": ".json"
  }
```
A route is determined by at least four attributes: `url`, `source`, `target` and `type`. Optionally, you can also specify a `suffix`

##### url
Points to the 3rd-party API. That's the link being proxied by apimock. Anytime you make request towards apimock, and there is no cached response for your request just yet, apimock will connect to the actual API by using the specified link.

##### source
That's where the cached responses are being stored. Simply put, your data directory. Everything is stored as plained text, so go and explore the stored files. The best part is that those files are read on-the-fly, so you will see your changes instantly, i.e. as soon as you make the same request again.

##### target
This is the actual route, a relative link associated with the particular route settings. In our example, every time you make a HTTP GET request towards apimock, such as: `http://localhost:8082/api?call=getUserDetails&username=john`, the apimock knows that the actual API call translates to `http://3rd-party-api.com?call=getUserDetails&username=john`.

##### type
Specifies the response content type. That's important for correct data parsing and handling by the browser.

##### suffix
Makes part of the filename of each and every cached response in a form of a file suffix. For instance, knowing you deal with JSON format, it's a good idea to let the files be stored as '.json'.

#### GET Handling
GET responses are fully determined by the settings described above, i.e.:
```
  {
      "url": "http://3rd-party-api.com",
      "source": "/data",
      "target": "/api",
      "type": "application/json",
      "suffix": ".json"
  }
```
The remaining question is how are the captured responses actually saved. Well, it's very simple. The file name of any saved responses corresponds to the URL-encoded string of the relevant GET request. Example:

A response to this request `http://localhost:8082/api?call=getUserDetails&username=john` 
will be saved as `api%3Fcall%3DgetUserDetails%26username%3Djohn.json`

Naturally, each and every intercepted request is first compared (URL-encoded) to the stored filenames. Should a file be found, the request is dropped and the content of the file is returned as a response to the client.

#### POST Handling
```
  {
      "url": "http://3rd-party-api.com",
      "source": "/data",
      "target": "/login",
      "type": "application/json",
      "method": "POST",
      "postMap": ["username"]
  }
```
In case of a POST requests, it's the request body which plays the dominant role. The content of the body is parsed and compared to the path specified by `postMap`. Example:

Suppose, this is the POST request body
```
{  "username":"tom" }
```
and this is the corresponding configuration
```
"postMap": ["username"]
```
then, apimock knows it should look for the key called 'username' when inspecting the body and use the found value as well. Thus, it saves the relevant response as `username_tom.json`.

Again, the next time the same request body is captured it is compared against the stored files. If the file called `username_tom.json` is found, the POST request is dropped and the file content is returned as a respponse to the client.

Unlike GET requests, the POST handling requires a little bit of preparation, so that the postMap comprises correct paths.

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

