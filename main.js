'use strict';

let rp = require('request-promise');

/**
 * Configures the request to the Notify my Android service,
 * including the content of the notification.
 * TODO: parametize some of the configuration of the notification (eg description, event etc) 
 * @param {any} secrets: the Secrets embedded in the web task (contains API key for Notify service)
 */
function getRequestOptions(secrets, items) {
    return {
        method: 'POST',
        uri: 'https://www.notifymyandroid.com/publicapi/notify',
        qs: {
            apikey: secrets.NOTIFY_API_KEY,
            application: 'grocery notifier',
            event: 'You have new groceries to pick up',
            description: 'Your grocery list has been updated by your significant other. ' +
                          'Please pick up: ' + items
        },
        body: {
            ignored: 'ignored'
        },
        json: true
    };
}

/**
 * Send notification to  all users attached to the account that generated the API key used
 * @param {any} context from the webtask 
 */
function notifyUsers(context) {
    let options = getRequestOptions(context.secrets, context.query.items);
    return rp(options)
            .then(xmlResult => {
                // TODO: parse the xmlResult to retrieve the API results
                return true;

            })
            .catch(error => {
                // TODO: parse the xmlResult to determine the actual error
                return false;
            });
}

/**
 * Save Action - saves the items to the webtask and
 *               sends a notification of the update 
 * @param {*} context 
 * @param {*} cb 
 */
function saveAction(context, cb) {
    let data = { items: context.query.items };
    saveToDbWithCallback(context, data, cb);
    return;
    // TODO: the promise version of the save function
    //       doesn't work - need to investigate why

    // saveToDb(context, data).then(items => {
    //     return notifyUsers(context);
    // })
    // .then(result => {
    //     let message = '';
    //     if(result) {
    //         message = 'We also notified your spouse of the grocery list updates!'
    //     }else{
    //         message = "We were unable to notify your spouse.... :( "
    //     }
    //     cb(null, { "message": message });
    // });
}

function saveToDbWithCallback(context, data, cb){
    context.storage.set(data, {force: 1}, function(error) {
        if(error) {
            cb(error);
            return;
        }

        notifyUsers(context).then(result => {
            if(result) {
                cb(null, { "message": "Your spouse was notified." });
            } else {
                cb(null, { "message": "We were unable to notify your spouse :("})
            }
        });
    })

}

// TODO: why doesn't this work, but the callback version does?
// it times out - even though promises are eager and by creating one,
// it should trigger the async action
function saveToDb(context, newData) {
    return new Promise((resolve, reject) => {
        context.storage.set(newItems, {force: 1}, (error) => {
            if (error) {
                return reject(error);
            }
            return resolve(newItems);
        });
    });
}

function getAction(context, cb) {
    getFromDb(context).then((items) => {
        cb(null, { "items": items });
    });
}
/** 
 * Retrieve data stored.
 * Returns a promise that resolves with the saved items
 */
function getFromDb(context) {
    return new Promise((resolve, reject) => {
        context.storage.get((error, items) => {
            if (error) {
                reject(error);
            }
            resolve(items);
        });
    });
}

function main(context, cb) {

    // switch on the action query param
    // it may make more sense in this situation
    // to simply switch on the request method
    // since it's a simple PUT and GET scenario,
    // but leaving the action technique there for now
    if (context.query["action"] == 'save') {
        saveAction(context, cb);
    } else if (context.query["action"] == 'get') {
        getAction(context, cb);
    } else {
        cb(null, { message: 'unknown action', query: context.query })
    }
}

module.exports = main;   

