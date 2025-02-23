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
router.get('/measures',[measures_Mid.GetMeasures], (req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok",data:req.all_measures});
    } else {
        return res.status(500).json({message: err});
    }
});
router.put('/measures',[measures_Mid.UpdateMeasures],  (req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok"});
    } else {
        return res.status(500).json({message: err});
    }
});
router.delete('/measures',[measures_Mid.DeleteMeasures], (req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok"});
    } else {
        return res.status(500).json({message: err});
    }
});