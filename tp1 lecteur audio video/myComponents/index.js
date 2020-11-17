
import './lib/webaudio-controls.js';

const getBaseURL = () => {
  const base = new URL('.', import.meta.url);
  console.log("Base = " + base);
  return `${base}`;
};

const template = document.createElement("template");
template.innerHTML = `
<style>
  H1 {
    color: red;
  }

  .btn_custom {
    height: 3em;
    width: 3em;
    border-radius: 20px;
    background: rgb(152, 152, 152);
    background: linear-gradient(333deg, rgba(152, 152, 152, 1) 0%, rgba(255, 255, 255, 1) 100%);
    color: black;
    margin: 7px;
    cursor: pointer;
  }

  .div_general {
    box-shadow: 0px 0px 20px black;
  width: 300px;
  background-color: #000000;
  background-image: url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png');
  padding: 2em;
  border-radius: 15px;
  }

  .btn_custom_active {
    height: 3em;
    width: 3em;
    border-radius: 20px;
    background: rgb(113, 113, 113);
    background: linear-gradient(333deg, rgba(113, 113, 113, 1) 0%, rgba(255, 255, 255, 1) 100%);
    color: gray;
    margin: 7px;
    cursor: pointer;
    border-style: inset;
  }

  .btn_custom:active {
    background: rgb(113, 113, 113);
    background: linear-gradient(333deg, rgba(113, 113, 113, 1) 0%, rgba(255, 255, 255, 1) 100%);
  }

  .btn_custom:focus {
    outline: none !important;
  }

  .btn_custom_active:focus {
    outline: none !important;
  }

  .titleSound {
    font-size: 24px;
    font-weight: bold;
    font-family: sans-serif;
    overflow-x: auto;
    color: white;
  }

  .titleSound::-webkit-scrollbar {
    display: none;
  }

  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .canvas_viewer {
    border: 1px solid black;
    border-radius: 15px;
    width: 300px;
    transition: all 0.5s ease;
    transform: scaleX(1);
    transform-origin: center;
  }

  .canvas_hide {
    transform: scaleX(0);
    width: 0px;
  }

  .label_hz{
    width: 35px;
    text-align: center;
    font-size: 12px;
    background: #ffffff21;
    padding: 2px;
    border-radius: 3px;
    color: #bdbdbd;
    border: 1px #696969 solid;
  }

  .slider {
    margin: 10px 0;
    -webkit-appearance: none;
    width: 100%;
    height: 2px;
    border-radius: 5px;  
    background: #d3d3d3;
    outline: none;
    opacity: 1;
    -webkit-transition: .2s;
    transition: opacity .2s;
    cursor: pointer;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%; 
    background: #FFFFFF;
    cursor: pointer;
  }
  
  .slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #FFFFFF;
    cursor: pointer;
  }
</style>
<div id="div_general" class="div_general" style="">
  <div id="visualizerPanel" style="display: flex; flex-direction: column; justify-content: center;">
    <div id="titleSound" class="titleSound"></div>
    <!--<progress style="width: 100%;" id="progress" min=0 max=100 step=1 value=0></progress>-->
    <input class="slider" type="range" style="width: 100%;" id="progress" min=0 max=100 step=1 value=0>
    <div style="display: flex; justify-content: flex-end;color:white; font-family: sans-serif; font-size: 12px;">
      <div id="currentDuration">0:00</div>/<div id="totalDuration">0:00</div>
    </div>
  </div>
  <div id="firstcontrolPanel" style="display: flex; justify-content: center;">
    <audio id="myPlayer" crossorigin>
      
    </audio>
    <button id="stopButton" class="btn_custom">◀◀</button>
    <button id="playButton" class="btn_custom">▶</button>
    <button id="loopButton" class="btn_custom">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-clockwise" fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
      </svg>
    </button>
    <!--<webaudio-switch id="knobLoop" width="38" height="11" src="./assets/imgs/ST_button_Loop_38x11_6f.png">
    </webaudio-switch>-->

  </div>
  <div id="secondcontrolPanel" style="display: flex; justify-content: space-around; align-items: center;">
    <webaudio-knob style="cursor:default" id="knobVueMeter" src="./assets/imgs/Realistic-Vu.png" sprites="98" width="90" height="60" value=0 min="0" max="100"
      step=1>
    </webaudio-knob>
    <webaudio-knob id="knobVolume" tooltip="Volume:%s" src="./assets/imgs/bouton3.png" sprites="29" value="0" defvalue="0"  min="0"
      max="1" step=0.01>
    </webaudio-knob>
    <webaudio-knob id="knobPan" tooltip="Pan:%s" src="./assets/imgs/bouton2.png" width="70" height="80" sprites="127" value="0" defvalue="0" min="-1" max="1"
      step=0.01>
    </webaudio-knob>
  </div>
  <div style="width: 100%;
  display: flex;
  justify-content: center;">
    <webaudio-switch style="transform: rotate(90deg);" id="knobSwitchView" src="./assets/imgs/switch_toggle.png"
      value="1" sprites="2" width="50" height="50">
    </webaudio-switch>
  </div>
  <div style="display: flex;
  height: 100px;
  margin: 0 0 10px 0;">
    <canvas id="myCanvasWaveShape" class="canvas_viewer" width=300 height=100></canvas>

    <canvas id="myCanvasFrequency" class="canvas_viewer canvas_hide" width=300 height=100></canvas>
  </div>
  <div style="display: flex;
  color: lightgray;
  font-family: system-ui;">
    <div class="controls">

      <webaudio-knob id="inputgain0" src="./assets/imgs/slider_knobman2.png" width="50" height="128" sprites="30"
        value=0 min="-30" max="30" step=1 tooltip="%s DB"></webaudio-knob>
      <label class="label_hz">60</label>
      <!-- <output id="gain0">0 dB</output> -->
    </div>
    <div class="controls">

      <webaudio-knob id="inputgain1" src="./assets/imgs/slider_knobman2.png" width="50" height="128" sprites="30"
        value=0 min="-30" max="30" step=1 tooltip="%s DB"></webaudio-knob>
      <label class="label_hz">170</label>
      <!-- <output id="gain1">0 dB</output> -->
    </div>
    <div class="controls">

      <webaudio-knob id="inputgain2" src="./assets/imgs/slider_knobman2.png" width="50" height="128" sprites="30"
        value=0 min="-30" max="30" step=1 tooltip="%s DB"></webaudio-knob>
      <label class="label_hz">350</label>
      <!-- <output id="gain2">0 dB</output> -->
    </div>
    <div class="controls">

      <webaudio-knob id="inputgain3" src="./assets/imgs/slider_knobman2.png" width="50" height="128" sprites="30"
        value=0 min="-30" max="30" step=1 tooltip="%s DB"></webaudio-knob>
      <label class="label_hz">1000</label>
      <!-- <output id="gain3">0 dB</output> -->
    </div>
    <div class="controls">

      <webaudio-knob id="inputgain4" src="./assets/imgs/slider_knobman2.png" width="50" height="128" sprites="30"
        value=0 min="-30" max="30" step=1 tooltip="%s DB"></webaudio-knob>
      <label class="label_hz">3500</label>
      <!-- <output id="gain4">0 dB</output> -->
    </div>
    <div class="controls">

      <webaudio-knob id="inputgain5" src="./assets/imgs/slider_knobman2.png" width="50" height="128" sprites="30"
        value=0 min="-30" max="30" step=1 tooltip="%s DB"></webaudio-knob>
      <label class="label_hz">10000</label>
      <!-- <output id="gain5">0 dB</output> -->
    </div>
  </div>
</div>
        `;

