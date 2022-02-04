const router = require('express').Router();
const Conversation = require('../models/Conversation');

//NUEVA CONVERSACION

router.post('/', async (req,res)=>{
    const newConversation = new Conversation({
        members : [req.body.senderId, req.body.receiverId],
    });

    try{

        const savedConversation = await newConversation.save();

        res.status(200).json(savedConversation)

    }catch(err){
        res.status(500).json(err);
    }


})


//GET CONVERSACION DE UN USUARIO


router.get('/:userId', async (req,res)=>{

    try{

        const conversation = await Conversation.find({
            members : { $in:[req.params.userId]},       //me devuelve todas las conversaciones que contentan el id del usuario que envio

        });
        res.status(200).json(conversation);

    }catch(err){
        res.status(500).json(err);
    }

})

//GET CONVERSACION CON 2 USER ID

router.get('/find/:firstUserId/:secondUserId', async (req, res) =>{
    try{

        const conversation = await Conversation.findOne({
            members : { $all:[req.params.firstUserId, req.params.secondUserId]}
        });

        res.status(200).json(conversation);

    }catch(err){

        res.status(500).json(err);

    }
})

module.exports = router;