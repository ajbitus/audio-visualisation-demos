const createFileInputElement = () => {
 const fileInputElement = document.createElement("input");
 fileInputElement.setAttribute("id", "thefile");
 fileInputElement.setAttribute("type", "file");
 fileInputElement.setAttribute("accept", "audio/*");
 const contentElem = document.getElementById("content");
 contentElem.appendChild(fileInputElement);
};

const createCanvasElement = () => {
 const canvasElement = document.createElement("canvas");
 canvasElement.setAttribute("id", "canvas");
 const contentElem = document.getElementById("content");
 contentElem.appendChild(canvasElement);
};

const createAudioElement = () => {
 const audioElement = document.createElement("audio");
 audioElement.setAttribute("id", "audio");
 audioElement.setAttribute("controls", "");
 const contentElem = document.getElementById("content");
 contentElem.appendChild(audioElement);
};

const removeElementById = (id) => {
 let elementToBeRemoved = document.getElementById(id);
 if (elementToBeRemoved) {
  elementToBeRemoved.remove();
 }
};

window.onload = () => {
 createFileInputElement();
 createCanvasElement();
 //  createAudioElement();

 const file = document.getElementById("thefile");

 file.onchange = (event) => {
  removeElementById("canvas");
  removeElementById("audio");
  createCanvasElement();
  createAudioElement();

  var audio = document.getElementById("audio");

  var files = event.target.files;
  audio.src = URL.createObjectURL(files[0]);
  audio.load();
  audio.play();

  var context = new AudioContext();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 256;

  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");

  var bufferLength = analyser.frequencyBinCount;
  //   console.log(bufferLength);

  var dataArray = new Uint8Array(bufferLength);

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  //   var barWidth = (WIDTH / bufferLength) * 2.5;
  var barWidth = WIDTH / bufferLength - 1;
  var barHeight;
  var x = 0;

  function renderFrame() {
   requestAnimationFrame(renderFrame);

   x = 0;

   analyser.getByteFrequencyData(dataArray);

   ctx.fillStyle = "#000";
   ctx.fillRect(0, 0, WIDTH, HEIGHT);

   for (var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    var r = barHeight + 25 * (i / bufferLength);
    var g = 250 * (i / bufferLength);
    var b = 50;
    var a = 0;

    var r = barHeight + 25 * (i / bufferLength);
    var g = 0;
    var b = 0;
    var a = barHeight;

    // if (
    //  !!(
    //   audio.currentTime > 0 &&
    //   !audio.paused &&
    //   !audio.ended &&
    //   audio.readyState > 2
    //  )
    // ) {
    //  console.log(
    //   `Bar No: ${i + 1}, Strength: ${barHeight}, r: ${r}, g: ${g}, b: ${b} `
    //  );
    // }

    ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    ctx.fillStyle = "#fff";
    ctx.fillText(i + 1, x, 50, barWidth);

    x += barWidth + 1;
   }
  }

  audio.play();
  renderFrame();
 };
};
