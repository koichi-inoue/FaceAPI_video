let faceapi;
let video;
let width = 480;
let height = 360;
let canvas, ctx;

window.onload = function() {

  video = document.createElement('video');
  video.setAttribute("style", "display: none;");
  video.width = width;
  video.height = height;
  document.body.appendChild(video);

  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })

  canvas = document.createElement("canvas");
  canvas.width  = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');

  faceapi = ml5.faceApi(video, modelLoaded);

 }

function modelLoaded() {
  document.getElementById('message').innerHTML = '<p>FaceApi loaded! | Now Preparing! </p>';
  faceapi.detect(gotResults);
}

function gotResults(err, result) {

  document.getElementById('message').innerHTML = '<p>FaceApi Running!</p>';

  if (err) {
    console.log(err)
    return
  }

  if (result) {
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0, width, height);
    ctx.drawImage(video, 0,0, width, height);
    if(result.length > 0){
      drawBox(result)
      drawLandmarks(result)
    }
  }

  faceapi.detect(gotResults);
}

function drawBox(result){

  for(let i = 0; i < result.length; i++){
    const alignedRect = result[i].alignedRect;
    const x = alignedRect._box._x
    const y = alignedRect._box._y
    const boxWidth = alignedRect._box._width
    const boxHeight  = alignedRect._box._height

    ctx.beginPath();
    ctx.rect(x, y, boxWidth, boxHeight);
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.closePath();
  }
}

function drawLandmarks(result){

  ctx.strokeStyle = "#a15ffb";

  for(let i = 0; i < result.length; i++){
    drawPart(result[i].parts.mouth, true);
    drawPart(result[i].parts.nose, false);
    drawPart(result[i].parts.leftEye, true);
    drawPart(result[i].parts.leftEyeBrow, false);
    drawPart(result[i].parts.rightEye, true);
    drawPart(result[i].parts.rightEyeBrow, false);
  }

}

function drawPart(feature, closed){

  ctx.beginPath();
  for(let i = 0; i < feature.length; i++){
    const x = feature[i]._x;
    const y = feature[i]._y;

    if(i === 0){
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
    }
  }

  if(closed === true){
      ctx.closePath();
  }
  ctx.stroke();

}
