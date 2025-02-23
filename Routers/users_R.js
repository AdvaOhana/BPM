const express = require('express');
const router = express.Router();
module.exports = router;

const users_Mid =require('../Middleware/users_Mid');

router.post('/users', [users_Mid.AddUsers],(req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok",Last_Id:req.insertId});
    } else {
        return res.status(500).json({message: err});
    }
});
router.get('/users',[users_Mid.GetUsers], (req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok",data:req.all_users});
    } else {
        return res.status(500).json({message: err});
    }
});
router.get('/userById',[users_Mid.GetUserById], (req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok",data:req.userById});
    } else {
        return res.status(500).json({message: err});
    }
});
router.put('/users',[users_Mid.UpdateUsers],  (req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok"});
    } else {
        return res.status(500).json({message: err});
    }
});
router.delete('/users',[users_Mid.DeleteUsers], (req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok"});
    } else {
        return res.status(500).json({message: err});
    }
});
