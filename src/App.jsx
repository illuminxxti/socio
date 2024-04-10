import { useContext, useEffect, useState } from 'react'
import './App.css'
import Signup from './components/signup/signup'
import {Route,Routes, useNavigate } from 'react-router-dom'
import Login from './components/login/login'
import ViewPost from './pages/viewPost'
import {auth} from './firebase/config'
import {onAuthStateChanged} from 'firebase/auth'
import {authContext} from './firebase/firebaseContext'
import Createpost from './components/createpost/createpost'
import Viewyourposts from './pages/viewyourposts';
import {uploaderUser} from './firebase/uploaderuser'
import Viewuploaduser from './pages/viewuploaduser'
import ViewMessage from './pages/viewMessage'
import Profile from './components/profile/profile'



function App() {
  const [uploadUser,setUploadUser] = useState();
  const [user,setUser] = useState();
  const navigate = useNavigate();
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
     setUser(user);
    });

  })


  return (
   <>
   <authContext.Provider value={{user}}>
    <uploaderUser.Provider value={{uploadUser,setUploadUser}}>
   <Routes>

    
   <Route exact path='/' element={<ViewPost/>}/> 
   <Route path='/create' element={<Createpost/>}/>
   <Route path='/yourposts' element={<Viewyourposts/>}/>
   <Route path='/user' element={<Viewuploaduser/>}/>
   <Route path='/message' element={<ViewMessage/>}/>
   <Route path='/login' element={<Login/>}/>
   <Route path='/signup' element={<Signup/>}/>
   <Route path='/profile' element={<Profile/>}/>
  
    
   </Routes>
   </uploaderUser.Provider>
   </authContext.Provider>
   </>
  )
}

export default App
