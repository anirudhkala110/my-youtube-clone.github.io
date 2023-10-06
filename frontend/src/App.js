import logo from './logo.svg';
import './App.css';
import Navbar from './Utils/Navbar';
import Footer from './Utils/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Watch from './Components/Pages/Watch';
import Login from './Authorization/Login';
import Register from './Authorization/Register';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import UserData from './Authorization/UserData';
import Navbar2 from './Utils/Navbar2';
import UploadVideo from './Components/Pages/UploadVideo';
import EditVideo from './Authorization/EditVideo';

export const userContext = createContext()

function App() {
  axios.defaults.withCredentials = true
  const [user, setUser] = useState({})
  useEffect(() => {
    axios.get('http://localhost:8090/logged-in')
      .then(res => {
        setUser(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  })
  return (
    <userContext.Provider value={user}>
      <Router className="App">
        <Routes>
          <Route exact path="/" element={<Navbar />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route path="/watch-video/:id/:size" element={<Watch />} />
          <Route path="/edit-video-data/:vid" element={<EditVideo />} />
          <Route exact path='/user-data' element={<UserData />} />
          <Route exact path='/upload-video' element={<UploadVideo />} />
        </Routes>
        <Footer />
      </Router>
    </userContext.Provider>
  );
}

export default App;
