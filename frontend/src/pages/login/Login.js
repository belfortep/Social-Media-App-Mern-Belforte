import './login.css'
import { useRef, useContext} from 'react';
import { loginCall } from '../../apiCalls';
import {AuthContext} from '../../context/AuthContext'
import {CircularProgress} from '@material-ui/core';
import {Link} from 'react-router-dom';
export default function Login() {


    const email = useRef();
    const password = useRef();
    const {user,isFetching, error, dispatch} = useContext(AuthContext);


    const handleClick = (e) =>{
        e.preventDefault();
        if(password.current.value.length < 6){
            return
        }else {
            loginCall({email:email.current.value, password:password.current.value}, dispatch);
        }
        
    };

    console.log(user);
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">CaraLibro</h3>
                    <span className="loginDesc">
                        Connect with frineds and the world around you on CaraLibro.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Email" type="email" required className="loginInput" ref={email}/>
                        <input placeholder="Password" type="password" minLength="6"  required className="loginInput" ref={password} />
                        <button className="loginButton" type='submit' disabled={isFetching}>{isFetching ? <CircularProgress color='white'/> : "Log In"}</button>
                        <span className="loginForgot">Forgot Password?</span>
                        <Link to={'/register/'} className="loginRegisterButton"><span  >{isFetching ? <CircularProgress color='white'/> : "Create new Account"}</span></Link>
                        
                    </form>
                    
                </div>
            </div>
        </div>
    )
}
