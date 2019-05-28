const { name, version, description } = require('../package.json');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: name, version: version, description: description });
}).get('/switches', (req, res, next) =>{
  res.json([
    { ip: '10.11.22.33', name: 'Switch-1' },
    { ip: '10.12.22.23', name: 'Switch-2' },
    { ip: '10.13.22.34', name: 'Switch-3' }
  ])
});

module.exports = router;