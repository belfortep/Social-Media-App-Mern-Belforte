import './post.css';
import React, { useState, useEffect, useContext } from 'react';
import {MoreVert} from '@material-ui/icons'
import axios from 'axios';
import {format} from 'timeago.js';
import { Link } from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';

export default function Post({post}) {
    
    //const user = Users.filter(u => u.id === 2);

    const PF= process.env.REACT_APP_PUBLIC_FOLDER;
    console.log(PF);
    const [like, setLike] = useState(post.likes.length); //estos son los states con hooks, adentro del useState le puse el valor inicial
    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState({});
    const {user:currentUser} = useContext(AuthContext);
    useEffect(()=>{
        setIsLiked(post.likes.includes(currentUser._id));//si contiene el id del usuario actual signifca que ya esta con un like, si no se queda en falso
    }, [currentUser._id, post.likes])



    useEffect(()=>{//interesante, se utiliza siempre que cambie el ESTADO de una "dependencia" que es lo que le doy de segundo parametro, SI LO DEJO SIN NADA, SE ACTIVA UNA SOLA VEZ, QUE ES CUANDO SE RENDERIZA
        const fetchUser = async () =>{   //tengo que crear una funcion async aca porque en el useEffect no le gusta a react 

            const res = await axios.get(`/users?userId=${post.userId}`);
            setUser(res.data);

        };
        fetchUser();

    },[post.userId]);




    const likeHandler = async () =>{
        try{
            await axios.put('/posts/' + post._id + "/like", {userId : currentUser._id})
        }catch(err){

        }

        setLike(isLiked ? like-1 : like+1); //si isLiked es verdad, restale 1 a la variable like, si es falsa, sumale 1
        setIsLiked(!isLiked);//niega lo que esta guardado en la variable isLiked
    }

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                    <Link to={`/profile/${user.username}`}>
                    <img src={user.profilePicture ? PF + user.profilePicture : PF + "person/7.jpeg"} alt="" className="postProfileImg" />
                    </Link>
                        
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert/>
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>  {/*el signo de interrogacion es para indicar que puede que un POST no tenga su DESC */}
                    <img className='postImg' src={PF + post?.img} alt="" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={`${PF}like.png`} onClick={likeHandler} alt="" />
                        <img className="likeIcon" src={`${PF}heart.png`} onClick={likeHandler} alt="" />
                        <span className="postlikeCounter">{like} people liked it</span>
                    </div>
                    <div className="postBottomRight">
                        <div className="postCommentText">{post.comment} Comments</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
