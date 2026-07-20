import React from 'react'
import {Route,Routes,Router} from "react-router-dom"
import Login from "./Pages/Login"
import Admin from "./Pages/Admin"
import Feed from "./Pages/Feed"
import Post from "./Pages/Post"

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/admin' element={<Admin/>}/>
      <Route path='/feed' element={<Feed/>}/>
      <Route path='/post' element={<Post/>}/>
    </Routes>
  )
}

export default App
