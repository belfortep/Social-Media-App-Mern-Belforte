import {useState, useEffect, useContext} from 'react';
import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

 export default function Feed({username}) {

    const [posts, setPosts] = useState([]);

    const {user} = useContext(AuthContext);

    useEffect(()=>{//interesante, se utiliza siempre que cambie el ESTADO de una "dependencia" que es lo que le doy de segundo parametro, SI LO DEJO SIN NADA, SE ACTIVA UNA SOLA VEZ, QUE ES CUANDO SE RENDERIZA
        const fetchPosts = async () =>{   //tengo que crear una funcion async aca porque en el useEffect no le gusta a react 

            const res = username    //si tiene el prop username, mostrame los posts de ese usuario, si no mostrame el que envie
            ? await axios.get('/posts/profile/' + username) 
            : await axios.get('/posts/timeline/' + user._id);
            setPosts(res.data.sort((p1,p2)=>{
                return new Date(p2.createdAt) - new Date(p1.createdAt);
            }));
                //61e0e2002baf94e5f0c9d081 ID DE PRUEBAS
        };
        fetchPosts();

    },[username, user._id]);


     return (
         <div className='feed'>
            <div className="feedWrapper">
                {(!username || username === user.username) && <Share/>}
                {posts.map(p =>(
                    <Post key={p._id} post={p}/>
                ))}
                
            </div>
         </div>
     )
 }
 