const express = require('express');
const router = express.Router();
module.exports = router;

const users_Mid =require('../middleware/users_Mid');

router.post('/users', [users_Mid.AddUsers],(req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok",Last_Id:req.insertId});
    } else {
        return res.status(500).json({message: err});
    }
});
