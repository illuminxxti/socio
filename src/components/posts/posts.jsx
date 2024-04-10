import React, { useEffect, useState,useContext } from "react";
import "./posts.css";
import { getDocs, collection, increment,updateDoc,doc, FieldValue } from "firebase/firestore";
import { db ,auth} from "../../firebase/config";
import { authContext } from "../../firebase/firebaseContext";
import {useNavigate} from 'react-router-dom'
import { uploaderUser } from "../../firebase/uploaderuser";


function Posts() {
  const [allPost ,setAllPost] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [save, setSave] = useState(false);
  const {user,setUser} = useContext(authContext);
  const navigate = useNavigate();
  const {uploadUser,setUploadUser} = useContext(uploaderUser);
  

  useEffect(() => {
    getDocs(collection(db, "posts")).then((snapshot) => {
       setAllPost(snapshot.docs.map((product)=>{
        return {
          ...product.data(),
          id:product.id
        }
      }))
    });
  });

  const handleUploader =(id)=>{
    setUploadUser(id);
    navigate('/user');
  }

  const incrementLike=(id,like)=>{
    like+=1;
    updateDoc(doc(db,"posts",id),{
      social:{
        likes:like
      }
    })

  }

  const decrementLike=(id,like)=>{
    like-=1;
    updateDoc(doc(db,"posts",id),{
      social:{
        likes:like
      }
    })

  }

  return (
    <>
    <div className="post">
      {allPost.map((post) => {
        
        return(
         
          <div className="card">
            <div className="uploader">
              <img src={post.profileUrl} alt="" />
              <div>
              <p>Uploaded by <span onClick={()=>{handleUploader(post.uploaderId)}} style={{color:"rgb(56, 53, 223)",cursor:"pointer"}}>{post.uploaderName}</span></p>
              <p className="time">{post.createdAt}</p>
              </div>
            </div>
            <div className="img">
              <div className="adjustImg">
              <img src={post.imageUrl} alt="" className="postImage" />
              </div>
              <div className="features">
                <img
                  src="heart.png"
                  onClick={(e) => {
                    setIsLiked(!isLiked);
                      if(isLiked){
                        e.target.src="filled_heart.png";
                        incrementLike(post.id,post.social.likes);
                        console.log(post.id);
                      }
                      else{
                        e.target.src="heart.png";
                        decrementLike(post.id,post.social.likes);
                      }
                  }}
                  alt=""
                />{post.social.likes}
                <img
                  src="save-instagram.png"
                  onClick={(e) => {
                    setSave(!save);
                    save
                      ? (e.target.src="bookmark.png")
                      : (e.target.src="save-instagram.png");
                  }}
                />
              </div>
            </div>
            <div className="description">
              <p>
                {post.description}
              </p>
            </div>
          </div>)
  
      })}
    </div>
    </>
  );
}

export default Posts;
