'use strict'

const unifyOptions = require('./libs/createClient');
const requestOptions = require('./libs/requestOptions');
const socket = require('./libs/socketConnection');
const https = require('https');
const path = require('path');
const helpers = require('./libs/helpers')

function QlikConnection (options) {
 this.options = options
 this.options.certPath = path.join('C:', 'ProgramData', 'Qlik', 'Sense', 'Repository', 'Exported Certificates', '.Local Certificates');

}

QlikConnection.prototype.getAbout = async function () {
        let reqOptions = requestOptions.getOptions('about', this.options)
        let res = await requestGetDispatcher(reqOptions)
        return res
    }

QlikConnection.prototype.getApps = async function () {
    let reqOptions = requestOptions.getOptions('apps', this.options)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getEngine = async function () {
    let reqOptions = requestOptions.getOptions('engine', this.options)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getHealthCheck = async function () {
    let reqOptions = requestOptions.getOptions('healthcheck', this.options)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getExecutionResult = async function () {
    let reqOptions = requestOptions.getOptions('executionresult', this.options)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getQsr = async function (path) {
    let reqOptions = requestOptions.getOptions('qrs', this.options)
    reqOptions.path = reqOptions.path.replace('##path##', path)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getGlobal = async function (method, params) {
    let ws = await socket.creatSocket(this.options)
    return new Promise((resolve, reject)=>{
        ws.onopen = async function (event) {
            var msg = {
                "method": method,
                "handle": -1,
                "params": params,
                "jsonrpc": "2.0",
                "id": 2
            }
            ws.send(JSON.stringify(msg));
           
            ws.onmessage = function (event) {
                let parsedAwnser = JSON.parse(event.data)
                if(parsedAwnser.method != 'OnConnected'){
                    resolve(parsedAwnser.result)
                    ws.close()
                }
            
            }
        }
    })
}

QlikConnection.prototype.generateSession = async function (userdirectory, userName) {
    let reqOptions = requestOptions.getOptions('createSession', this.options)
    let bodyOptions = { 'UserDirectory': userdirectory.toString() , 'UserId': userName.toString(), "SessionId": helpers.generateUUID() }
    let res = await requestPostDispatcher(reqOptions, bodyOptions)
    return res
}

QlikConnection.prototype.getSession = async function (sessionId) {
    let reqOptions = requestOptions.getOptions('getSession', this.options)
    reqOptions.path = reqOptions.path.replace('##path##', sessionId)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.deleteSession = async function (sessionId) {
    let reqOptions = requestOptions.getOptions('deleteSession', this.options)
    reqOptions.path = reqOptions.path.replace('##path##', sessionId)
    let res = await requestGetDispatcher(reqOptions)
    return res
}


async function requestGetDispatcher(reqOptions){
    return new Promise(async function(resolve, reject){
        https.get(reqOptions, function(res) {
            let body = '';
            res.on("data", function(chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(JSON.parse(body.toString()))
              });
            }).on('error', function(e) {
               reject(e)
          });
     })
}    

async function requestPostDispatcher(reqOptions, bodyOptions){
    reqOptions.headers = {...reqOptions.headers, 'Content-Type': 'application/json'}
    return new Promise((resolve, reject) => {
      let sessionreq = https.request(reqOptions, async function (sessionres) {
        let body = '';
        sessionres.on("data", function(chunk) {
            body += chunk;
        });
        sessionres.on('end', function () {
            resolve(JSON.parse(body.toString()))
          });
        }).on('error', function(e) {
           reject(e)
      });
      let jsonrequest = JSON.stringify(bodyOptions);
      sessionreq.write(jsonrequest);
      sessionreq.end();
  
      sessionreq.on('error', function (e) {
        reject('Error' + e);
      });
    })
  
}  

exports.createClient = function () {
    return new QlikConnection(unifyOptions.apply(null,arguments));
};