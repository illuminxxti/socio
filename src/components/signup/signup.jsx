import React, { useState, useContext } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, db,storage } from "../../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import {uploadBytes,ref,getDownloadURL} from 'firebase/storage';


function Signup() {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [err,setErr] = useState("");
  const navigate = useNavigate();
  const [proPic, setProPic] = useState();

  const handleSignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, Email, Password).then(
      (userCredentials) => {
        setErr("");
        const storageRef = ref(storage,`/profilePicture/${proPic.name}`);
        uploadBytes(storageRef,proPic).then((snapshot)=>{
            getDownloadURL(ref(storage,`/profilePicture/${proPic.name}`)).then((url)=>{


                updateProfile(auth.currentUser, { displayName: Name,photoURL:url }).then(() => {
                    addDoc(collection(db, "users"), {
                      Name,
                      Email,
                      userId: userCredentials.user.uid,
                      profileUrl:url
                    })
                    navigate("/login");
                  });

            })







        }
        )
      }
    ).catch((err)=>{
      console.log(err.code);
      if("auth/invalid-email" === err.code)
      {
        setErr("*Invalid Email");
      }
      else if("auth/weak-password" === err.code)
      {
        setErr("*Password is Weak");
      }
    })
  }

  return (
    <>

      <div className="container">
        <div className="box">
          <div className="title">
            <h3>ConioApp</h3>
          </div>
          <div className="signupInputs">
            <div className="profilepictur">
              <img src={proPic ? URL.createObjectURL(proPic) : null} alt="" />
            </div>
            <div className="uploadpropic">
              <p style={{ fontSize: "14px", color: "grey" }}>
                Upload your profile picture
              </p>
              <input type="file" name="" onChange={(e)=>{setProPic(e.target.files[0])}} id="" />
            </div>
            <div className="name">
              <input
                type="text"
                placeholder="Enter your name.."
                value={Name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="email">
              <input
                type="email"
                name=""
                placeholder="Enter your email..."
                value={Email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id=""
              />
            </div>
            <div>
              <div className="password">
                <input
                  type="password"
                  name=""
                  placeholder="Create Password..."
                  id=""
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <span className="error">{err}</span>

              <div className="submitBtn">
                <button onClick={handleSignUp}>SignUp</button>
              </div>
            </div>
          </div>
          <div className="extrafeature">
            <p>
              Already have an account?
              <Link className="Link" to="/login">
                
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
