import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  getDocs,
  getDoc,
  collection,
  query,
  setDoc,
  where,
  doc,
  addDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { uploaderUser } from "../../firebase/uploaderuser";
import "./uploaduser.css";
import { Link,useNavigate } from "react-router-dom";
import { authContext } from "../../firebase/firebaseContext";
import { combinedId } from "../../firebase/messageuser";

function UploadUser() {
  const [userData, setUserData] = useState();
  const [noPosts, setNoPosts] = useState();
  const [userPosts, setUserPosts] = useState();
  const [Posts, setPosts] = useState();
  const {user} = useContext(authContext);
  const allPost = [];
  const {chatCombinedId,setChatCombinedId} = useContext(combinedId);
  const { uploadUser, setUploadUser } = useContext(uploaderUser);
  const navigate = useNavigate();

  const handleMessage = async () => {
    const combinedId = userData.userId>user.uid? userData.userId+user.uid: user.uid+userData.userId;
    setChatCombinedId(combinedId);

      
   let chatRoomExist = await getDoc(doc(db,"Messages",combinedId));
    if(chatRoomExist.exists()){
      const q = query(collection(db, "userChats"), where("owner", "==", user.uid),where("messagers.userId",'==',userData.userId));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.docs.length>0)
        {
            navigate('/message');    
        }
        else{
          addDoc(collection(db,"userChats"),{
            messagers:userData,
            owner:user.uid}).then(()=>{
              navigate('/message');
            });
        }
    }
    else{

      setDoc(doc(db,'Messages',combinedId),{
        "chats":[]
      }).then(async()=>{
        const q = query(collection(db, "userChats"), where("owner", "==", user.uid),where("messagers.userId",'==',userData.userId));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.docs.length>0)
        {
            navigate('/message');    
        }
        else{
          addDoc(collection(db,"userChats"),{
            messagers:userData,
            owner:user.uid}).then(()=>{
              navigate('/message');
            });
        }
      })

    }

   
  }

  useEffect(() => {
    const q = query(collection(db, "users"), where("userId", "==", uploadUser));
    getDocs(q).then((e) => {
      e.forEach((doc) => {
        setUserData(doc.data());
      });
     const p = query(collection(db, "posts"),where("uploaderId","==",uploadUser));
        getDocs(p).then((querySnapshot)=>{
         setPosts(querySnapshot.docs.map((e)=>{
          return {
           ...e.data()
          }
         }));
        });
    });
    setNoPosts(Posts?.length);
    });



  return (
    <div className="container-uploaduser">
      <div className="uploaduser">
        <div className="uploaderuser-left">
          <div className="uploaduser-details">
            <div className="profile">
              <img src={userData ? userData.profileUrl : ""} alt="" />
            </div>
            <div className="details">
              <div className="name">
                <p>{userData ? userData.Name : ""}</p>
              </div>
              <div className="about">
                <p>{userData ? userData.About : ""}</p>
              </div>
              <div className="about profession">
                <p>{userData ? userData.Profession : ""}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="uploaduser-right">
          <div className="followers">
            <p>Followers</p>
            <p>10</p>
          </div>
          <div className="following">
            <p>Following</p>
            <p>5</p>
          </div>
          <div className="totalposts">
            <p>Posts</p>
            <p>{noPosts ? noPosts : ""}</p>
          </div>
          <div className="message">
            <button className="btnmessage">Follow</button>
            <button className="btnmessage" onClick={handleMessage}>Message</button>
          </div>
        </div>
      </div>
      <div className="uploaduser-posts">
        {
            Posts?.map((e)=>{
            return(
              <div className="postcard">
              {/* <div className="uploader">
                <img src={e.profileUrl} alt="" />
                <div>
                <p><span>{e.uploaderName}</span></p>
                <p className="time">{e.createdAt}</p>
                </div>
              </div> */}
              <div className="img">
                <div className="adjustImg">
                <img src={e.imageUrl} alt="" className="userPostImage" />
                </div>
              </div>
              <div className="description">
                <p>
                {e.description}
                </p>
              </div>
            </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default UploadUser;
