const debug = require('debug')('netex:public');
const { name, version, description } = require('../package.json');
const express = require('express');
const redis = require('redis');
const zmq = require('zeromq');
const cache = redis.createClient();
const router = express.Router();

let requester = zmq.socket('req');
requester.on("message", reply => {
    debug("Received reply: [", reply.toString(), ']');
    cache.set(reply.key, reply.value);
  });
requester.connect("tcp://localhost:5555");
process.on('SIGINT', () => {
  requester.close();
  process.exit(0);
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: name,
    version: version,
    description: description
  });
}).get('/switches', (req, res, next) => {
  // Function to get a list of switches.
  cache.get('switches', (err, result) => {
    if (err == null && result != null) {
      res.json(result);
    } else {
      requester.send('switches');
      // Should be wait for results for a while, somehow...
      new Promise((resolve, reject) => {
        cache.get('switches', (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        })
      }).then(result => res.json(result));
      next();
    }
  });
/*
  res.json([
    { ip: '10.11.22.33', name: 'Switch-1' },
    { ip: '10.12.22.23', name: 'Switch-2' },
    { ip: '10.13.22.34', name: 'Switch-3' }
  ])
*/
});

module.exports = router;