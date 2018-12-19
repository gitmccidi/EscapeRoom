var version = 1.4;
var time = 3600;
var seconds = 0;
var latency = 1000;
var running = false;
var username = "anonymous";

//get Date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!

var yyyy = today.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
} 
if (mm < 10) {
  mm = '0' + mm;
} 
var today = dd + '/' + mm + '/' + yyyy;

var objectDB = {
	username: username,
	parsedDate: today,
	time:0
}

//Welkom bericht
console.log("Dit is het scherm waarmee je de klok start en tips geeft V(" + version +")");
console.log("-De klok:");
console.log("   Typ start() en hij telt af van 60min");
console.log("	   Typ start(\"Jeff\") en stel een username in (voor de DataBase)")
console.log("   Typ start(username,tijdInSeconden) voor een andere tijd (username tussen \"\")");
console.log("   Typ pause() voor te pauzeren");
console.log("   Typ pause() opnieuw voor terug te starten")
console.log("   Typ finish() om te stoppen (en de tijd op te slaan in de DB)")
console.log("      Typ DataBase() voor database info (en Firebase)")
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
function start(iUsername="anonymous",itime=time){
  username = iUsername;
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

function finish(veranderTip=true){
	if (running){
		pause();
	}
	//verander tip
	if(veranderTip){
		document.getElementById("tip").style.fontSize = "10 em";
		document.getElementById("tip").innerHTML = "Escaped!";
		document.getElementById("tip").style.color = "green";
		document.getElementById("tip").style.fontWeight = "bolder";
	}
	window.localStorage.setItem("DB", window.localStorage.getItem("DB") + username + ":\t" + time + "\n");
	console.log("Geschreven naar DB:\n" + window.localStorage.getItem("DB"))
	objectDB.time = time;
	objectDB.username = username;
	var JSONDB = window.localStorage.getItem("jsonDB")
	if(JSONDB == null){
		JSONDB = "--JSON from jsonDB following:--\n";
	}
	window.localStorage.setItem("jsonDB", JSONDB + ","+ JSON.stringify(objectDB))
	console.log("Geschreven naar jsonDB:\n" + window.localStorage.getItem("jsonDB"));
}
function DataBase(){
	console.log("De DataBase(of DB) houd LOCAL de tijden en usernames bij.");
	console.log("Deze tijden kunnen later op Firebase geüpload worden.")
	console.log("   Typ readDB() om de DB te lezen");
	console.log("   Typ clearDB() om de DB naar de backup te verplaatsen (Als je de tijden op Firebase hebt geüpload bv).");
	console.log("   Typ getDB() of jsonDB() om de DB als JSON te krijgen. Deze JSON kun je op Firebase uploaden.")
}

function getDB(showBackup=false){
	jsonDB(showBackup);
}

function jsonDB(showBackup=false){
	if(showBackup){
		console.log("[" + window.localStorage.getItem("jsonBackupDB") + "]");
		console.log("\n--end backup--\n");
	} else {
		console.log("Typ getDB(true) als je ook de jsonBackup wilt")
	}
	console.log("[" + window.localStorage.getItem("jsonDB") + "]");
}

function readDB(showBackup=false){
	if(showBackup){
		console.log(window.localStorage.getItem("backupDB")+"\n--end backup--\n");
	} else {
		console.log("Typ readDB(true) als je ook de Backup wilt")
	}
	console.log(window.localStorage.getItem("DB"));
	
}

function clearDB(sure){
	if(sure){
		window.localStorage.setItem("backupDB", window.localStorage.getItem("backupDB") +  window.localStorage.getItem("DB") +"--End backup "+today+"--");
		window.localStorage.setItem("DB","");
		window.localStorage.setItem("jsonBackupDB", window.localStorage.getItem("jsonBackupDB") +  window.localStorage.getItem("jsonDB") +"--End backup "+today+"--");
		window.localStorage.setItem("jsonDB","");
	} else {
		console.log("Als je zeker bent typ clearDB(true)")
		console.log("De DB en jsonDB gaat dan naar backupDB en jsonBackupDB")
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
