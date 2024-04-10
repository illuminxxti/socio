import React, { useContext, useState } from 'react'
import './login.css';
import {Link,useNavigate} from 'react-router-dom';
import {auth} from '../../firebase/config';
import {signInWithEmailAndPassword} from 'firebase/auth'
import { authContext } from '../../firebase/firebaseContext';



function Login() {
    const [Email,setEmail] = useState("");
    const [Password,setPassword] = useState("");
    const {user,setUser} = useContext(authContext);
    const [error,setError] = useState("");
 
    const navigate = useNavigate();
    const handleSignIn=(e)=>{
        e.preventDefault();
            signInWithEmailAndPassword(auth,Email,Password).then((userCredentials)=>{
                setError(null);
                navigate('/');
                setUser(userCredentials);
            }).catch((error)=>{
                if(error.code)
                {
                    setError("*Email or Password is Incorrect");
                }
            });
      
    }


  return (
    <div>
       <div className="container">
      <div className="box">
        <div className="title">
            <h3>ConioApp</h3>
        </div>
        <div className="signupInputs">
            <div className="email">
                <input type="email" name="" placeholder='Enter your email...' value={Email} onChange={(e)=>{setEmail(e.target.value)}} id="" />
            </div>
            <div>
            <div className="password">
                <input type="password" name="" placeholder='Enter Password...' id="" value={Password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <span className='error'>
                {error}
            </span>
            
            <div className="submitBtn">
                <button onClick={handleSignIn}>SignIn</button>
            </div>
            </div>
        </div>
        <div className="extrafeature">
            <p>Don't have an account?<Link className='Link' to='/signup'> Register</Link></p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login
