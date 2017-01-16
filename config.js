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

                consultinglist: '/consultinglist',
                consultingmodify: '/consultingmodify',

                managecustomers: '/managecustomers',
                getshprcontactmngtbyexcelfile: '/getshprcontactmngtbyexcelfile/:excelfile',
                checksession: '/checksession',
                checkconsultantcount: '/checkconsultantcount',
                secondlogin: '/secondlogin',
                getshippers: '/shippers',
                getcountrys: '/countrys',
                getshprcontactmngtbyshprcd: '/shprcontactmngts/:shprcd',
                getshprcontactmngts: '/shprcontactmngts',
                getexcelshprcontactmngts: '/excelshprcontactmngts',
                postshprcontactmngts: '/shprcontactmngts',
                putshprcontactmngts: '/shprcontactmngts/:seq',
                delshprcontactmngts: '/shprcontactmngts/:seq',
                //delshprcontactmngts: '/shprcontactmngts/:shprcd',
                register: '/account/register',
                transition2operation: '/transition2operation',
                restore2operation: '/restore2operation',

                managevessels: '/managevessels',
                getNextTxVesselSeq: '/vesselseq',
                getvessels: '/vessels/:shprcd',
                getexcelvessels: '/excelvessels/:shprcd',
                postvessel: '/vessels',
                putvessel: '/vessels/:vesselid',
                delvessel: '/vessels/:vesselid',

                managevesselmap: '/managevesselmap',
                getNextTxVesselMapId: '/vesselmapid',
                getsimplevesselmap: '/simplevesselmap',
                getvesselmap: '/vesselmap',
                postvesselmap: '/vesselmap',
                putvesselmap: '/vesselmap/:vesselmapid',
                delvesselmap: '/vesselmap/:vesselmapid',

                manageport: '/manageport',
                getport: '/port',
                postport: '/port',
                putport: '/port/:portcd',
                delport: '/port/:portcd',

                manageportnmmap: '/manageportnmmap',
                getNextTxPortNmMapId: '/portnmmapid',
                getportnmmap: '/portnmmap',
                postportnmmap: '/portnmmap',
                putportnmmap: '/portnmmap/:portnmmapid',
                delportnmmap: '/portnmmap/:portnmmapid',

                managescraper: '/managescraper',
                getscrapers: '/scrapers/:scraperType',
                getP2pScraptasks: '/scraptasks/p2p/:operCd',
                putP2pScraptasks: '/scraptasks/p2p/:seq',
                getVsScraptasks: '/scraptasks/vs/:operCd',
                putVsScraptasks: '/scraptasks/vs/:seq',
                managescraper2: '/managescraper2',

                managecustomerquery: '/managecustomerquery',
                getcustomerquerys: '/customerquerys',
                inquiry: '/inquiry',
                putcustomerquerys: '/customerquerys/:seq',

                manageerrorreport: '/manageerrorreport',
                geterrorreports: '/geterrorreports',
                errorreport: '/errorreport',
                puterrorreports: '/puterrorreports/:seq',

                testpage: '/testpage',
                posttest: '/posttest',

                getunlocode: '/unlocode/:bigword',

                postQuotationCost: '/consult/cost',
                getNewQuotationCostId: '/consult/cost/newid',
                delQuotationCost: '/consult/cost/:costid'
        },
        host: 'http://inner.lifemagazine.com',
        webChatAddress: 'http://inner.lifemagazine.com/webchat',
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
module.exports.pool = pool;
