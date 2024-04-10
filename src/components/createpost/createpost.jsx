import React, { useState } from 'react'
import {storage,auth} from '../../firebase/config'
import {uploadBytes,ref,getDownloadURL} from 'firebase/storage';
import './createpost.css';
import {addDoc,collection,setDoc,doc,updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore';
import {db} from '../../firebase/config'
import { useNavigate } from 'react-router-dom';

function Createpost() {
    const [image,setImage] = useState();
    const [desc,setDesc] = useState("");
    const navigate = useNavigate();
    const handleUpload=(e)=>{
        e.preventDefault();

        const storageRef = ref(storage,`/image/${image.name}`);
        uploadBytes(storageRef,image).then((snapshot)=>{
            getDownloadURL(ref(storage,`/image/${image.name}`)).then((url)=>{
              addDoc(collection(db,"posts"),{

                uploaderName:auth.currentUser.displayName,
                imageUrl:url,
                uploaderId:auth.currentUser.uid,
                createdAt: new Date().toLocaleString(),
                description:desc,
                social:{
                  likes:null
                },
                profileUrl:auth.currentUser.photoURL
              }).then(()=>{
                navigate('/');
              })        
            })
            })
        
    }


  return (
    <div className='fileupload'>
      <div className="form">
        <h3>Create your post</h3>
        <div className="showUploadedImage">
            <img style={{width:'10vw'}} src={image?URL.createObjectURL(image):null} alt="" />
        </div>
        <div className="image">
            <input type="file"  name="" onChange={(e)=>{setImage(e.target.files[0])}}  id="" />
        </div>
        <div className="desc">
            <textarea type="text" placeholder='Enter description...' name="" value={desc} onChange={(e)=>{setDesc(e.target.value)}} maxLength="200" id=""></textarea>
        </div>
        <div className="submit">
            <button onClick={handleUpload}>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default Createpost
