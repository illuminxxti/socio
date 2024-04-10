import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import {Link, useNavigate} from 'react-router-dom'
import "./profile.css";
import Yourposts from "../yourposts/yourposts";

function Profile() {
  const navigate = useNavigate();
  const [ProPic, setProPic] = useState();
  const [changeProPic, setChangeProPic] = useState();
  const [user, setUser] = useState();
  const [profession, setProfession] = useState();
  const [bioabout, setBioAbout] = useState();
  const [oldAbout, setOldAbout] = useState();
  const [oldProfession, setOldProfession] = useState();
  const [docId, setDocId] = useState();
  const [products,setProducts] = useState([]);

  const handleUpdate = (e) => {
    e.preventDefault()
    const storageRef = ref(storage, `/profilePicture/${changeProPic.name}`);
    uploadBytes(storageRef, changeProPic).then((snapshot) => {
      getDownloadURL(ref(storage, `/profilePicture/${changeProPic.name}`)).then(
        (url) => {
          updateProfile(auth.currentUser, { photoURL: url }).then(() => {
            updateDoc(doc(db,"users",docId),{
              profileUrl:url,
              About:bioabout?bioabout:oldAbout?oldAbout:'',
              Profession:profession?profession:oldProfession?oldProfession:''
            }).then(()=>{
              let q = query(collection(db,"posts"),where("uploaderId","==",user.uid));
              getDocs(q).then((snapshot)=>{
                snapshot.forEach((snap)=>{
                  updateDoc(doc(db,"posts",snap.id),{
                    profileUrl:url
                  });
                });
              });
              let s = query(collection(db,"userChats"),where("messagers.userId","==",user.uid));
              getDocs(s).then((snapshot)=>{
                snapshot.forEach((snap)=>{
                  updateDoc(doc(db,"userChats",snap.id),{
                    "messagers.profileUrl":url
                  });
                });
              });
              navigate('/');
            })
          });
        }
      );
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setProPic(user.photoURL);
      setUser(user);
      let q = query(collection(db,"posts"),where("uploaderId","==",user.uid))
      getDocs(q).then((snapshot)=>{
       setProducts(snapshot.docs.map((e)=>{
          return{
            ...e.data()
          }
        }))
      })
      
    });
    if (user) {
      let p = query(collection(db, "users"), where("userId", "==", user.uid));
      getDocs(p).then((doc) => {
        doc.forEach((e) => {
          setOldAbout(e.data().About);
          setDocId(e.id);
          setOldProfession(e.data().Profession);
        });
      });
    }
  });


  return (
    <div className="containerProfile">
      <div className="innerContainerProfile">
        <div className="random">
      <div className="saveBtn">
        <button onClick={handleUpdate}>Save</button>
      </div>
      <div className="proFeatures">
      <Link to="/yourposts"><button>Your Posts</button></Link> 
      <Link to="/create"><button>Upload Post</button></Link> 
      </div>
        <div className="updateProPic">
          <div className="showImg">
            <img
              src={changeProPic ? URL.createObjectURL(changeProPic) : ProPic}
              alt=""
            />
          </div>
          <div className="inputImg">
            <p>Change profile pic</p>
            <input
              type="file"
              onChange={(e) => {
                setChangeProPic(e.target.files[0]);
              }}
              name=""
              id=""
            />
          </div>
        </div>
        <div className="bioabout">
          <p>Bio</p>
          <textarea
            name=""
            placeholder="Add Bio"
            defaultValue={oldAbout}
            className="changeBio"
            id=""
            value={bioabout}
            onChange={(e) => setBioAbout(e.target.value)}
            style={{ resize: "none" }}
          ></textarea>
        </div>
        <div className="currentProfession">
          <p>Profession</p>
          <textarea
            type="text"
            placeholder="Add Profession"
            id="profession"
            className="changeBio"
            style={{resize:"none",height:"4vh"}}
            defaultValue={oldProfession}
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          ></textarea>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Profile;
