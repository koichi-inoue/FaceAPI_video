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
        ctx.strokeStyle = "#a15ffb";
        ctx.stroke();
        ctx.closePath();
    }
}

function drawLandmarks(result){

    for(let i = 0; i < result.length; i++){
        const mouth = result[i].parts.mouth;
        const nose = result[i].parts.nose;
        const leftEye = result[i].parts.leftEye;
        const rightEye = result[i].parts.rightEye;
        const rightEyeBrow = result[i].parts.rightEyeBrow;
        const leftEyeBrow = result[i].parts.leftEyeBrow;

        drawPart(mouth, true);
        drawPart(nose, false);
        drawPart(leftEye, true);
        drawPart(leftEyeBrow, false);
        drawPart(rightEye, true);
        drawPart(rightEyeBrow, false);
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
