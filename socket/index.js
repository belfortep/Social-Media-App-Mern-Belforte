const io = require('socket.io')(8900,{
    cors:{
        origin : 'http://localhost:3000',
    },
});


let users = [];

const addUser = (userId, socketId) =>{

    !users.some(user=>user.userId === userId) &&
        users.push({userId, socketId});

};


const removeUser = (socketId) =>{

    users = users.filter(user => user.socketId !== socketId);

}

const getUser = (userId) =>{
    return users.find(user=>user.userId === userId);
}



io.on('connection', (socket) =>{

    //al conectar
    console.log('usuario conectado');
    //agarra userId y socketId del usuario
    socket.on('addUser', userId=>{

        addUser(userId, socket.id);
        io.emit('getUsers', users);

    }); 

    //enviar y obtener mensaje
    socket.on('sendMessage', ({senderId, receiverId, text})=>{


        const user = getUser(receiverId);

        io.to(user.socketId).emit('getMessage',{
            senderId, text,
        })


    })


    //al desconectar
    socket.on('disconnect', ()=>{
        console.log('usuario desconectado >:c');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })

});
