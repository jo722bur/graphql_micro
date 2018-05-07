const express = require('express');
const userData = require('../resource/userData.json');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/api/v1/user/:id', (req, res) => {
    const user = getUserByID(req.params.id);
    if (user === null) {
        return res.status(404).send("User Not found")
    }
    return res.status(200).send(user);
});

router.get('/api/v1/user/:id/image', (req, res) => {

    fs.readFile('./resource/default.png', (error, data) => {
        let img = new Buffer(data, 'base64');
        res.set('Content-Type', 'image/jpeg');
        res.send(img)
    })
});


function getUserByID(id) {
    const user = userData.filter(p => p.userID === parseInt(id));
    return user.length === 0 ? null : user[0];
}

module.exports = router;