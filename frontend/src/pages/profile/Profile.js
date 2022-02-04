import './profile.css';
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from 'react-router';

export default function Profile() {

    const PF= process.env.REACT_APP_PUBLIC_FOLDER;

    const [user, setUser] = useState({});

    const username = useParams().username;//FUNCIONA GRACIAS A DIOSITO
    

    useEffect(()=>{//interesante, se utiliza siempre que cambie el ESTADO de una "dependencia" que es lo que le doy de segundo parametro, SI LO DEJO SIN NADA, SE ACTIVA UNA SOLA VEZ, QUE ES CUANDO SE RENDERIZA
        const fetchUser = async () =>{   //tengo que crear una funcion async aca porque en el useEffect no le gusta a react 

            const res = await axios.get(`/users?username=${username}`);
            setUser(res.data);

        };
        fetchUser();

    },[username]);

    return (
        <div>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                        <img className='profileCoverImg' src={user.coverPicture ? PF+user.coverPicture : PF+"person/7.jpeg"} alt="" />
                        <img className='profileUserImg' src={user.profilePicture ? PF +user.profilePicture : PF+"person/7.jpeg"} alt="" />
                        </div>
                        <div className="profileInfo">
                            <h4 className='profileInfoName'>{user.username}</h4>
                            <span className='profileInfoDesc'>{user.desc}</span>
                        </div>

                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username}/>
                        <Rightbar user={user} />
                    </div>
                </div>
            </div>
        </div>
    )
}
