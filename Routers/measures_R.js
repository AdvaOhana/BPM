const express = require('express');
const router = express.Router();
module.exports = router;

const measures_Mid =require('../Middleware/measures_Mid');

router.post('/measures', [measures_Mid.AddMeasures],(req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok",Last_Id:req.insertId});
    } else {
        return res.status(500).json({message: err});
    }
});
