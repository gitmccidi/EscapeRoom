var version = 1.4;
var time = 600;
var seconds = 0;
var latency = 1000;
var running = false;


//Welkom bericht
console.log("Dit is het scherm waarmee je de klok start en tips geeft V(" + version +")");
console.log("-De klok:");
console.log("   Typ start() en hij telt af van 10min");
console.log("   Typ start(tijdInSeconden) voor een andere tijd");
console.log("   Typ pause() voor te pauzeren");
console.log("   Typ pause() opnieuw voor terug te starten")
console.log("-De Tips:");
console.log("   Typ schrijf(\"tip\"), je tip moet tussen aanhalingstekens");
console.log("   Vb: schrijf(\"hallo!\")");
console.log("   Typ schrijf(\"tip\#,grootte) voor de grootte aan te passen");
console.log("   grootte moet een getal zijn \(zonder \"\"\)");
var heartbeat = new Audio('heartbeat.wav');


var playSound = function (){
  heartbeat.play();
  setTimeout(playSound, heartbeat.duration);
}

function schrijf(tip,grootte=8){
  document.getElementById("tip").innerHTML = tip;
  if (typeof grootte === 'string'){
     document.getElementById("tip").style.fontSize = grootte;
  } else {
  document.getElementById("tip").style.fontSize = grootte.toString()+"em";
  }
}
function start(itime=time){
  document.getElementById("clock").style.fontSize = "9em";

  running = true;
  time = itime;
  loop();
}

function specialEffects(){
    if (time < 60){
      if (document.getElementById("clock").style.color == "red") {
        document.getElementById("clock").style.color = "white"
      } else {
        document.getElementById("clock").style.color = "red"
      }
    }
}

function pause(){
   running = !running;
   if (running){
      loop();
   }
}


var loop = function (){
  seconds = time%60;
  if (seconds<10){
    seconds = "0"+seconds
  }
  document.getElementById("clock").innerHTML = Math.floor(time/60) + ":" + seconds;
  time--;
  specialEffects();
  if (time > 0 && running) {
      setTimeout(loop, latency);
  }
}
