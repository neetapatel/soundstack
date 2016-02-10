/**
 * @name soundstack
 * @description <p>Visualize + compile the frequency spectrums of live audio input.</p>
 */
 
var mic, fft;
var pastSpecs = [];
var pastColor = [];
var redC, blueC, greenC;
var currentSpectrum;

function setup() {
   createCanvas(710, 800);
   noFill();

  // maybe change this to song inputs, instead of live input.
   mic = new p5.AudioIn();
   mic.start();
   fft = new p5.FFT(0.8);
   fft.setInput(mic);
}

function draw() {
  background(0,0,0);
   
  // var waveform = fft.waveform();

  // draw all saved spectrums
  // are most recent ones drawn on top?
  for (j = 0; j < pastSpecs.length; j++) {
    var oldSpectrum = pastSpecs[j];
    stroke(pastColor[j]);
    if (oldSpectrum) {
      beginShape();
      for (i = 0; i < oldSpectrum.length; i++) {
        var logX = Math.log(i); // take log of frequency bins
        vertex(logX*100, map(oldSpectrum[i], 0, 255, height, 0));
      }
      endShape();
    }
  }
   
  // draw live spectrum feed.
  strokeWeight(2);
  redC = random(0, 255);
  blueC = random(0, 255);
  greenC = random(0, 255);
  stroke(redC, blueC, greenC);
  // analyze() returns an array of amplitude values (between 0 and 255) across 
  // the frequency spectrum. Length is equal to FFT bins (1024 by default). The 
  // array indices correspond to frequencies (i.e. pitches), from the lowest to 
  // the highest that humans can hear. Each value represents amplitude at that 
  // slice of the frequency spectrum. 
  currentSpectrum = fft.analyze();
  beginShape();
  for (i = 0; i < currentSpectrum.length; i++) {
    var logX = Math.log(i); // take log of frequency bins
    vertex(logX*100, map(currentSpectrum[i], 0, 255, height, 0));
  }
  endShape();
}

// i dont think this is doing anything yet.
/*
// map to a color for each saved spectrum.
function mapWaveform(wavearray) {
  var newRed = map(i, 0, waveform.length, 0, 255);
  var newBlue = map(i, 0, waveform.length, 0, 255);
  var newGreen = map(i, 0, waveform.length, 0, 255);
  return color(newRed, newBlue, newGreen);
}
*/

// if any key is pressed, save canvas + spectrum points + color.
function keyPressed() {
  // do we actually need to save a canvas? i forget why this is here.
  saveCanvas('myCanvas', 'jpg');
  var img = loadImage("assets/myCanvas.jpg");
  
  pastSpecs.push(currentSpectrum.slice());
  image(img, 0, 0); 
  pastColor.push(color(redC, greenC, blueC));
}

// there must be a way to make the general accumulation of sound more meaningful.  
// maybe we automate the 'keyPressed' function so that it automatically collects 
// old spectrums? would that show the user something abt the sound? i just want to 
// push this to be something other than a cool looking visual. what can the 
// visual show us that is mildly interesting?