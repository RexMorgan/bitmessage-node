bitmessage-node
=========


[![NPM](https://nodei.co/npm/bitmessage-node.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/bitmessage-node/)

Bitmessage client for the API written in Node.js.


## Install

    npm install bitmessage-node

## Usage

    //establish connection to Bitmessage server
    bm = require('bitmessage-node')(host, port, username, password);

    //get inbox list
    bm.messages.inbox.list(cb); //returns list of messages

    //get message by id
    bm.messages.inbox.single(id, cb, read);

    //send message
    bm.messages.send(toAddress, fromAddress, subject, message, cb);

    //get sent messages
    bm.messages.sent.list(cb);

    //get sent message by id
    bm.messages.sent.single(id, cb);

    //get sent message by ack
    bm.messages.sent.singleByAck(ack, cb);

    //move message to trash by id
    bm.messages.inbox.moveToTrash(id, cb);

    //move message to trash by ack
    bm.messages.sent.moveToTrashByAck(ack, cb);

    //list identities
    bm.addresses.list(cb); //returns identities

    //create random address
    bm.addresses.createRandom(label, cb); //returns address id

    //create deterministic address
    bm.addresses.createDeterministic(passphrase, cb); //returns address id

    //list subscriptions
    bm.subscriptions.list(cb); //returns subscriptions

    //subscribe
    bm.subscriptions.subscribe(address, label, cb); //returns string with status

    //unsubscribe
    bm.subscriptions.unsubscribe(address, cb); //returns string with status

    //list contacts
    bm.addressbook.list(cb); //returns contacts

    //add contact
    bm.addressbook.addEntry(address, label, cb);

    //delete contact
    bm.addressbook.deleteEntry(address, cb);

## Requirements

A Bitmessage server running on a local machine. Download from [Bitmessage.org](http://bitmessage.org)

If you plan on connecting to a remote Bitmessage server, you should *absolutely* use SSH tunneling to establish a secure connection and connect via a local port.

    ssh -N -L 8442:localhost:8442 <remote-bitmessage-server-hostname>


## More info

* [Bitmessage.org](http://bitmessage.org)
* [API Reference](https://bitmessage.org/wiki/API_Reference#List_of_Operations)


