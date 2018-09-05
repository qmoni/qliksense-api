'use strict'
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

async function creatSocket(options) {
    var certificates = {
        cert: fs.readFileSync(path.resolve(options.certPath, 'client.pem')),
        key: fs.readFileSync(path.resolve(options.certPath, 'client_key.pem')),
        root: fs.readFileSync(path.resolve(options.certPath, 'root.pem'))
        };
    
        return new WebSocket(`wss://${options.hostname}:4747/app/`, {
            ca: certificates.root,
            cert: certificates.cert,
            key: certificates.key,
            headers: {
                'X-Qlik-User':  'UserDirectory=internal; UserId=sa_engine'
            }
        });
  }

  module.exports = {
    creatSocket
}