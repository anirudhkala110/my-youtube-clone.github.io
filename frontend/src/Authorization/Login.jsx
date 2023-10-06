import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar2 from '../Utils/Navbar2'
const Login = () => {
    const [show, setShow] = useState(false)
    const [type, setType] = useState()
    const handleShowandHide = () => {
        if (show) {
            setShow(false)
        } else {
            setShow(true)
        }
    }

    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const [msg, setMsg] = useState()
    const [msg_type, setMsg_type] = useState()
    const navigate = useNavigate()
    axios.defaults.withCredentials = true
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8090/login', { email: values.email, password: values.password })
            .then(res => {
                setMsg(res.data.msg)
                setMsg_type(res.data.msg_type)
                if (res.data.msg_type === "good") {
                    navigate('/')
                }
            })
            .catch(err => {
                console.log("Error from backend", err)
            })
    }
    return (
        <div className='w-100 d-flex align-items-center justify-content-center bg-light' style={{minHeight:"70vh"}}>
            {/* <Navbar2/> */}
            <div className='container border w-25 p-3 bg-white shadow-lg rounded' style={{ minWidth: "450px", minHeight: "300px" }}>
                <form onSubmit={handleSubmit}>
                    <center><h1> Login page</h1></center>
                    {
                        msg && <div className={` alert ${msg_type === 'good' ? "alert-success text-success" : "alert-danger text-danger"} d-flex justify-content-between align-items-center`}>{msg} <i className='bi bi-x fs-5 text-danger' onClick={e => setMsg(null)}></i> </div>
                    }
                    <div className='form-group mb-3 bg-light p-2 text-dark rounded border'>
                        <label className='my-1 fw-bolder'>Email</label>
                        <input type='email' className='form-control' onChange={e => setValues({ ...values, email: e.target.value })} required />
                    </div>
                    <div className='form-group mb-3 bg-light p-2 text-dark rounded border'>
                        <label className='my-1 fw-bolder'>Password</label>
                        <div className='form-control py-0 ps-0 d-flex align-items-center'>
                            <input type={`${show ? 'text' : 'password'}`} className='form-control border-0' onChange={e => setValues({ ...values, password: e.target.value })} required />
                            <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'} fs-5`} onClick={handleShowandHide}></i>
                        </div>
                    </div>
                    <div className='my-2'>
                        <button className='w-100 btn btn-success my-1' type='submit'>Login</button>
                        <Link to='/register' className='text-decoration-none'>
                            <center className='fw-bold text-decoration-none text-dark'>Not Registered ? </center>
                            <button className='w-100 btn btn-primary text-deocration-none text-light '>Register</button>
                        </Link>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Login