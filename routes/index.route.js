const express = require('express');
const router = express.Router();
const usersRouter = require("./users.route");
const itemsRouter = require('./items.route');
const commentsRouter = require('./comments.route');



// 홈페이지일 경우
router.get('/', (req, res) => {
    res.send("이게 왜 안됨?");
});
router.use('/users', [usersRouter]);
//posts router 연결 후 postRouter 연결
router.use('/items', [itemsRouter, commentsRouter]);


module.exports = router;