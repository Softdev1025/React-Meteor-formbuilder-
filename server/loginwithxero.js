const xero = require('xero-node');
var oauthRequestToken = null;
var oauthRequestSecret = null;
getXeroClient = (session, callbackUrl) => {
    try {
        metaConfig = JSON.parse(Assets.getText('config/config.json'));
    } catch (ex) {
        if (process && process.env && process.env.APPTYPE) {
            //no config file found, so check the process.env.
            metaConfig.APPTYPE = process.env.APPTYPE;
            metaConfig[metaConfig.APPTYPE.toLowerCase()] = {
                authorizeCallbackUrl: process.env.authorizeCallbackUrl,
                userAgent: process.env.userAgent,
                consumerKey: process.env.consumerKey,
                consumerSecret: process.env.consumerSecret
            }
        } else {
            throw "Config not found";
        }
    }

    var APPTYPE = metaConfig.APPTYPE;
    var config = metaConfig[APPTYPE.toLowerCase()];
    if (callbackUrl)
        config.authorizeCallbackUrl = callbackUrl;
    if (session && session.token) {
        config.accessToken = session.token.oauth_token;
        config.accessSecret = session.token.oauth_token_secret;
    }

    if (config.privateKeyPath && !config.privateKey) {
        try {
            //Try to read from the path
            config.privateKey = fs.readFileSync(config.privateKeyPath);
        } catch (ex) {
            //It's not a path, so use the consumer secret as the private key
            config.privateKey = "";
        }
    }

    switch (APPTYPE) {
        case "PUBLIC":
            xeroClient = new xero.PublicApplication(config);
            break;
        case "PARTNER":
            xeroClient = new xero.PartnerApplication(config);
            eventReceiver = xeroClient.eventEmitter;
            eventReceiver.on('xeroTokenUpdate', (data) => {
                //Store the data that was received from the xeroTokenRefresh event
                console.log("Received xero token refresh: ", data);
            });
            break;
        default:
            throw "No App Type Set!!"
    }
    return xeroClient;
}

Meteor.methods({

    getRequestToken: (session, callbackUrl) => {

        var xeroClient = getXeroClient(session, callbackUrl);

        var requestToken = xeroClient.getRequestToken((err, token, secret) => {
            if (!err) {
                oauthRequestToken = token;
                oauthRequestSecret = secret;
            } else {
                return err;
            }
        });
        return requestToken;
    },
    getAuthoriseUrl: (session, callbackUrl) => {

        var xeroClient = getXeroClient(session, callbackUrl);
        var AccountingScope = '';
        var authoriseUrl = xeroClient.buildAuthorizeUrl(session.token, {
            scope: AccountingScope
        });
        return authoriseUrl;
    },
    authorizedOperation: (req, callbackUrl) => {

        var xeroClient = getXeroClient(req, callbackUrl);

        return xeroClient.core.reports.generateReport(
            { id: req.reportkey }
        )
            .then((report) => {
                return {state:true,data:report.toObject()};
            })
            .catch((err) => {
                return {state:false,data:err};
            });
    },
    setAccessToken: (query) => {
        var xeroClient = getXeroClient();

        if (query.oauth_verifier && query.oauth_token == oauthRequestToken) {

            return xeroClient.setAccessToken(oauthRequestToken, oauthRequestSecret, query.oauth_verifier)
                .then((token) => {
                    return token.results;
                })
                .catch((err) => {
                    return err
                })
        }

    }

});
