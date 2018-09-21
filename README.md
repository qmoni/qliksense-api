# Best Wrapper For Qlik Sense API


Getting tired of trying to connect to Qlik Sense API? The easiest way to connect with Qlik Sense. A lightful wrapper for Qlik Sense made by developer to developer :)

##### IMPORTANT -  This package is under construction, feel free to contribuite, open issues or contact.


## Getting Started

This package is designed to be the simplest way possible to connect to Qlik.
### Prerequisites

* Export Qlik Sense Certificates ([qlik help documentation](https://help.qlik.com/en-US/sense/June2018/Subsystems/ManagementConsole/Content/export-certificates.htm))


### Installing
```

npm i qliksense-api --save

```


### Starting

```

const qlikapi = require('qliksense-api')

let qlik = qlikapi.createClient({
  key: "./certificates/client_key.pem",  //path to certificates
  cert: "./certificates/client.pem",
  ca: "./certificates/root.pem"
})

```

## QSR

### Get /about Path

```
qlik.getAbout().then((res)=>{
    console.log(res)
})
```
or Async/Await :

```
let res = await qlik.getAbout()
console.log(res)
```

### Get Functions:

* qlik.getApps()
* qlik.getHealthCheck()
* qlik.getExecutionResult()
* ... More to come

### Get Generic Path

You can see the full list of QSR endpoints path [here](https://help.qlik.com/en-US/sense-developer/June2018/apis/repositoryserviceapi/index.html)

```
const path = 'repositoryservice/full'
qlik.getQsr(path).then((res)=>{
    console.log(res)
})
```
or Async/Await :

```
const path = 'repositoryservice/full'
let res = await qlik.getQsr(path)
console.log(res)
```

## QPS

### Generating Session
The session solution allows the Qlik Sense Proxy Service (QPS) to use a session from an external system to validate who the user is.

```
let username =  'userExemple'
let userRepository = 'repositoryExemple'
qlik.generateSession(userRepository, username).then((res)=>{
    console.log(res)
})
```
or Async/Await :

```
let username =  'userExemple'
let userRepository = 'repositoryExemple'
let res = await qlik.generateSession(userRepository, username)
console.log(res)
```

### Get Session

```
let sessionId =  'ed0671860b754b92df7c2e9c6cea4a7f'
qlik.getSession(sessionId).then((res)=>{
    console.log(res)
})
```
or Async/Await :

```
let sessionId =  'ed0671860b754b92df7c2e9c6cea4a7f'
let res = await qlik.getSession(sessionId)
console.log(res)
```

### Delete Session

```
let sessionId =  'ed0671860b754b92df7c2e9c6cea4a7f'
qlik.deleteSession(sessionId).then((res)=>{
    console.log(res)
})
```
or Async/Await :

```
let sessionId =  'ed0671860b754b92df7c2e9c6cea4a7f'
let res = await qlik.deleteSession(sessionId)
console.log(res)
```

## Qlik Engine API
The Qlik Engine API consists of a set of objects representing apps, lists, and so on.

[Qlik Engine API - DOC](https://help.qlik.com/en-US/sense-developer/June2018/Subsystems/EngineAPI/Content/introducing-engine-API.htm)

## Global Class
All the methods available can be found [here](https://help.qlik.com/en-US/sense-developer/June2018/apis/EngineAPI/services-Global-AbortAll.html)

```
let method = 'GetDocList'
let params = []
qlik.engine(method, params).then((res)=>{
  console.log(res)
})
```

or Async/Await:

```
let method = 'GetDocList'
let params = []
let res = await qlik.engine(method)
console.log(res)
```

## App Class
All the methods available can be found [here](https://help.qlik.com/en-US/sense-developer/November2017/Subsystems/EngineAPI/Content/Classes/AppClass/App-class-AbortModal-method.htm)

```
let appId = '9586b50f-4df2-400e-8b4a-69874a7dcc3e'
let method = 'GetAllInfos'
let params = []
qlik.OpenDoc(appId, method, params).then((res)=>{
  console.log(res)
})
```

or Async/Await:

```
let appId = '9586b50f-4df2-400e-8b4a-69874a7dcc3e'
let method = 'GetAllInfos'
let params = []
let res = await qlik.OpenDoc(appId, method, params)
console.log(res)
```


## Authors

* [**Rodolfo Viola**](https://github.com/rodolfoviolac) - *Initial work*

See also the list of [contributors](https://github.com/qmoni/qliksense-api/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
