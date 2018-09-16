'use strict'
const xrfkey = 'abcdefghijklmnop'
const pathDef = {
    about : {
        method: 'GET',
        port: 4242,
        path: `/qrs/about?xrfkey=${xrfkey}`
    },
    apps : {
        method: 'GET',
        port: 4242,
        path: `/qrs/app/full?xrfkey=${xrfkey}`
    },
    healthcheck: {
        method: 'GET',
        port: 4747,
        path: `/engine/healthcheck/?xrfkey=${xrfkey}`
    },
    executionresult: {
        method: 'GET',
        port: 4242,
        path: `/qrs/executionresult?xrfkey=${xrfkey}`
    },
    event: {
        method: 'GET',
        port: 4242,
        path: `/qrs/event/full?xrfkey=${xrfkey}`
    },
    qrs: {
        method: 'GET',
        port: 4242,
        path: `/qrs/##path##?xrfkey=${xrfkey}`
    },
    createSession: {
        method: 'POST',
        port: 4243,
        path: `/qps/session?xrfkey=${xrfkey}`
    },
    getSession: {
        method: 'GET',
        port: 4243,
        path: `/qps/session/##path##?xrfkey=${xrfkey}`
    },
    deleteSession: {
        method: 'DELETE',
        port: 4243,
        path: `/qps/session/##path##?xrfkey=${xrfkey}`
    }
}

function getOptions (type, optionsParams) {
    if(pathDef[type]){
        let options = {}
        options = {...pathDef[type], ...optionsParams}
        options.headers = {
            'x-qlik-xrfkey' : xrfkey,
            'X-Qlik-User' : 'UserDirectory= Internal; UserId= sa_repository'
         }
         return options
    } else {
        throw new TypeError('Error on PATH KEY: get request options');
    }
       
}

module.exports = {
    getOptions
}