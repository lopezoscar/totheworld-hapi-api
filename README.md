# totheworld-hapi-api
hotels api with hapi

* API Keys (JWT)
* Rate Limit
* Self Documentation (Swagger)
* All input validation
* API Versioning
* All Endpoints Tests
* Authorization with scopes

## API Keys (JWT)
[hapi-auth-jwt2](https://github.com/dwyl/hapi-auth-jwt2) allows me creates JWT tokens that contains data about the apikey 
owner. It's saves the token in a redis session in order to maintain the accounting.

## Rate Limit
I am using the Twitter Rate Limit Scehma [Twitter Rate Limit](https://dev.twitter.com/rest/public/rate-limiting)
with [hapi-rate-limiter](https://github.com/lob/hapi-rate-limiter).
The rateLimitKey is the Authorization header that contains the jwt token.
 
## Self Documentantion (Swagger)
Swagger is used for endpoint documentation and testing. Each endpoint can be tested using swagger
[http://localhost:9090/docs](http://localhost:9090/docs) if you are in development enviroment.

## All input validation
Hapi uses [joi](https://github.com/hapijs/joi) in order to check every endpoint param using simple checks like require or optional or complex regexes.
Also every param has a description that allows to know for what do you use it.

## API Versioning
This project uses [hapi-api-version](https://github.com/p-meier/hapi-api-version) for endpoints versioning.
You can creates differents implementations for the same endpoint. You just have to add the versioning in the path.
For example: /v1/hotels or /v2/hotels
 
## All Endpoints Tests
You can tests with mocha every endpoint. Each endpoint need to be send with the Authorization header unless that the endopint
is a public endpoint.

## Authorization with scopes
There are scopes associated to each apikey.
For example: GET /v1/hotels has the scope hotels:read, if the apikey hasn't the scope, you will got an Insufficient Scopes error.
You can see an example here [hapi-auth-jwt](https://github.com/ryanfitz/hapi-auth-jwt)


## SETUP

### Pre requisites
* MongoDB
* Node.js >= 6.0.0
* Redis

### Install
```javascript
git clone https://github.com/lopezoscar/totheworld-hapi-api
cd totheworld-hapi-api
npm install
//create hotels and user with apikey
npm run setup

//Close the console.

npm start
```

Once that you have the enviroment ok
[api.almundo.com](http://api.almundo.com/)