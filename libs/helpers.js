//Generates a random number that we use as the session token
function generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
  }

  function buildMessage(method, handle, params, id){
    return JSON.stringify({
        "method": method,
        "handle": handle,
        "params": params,
        "jsonrpc": "2.0",
        "id": id
    })
  }
  
  module.exports = {
    generateUUID,
    buildMessage
  }
  