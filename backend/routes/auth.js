const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


//REGISTER
router.post('/register', async (req,res) =>{
    try{
        //HASH DE LA PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //CREANDO EL NUEVO USUARIO
        const newUser= new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        });

        //GUARDANDO EL USUARIO
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){

        res.status(500).json(err);

    }

});

//LOGIN
router.post("/login", async (req,res) =>{
    try{
        const user = await User.findOne({email : req.body.email});
        !user && res.status(404).send("Usuario no encontrado :c") //busca usuario por mail
        

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Contraseña incorrecta ;c");  //compara contraseña en BBDD con la enviada
        res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
    
})



router.get('/', async (req,res)=>{
    const users = await User.find();
    res.json(users);
});



module.exports = router;