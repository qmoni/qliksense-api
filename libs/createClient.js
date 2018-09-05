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

   
    // testConnection(options)

    return options;
};

async function testConnection(options) {
    options.path = '/qrs/about?xrfkey=abcdefghijklmnop'
    options.method = 'GET'
    options.headers = {
        'x-qlik-xrfkey' : 'abcdefghijklmnop',
        'X-Qlik-User' : 'UserDirectory= Internal; UserId= sa_repository '
     }

      https.get(options, function(res) {
        }).on('error', function(e) {
            throw new TypeError(e.message);
        });

}
