'use strict';
const os = require('os')
const fs = require('fs')
const https = require('https');

module.exports = function createClient (optionsParams) {
    let options = {}
    if (!optionsParams) {
        throw new TypeError('Unknown type of connection in createClient()');
    }

    options.hostname = optionsParams.hostname || os.hostname()
    try{
        options.key = fs.readFileSync(optionsParams.key),
        options.cert = fs.readFileSync(optionsParams.cert),
        options.ca = fs.readFileSync(optionsParams.ca)
    } catch(e){
        throw new TypeError(e);
    }

    return options;
};


