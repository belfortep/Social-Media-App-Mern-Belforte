const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
//CREATE A POST

router.post('/', async (req,res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost); 
    }catch(err){
        res.status(500).json(err);
    }
})

//UPDATE A POST

router.put('/:id', async (req,res)=>{
    try{

    
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({$set : req.body});
        res.status(200).json('Post actualizado');
    }else{
        res.status(403).json('solo podes actualizar TUS posts gil')
    }
    }catch(err){
        res.status(500).json(err);
    }

})

//DELETE A POST
router.delete('/:id', async (req,res)=>{
    try{

    
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.deleteOne();
        res.status(200).json('Post eliminado');
    }else{
        res.status(403).json('solo podes eliminar TUS posts gil')
    }
    }catch(err){
        res.status(500).json(err);
    }

})



//LIKE / DISLIKE A POST

router.put('/:id/like', async(req,res)=>{
    try{
        const post =await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){  //verifica si contiene en el array de likes, el id del usuario que hizo click
            await post.updateOne({$push : {likes : req.body.userId}});
            res.status(200).json('Se dio un like al post');
        } else{
            await post.updateOne({$pull : {likes : req.body.userId}});
            res.status(200).json('se dio dislike al post');
        }
    }catch(err){
        res.status(500).json(err);

    }
    
})


//GET A POST


router.get('/:id', async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);


    }catch(err){
        res.status(500).json(err);
    }
}); 

//GET TIMELINE POSTS

router.get('/timeline/:userId', async(req,res) =>{
    
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId : currentUser._id});
        const friendPosts = await Promise.all(  //promise.all cuando se va a utilizar un bucle, si no no va a poder obtener todos los valores
            currentUser.followings.map(friendId =>{
                return Post.find({userId : friendId});
            })
        ); 
        res.status(200).json(userPosts.concat(...friendPosts));//agarro tanto post del usuario como de los seguidores
    }catch(err){
        res.status(500).json(err);
    }
})

//GET USER ALL POSTS

router.get('/profile/:username', async(req,res) =>{
    
    try{
        const user = await User.findOne({username : req.params.username});
        const posts = await Post.find({userId : user._id});
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;