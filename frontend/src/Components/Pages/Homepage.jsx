
import React, { useState, useEffect, useContext, useRef } from 'react';
import tryimg from '../Images/try.jpg';
import shorts from '../Images/shorts.jpg';
import { useNavigate, Link } from 'react-router-dom';
import { userContext } from '../../App';
import axios from 'axios';

axios.defaults.withCredentials = true

const Homepage = () => {
  const user = useContext(userContext)
  const [size, setSize] = useState()
  const [post, setPost] = useState([]);
  const navigate = useNavigate();
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef([]);
  const handleMouseEnter = (index) => {
    if (videoRefs.current[index].paused) {
      // Add a 2-second delay before playing the video
      // setPlayingIndex(index);
      videoRefs.current[index].play();
      // setTimeout(() => {
      // }, 500); // 2000 milliseconds (2 seconds)
    }
  };

  const handleMouseLeave = (index) => {
    setPlayingIndex(null);
    videoRefs.current[index].pause();
  };
  // console.log("Backend")
  useEffect(() => {
    axios.get('http://localhost:8090/all-videos')
      .then((posts) => {
        // console.log("Data -> ", posts.data)
        if (Array.isArray(posts.data)) {
          // If it's an array, you can access its length
          setSize(posts.data.length);
        }
        setPost(posts.data);
      })
      .catch((err) => console.log(err));
  });

  function truncateText(text, numWords) {
    const words = text.split(' ');
    if (words.length > numWords) {
      return words.slice(0, numWords).join(' ') + '...';
    }
    return text;
  }

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

  return (
    <div className='' style={{ height: '100vh' }}>
      <div className='' style={{ width: '-webkit-fill-available', minHeight: '100vh', overflow: "hidden" }}>
        <div className='row d-flex homedata m-2' style={{ width: '100vw' }}>
          {post.map((post, i) => (
            <div className='px-1 col-6 col-xs-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3' key={i} >
              <Link
                to={`/watch-video/${post.vid}/${size}`}
                className=' text-decoration-none text-black'
              >
                <div
                  className='mb-4 px-1 shadow innerdata border'
                  style={{maxHeight:'350px'}}
                  key={i}

                >
                  <video
                    ref={(ref) => (videoRefs.current[i] = ref)}
                    src={`http://localhost:8090/Files/${post.file}`}
                    className='rounded mb-3 border border-black '
                    autoPlay={playingIndex === i}
                    controls={playingIndex === i ? true : false}
                    controlsList="nodownload"
                    muted
                    loop
                    playsInline
                    style={{ width: "100%",maxHeight:'240px' }}
                    onMouseEnter={(e) => handleMouseEnter(i)}
                    onMouseLeave={(e) => handleMouseLeave(i)}
                  />
                  <div className='d-flex'>
                    {/* <i className='bi bi-person-circle fs-4'></i> */}
                    {
                      post.profile ? <img src={`http://localhost:8090/Files/${post.profile}`} style={{ width: "40px", height: "40px" }} className='profile-img rounded-5 me-1' /> : <i className='bi bi-person-circle fs-4 me-1'></i>
                    }
                    <div className='me-3 mb-1'>
                      {/* <div
                        className='fw-bold  mb-0'
                        style={{ fontSize: '20px' }}
                      >
                        {/* {post.title} | {post.vid} }
                        {post.title}
                      </div> */}
                      <div
                        className='fw-bold  mb-0'
                        style={{ fontSize: '20px' }}
                      >
                        {truncateText(post.title, 4)} {/* Truncate to 4 words */}
                      </div>
                      <div className='mb-0'>{post.username}</div>
                      <div className='mb-0'>
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
        {/* <div>
          <div className='btn'>Shorts <i class="bi bi-caret-right"></i></div>
          <hr />
          <div className='d-flex  overflow-x-hidden' style={{ width: "100%" }}>
            <div className='mx-2 scroll-container' style={{ height: "500px", width: "95%" }}>
              {
                repeater.map((i => (
                  <div key={i} className='me-4 shortsdata'>
                    <img src={`${shorts}`} style={{ width: "280px", height: "480px" }} />
                    <div className='text-light bg-dark d-flex justify-content-start align-items-bottom' style={{ marginTop: "-25px", zIndex: "20" }}>Descriptions or name of the short</div>
                  </div>
                )))
              }
              <div className='d-flex align-items-center shortsdata-more text-black px-2 justify-content-center fw-bold'>More <i class="bi bi-caret-right" style={{ height: "" }}></i></div>
            </div>
          </div>
          <hr />
        </div>
        <div className='row border border-5 border-black d-flex homedata ' style={{ width: '100vw' }}>
          {repeater2.map((data, i) => (
            <div className='px-1 col-6 col-xs-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3' key={i}>
              <Link
                to={`/watch-video/${i}/${data}`}
                className=' text-decoration-none text-black'
              >
                <div
                  className='mb-4 px-1 innerdata border'
                >
                  <video
                    src={`/Video/${data}`}
                    className='rounded mb-3 border border-black '
                    autoPlay={playingIndex === i}
                    // controls
                    onMouseEnter={(e) => handleMouseEnter(i)}
                    onMouseLeave={e => handleMouseLeave(i)}
                    style={{ width: "100%" }}
                  />
                  <div className='d-flex'>
                    <div className='me-3 mb-1 p-lg-0 p-0 p-md-0 p-sm-0 p-xl-0 p-xxl-0'>
                      <i className='bi bi-person-circle fs-4'></i>
                    </div>
                    <div className='me-3 mb-1'>
                      <div
                        className='fw-bold  mb-0'
                        style={{ fontSize: '20px' }}
                      >
                        Cars Vs Cars 566.555% People Break Their Nails After
                        This Race in GTA 5!
                      </div>
                      <div className='mb-0'>THE CASETOO</div>
                      <div className='mb-0'>
                        75K views{' '}
                        <i
                          className='bi bi-dot fw-bold'
                          style={{ fontSize: '20px' }}
                        ></i>{' '}
                        17 hours ago
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div> */}

      </div>
    </div>
  )
}

export default Homepage