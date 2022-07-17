import { useRef, useEffect } from 'react';
import signalingSooketImage from "./signalingSooketImage.jpeg"
import './App.css';
import io from 'socket.io-client'

const socket = io('webRTCPeers', { path: "/webrtc" })

function SignalingSooketIO() {
  const localVideoRef = useRef()
  const remoteVideoRef = useRef()
  const textRef = useRef()

  const pcRef = useRef(new RTCPeerConnection(null))
  const getUserMedia = () => {
    const constraints = {
      audio: false,
      video: true
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      //displayVideo
      localVideoRef.current.srcObject = stream
      stream.getTracks().forEach(track => {
        pcRef.current.addTrack(track, stream)
      });
    }).catch((err) => { console.log("An error occurred: " + err); })
  }
  useEffect(() => {
    socket.on("connection-success", success => {
      console.log(success);
    })
    getUserMedia()
    const peerConnection = new RTCPeerConnection(null)
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        console.log(JSON.stringify(e.candidate));
      }
    }
    peerConnection.oniceconnectionstatechange = (e) => {
      console.log(e);
      //connected
      //disconnected
      //faild
      //close
    }
    peerConnection.ontrack = (e) => {
      //we got remote stream ....
      console.log(e);
      remoteVideoRef.current.srcObject = e.streams[0]
    }
    pcRef.current = peerConnection;

  }, [])

  //controls
  const createOffer = () => {
    pcRef.current.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      console.log(JSON.stringify(sdp))
      pcRef.current.setLocalDescription(sdp)
      textRef.current.value = JSON.stringify(sdp)
    }).catch(err => console.log(err))

  }
  const createAnswer = () => {
    pcRef.current.createAnswer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(sdp => {
      console.log(JSON.stringify(sdp))
      pcRef.current.setLocalDescription(sdp)
      textRef.current.value = JSON.stringify(sdp)
    }).catch(err => console.log(err))

  }
  const setRemoteDesc = () => {
    //get the sdp value from the text editor 
    const sdp = JSON.parse(textRef.current.value)
    console.log("sdp", sdp);
    pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp))

  }
  const addIceCandidate = () => {
    //get the sdp value from the text editor 
    const candidate = JSON.parse(textRef.current.value)
    console.log("adding candidate ...", candidate);
    pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
  }

  return (
    <div className="App card">
      <h1 style={{ textAlign: "center" }}>signaling with sooket io</h1>
      <img src={signalingSooketImage} alt="manually" />
      <div className='videoContainer'>
        <div className=''>
          <video className='video' ref={localVideoRef} autoPlay ></video>
          <p>local video</p>
        </div>
        <div>
          <video className='video' ref={remoteVideoRef} autoPlay ></video>
          <p>Remote video</p>
        </div>
      </div>
      <textarea ref={textRef} />
      <div className='controls'>
        <button onClick={createOffer}>CREATE OFFER SDT</button>
        <button onClick={createAnswer}>CREATE ANSWER SDT</button>
        <button onClick={setRemoteDesc}>SET REMOTE DESCRIPTION</button>
        <button onClick={addIceCandidate}>ADD THE ICE_CANDIDATE</button>
      </div>
      <h3>do this way to signaling sdp/iceCandidate manually : </h3>
      <ul className='list'>
        <li> open this tab on another tab (as reciving side)</li>
        <li>1 in calling side:press createOffer btn (as calling side) </li>
        <li>2 in calling side: copy the sdp type "offer" </li>
        <li>3 in reciving side: paste sdp in recieving sides texterea </li>
        <li>4 in reciving side: press setRemo Description btn </li>
        <li>5 in reciving side: press create answer  </li>
        <li>6 in reciving side: copy the sdp type "answer" </li>
        <li>7 in calling side: paste sdp in in calling sides texterea </li>
        <li>8 in calling side: press setRemo Description btn </li>
        <li>9 in calling side: copy one of candidate in console </li>
        <li>10 in reciving side: paste candidate in recieving sides texterea </li>
        <li>11 in reciving side: press addCandidate btn </li>
        <li> done! </li>
      </ul>
    </div>
  );
}

export default SignalingSooketIO;
