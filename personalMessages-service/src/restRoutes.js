const express = require('express');
const bodyParser = require('body-parser');
const data = require('../resource/testdata.json');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/api/v1/personalMessage/:id', (req, res) => {
    let personalMessages = data.find(p => p.userID === parseInt(req.params.id));
    return res.status(200).send(personalMessages)
});

router.post('/api/v1/sendPersonalMessage/', (req, res) => {
    let a = testdata.filter(p => p.userID === toUser);
    a[0].messages.push({content: content, date: new Date(), from: 1, type: "personal"});
    return true
});

router.post('/api/v1/personalMessage/', (req, res) => {
    let a = data.filter(p => p.userID === parseInt(req.body.toUser));
    a[0].messages.push({content: req.body.content, date: new Date(), from: 1, recommendedPage: req.body.recommendedPage});
    return res.status(200).send('ok')
});

module.exports = router;