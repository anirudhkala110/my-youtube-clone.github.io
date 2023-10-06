import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar2 from '../../Utils/Navbar2';
import { userContext } from '../../App';
import axios from 'axios';

axios.defaults.withCredentials = true
const Watch = () => {
    const { id, size } = useParams();
    const currentIndex = parseInt(id);
    const [chkindex, setChkindex] = useState(null)
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [autoPlayNext, setAutoPlayNext] = useState(true);
    const [showReplay, setShowReplay] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const user = useContext(userContext)

    // console.log(user)
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setShowReplay(false);
            } else {
                videoRef.current.play();
                setShowReplay(false);
            }
        }
    };

    const handleToggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    const handlePlaybackRateChange = (newRate) => {
        setPlaybackRate(newRate);
        if (videoRef.current) {
            videoRef.current.playbackRate = newRate;
        }
    };

    const handleVideoEnded = () => {
        // alert("video ended")
        if (autoPlayNext) {
            goToPreviousVideo();
        } else {
            setIsPlaying(false);
            setShowReplay(true);
        }
    };

    const goToPreviousVideo = (e) => {
        let previousIndex = currentIndex - 1;
        if (previousIndex > 0) {
            window.location.href = `/watch-video/${previousIndex}/${size}`;
        }
    };
    // const goToPreviousVideo = () => {
    //     let previousIndex = currentIndex - 1;

    //     while (previousIndex >= 0) {
    //         // Check if the video ID at previousIndex exists in your data
    //         if (videoData[previousIndex]) {
    //             window.location.href = `/watch-video/${previousIndex}/${size}`;
    //             return; // Exit the loop and navigate to the previous video
    //         }

    //         // If the video ID doesn't exist, continue with the previous index
    //         previousIndex--;
    //     }

    //     // If no valid previous video ID was found, you can handle it here
    //     // For example, you can display an error message or take some other action.
    //     console.log("No valid previous video found.");
    // };

    const goToNextVideo = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex <= size) {
            window.location.href = `/watch-video/${nextIndex}/${size}`;
        }
        else {
            setAutoPlayNext(false)
            setIsPlaying(false);
            setShowReplay(true);
        }
    };

    const handleTimeChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    useEffect(() => {
        if (autoPlayNext) {
            setIsPlaying(true);
            setShowReplay(false);
        }
    }, [autoPlayNext]);

    useEffect(() => {
        if (videoRef.current) {
            // console.log(videoRef)
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration);
        }
    }, [videoRef.current?.currentTime, videoRef.current?.duration]);

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };
    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (videoRef.current) {
                if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen().then(() => {
                        setIsFullScreen(true);
                        document.addEventListener('fullscreenchange', exitHandler);
                    });
                } else if (videoRef.current.mozRequestFullScreen) {
                    videoRef.current.mozRequestFullScreen().then(() => {
                        setIsFullScreen(true);
                        document.addEventListener('mozfullscreenchange', exitHandler);
                    });
                } else if (videoRef.current.webkitRequestFullscreen) {
                    videoRef.current.webkitRequestFullscreen().then(() => {
                        setIsFullScreen(true);
                        document.addEventListener('webkitfullscreenchange', exitHandler);
                    });
                } else if (videoRef.current.msRequestFullscreen) {
                    videoRef.current.msRequestFullscreen().then(() => {
                        setIsFullScreen(true);
                        document.addEventListener('msfullscreenchange', exitHandler);
                    });
                }
            }
        } else {
            exitFullscreen();
        }
    };

    const exitFullscreen = () => {
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const exitHandler = () => {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            setIsFullScreen(false);
            document.removeEventListener('fullscreenchange', exitHandler);
            document.removeEventListener('mozfullscreenchange', exitHandler);
            document.removeEventListener('webkitfullscreenchange', exitHandler);
            document.removeEventListener('msfullscreenchange', exitHandler);
        }
    };

    // console.log(chkindex)

    const [loggedin, setLoggedin] = useState(false)
    const [alreadyliked, setAlreadyLiked] = useState(false)
    const [alreadydisliked, setAlreadydisLiked] = useState(false)
    const [liked, setLiked] = useState(false)
    const [disliked, setDisLiked] = useState(false)

    const handleLikedislike = (e) => {
        axios.post('http://localhost:8090/likes', { liked: liked, disliked: disliked })
            .then(res => {
                // console.log(res)
            })
            .catch(err => console.log(err))
    }
    const handleLike = () => {
        if (liked) {
            setLiked(false)
            axios.post('http://localhost:8090/likes', { liked: liked, disliked: disliked })
                .then(res => {
                    // console.log(res)
                })
                .catch(err => console.log(err))
        } else {
            if (user.email === null) {
                alert("Please Login First . .  .")
                setLoggedin(false)
            }
            else {
                setLiked(true)
                setDisLiked(false)
                axios.post('http://localhost:8090/likes', { liked: liked, disliked: disliked })
                    .then(res => {
                        // console.log(res)
                    })
                    .catch(err => console.log(err))
                // handleCommentandLike()
            }
        }
        // handleLikedislike()
    }
    // console.log(liked)
    const handledisLike = () => {
        if (disliked) {
            setLiked(false)
            setDisLiked(false)
            axios.post('http://localhost:8090/likes', { liked: liked, disliked: disliked })
                .then(res => {
                    // console.log(res)
                })
                .catch(err => console.log(err))
        } else {
            if (user.email === null) {
                alert("Please Login First . .  .")
                setLoggedin(false)
            }
            else {
                setDisLiked(true)
                setLiked(false)
                axios.post('http://localhost:8090/likes', { liked: liked, disliked: disliked })
                    .then(res => {
                        // console.log(res)
                    })
                    .catch(err => console.log(err))
                // handleCommentandLike()
            }
        }
        // handleLikedislike()
    }

    const [post, setPost] = useState({})
    const [sidePost, setSidePost] = useState([])
    useEffect(() => {
        axios.get(`http://localhost:8090/read-post/` + id)
            .then(res => {
                // console.log(res.data)
                setChkindex(res.data.vid)
                setPost(res.data)
                if (res.data.vid === null) {
                    console.log("null value")
                }
            })
            .catch(err => {
                console.log("Error is -> ", err)
                goToPreviousVideo()
            })
    }, [])
    // console.log(chkindex)
    const [allComments, setAllComments] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8090/all-videos')
            .then((posts) => {
                setSidePost(posts.data);
            })
            .catch((err) => console.log(err));
    }, []);
    function getTimeAgo(uploadDate) {
        const currentDate = new Date();
        const uploadDateObject = new Date(uploadDate);
        const timeDifferenceMillis = currentDate - uploadDateObject;
        // Convert milliseconds to seconds
        const timeDifferenceSeconds = Math.floor(timeDifferenceMillis / 1000);

        if (timeDifferenceSeconds < 60) {
            return `${timeDifferenceSeconds} seconds ago`;
        } else if (timeDifferenceSeconds < 3600) {
            const minutes = Math.floor(timeDifferenceSeconds / 60);
            return `${minutes} minutes ago`;
        } else if (timeDifferenceSeconds < 86400) {
            const hours = Math.floor(timeDifferenceSeconds / 3600);
            return `${hours} hours ago`;
        } else {
            // You can customize this part to display the full date if needed
            return uploadDateObject.toLocaleDateString();
        }
    }

    function truncateText(text, numWords) {
        const words = text.split(' ');
        if (words.length > numWords) {
            return words.slice(0, numWords).join(' ') + '...';
        }
        return text;
    }
    const navigate = useNavigate()
    const handleRoute = (e, vid, size) => {
        e.preventDefault()
        navigate(`/watch-video/${vid}/${size}`)
        window.location.reload(true)
    }

    const [show, setShow] = useState(false)
    const handleShowHideDescription = (e) => {
        if (!show) {
            setShow(true)
        }
        else {
            setShow(false)
        }
    }
    const email = user.email
    const videoId = post.vid
    const file = post.file
    const title = post.title
    const profile = user.file
    const username = user.username
    const [comment, setComment] = useState()

    const handleCommentandLike = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8090/comment-likes', { liked, comment, email, title, videoId, file, profile, username })
            .then(res => {
                if (res.data.msg_type === "good") {
                    window.location.reload(true)
                }
            })
            .catch(err => console.log(err))
    }
    const [commentArraySize, setCommentArraySize] = useState(null)
    useEffect(() => {
        axios.get('http://localhost:8090/all-comments')
            .then((response => {
                setAllComments(response.data)
                if (Array.isArray(response.data)) {
                    setCommentArraySize(response.data.length)
                }
            }))
            .catch(err => console.log(err))
    }, [])
    // console.log(allComments[0].comntUserEmail)
    // console.log("response ->", commentArraySize)
    // console.log(post)
    return (
        <div className='w-100 watch-video-page'>
            <Navbar2 />
            <div className='w-100 player-and-other-data-base'>
                <div className='container1'>
                    <div className='playerWidth'>
                        <div className='d-flex justify-content-center mt-2'>
                            <div className='shadow mb-3' style={{ maxHeight: "800px" }}>
                                {
                                    parseInt(post.vid) === parseInt(id) &&
                                    <video
                                        ref={videoRef}
                                        src={`http://localhost:8090/Files/${post.file}`}
                                        autoPlay={isPlaying}
                                        muted={isMuted}
                                        playbackRate={playbackRate}
                                        onClick={togglePlayPause}
                                        onEnded={handleVideoEnded}
                                        onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
                                        id='vdo-player'
                                        volume={volume}
                                        // className={isFullScreen ? 'hide-controls' : 'show-controls'}
                                        controls={isFullScreen ? true : false}
                                        controlsList='nodownload'
                                    />
                                }
                                {
                                    parseInt(post.vid) !== parseInt(id) && <div className='container my-5 py-5 d-flex justify-content-center align-items-center fs-2 fw-bold'>
                                        {e => goToPreviousVideo(e)}
                                    </div>
                                }
                                <div>
                                    <div className='d-flex justify-content-between'>
                                        <div className='d-flex align--items-center'>
                                            {currentIndex < size ? (
                                                <button className="btn px-2 fs-5" onClick={goToNextVideo}>
                                                    <i className='bi bi-skip-backward-fill'> </i>
                                                </button>
                                            ) : <button className="btn px-2 fs-5">No Prev </button>}
                                            <button className="btn px-2 fs-5" onClick={togglePlayPause}>
                                                {showReplay ? <i className='bi bi-arrow-counterclockwise'></i> : (isPlaying ? <i className='bi bi-pause'></i> : <i className='bi bi-play'></i>)}
                                            </button>
                                            {currentIndex > 1 ?
                                                <button className="btn px-2 fs-5" onClick={goToPreviousVideo}>
                                                    <i className='bi bi-skip-forward-fill'> </i>
                                                </button> : <button className="btn px-2 fs-5">No Next  </button>
                                            }
                                            <div className='d-flex align-items-center'>
                                                <button className="btn px-2 fs-5" onClick={handleToggleMute}>
                                                    {isMuted ? <i className='bi bi-volume-mute-fill'></i> : <i className='bi bi-volume-up-fill'></i>}
                                                </button>
                                                <input
                                                    type='range'
                                                    className='slider'
                                                    id='volume'
                                                    value={volume}
                                                    min={0}
                                                    max={1}
                                                    step={0.01}
                                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                                    style={{ width: "70px" }}
                                                />
                                            </div>

                                        </div>
                                        <div className='d-flex justify-content-between align-items-center ' style={{ width: "30vw" }}>
                                            <span className='px-2'>{formatTime(currentTime)}</span>
                                            <input
                                                type='range'
                                                className='slider'
                                                id='slider'
                                                value={currentTime}
                                                min={0}
                                                max={duration}
                                                step={0.1}
                                                onChange={handleTimeChange}
                                                style={{ width: "100%" }}
                                            />
                                            <span className='px-2'>{formatTime(duration)}</span>
                                        </div>
                                        <div>
                                            <button className="btn px-2 fs-5" onClick={() => setAutoPlayNext(!autoPlayNext)}>
                                                {autoPlayNext ? <i class="bi bi-pause-circle-fill"></i> : <i class="bi bi-play-circle-fill"></i>}
                                            </button>
                                            <select
                                                className='btn'
                                                name="Playback Speed"
                                                value={playbackRate}
                                                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                                            >
                                                <option value={0.25}>0.25x</option>
                                                <option value={0.5}>0.5x</option>
                                                <option value={0.75}>0.75x</option>
                                                <option value={1}>1x</option>
                                                <option value={1.25}>1.25x</option>
                                                <option value={1.5}>1.5x</option>
                                                <option value={1.75}>1.75x</option>
                                                <option value={2}>2x</option>
                                            </select>
                                            <i onClick={toggleFullScreen} style={{ marginTop: `${isFullScreen ? '-20px' : ""}` }} >
                                                {isFullScreen ? <button class="btn bi bi-fullscreen"></button> : <button class="btn bi bi-fullscreen"></button>}
                                            </i>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between align-items-center my-2 p-2 border rounded' style={{ background: "transparent" }}>
                                    <div className='d-flex align-items-center justify-content-between me-5'>
                                        <div className='me-2'><img src={`http://localhost:8090/Files/${post.profile}`} className='profile-img rounded-5' /></div>
                                        {/* <div className='me-2'>{post.username}</div> */}
                                        {/* <div>{truncateText(post.title, 4)}</div> */}
                                        <div>{post.title}</div>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        {
                                            user.msg_type === "error" ? <div> <Link to='/user-data' className='text-decoration-none'>Login first to like or dislike</Link> </div> : <div onClick={e => handleLike(e)}><i className={`bi ${liked ? "bi bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"} me-5`}>{user[0]}</i></div>
                                        }
                                        {
                                            user.msg_type === "error" ? <div> <Link to='/user-data' className='text-decoration-none'>Login first to like or dislike</Link> </div> : <div onClick={e => handledisLike(e)}><i className={`bi ${disliked ? "bi bi-hand-thumbs-down-fill" : "bi-hand-thumbs-down"} me-5`}>{user[0]}</i></div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='px-5 shadow bg-white description-down py-2'>
                            <h3> Description </h3>
                            <button className='btn text-decoration-none border btn-link' onClick={e => handleShowHideDescription(e)}>
                                Show More
                                {
                                    show ? <i class="bi bi-chevron-up"></i> : <i class="bi bi-chevron-down"></i>
                                }
                            </button>
                            <hr />
                            {
                                show && <div>
                                    <div className=''><img src={`http://localhost:8090/Files/${post.profile}`} className='profile-img shadow-lg rounded-5' /></div>
                                    <div className='fs-3 fw-bold'>{post.username}</div>
                                    <br />{post.description}
                                    <br />{getTimeAgo(post.updatedAt)}
                                </div>
                            }
                        </div>
                    </div>

                    <div className='widthmore1000Comments'>

                        <div className='py-2 ms-5'>
                            <div>
                                <div className='fw-bold fs-4'>
                                    Comments
                                </div>
                                {
                                    user.email ? <form className='border p-1 mb-3' onSubmit={handleCommentandLike}>
                                        <div className='form-group my-2'>
                                            {allComments.username}
                                            <label>Commenting as : {user.username}</label>
                                            <textarea className='form-control' onChange={e => setComment(e.target.value)} />
                                            <button type='submit' className='btn btn-primary mt-1'>Comment</button>
                                        </div>
                                    </form> : <div className='alert alert-warning '>To comment on this video Please <Link to='/user-data' className='text-decoration-none' >Login</Link> First</div>
                                }
                            </div>
                            {
                                allComments.map((comments, i) => (
                                    <>
                                        {
                                            post.vid === comments.vid ?
                                                <div className='p-2 mb-2 card' style={{ maxWidth: "1200px" }} key={i}>
                                                    <div className='card-header'>
                                                        {
                                                            comments.profile ? <img src={`http://localhost:8090/Files/${comments.profile}`} style={{ width: "40px", height: "40ox" }} className='profile-img rounded-5 me-3' /> : <i className='bi bi-person-circle'></i>
                                                        }
                                                        {comments.username}

                                                        {
                                                            // comments.comntUserEmail===user.email ? <div>it is true</div>:
                                                            // <div> {comments.cmntUserEmail} - {e => setLiked(comments.liked)} {e => setDisLiked(comments.disliked)} {user.email} </div>
                                                        }
                                                    </div>
                                                    <div className='card-body pb-0'>
                                                        <div className='d-flex justify-content-between'>
                                                            {comments.comment}
                                                            <h6>{getTimeAgo(comments.updatedAt)}</h6>
                                                        </div>
                                                    </div>
                                                    {/* <div className='card-title'> <i className='bi bi-hand-thumbs-up-fill'></i> 5.3k</div> */}
                                                </div> :
                                                <>
                                                    {
                                                        commentArraySize == 0 && <div className='my-3' >No Comments yet. Be the first to comment on this video </div >
                                                    }
                                                </>

                                        }

                                    </>
                                ))
                            }


                        </div>
                    </div>
                </div>
                <div className='container1-side-player '>
                    <div className='shadow' style={{ width: "100%" }}>
                        <div>
                            {sidePost.map((post, i) => (
                                <div className={`${chkindex === post.vid ? "px-1 bg-success text-light" : "px-1"}`} key={i} onClick={e => handleRoute(e, post.vid, size)}>
                                    <Link to={`/watch-video/${post.vid}/${size}`} className=' text-decoration-none text-black'
                                    >
                                        <div className='mb-4 px-1 shadow innerdata d-flex justify-content-sart align-items-center' key={i} >
                                            <video src={`http://localhost:8090/Files/${post.file}`} className='rounded me-3' style={{ width: "100px" }} />
                                            <div className='d-flex'>
                                                <div className={`me-3 mb-1${chkindex === post.vid ? 'text-light' : "text-dark"}`}>
                                                    <div
                                                        className={`fw-bold  mb-0 ${chkindex === post.vid ? 'text-light' : "text-dark"}`}
                                                        style={{ fontSize: '20px' }}
                                                    >
                                                        {truncateText(post.title, 4)} {/* Truncate to 4 words */}
                                                    </div>
                                                    <div className={`mb-0 ${chkindex === post.vid ? 'text-light' : "text-dark"}`}>{post.username}</div>
                                                    <div className={`mb-0 ${chkindex === post.vid ? 'text-light' : "text-dark"}`}>
                                                        75K views{' '}
                                                        <i
                                                            className='bi bi-dot'
                                                            style={{ fontSize: '20px' }}
                                                        ></i>{''}{getTimeAgo(post.updatedAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-100 player-and-other-data-base-container2-1'>
                <div className='px-5 shadow bg-white py-2'>
                    <h3> Description </h3>
                    <button className='btn text-decoration-none border btn-link me-3' onClick={e => handleShowHideDescription(e)}>
                        Show More
                        {
                            show ? <i class="bi bi-chevron-up ms-3"></i> : <i class="bi bi-chevron-down ms-3"></i>
                        }
                    </button>
                    <hr />
                    {
                        show && <div>
                            <div className=''><img src={`http://localhost:8090/Files/${post.profile}`} className='profile-img shadow-lg rounded-5' /></div>
                            <div className='fs-3 fw-bold'>{post.username}</div>
                            <br />{post.description}
                            <br />{getTimeAgo(post.updatedAt)}
                        </div>
                    }
                </div>
                <div className='container2 p-3'>
                    <div className='py-2' style={{ maxWidth: "800px" }}>
                        <div>
                            <div className='fw-bold fs-4'>
                                Comments
                            </div>
                            {
                                user.email &&
                                <form className='border p-1 mb-3' onSubmit={handleCommentandLike}>
                                    <div className='form-group my-2'>
                                        {allComments.username}
                                        <label>Commenting as : {user.username}</label>
                                        <textarea className='form-control' onChange={e => setComment(e.target.value)} />
                                        <button type='submit' className='btn btn-primary mt-1'>Comment</button>
                                    </div>
                                </form>
                            }
                        </div>
                        {
                            allComments.map((comments, i) => (
                                <>
                                    {
                                        post.vid === comments.vid ?
                                            <div className='p-2 mb-2 card' style={{ maxWidth: "1200px" }} key={i}>
                                                <div className='card-header'>
                                                    {
                                                        comments.profile ? <img src={`http://localhost:8090/Files/${comments.profile}`} style={{ width: "40px", height: "40ox" }} className='profile-img rounded-5 me-3' /> : <i className='bi bi-person-circle'></i>
                                                    }
                                                    {comments.username}
                                                </div>
                                                <div className='card-body'>{comments.comment}</div>
                                                {/* <div className='card-title'> <i className='bi bi-hand-thumbs-up-fill'></i> 5.3k</div> */}
                                            </div> :
                                            <>
                                                {
                                                    i === 1 && <div className='my-3' >No Comments yet. Be the first to comment on this video </div >
                                                }
                                            </>

                                    }

                                </>
                            ))
                        }

                    </div>
                    <div className='' style={{ width: "35vw" }}>
                        {sidePost.map((post, i) => (
                            <div className={`${chkindex === post.vid ? "px-1 bg-dark text-light" : "px-1"}`} key={i}>
                                <Link to={`/watch-video/${post.vid}/${size}`} className=' text-decoration-none text-black'
                                >
                                    <div className='mb-4 px-1 shadow innerdata d-flex justify-content-sart align-items-center' key={i} >
                                        <video src={`http://localhost:8090/Files/${post.file}`} className='rounded me-3' style={{ width: "100px" }} />
                                        <div className='d-flex'>
                                            <div className={`me-3 mb-1${chkindex === post.vid ? 'text-light' : "text-dark"}`}>
                                                <div
                                                    className={`fw-bold  mb-0 ${chkindex === post.vid ? 'text-light' : "text-dark"}`}
                                                    style={{ fontSize: '20px' }}
                                                >
                                                    {truncateText(post.title, 4)} {/* Truncate to 4 words */}
                                                </div>
                                                <div className={`mb-0 ${chkindex === post.vid ? 'text-light' : "text-dark"}`}>{post.username}</div>
                                                <div className={`mb-0 ${chkindex === post.vid ? 'text-light' : "text-dark"}`}>
                                                    75K views{' '}
                                                    <i
                                                        className='bi bi-dot'
                                                        style={{ fontSize: '20px' }}
                                                    ></i>{''}{getTimeAgo(post.updatedAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds - minutes * 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default Watch;
