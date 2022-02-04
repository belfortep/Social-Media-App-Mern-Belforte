const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');
//update user

router.put('/:id', async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {

        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {    //simbolo dolar, pone todos los datos directamente
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,

            });
            res.status(200).json("Cuenta actualizada");
        } catch (err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json('Solo podes actualizar tu cuenta');
    }

})

//delete user

router.delete('/:id', async (req, res) => {

    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {    //simbolo dolar, pone todos los datos directamente
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Cuenta Eliminada");
        } catch (err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json('Solo podes eliminar tu cuenta');
    }

})

//get a user

router.get('/', async (req, res) => {

    const userId = req.query.userId;    //con el query puedo obtener parametros de 2 maneras, con el ID o con el USERNAME
    const username = req.query.username;


    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        const { password, updatedAt, ...other } = user._doc   //meto mi objeto usuario y separo la variable password y updated at, dejandome solo con el "other" que es el resto de propieades
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
})

//get friends

router.get('/friends/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId);
            })
        )

        let friendList = [];
        friends.map(friend => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList);

    } catch (err) {
        res.status(500).json(err);
    }
})


//follow a user

router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });  //uso push porque meto los valores en un array, guardo en "seguidores" el usuario que envia la peticion
                await currentUser.updateOne({ $push: { followings: req.params.id } });    //guardo en "siguiendo" el id del usuario al que elegi
                res.status(200).json('se siguio al usuario');
            } else {
                res.status(403).json('ya sigues a este usuario');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("No podes seguirte a vos mismo ._.");
    }
})



//unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });  //uso pull porque saco los valores en un array, guardo en "seguidores" el usuario que envia la peticion
                await currentUser.updateOne({ $pull: { followings: req.params.id } });    //guardo en "siguiendo" el id del usuario al que elegi
                res.status(200).json('se dejo de seguir al usuario');
            } else {
                res.status(403).json('ya dejaste de seguir a este usuario ._.');
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("No podes dejar de seguirte ._.");
    }
})


module.exports = router;