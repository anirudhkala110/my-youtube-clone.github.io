import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';
import axios from 'axios';
import Navbar2 from '../../Utils/Navbar2';
import Login from '../../Authorization/Login';

const UploadVideo = () => {
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const user = useContext(userContext);
    console.log(user)
    const handleRoute = (route) => {
        navigate(`/${route}`);
    };

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    // console.log(user)
    const email = user.email;
    const username = user.username;
    const userId = user.userId;
    const profile = user.file
    // console.log(profile)
    const [msg, setMsg] = useState('');
    const [msg_type, setMsg_type] = useState('');

    const handleSubmmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        axios.post(`http://localhost:8090/upload-video/${title}/-/${description}/-/${profile}`, formData, { title: title, description: description, email: email, userId: userId, username: username, profile: profile })
            .then((res) => {
                console.log(res)
                setMsg(res.data.msg);
                setMsg_type(res.data.msg_type);
                if (res.data.msg_type === 'good') {
                    navigate('/')
                }

            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <Navbar2 />
            {user.email ? (
                <div className='w-100 vh-100 d-flex justify-content-center'>
                    <div className='container mt-3'>
                        <form
                            className='form shadow p-2'
                            onSubmit={(e) => handleSubmmit(e)}
                            encType='multipart/form-data' // Add this line to set the form enctype
                        >
                            {msg && <div className={`alert ${msg_type ? 'alert-success' : 'alert-warning'} d-flex align-items-center justify-content-between`}>{msg} <i className='bi bi-x-circle-fill' onClick={e => setMsg(null)}></i></div>}
                            <center className='mb-3 alert alert-info text-primary'>
                                <h1>Upload Your Video</h1>
                            </center>
                            <div className='form-group my-3'>
                                <label className='fw-bold'>Video Title</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    name='title'
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className='form-group my-3'>
                                <label className='fw-bold'>Video Description</label>
                                <textarea
                                    type='text'
                                    className='form-control'
                                    cols={30}
                                    rows={10}
                                    placeholder='max-250 words'
                                    name='description'
                                    required
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                            <div class='input-group my-3'>
                                <div class='form-control d-flex align-items-center justify-content-between'>
                                    <label class='custom-file-label fw-bold' for='inputGroupFile01'>
                                        Choose file
                                    </label>
                                    <input
                                        type='file'
                                        class='border-0'
                                        id='inputGroupFile01'
                                        required
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                            </div>
                            <button type='submit' className='btn btn-success w-100 my-4'>
                                Upload
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div>
                    <center className='alert alert-warning fs-3'>Please Login First</center>
                    <Login />
                </div>
            )}
        </>
    );
};

export default UploadVideo;
