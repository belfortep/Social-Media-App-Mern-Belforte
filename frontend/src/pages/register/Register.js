import './register.css'
import { useRef} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


export default function Register() {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate();

    const handleClick = async (e) =>{
        e.preventDefault();

        if(password.current.value.length < 6 || passwordAgain.current.value !== password.current.value){
            password.current.setCustomValidity("Passwords distintas");
        }else{

            const user = {
                username : username.current.value,
                email : email.current.value,
                password : password.current.value,

            }
            try{
                await axios.post('/auth/register', user);
                navigate('/login');

            }catch(err){
                console.log(err);
            }
            

        }
        
    };






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
                        <input placeholder="Username" required ref={username}  type="text" className="loginInput" />
                        <input placeholder="Email" required ref={email} type="email" className="loginInput" />
                        <input placeholder="Password" minLength="6" required ref={password} type="password" className="loginInput" />
                        <input placeholder="Password again" minLength="6" required ref={passwordAgain} type="password" className="loginInput" />
                        <button className="loginButton" type='submit'>Sign up</button>

                        <Link className="loginRegisterButton" to="/login">Log into Account</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
