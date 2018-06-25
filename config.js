var config = {
        port: 8080,
        secret: 'secret',
        redisPort: 6379,
        redisHost: 'localhost',
        redisUrl: 'redis://localhost',
        routes: {
                login: '/account/login',
                logout: '/account/logout',

                chat: '/chat',
                // chatwindowlogin: '/chatwindowlogin',
                chatwindow: '/chatwindow',
                msgwindow: '/msgwindow',
                chatwindowadmin: '/chatwindowadmin',
                uploadfile: '/uploadfile',
                removechattingroom: '/removechattingroom',
                secondlogin: '/secondlogin',
                checksession: '/checksession',
                consultinglist: '/consultinglist',
                consultingmodify: '/consultingmodify',
                test: '/test',
        },
        host: 'http://127.0.0.1:8080',
        webChatAddress: 'http://127.0.0.1:8080/webchat',
        crypto: {
                workFactor: 5000,
                keylen: 32,
                randomSize: 256
        },
        poolConfig: {
                min: 5,
                max: 20,
                retryDelay : 20000,
                log: false
        },
        consultantRoomName: 'consultantRoom'
        /*,
        rabbitMQ: {
                URL: 'amqp://guest:guest@localhost:5672',
                exchange: 'webchat.log'
        }*/
};

module.exports = config;
// module.exports.pool = pool;
