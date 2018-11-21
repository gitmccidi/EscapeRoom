var version = 1;
var time = 3600;
var seconds = 0;
var latency = 1000;

//Welkom bericht
console.log("Dit is het scherm waarmee je de klok start en tips geeft V(" + version +")");
console.log("-De klok:");
console.log("   Typ start() en hij telt af van 10min");
console.log("   Typ start(tijdInSeconden) voor een andere tijd");
console.log("-De Tips:");
console.log("   Typ schrijf(\"tip\"), je tip moet tussen aanhalingstekens");
console.log("   Vb: schrijf(\"hallo!\")");


function schrijf(tip){
  document.getElementById("tip").innerHTML = tip;
}
function start(itime=time){
  time = itime;
  loop();
}

function specialEffects(){
    if (time < 60){
      if (document.getElementById("clock").style.color == "red") {
        document.getElementById("clock").style.color = "white"
      } else {
        console.log("else");
        document.getElementById("clock").style.color = "red"
      }
    }
}

var loop = function (){
  seconds = time%60;
  if (seconds<10){
    seconds = "0"+seconds
  }
  document.getElementById("clock").innerHTML = Math.floor(time/60) + ":" + seconds;
  console.log(time);
  time--;
  specialEffects();
  if (time > 0) {
      setTimeout(loop, latency);
  }
}
