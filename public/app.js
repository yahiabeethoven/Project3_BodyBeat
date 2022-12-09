// Make sure you move your mouse around

// Open this sketch up 2 times to send video back and forth
let video;
let poseNet;
let pose;
let skeleton;
let MIRROR_video_FEED = true;

let bottomLeftX = 150;
let bottomLeftY = 380;

let bottomRightX = 500;
let bottomRightY = 380;

let topRightX = 500;
let topRightY = 100;

let radius = 180;

let maxThresh = 200;
let minThresh = 160;

let insideTopLeft = false;

let distToTopLeft;

let wristRadius = 32;

let song;
let song2;
let song3;

let drum1, drum1img, drum1touch;
let drum2, drum2img, drum2touch;
let drum3, drum3img, drum3touch;

function preload() {
  drum1img = loadImage('assets/drum1.png');
  drum2img = loadImage('assets/drum2.png');
  drum3img = loadImage('assets/drum3.png');
  // bg = loadImage('assets/background.png');
}

let myVideo;
let otherVideo;
let myCanvas;

function setup() {
  myCanvas = createCanvas(640, 480);
  myVideo = createCapture(VIDEO);
  myVideo.muted = true;
  myVideo.hide();
  
  let constraints = {
    audio: true
  };
  
  myAudio = createCapture(constraints, function(stream) {
    
    // Get a stream from the canvas to send
    let canvasStream = myCanvas.elt.captureStream(15);
    
    // Extract the audio tracks from the stream
    let audioTracks = stream.getAudioTracks();
    console.log(audioTracks);
    
    // Use the first audio track, add it to the canvas stream
    if (audioTracks.length > 0) {
      canvasStream.addTrack(audioTracks[0]);
    }
    
    // Give the canvas stream to SimpleSimplePeer as a "CAPTURE" stream
    p5lm = new p5LiveMedia(this, "CAPTURE", canvasStream, "SimpleSimplePeerAdvancedTest");
    p5lm.on('stream', gotStream);       
  });
  
  myAudio.elt.muted = true;
  myAudio.hide();

  //let ssp = new SimpleSimplePeer(this,"CANVAS",myCanvas);
  // Work-around a bug introduced by using the editor.p5js.org and iFrames.  Hardcoding the room name.
//   let p5l = new p5LiveMedia(this,"CANVAS",myCanvas, "p5LiveMediaPeerTestFun");
//   p5l.on('stream', gotStream); 
  
  poseNet = ml5.poseNet(myVideo, modelLoaded);
  poseNet.on("pose", getPoses);
  
  
//    let constraints = {audio: true, video: true};
//   myVideo = createCapture(constraints, 
//     function(stream) {
//    let p5l = new p5LiveMedia(this, "CAPTURE", stream, "BLENDEDVIDEO")
//    p5l.on('stream', gotStream);
//      myVideo.elt.muted = true;     
//       myVideo.hide();
//     }
 
//   );  
 
  
//    poseNet = ml5.poseNet(myVideo, modelLoaded);
//    poseNet.on("pose", getPoses);
  
  
  
  
  
  song = loadSound('assets/drum1.wav');
  song2 = loadSound('assets/drum2.mp3');
  song3 = loadSound('assets/drum3.wav');
  
}

function getPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function draw() {
  background(220);
  
  image(myVideo,0,0,width,height);
  ellipse(mouseX,mouseY,50,50);
  
  // Do the threshold 1 time in setup
//   loadPixels();
//   for (let i = 0; i < pixels.length; i+=4) {
//     let r = pixels[i];
//     let g = pixels[i+1];
//     let b = pixels[i+2];
        
//     if (r+b+g > 200) {
//       pixels[i] = 255;
//       pixels[i+1] = 255;
//       pixels[i+2] = 255;
//     } else {
//       pixels[i] = 0;
//       pixels[i+1] = 0;
//       pixels[i+2] = 0;
//     }
//   }
//   updatePixels();
  
  if (pose) {
    console.log("pose work")
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, (3 * d) / 4);

    drum1 = new Instrument(bottomLeftX, bottomLeftY, radius, drum1img, minThresh, maxThresh);
    
    drum1touch = drum1.wristTouch(pose.rightWrist.x,pose.rightWrist.y,pose.leftWrist.x,pose.leftWrist.y, wristRadius);
    
    drum2 = new Instrument(bottomRightX, bottomRightY, radius, drum2img, minThresh, maxThresh);
    
    drum2touch = drum2.wristTouch(pose.rightWrist.x,pose.rightWrist.y,pose.leftWrist.x,pose.leftWrist.y, wristRadius);

    drum3 = new Instrument(topRightX, topRightY, radius, drum3img, minThresh, maxThresh);
    
    drum3touch = drum3.wristTouch(pose.rightWrist.x,pose.rightWrist.y,pose.leftWrist.x,pose.leftWrist.y, wristRadius);
     
    fill(0, 255, 0);
    if (drum1touch[0] == 1 || drum1touch[1] == 1) {
      fill(255, 204, 0);
      if (drum1.size < drum1.maxSize) {
        console.log("touching drum")
        drum1.increaseRadius(20);
        if (!song.isPlaying()) {
          song.play();  
        }
      }
    }
    else {
      if (drum1.size > drum1.minSize) {
        drum1.shrinkRadius(20);
        song.stop(); 
      }
    }
    //////
    if (drum2touch[0] == 1 || drum2touch[1] == 1) {
      fill(255, 204, 0);
      if (drum2.size < drum2.maxSize) {
        console.log("touching plate")
        drum2.increaseRadius(20);
        if (!song2.isPlaying()) {
          song2.play();  
        }
      }
    }
    else {
      if (drum2.size > drum2.minSize) {
        drum2.shrinkRadius(20);
        song2.stop(); 
      }
    }
    ////////
    if (drum3touch[0] == 1 || drum3touch[1] == 1) { 
      fill(255, 204, 0);
      if (drum3.size < drum3.maxSize) {
        console.log("touching plate")
        drum3.increaseRadius(20);
        if (!song3.isPlaying()) {
          song3.play();
        }
      }
    }
    else {
      if (drum3.size > drum3.minSize) {
        drum3.shrinkRadius(20);
        song3.stop();
      }
    }
    //////////

    
    
    drum1.display();
    drum2.display();
    drum3.display();
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
      
    }
    fill(0, 0, 255);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, wristRadius);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, wristRadius);
    
  }
}

// We got a new stream!
function gotStream(stream) {
  // This is just like a video/stream from createCapture(VIDEO)
  otherVideo = stream;
  //otherVideo.id is the unique identifier for this peer
  //otherVideo.hide();
}



// class Instrument {
//   constructor(x, y, d, img, minThresh, maxThresh) {
//     this.x = x;
//     this.y = y;
//     this.radius = d;
//     this.img = img;
//     this.position = [];
//     this.minThresh = minThresh;
//     this.maxThresh = maxThresh;
//   }
//   // Getter
//   get coordinates() {
//     return this.calcPosition();
//   }
  
//   get size() {
//     return this.radius;
//   }
  
//   get maxSize() {
//     return this.maxThresh;
//   }
  
//   get minSize() {
//     return this.minThresh;
//   }
  
//   wristTouch(rightX, rightY,leftX, leftY, wristRadius) {
//     let rightTouch = 0;
//     let leftTouch = 0;
//     if (this.distanceTo(rightX,rightY) <= this.radius - 2*wristRadius) {
//       rightTouch = 1;
//     }
//     if (this.distanceTo(leftX, leftY) <= this.radius - 2*wristRadius) {
//       leftTouch = 1;
//     }
//     let wristTouches = [rightTouch, leftTouch];
//     return wristTouches;
//   }
  
//   increaseRadius(increment) {
//     this.radius += increment;  
//     // this.display();
//   }
  
//   shrinkRadius(increment) {
//     this.radius -= increment; 
//     // this.display();
//   }
  
//   calcPosition() {
//     this.position = [this.x,this.y];
//     return this.position;
//   }
  
//   distanceTo(targetX, targetY) {
//     return dist(targetX,targetY, this.x, this.y);
//   }
  
//   display () {
//     image(this.img, this.x - this.radius/2, this.y - this.radius/2, this.radius, this.radius);
//   }
  
  
