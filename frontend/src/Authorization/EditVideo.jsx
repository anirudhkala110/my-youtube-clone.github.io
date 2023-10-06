import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar2 from '../Utils/Navbar2'
import { userContext } from '../App'

axios.defaults.withCredentials = true
const EditVideo = () => {
    const user = useContext(userContext)
    const { vid } = useParams()
    const [Post, setPost] = useState({})
    const [description, setDescription] = useState()
    const [title, setTitle] = useState()
    const [userId, setUserId] = useState()
    const [username, setusername] = useState()
    const [file, setfile] = useState()
    const [email, setEmail] = useState()
    useEffect(() => {
        axios.get(`http://localhost:8090/read-post/` + vid)
            .then(res => {
                console.log(res.data, vid)
                setPost(res.data)
            })
            .catch(err => console.log(err))
    }, [])
    const navigate = useNavigate()
    const handleUpdate = (e) => {
        e.preventDefault()
        console.log(title, " ", description)
        if (!title || title === '') {
            setTitle(Post.title)
        }
        if (!description || description === '') {
            setDescription(Post.description)
        }
        console.log(title, " ", description)
        setUserId(Post.userId)
        setusername(Post.username)
        setfile(Post.file)
        setEmail(Post.email)
        axios.put(`http://localhost:8090/edit-video/${vid}`, { title: title, description: description })
            .then(result => {
                if (result.data.msg_type === "good") {
                    navigate('/user-data')
                }
                else {
                    alert("Not Updated. . . . ")
                }
            })
            .catch(err => console.log(err))
    }
    return (
        <div>
            <Navbar2 />
            {
                user.email === null ? <div className='alert alert-warning fs-2 fw-bold'>Please Login First</div> :
                    <div>
                        <center className='container border my-5 d-flex align-items-center justify-content-center fs-2 rounded bg-warning shadow btn-outline-warning btn text-light fw-bold'>Old Information</center>
                        <div className='card p-3 m-3'>
                            <div className='card-header bg-primary fw-bold text-light'><b>Title :</b> {Post.title}</div>
                            <div className='card-body alert alert-success m-0 py-3'><b>Description :</b> {Post.description}</div>
                        </div>
                        <form onSubmit={e => handleUpdate(e)} className='p-3 m-3 rounded border'>
                            <center className='fw-bold fs-3 my-3 bg-primary rounded text-light'>New Data</center>
                            <div className='form-group mb-3'>
                                <label className='fw-bold mb-1'>Title of the Video</label>
                                <input type='text' className='form-control' placeholder={Post.title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div className='form-group mb-3'>
                                <label className='fw-bold mb-1'>Description of the Video</label>
                                <textarea type='text' className='form-control' placeholder={Post.description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <button type='submit' className='btn btn-outline-success'>Submit</button>
                        </form>
                    </div>
            }
        </div>
    )
}

export default EditVideo