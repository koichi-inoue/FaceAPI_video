let faceapi;
let video;
let detections;
let width = 480;
let height = 360;
let canvas, ctx;

const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

window.onload = function() { make(); }

async function make(){

    video = document.createElement('video');
    video.setAttribute("style", "display: none;");
    video.width = width;
    video.height = height;
    document.body.appendChild(video);

    const capture = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = capture;
    video.play();

    canvas = document.createElement("canvas");
    canvas.width  = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    faceapi = await ml5.faceApi(video, detection_options, modelReady)

}

function modelReady() {
    console.log('ready!')
    faceapi.detect(gotResults)
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }

    // console.log(result)
    detections = result;

    // Clear part of the canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0, width, height);

    ctx.drawImage(video, 0,0, width, height);

    if (detections) {
        if(detections.length > 0){
            drawBox(detections)
            drawLandmarks(detections)
        }
    }
    faceapi.detect(gotResults)
}

function drawBox(detections){

    for(let i = 0; i < detections.length; i++){
        const alignedRect = detections[i].alignedRect;
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

function drawLandmarks(detections){

    for(let i = 0; i < detections.length; i++){
        const mouth = detections[i].parts.mouth;
        const nose = detections[i].parts.nose;
        const leftEye = detections[i].parts.leftEye;
        const rightEye = detections[i].parts.rightEye;
        const rightEyeBrow = detections[i].parts.rightEyeBrow;
        const leftEyeBrow = detections[i].parts.leftEyeBrow;

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
