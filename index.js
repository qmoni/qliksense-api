'use strict'

const unifyOptions = require('./libs/createClient');
const requestOptions = require('./libs/requestOptions');
const socket = require('./libs/socketConnection');
const https = require('https');
const request = require('request')
const path = require('path');

function QlikConnection (options) {
 this.options = options
 this.options.certPath = path.join('C:', 'ProgramData', 'Qlik', 'Sense', 'Repository', 'Exported Certificates', '.Local Certificates');

}

QlikConnection.prototype.getAbout = async function () {
        let reqOptions = requestOptions.getOptions('about', this.options)
        let res = await requestDispatcher(reqOptions)
        return res
    }

QlikConnection.prototype.getApps = async function () {
    let reqOptions = requestOptions.getOptions('apps', this.options)
    let res = await requestDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getEngine = async function () {
    let reqOptions = requestOptions.getOptions('engine', this.options)
    let res = await requestDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getHealthcCheck = async function () {
    let reqOptions = requestOptions.getOptions('healthcheck', this.options)
    let res = await requestDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getExecutionResult = async function () {
    let reqOptions = requestOptions.getOptions('executionresult', this.options)
    let res = await requestDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getQsr = async function (path) {
    let reqOptions = requestOptions.getOptions('qrs', this.options)
    reqOptions.path = reqOptions.path.replace('##path##', path)
    console.log(reqOptions)
    let res = await requestDispatcher(reqOptions)
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


async function requestDispatcher(reqOptions){
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

exports.createClient = function () {
    return new QlikConnection(unifyOptions.apply(null,arguments));
};