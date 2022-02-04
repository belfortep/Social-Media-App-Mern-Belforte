//------------------------------IMPORTACIONES------------------------------
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute= require('./routes/users');
const authRoute= require('./routes/auth');
const postRoute= require('./routes/posts');
const conversationRoute= require('./routes/conversations');
const messageRoute= require('./routes/messages');

const multer = require('multer');
const path = require('path');

dotenv.config();
//------------------------------CONEXION BBDD------------------------------
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser : true, useUnifiedTopology : true}, () =>{
    console.log('CONECTADO A LA BBDD');
});

app.use('/images', express.static(path.join(__dirname, "public/images")));//si usas este path, no hagas un request si no anda

//------------------------------MIDDLEWARES------------------------------
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"public/images");
    },
    filename : (req,file,cb)=>{
        cb(null,req.body.name);
    },
})

const upload = multer({storage});
app.post('/api/upload', upload.single("file"), (req,res)=>{
    try{
        return res.status(200).json('File upload succesfully');
    }catch(err){
        console.log(err);
    }
})

//------------------------------RUTAS------------------------------

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);




//------------------------------ABRIENDO SERVIDOR------------------------------
app.listen(8800, ()=>{
    console.log("SERVIDOR BACKEND FUNCIONA PUERTO 8800");
});