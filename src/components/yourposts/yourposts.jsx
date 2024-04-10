import React, { useEffect, useState } from "react";
import './yourposts.css'
import {db,auth} from '../../firebase/config'
import {getDoc,doc, collection, query, where, getDocs} from 'firebase/firestore'
import {onAuthStateChanged} from 'firebase/auth'

function Yourposts() {
const [products,setProducts] = useState([]);

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
         let q = query(collection(db,"posts"),where("uploaderId","==",user.uid))
            getDocs(q).then((snapshot)=>{
             setProducts(snapshot.docs.map((e)=>{
                return{
                  ...e.data()
                }
              }))
            })
            
        });
    });
    
  return (
    <div className="posts">
{
    products.map((product)=>{
        return (

            <div className="cards">
            <div className="uploaders">
                <div>
              <p> {product.uploaderName}</p>
              <p className="times">{product.createdAt}</p>
              </div>
              <div className="editImgs">
                <img src="edit.png" alt="" />
              </div>
            </div>
            <div className="imgs">
              <div className="adjustImgs">
                <img src={product.imageUrl} alt="" className="postImages" />
              </div>
              <div className="featuress">
                <img
                  src="heart.png"
                  onClick={(e) => {
                    setIsLiked(!isLiked);
                    if (isLiked) {
                      e.target.src = "filled_heart.png";
                    } else {
                      e.target.src = "heart.png";
                    }
                  }}
                  alt=""
                />
              </div>
            </div>
            <div className="descriptions">
              <p>
                {product.description}
              </p>
            </div>
          </div>
        )
    })
          

            }
    </div>
  );
}

export default Yourposts;