class MyAudioPlayer extends HTMLElement {

  static get observedAttributes() { // MVC
    return ["volume", "pan"];
  }
  attributeChangedCallback(attr, oldV, newV) { // MVC
    // sera appelé par ex. lors d’un this.setAttribute(’volume’, val);
    // console.log("changement" + oldV)
    if(oldV != null){
      switch (attr) {
        case 'volume':
          this.setControlledVolume(newV);
          break;
        case 'pan':
          this.setControlledPan(newV);
        default:
        // console.log("Non reconnu");
      }
    }
    
    // console.log(attr + " - " + oldV + " - " + newV)
  }


  constructor() {
    super();
    this.viewBool = true;
    this.playBool = false;
    this.loopBool = false;
    this.volume = 0.2;
    this.pan = 0;
    this.srcString = "";
    this.filters = [];
    this.attachShadow({ mode: "open" });
    //this.shadowRoot.innerHTML = template;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    if (this.getAttribute('src') != null) {
      this.srcString = this.getAttribute('src');
      this.shadowRoot.querySelector("#myPlayer").setAttribute('src', this.srcString)
      // <source src="https://mainline.i3s.unice.fr/mooc/guitarRiff1.mp3" type="audio/mp3" />
    }
    if (this.getAttribute('volume') != null) {
      this.volume = this.getAttribute('volume');
      console.log("volume : " + this.volume)
    }
    if (this.getAttribute('pan') != null) {
      this.pan = this.getAttribute('pan');
    }

