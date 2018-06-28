const http = require('http');
const keepAliveAgent = new http.Agent({keepAlive: true});

module.exports.requestHttpPost = requestHttpPost;

function requestHttpPost(pathInfo, args, timeout) {
    return new Promise((resolve, reject) => {
        var input = JSON.stringify(args);
        var options = {
            host: pathInfo.host,
            port: pathInfo.port,
            path: pathInfo.path,
            method: 'POST',
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(input)
            },
            timeout: timeout
        };
        options.agent = keepAliveAgent;
        var jsonObjs='';
        var req = http.request(options, function (res) {
            // console.log('Res STATUS of '+pathInfo.path+' : '+res.statusCode);
            // console.log('Res HEADERS of '+pathInfo.path+' : '+JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                // console.log('Res data of '+pathInfo.path+' is '+chunk.toString('urf-8'));
                jsonObjs = jsonObjs + chunk.toString('urf-8');
            });
            res.on('end', function(){
                // console.log('Res of '+pathInfo.path+' is End.');
                var jsonResult = null;
                try{
                    jsonResult = JSON.parse(jsonObjs);
                    // console.log(jsonResult);
                }catch(err){
                    reject(err);
                    return;
                }
                resolve(jsonResult);
            });
            res.on('error', function (error) {
                reject(error);
            });
        });
        req.on('timeout', () => {
            reject(new Error('[client] timeout'));
        });
        req.on('error', function (e) {
            console.log('ERROR: ' + e.message);
            reject(new Error(e.message));
        });
        // post the data
        req.write(input);
        req.end();
    })
}
