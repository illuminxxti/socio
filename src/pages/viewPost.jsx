import React, { useEffect } from 'react'
import Header from '../components/header/header'
import Posts from '../components/posts/posts'
import {auth} from '../firebase/config';
import {useNavigate} from 'react-router-dom'
export default function ViewPost() {



  return (
    <>
      <Header/>
      <Posts/>
    </>
  )
}
