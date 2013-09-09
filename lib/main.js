"use strict";

var xmlrpc = require('xmlrpc')
    , moment = require('moment');

module.exports = function (host, port, user, pass, options) {
    var defaults = options || {};
    var client = xmlrpc.createClient({
        host: host,
        port: port,
        path: '/',
        basic_auth: {
            user: user,
            pass: pass
        }
    });

    var callMethod = function (options, cb) {
        options = options || {};
        options.args = options.args || [];
        if (options.json === undefined)
            options.json = true;

        client.methodCall(options.method, options.args, function (error, value) {
            if (error) throw error;
            if (options.json) return cb(JSON.parse(value));
            return cb(value);
        });
    };

    var fromBase64 = function (value) {
        return new Buffer(value, 'base64').toString();
    };

    var toBase64 = function (value) {
        return new Buffer(value).toString('base64');
    };

    var fromUnix = function (value) {
        return moment.unix(parseInt(value, 10)).toDate();
    };

    return {
        addresses: {
            list: function (cb) {
                callMethod({ method: 'listAddresses' }, function (value) {
                    var addresses = value.addresses;
                    cb(addresses);
                });
            },
            createRandom: function (label, cb) {
                callMethod({
                    method: 'createRandomAddress',
                    args: [toBase64(label)],
                    json: false
                }, cb);
            },
            createDeterministic: function (passphrase, cb) {
                callMethod({
                    method: 'createDeterministicAddresses',
                    args: [toBase64(passphrase), 1, 0, 0, false, 1, 1]
                }, function (value) {
                    if (value.addresses.length > 0) {
                        return cb(value.addresses[0]);
                    }
                    return cb(null);
                });
            },
            getDeterministic: function (passphrase, cb) {
                callMethod({
                    method: 'getDeterministicAddress',
                    args: [toBase64(passphrase), 3, 1],
                    json: false
                }, cb);
            },
        },
        messages: {
            inbox: {
                list: function (cb) {
                    callMethod({method: 'getAllInboxMessages' }, function (value) {
                        var messages = value.inboxMessages;
                        for (var i = 0; i < messages.length; ++i) {
                            messages[i].subject = fromBase64(messages[i].subject);
                            messages[i].message = fromBase64(messages[i].message);
                            messages[i].receivedTime = fromUnix(messages[i].receivedTime);
                        }
                        cb(messages);
                    });
                },
                single: function (messageId, cb, read) {
                    var args = [messageId];

                    //optionally mark a message as read or unread
                    if ( read === true || read === false ) {
                        args.push(read);
                    }

                    callMethod({
                        method: 'getInboxMessageById',
                        args: args
                    }, function (value) {
                        var message = value.inboxMessage[0];
                        message.subject = fromBase64(message.subject);
                        message.message = fromBase64(message.message);
                        message.receivedTime = fromUnix(message.receivedTime);
                        cb(message);
                    });
                },
                moveToTrash: function (messageId, cb) {
                    callMethod({
                        method: 'trashMessage',
                        args: [messageId],
                        json: false
                    }, function (value) {
                        cb(value);
                    });
                },
            },
            sent: {
                list: function (cb) {
                    callMethod({method: 'getAllSentMessages' }, function (value) {
                        var messages = value.sentMessages;
                        for (var i = 0; i < messages.length; ++i) {
                            messages[i].subject = fromBase64(messages[i].subject);
                            messages[i].message = fromBase64(messages[i].message);
                            messages[i].lastActionTime = fromUnix(messages[i].lastActionTime);
                        }
                        cb(messages);
                    });
                },
                single: function (messageId, cb) {
                    callMethod({
                        method: 'getSentMessageById',
                        args: [messageId]
                    }, function (value) {
                        var message = value.sentMessage[0];
                        message.subject = fromBase64(message.subject);
                        message.message = fromBase64(message.message);
                        message.lastActionTime = fromUnix(message.lastActionTime);
                        cb(message);
                    });
                },
                singleByAck: function (ackData, cb) {
                    callMethod({
                        method: 'getSentMessageByAckData',
                        args: [ackData]
                    }, function (value) {
                        var message = value.sentMessage[0];
                        message.subject = fromBase64(message.subject);
                        message.message = fromBase64(message.message);
                        message.lastActionTime = fromUnix(message.lastActionTime);
                        cb(message);
                    });
                },
                moveToTrashByAck: function (ackData, cb) {
                    callMethod({
                        method: 'trashSentMessageByAckData',
                        args: [ackData],
                        json: false
                    }, function (value) {
                        cb(value);
                    });
                },
            },
            send: function (toAddress, fromAddress, subject, message, cb) {
                callMethod({
                    method: 'sendMessage',
                    args: [toAddress, fromAddress, toBase64(subject), toBase64(message)],
                    json: false
                }, cb);
            },
            broadcast: function (fromAddress, subject, message, cb) {
                callMethod({
                    method: 'sendBroadcast',
                    args: [fromAddress, toBase64(subject), toBase64(message)],
                    json: false
                }, cb);
            },
            status: function (messageId, cb) {
                callMethod({
                    method: 'getStatus',
                    args: [messageId],
                    json: false
                }, cb);
            }
        },
        subscriptions: {
            list: function (cb) {
                callMethod({ method: 'listSubscriptions' }, function (value) {
                    var subscriptions = value.subscriptions;

                    for (var i = 0; i < subscriptions.length; ++i) {
                        subscriptions[i].label = fromBase64(subscriptions[i].label);
                    }

                    cb(subscriptions);
                });
            },
            subscribe: function (address, label, cb) {
                callMethod({
                    method: 'addSubscription',
                    args: [address, toBase64(label)],
                    json: false
                }, cb);
            },
            unsubscribe: function (address, cb) {
                callMethod({
                    method: 'deleteSubscription',
                    args: [address],
                    json: false
                }, cb);
            }
        },
        test: {
            add: function (a, b, cb) {
                callMethod({
                    method: 'add',
                    args: [a, b],
                    json: false
                }, cb);
            },
            hello: function (word, word2, cb) {
                callMethod({
                    method: 'helloWorld',
                    args: [word, word2],
                    json: false
                }, cb);
            },
        },
    };
}