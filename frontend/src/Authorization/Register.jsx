import axios from 'axios'
import React, { useState } from 'react'

import { Link } from 'react-router-dom'
const Register = () => {
    const [show, setShow] = useState(false)
    const [show2, setShow2] = useState(false)
    const [type, setType] = useState()
    const handleShowandHide = () => {
        if (show) {
            setShow(false)
        } else {
            setShow(true)
        }
    }
    const handleShowandHide1 = (e) => {
        if (show2) {
            setShow2(false)
        } else {
            setShow2(true)
        }
    }
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: '',
        phone: ''
    })
    const [file, setFile] = useState()
    const [msg, setMsg] = useState()
    const [msg_type, setMsg_type] = useState()
    axios.defaults.withCredentials = true
    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', file);
        axios.post(`http://localhost:8090/register/${values.name}/${values.email}/${values.phone}/${values.password}/${values.cpassword}`, formData)
            .then(res => {
                setMsg(res.data.msg)
                setMsg_type(res.data.msg_type)
            })
            .catch(err => {
                console.log("Error from backend", err)
            })
    }
    // console.log(file)
    return (
        <div className='w-100 vh-100 d-flex align-item-start justify-content-center bg-light'>
            <div className='container my-5 border w-25 p-3 bg-white shadow-lg rounded' style={{ minWidth: "550px", minHeight: "550px" }}>
                <form onSubmit={e => handleSubmit(e)}>
                    <center><h1> Registration page</h1></center>
                    {
                        msg && <div className={` alert ${msg_type === 'good' ? "alert-success text-success" : "alert-danger text-danger"} d-flex justify-content-between align-items-center`}>{msg} <i className='bi bi-x fs-5 text-danger' onClick={e => setMsg(null)}></i> </div>
                    }
                    <div className='form-group mb-3 bg-light p-2 text-dark rounded border'>
                        <label className='my-1 fw-bolder'> Your  Name</label>
                        <input type='text' className='form-control' onChange={e => setValues({ ...values, name: e.target.value })} />
                    </div>
                    <div class='form-group mb-3 bg-light p-2 text-dark rounded border form-control d-flex align-items-center justify-content-between'>
                        <label class='custom-file-label fw-bold' for='inputGroupFile01'>
                            Profile Pic
                        </label>
                        <input
                            type='file'
                            class='border-0'
                            id='file'
                            required
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>
                    <div className='form-group mb-3 bg-light p-2 text-dark rounded border'>
                        <label className='my-1 fw-bolder'>Phone</label>
                        <input type='number' className='form-control' onChange={e => setValues({ ...values, phone: e.target.value })} />
                    </div>
                    <div className='form-group mb-3 bg-light p-2 text-dark rounded border'>
                        <label className='my-1 fw-bolder'>Email</label>
                        <input type='email' className='form-control' onChange={e => setValues({ ...values, email: e.target.value })} />
                    </div>
                    <div className='form-group mb-3 bg-light p-2 text-dark rounded border'>
                        <label className='my-1 fw-bolder'>Password</label>
                        <div className='form-control py-0 ps-0 d-flex align-items-center'>
                            <input type={`${show ? 'text' : 'password'}`} className='form-control border-0' onChange={e => setValues({ ...values, password: e.target.value })} />
                            <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'} fs-5`} onClick={e => handleShowandHide(e)}></i>
                        </div>
                    </div>
                    <div className='form-group mb-3 bg-light p-2 text-dark rounded border'>
                        <label className='my-1 fw-bolder'>Confirm Password</label>
                        <div className='form-control py-0 ps-0 d-flex align-items-center'>
                            <input type={`${show2 ? 'text' : 'password'}`} className='form-control border-0' onChange={e => setValues({ ...values, cpassword: e.target.value })} />
                            <i className={`bi ${show2 ? 'bi-eye-slash' : 'bi-eye'} fs-5`} onClick={e => handleShowandHide1(e)}></i>
                        </div>
                    </div>
                    <div className='my-2'>
                        <button className='w-100 btn btn-success my-1' type='submit'>Register</button>
                        <Link to='/login' className='text-decoration-none'>
                            <center className='fw-bold text-decoration-none text-dark'>Already Registered ? </center>
                            <button className='w-100 btn btn-primary text-deocration-none text-light '>Login</button>
                        </Link>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default Register