    this.basePath = getBaseURL(); // url absolu du composant
    // Fix relative path in WebAudio Controls elements
    this.fixRelativeImagePaths();


  }

  connectedCallback() {
    this.player = this.shadowRoot.querySelector("#myPlayer");
    this.player.volume = this.volume;


    this.player.addEventListener("loadeddata", (event) => {

      // get the canvas, its graphic context...
      this.canvasWaveShape = this.shadowRoot.querySelector("#myCanvasWaveShape");
      this.canvasFreq = this.shadowRoot.querySelector("#myCanvasFrequency");

      this.width = this.canvasWaveShape.width;
      this.height = this.canvasWaveShape.height;
      this.canvasContextWaveShape = this.canvasWaveShape.getContext('2d');

      this.widthFreq = this.canvasFreq.width;
      this.heightFreq = this.canvasFreq.height;
      this.canvasContextFreq = this.canvasFreq.getContext('2d');

      this.buildAudioGraph();

      this.initViewers();
      this.declareListeners();
      requestAnimationFrame(() => { this.visualize() });
      requestAnimationFrame(() => { this.visualizeFreq2() });
      requestAnimationFrame(() => { this.visualizeVueMeter() });
    });



  }

  buildAudioGraph() {
    this.player.onplay = (e) => { this.audioContext.resume(); }

    // fix for autoplay policy
    this.player.addEventListener('play', () => this.audioContext.resume());

    //Visualizer intensite
    this.vueMeter = this.shadowRoot.querySelector("#knobVueMeter")

    //contexte webaudio
    this.audioContext = new AudioContext();
    this.playerNode = this.audioContext.createMediaElementSource(this.player);
    this.pannerNode = this.audioContext.createStereoPanner();
    this.pannerNode.pan.value = this.pan;
    // Create an analyser node
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNodeVueMeter = this.audioContext.createAnalyser();

    // this.reverbNode = baseAudioContext.createConvolver();
    // set visualizer options, for lower precision change 1024 to 512,
    // 256, 128, 64 etc. bufferLength will be equal to fftSize/2
    this.analyserNode.fftSize = 1024;
    this.bufferLength = this.analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.analyserNodeVueMeter.fftSize = 1024;
    this.bufferLengthVueMeter = this.analyserNodeVueMeter.frequencyBinCount;
    this.dataArrayVueMeter = new Uint8Array(this.bufferLengthVueMeter);
    // this.playerNode.connect(this.pannerNode).connect(this.analyserNode).connect(this.audioContext.destination);

    // create the equalizer. It's a set of biquad Filters

    // Set filters
    [60, 170, 350, 1000, 3500, 10000].forEach((freq, i) => {
      var eq = this.audioContext.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      this.filters.push(eq);
    });
    this.playerNode.connect(this.pannerNode)
    // Connect filters in serie
    this.pannerNode.connect(this.filters[0]);
    for (var i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }

    // connect the last filter to the speakers
    this.filters[this.filters.length - 1].connect(this.analyserNode);

    this.playerNode.connect(this.analyserNodeVueMeter);
    this.analyserNode.connect(this.audioContext.destination);
  }

  fixRelativeImagePaths() {
    // change webaudiocontrols relative paths for spritesheets to absolute
    let webaudioControls = this.shadowRoot.querySelectorAll(
      'webaudio-knob, webaudio-slider, webaudio-switch, img'
    );
    webaudioControls.forEach((e) => {
      let currentImagePath = e.getAttribute('src');
      if (currentImagePath !== undefined) {
        //console.log("Got wc src as " + e.getAttribute("src"));
        let imagePath = e.getAttribute('src');
        //e.setAttribute('src', this.basePath  + "/" + imagePath);
        e.src = this.basePath + "/" + imagePath;
        //console.log("After fix : wc src as " + e.getAttribute("src"));
      }
    });
  }

  initViewers() {
    console.log(this.volume)
    console.log(this.pan)
    this.shadowRoot.querySelector("#knobVolume").value = this.volume;
    this.shadowRoot.querySelector("#knobPan").value = this.pan;
    this.shadowRoot.querySelector("#totalDuration").textContent = this.secondToMinute(this.player.duration);
    this.shadowRoot.querySelector("#loopButton").className = !this.loopBool ? "btn_custom" : "btn_custom_active";
    this.shadowRoot.querySelector("#titleSound").textContent = this.srcString.split("/")[this.srcString.split("/").length - 1];
  }

  declareListeners() {
    this.shadowRoot.querySelector("#playButton").addEventListener("click", (event) => {
      this.play();
    });
    this.shadowRoot.querySelector("#stopButton").addEventListener("click", (event) => {
      this.stop();
    });
    this.shadowRoot.querySelector("#loopButton").addEventListener("click", (event) => {
      this.loop();
    });

    this.shadowRoot.querySelector("#inputgain0").addEventListener("input", (event) => {
      this.changeGain(event.target.value, 0);
    });
    this.shadowRoot.querySelector("#inputgain1").addEventListener("input", (event) => {
      this.changeGain(event.target.value, 1);
    });
    this.shadowRoot.querySelector("#inputgain2").addEventListener("input", (event) => {
      this.changeGain(event.target.value, 2);
    });
    this.shadowRoot.querySelector("#inputgain3").addEventListener("input", (event) => {
      this.changeGain(event.target.value, 3);
    });
    this.shadowRoot.querySelector("#inputgain4").addEventListener("input", (event) => {
      this.changeGain(event.target.value, 4);
    });
    this.shadowRoot.querySelector("#inputgain5").addEventListener("input", (event) => {
      this.changeGain(event.target.value, 5);
    });


    this.shadowRoot.querySelector("#knobSwitchView").addEventListener("change", (event) => {
      if (event.target.value) {
        this.shadowRoot.querySelector("#myCanvasWaveShape").className = "canvas_viewer";
        this.shadowRoot.querySelector("#myCanvasFrequency").className = "canvas_viewer canvas_hide";
      }
      else {
        this.shadowRoot.querySelector("#myCanvasWaveShape").className = "canvas_viewer canvas_hide";
        this.shadowRoot.querySelector("#myCanvasFrequency").className = "canvas_viewer";
      }
    });


    this.player.addEventListener("timeupdate", (event) => {
      this.shadowRoot.querySelector("#progress").value = event.target.currentTime * 100 / this.player.duration;
      this.shadowRoot.querySelector("#currentDuration").textContent = this.secondToMinute(event.target.currentTime);
    })

    this.player.addEventListener("ended", (event) => {
      if(!this.loopBool){
        this.player.currentTime = 0;
        this.play();
      }
    })

    this.shadowRoot.querySelector("#progress").addEventListener("input", (event) => {
      let currentT = this.player.duration*event.target.value/100;
      this.player.currentTime = currentT;
      this.shadowRoot.querySelector("#currentDuration").textContent = this.secondToMinute(currentT);
    })

    this.shadowRoot
      .querySelector("#knobVolume")
      .addEventListener("input", (event) => {
        this.setVolume(event.target.value);
      });
    this.shadowRoot
      .querySelector("#knobPan")
      .addEventListener("input", (event) => {
        this.setPan(event.target.value);
      });
  }

  visualize() {
    // 1 - clear the canvas
    // like this: canvasContextWaveShape.clearRect(0, 0, width, height);
    // Or use rgba fill to give a slight blur effect
    this.canvasContextWaveShape.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.canvasContextWaveShape.fillRect(0, 0, this.width, this.height);
    // 2 - Get the analyser data - for waveforms we need time domain data
    this.analyserNode.getByteTimeDomainData(this.dataArray);

    // 3 - draws the waveform
    this.canvasContextWaveShape.lineWidth = 2;
    this.canvasContextWaveShape.strokeStyle = 'lightBlue';

    // the waveform is in one single path, first let's
    // clear any previous path that could be in the buffer
    this.canvasContextWaveShape.beginPath();
    var sliceWidth = this.width / this.bufferLength;
    var x = 0;

    for (var i = 0; i < this.bufferLength; i++) {
      // dataArray values are between 0 and 255,
      // normalize v, now between 0 and 1
      var v = this.dataArray[i] / 255;
      // y will be in [0, canvas height], in pixels
      var y = v * this.height;

      if (i === 0) {
        this.canvasContextWaveShape.moveTo(x, y);
      } else {
        this.canvasContextWaveShape.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.canvasContextWaveShape.lineTo(this.width, this.height / 2);
    // draw the path at once
    this.canvasContextWaveShape.stroke();
    // once again call the visualize function at 60 frames/s



    //animate vue meter
    // this.vueMeter
    // console.log(this.getAverageVolume(this.dataArrayVueMeter))
    // console.log(this.dataArray)
    requestAnimationFrame(() => { this.visualize() });
  }

  visualizeVueMeter() {
    //animate vue meter
    // this.vueMeter
    this.analyserNodeVueMeter.getByteFrequencyData(this.dataArrayVueMeter);
    let vol = this.getAverageVolume(this.dataArrayVueMeter);
    this.vueMeter.value = vol;
    // if(vol >= 80){
    //   document.querySelector("#div_general").style.background-color = "#FFFFFF";
    // }
    // else{
    //   document.querySelector("#div_general").style.background-color = "#000000";
    // }
    // console.log(this.dataArray)
    this.shadowRoot.querySelector("#div_general").setAttribute('style', 'background-color:rgb('+vol+', 0, 0);');
    requestAnimationFrame(() => { this.visualizeVueMeter() });
  }

  getAverageVolume(array) {
    var values = 0;
    var average;
    var length = array.length;
    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
      values += array[i];
    }
    average = values / length;
    return average;
  }

  visualizeFreq2() {
    // clear the canvas
    this.canvasContextFreq.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.canvasContextFreq.fillRect(0, 0, this.widthFreq, this.heightFreq);
    // Get the analyser data
    this.analyserNode.getByteFrequencyData(this.dataArray);

    var barWidth = this.widthFreq / this.bufferLength;
    var barHeight;
    var x = 0;
    // values go from 0 to 255 and the canvas heigt is 100. Let's rescale
    // before drawing. This is the scale factor
    var heightScale = this.heightFreq / 128;
    for (var i = 0; i < this.bufferLength; i++) {
      // between 0 and 255
      barHeight = this.dataArray[i];

      // The color is red but lighter or darker depending on the value
      this.canvasContextFreq.fillStyle = 'rgb(' + (barHeight + 100) + ',' + (230 - barHeight) + ',' + 50 + ')';
      // scale from [0, 255] to the canvas height [0, height] pixels
      barHeight *= heightScale;
      // draw the bar
      this.canvasContextFreq.fillRect(x, this.heightFreq - barHeight / 2, barWidth, barHeight / 2);

      // 1 is the number of pixels between bars - you can change it
      x += barWidth + 1;
    }
    // once again call the visualize function at 60 frames/s
    requestAnimationFrame(() => { this.visualizeFreq2() });
  }

  visualizeFreq() {
    this.canvasContextFreq.save();
    this.canvasContextFreq.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.canvasContextFreq.fillRect(0, 0, this.widthFreq, this.heightFreq);

    this.analyserNode.getByteFrequencyData(this.dataArray);
    var nbFreq = this.dataArray.length;

    var SPACER_WIDTH = 5;
    var BAR_WIDTH = 2;
    var OFFSET = 100;
    var CUTOFF = 23;
    var HALF_HEIGHT = this.heightFreq / 2;
    var numBars = 1.7 * Math.round(this.widthFreq / SPACER_WIDTH);
    var magnitude;

    this.canvasContextFreq.lineCap = 'round';

    for (var i = 0; i < numBars; ++i) {
      magnitude = 0.3 * this.dataArray[Math.round((i * nbFreq) / numBars)];

      this.canvasContextFreq.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
      this.canvasContextFreq.fillRect(i * SPACER_WIDTH, HALF_HEIGHT, BAR_WIDTH, -magnitude);
      this.canvasContextFreq.fillRect(i * SPACER_WIDTH, HALF_HEIGHT, BAR_WIDTH, magnitude);

    }

    // Draw animated white lines top
    this.canvasContextFreq.strokeStyle = "white";
    this.canvasContextFreq.beginPath();

    for (i = 0; i < numBars; ++i) {
      magnitude = 0.3 * this.dataArray[Math.round((i * nbFreq) / numBars)];
      if (i > 0) {
        //console.log("line lineTo "  + i*SPACER_WIDTH + ", " + -magnitude);
        this.canvasContextFreq.lineTo(i * SPACER_WIDTH, HALF_HEIGHT - magnitude);
      } else {
        //console.log("line moveto "  + i*SPACER_WIDTH + ", " + -magnitude);
        this.canvasContextFreq.moveTo(i * SPACER_WIDTH, HALF_HEIGHT - magnitude);
      }
    }
    for (i = 0; i < numBars; ++i) {
      magnitude = 0.3 * this.dataArray[Math.round((i * nbFreq) / numBars)];
      if (i > 0) {
        //console.log("line lineTo "  + i*SPACER_WIDTH + ", " + -magnitude);
        this.canvasContextFreq.lineTo(i * SPACER_WIDTH, HALF_HEIGHT + magnitude);
      } else {
        //console.log("line moveto "  + i*SPACER_WIDTH + ", " + -magnitude);
        this.canvasContextFreq.moveTo(i * SPACER_WIDTH, HALF_HEIGHT + magnitude);
      }
    }
    this.canvasContextFreq.stroke();

    this.canvasContextFreq.restore();
    requestAnimationFrame(() => { this.visualizeFreq() });
  }

  changeGain(sliderVal, nbFilter) {
    var value = parseFloat(sliderVal);
    this.filters[nbFilter].gain.value = value;

    // update output labels
    // var output = this.shadowRoot.querySelector("#gain" + nbFilter);
    // output.value = value + " dB";
  }



  // API
  setVolume(val) {
    this.player.volume = val;
  }

  setPan(val) {
    this.pannerNode.pan.value = val;
  }
  setControlledVolume(value) {
    this.shadowRoot.querySelector("#knobVolume").value = value;
    try {
      this.player.volume = value;
    }
    catch { }
  }
  setControlledPan(value) {
    this.pan = value;
    this.shadowRoot.querySelector("#knobPan").value = value;
    try {
      this.pannerNode.pan.value = value;
    }
    catch { }
  }


  play() {
    if (!this.playBool) {
      this.player.play();
      this.shadowRoot.querySelector("#playButton").textContent = "𝅛𝅛";
    }
    else {
      this.player.pause();
      this.shadowRoot.querySelector("#playButton").textContent = "▶";
    }
    this.playBool = !this.playBool;
  }

  loop() {
    this.loopBool = !this.loopBool;
    this.shadowRoot.querySelector("#loopButton").className = !this.loopBool ? "btn_custom" : "btn_custom_active";
    this.player.loop = this.loopBool;
  }


  stop() {
    this.player.currentTime = 0;
  }

  secondToMinute(seconds) {
    let minute = Math.floor(seconds / 60)
    let seconde = Math.floor(seconds % 60)
    seconde = seconde.toString().length < 2 ? ("0" + seconde) : seconde;
    return "" + minute + ":" + seconde
  }
}

customElements.define("my-audioplayer", MyAudioPlayer);
