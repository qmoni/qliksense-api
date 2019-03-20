'use strict'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const unifyOptions = require('./libs/createClient');
const requestOptions = require('./libs/requestOptions');
const socket = require('./libs/socketConnection');
const https = require('https');
const path = require('path');
const helpers = require('./libs/helpers')
const querystring = require('querystring');

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

QlikConnection.prototype.doReloadTask = async function (taskName) {
    if (!taskName) throw new Error('No taskName or file Reference Id declared')
    let reqOptions = requestOptions.getOptions('doReloadTask', this.options)
    reqOptions.path = reqOptions.path.replace('##path##', encodeURIComponent(taskName))
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getReloadTaskToken = async function (id, fileId) {
    if(!id || !fileId) throw new Error('No taskId or file Reference Id declared')
    let path = `ReloadTask/${id}/scriptlog?fileReferenceId=${fileId}`
    let reqOptions = requestOptions.getOptions('reloadTask', this.options)
    reqOptions.path = reqOptions.path.replace('##path##', path)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getTaskLog = async function (taskId) {
    if(!taskId) throw new Error('No taskId or file Reference Id declared')
    let task = await this.getQsr(`ReloadTask/${taskId}`)
    let token = await this.getReloadTaskToken(task.id, task.operational.lastExecutionResult.fileReferenceID)
    let log =   await  this.getExeutionLog(token.value, task.name)
    return log
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

QlikConnection.prototype.postQsr = async function (path) {
    let reqOptions = requestOptions.getOptions('postQrs', this.options)
    reqOptions.path = reqOptions.path.replace('##path##', path)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.getExeutionLog = async function (referenceId, taskName) {
    let path = `download/reloadtask/${referenceId}/${querystring.escape(taskName)}.log`
    let reqOptions = requestOptions.getOptions('qrs', this.options)
    reqOptions.path = reqOptions.path.replace('##path##', path)
    let res = await requestGetDispatcher(reqOptions)
    return res
}

QlikConnection.prototype.engine = async function (method, params) {
    if (!params) params = []
    let ws = await socket.creatSocket(this.options)
    return new Promise((resolve, reject)=>{
        ws.onopen = async function (event) {
            let msg = helpers.buildMessage(method, -1, params, 2)
            ws.send(msg);
            ws.onmessage = function (event) {
                let parsedAwnser = JSON.parse(event.data)
                if(parsedAwnser.error) resolve(parsedAwnser.error)
                if(parsedAwnser.method != 'OnConnected'){
                    resolve(parsedAwnser.result)
                    ws.close()
                }
            
            }
        }
    })
}

QlikConnection.prototype.openDoc = async function (docId, method, params) {
    if (!params) params = []
    if (!method || !docId) throw new Error('No method or docId declared')
    let ws = await socket.creatSocket(this.options)
    return new Promise((resolve, reject)=>{
        ws.onopen = async function (event) {
            let msg = helpers.buildMessage('OpenDoc', -1, [docId], 2)
            ws.send(msg);
            ws.onmessage = function (event) {
                let parsedAwnser = JSON.parse(event.data)
                if(parsedAwnser.method != 'OnConnected'){
                    let msg = helpers.buildMessage(method, 1, params, 5)
                    ws.send(msg);
                    ws.onmessage = function (event) {
                        let parsedAwnser = JSON.parse(event.data)
                        resolve(parsedAwnser)
                        ws.close()
                    }      
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
                try{
                    resolve(JSON.parse(body.toString()))
                }catch(e){
                    resolve(body.toString())
                }
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