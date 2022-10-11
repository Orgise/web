// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
// https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API
// https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API

const videoElm = document.getElementById('video');
const logElm = document.getElementById('log');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const canvas = document.getElementById('canvas');
const picBtn = document.getElementById('pic');
const photo = document.getElementById('photo');

startBtn.addEventListener('click', startCapture, false);
stopBtn.addEventListener('click', stopCapture, false);
picBtn.addEventListener('click', function(ev){
  takepicture();
  ev.preventDefault();
}, false);

const displayMediaOptions = {
    video: {
        cursor: 'never',
        frameRate: 60
    },
    audio: false
};

const streamOptions = {
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 2500000,
  mimeType: 'video/webm'
};

let mediaRecorder;
let recordedChunks = [];

async function startCapture() {
    logElm.innerHTML = '';

    try {
        videoElm.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      
        try {
            mediaRecorder = new MediaRecorder(videoElm.srcObject, streamOptions);
        } catch (e) {
            console.error('Exception while creating MediaRecorder: ' + e);
            return;
        }

        console.log('MediaRecorder created');
        mediaRecorder.ondataavailable = recorderOnDataAvailable;
        mediaRecorder.start(100);
      
        logInfo();
    } catch (err) {
        logElm.innerHTML += `Error: ${err}`;
    }
}

function recorderOnDataAvailable(event) {
    if (event.data.size !== 0) {
      recordedChunks.push(event.data);
    }
}

function stopCapture(evt) {
    console.log('Saving data');
    mediaRecorder.stop();
  
    let tracks = videoElm.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElm.srcObject = null;
    
    if (confirm('Would you like to download the recording?')) {
      var blob = new Blob(recordedChunks, { type: "video/webm" });
      var url = window.URL.createObjectURL(blob);

      createDownloadLink(url);
    }
}

function logInfo() {
    const videoTrack = videoElm.srcObject.getVideoTracks()[0];
    logElm.innerHTML = `Track settings:
    ${JSON.stringify(videoTrack.getSettings(), null, 2)}
    Track constraints:
    ${JSON.stringify(videoTrack.getConstraints(), null, 2)}`;
}

function takepicture() {
    var context = canvas.getContext('2d');
    // if (width && height) {
      canvas.width = 100;
      canvas.height = 100;
      context.drawImage(video, 0, 0, 100, 100);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    // } else {
    //   clearphoto();
    // }
  }

function createDownloadLink(url) {
  var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = 'test.webm';
    a.click();
    a.remove();
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }