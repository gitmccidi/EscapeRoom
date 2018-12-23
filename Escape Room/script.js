var version = 2.1;
var startTime = 3600;
var time = 3600;
var seconds = 0;
var latency = 1000;
var running = false;
var username = "anonymous";
var aantalTips = 0;
var bonusTijd = 0;
//Animation
var alpha = 0;
var fadeOut = false;
var footerHeight = 5;


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
var todayDB = dd.toString() + mm.toString() + yyyy.toString();

var objectDB = {
	username: username,
	parsedDate: today,
	time: 0
}

function move() {
	var elem = document.getElementById("myBar");
	var id = setInterval(frame, 50);
	function frame() {
		if (time / startTime >= 100) {
			clearInterval(id);
		} else {
			elem.style.width = time / startTime * 100 + '%';
		}
	}
}


setTimeout(info, 1000)

//Welkom bericht
function info() {
	console.log("Dit is het scherm waarmee je de klok start en tips geeft V(" + version + ")");
	console.log("-De klok:");
	console.log("   Typ start() en hij telt af van 60min");
	console.log("   Typ start(\"bv Jeff\") en stel een username in (voor de DataBase)")
	console.log("   Typ start(username,tijdInSeconden) voor een andere tijd (username tussen \"\", tijd niet)");
	console.log("   Typ pause() voor te pauzeren");
	console.log("   Typ pause() opnieuw voor terug te starten")
	console.log("   Typ finish() om te stoppen (en de tijd op te slaan in de DB)")
	console.log("      Typ DataBase() voor database info (en Firebase)")
	console.log("-De Tips:");
	console.log("   Typ schrijf(\"tip\"), je tip moet tussen aanhalingstekens");
	console.log("   Vb: schrijf(\"hallo!\")");
	console.log("   Typ schrijf(\"tip\",grootte) voor de grootte aan te passen");
	console.log("   grootte moet een getal zijn \(zonder \"\"\)");
}
var heartbeat = new Audio('heartbeat.wav');


var playSound = function () {
	heartbeat.play();
	setTimeout(playSound, heartbeat.duration);
}

function schrijf(tip, grootte = 8) {
	aantalTips++;
	console.log("Totaal aantal tips: " + aantalTips);

	document.getElementById("tip").innerHTML = tip;
	if (typeof grootte === 'string') {
		document.getElementById("tip").style.fontSize = grootte;
	} else {
		document.getElementById("tip").style.fontSize = grootte.toString() + "em";
	}

	alpha = 0.2;
	fadeOut = false;
	footerHeight = 5;

	var popupInterval = setInterval(redPopup, 10)
	function redPopup() {
		if (fadeOut) {
			alpha -= 0.02;
			if (footerHeight > 0) {
				footerHeight -= 15;
			}
			if (alpha < 0.05) {
				alpha = 0;
				document.getElementById("myProgress").style.display = "flex"
				clearInterval(popupInterval)
				document.getElementById("myProgress").style.color = "rgba(0, 128, 0, 0.3)";
			}
		} else {
			alpha += 0.02;
			if (footerHeight < 100) {
				footerHeight += 15;
			}
		}
		if (alpha >= 1) {
			fadeOut = true;
		}
		document.getElementById("myFooter").style.height = footerHeight + "%";
		document.getElementById("myFooter").style.backgroundColor = "rgba(255, 0, 0," + alpha + ")";
		document.getElementById("myProgress").style.color = "rgba(255, 0, 0," + alpha + ")";

	}
}
function start(iUsername = "anonymous", itime = time) {
	username = iUsername;
	document.getElementById("clock").style.fontSize = "9em";
	startTime = itime;
	move();

	running = true;
	time = itime;
	loop();
}


function specialEffects() {
	if (time / startTime < 0.3) {
		document.getElementById("myBar").style.backgroundColor = "rgba(255, 166, 0, 0.3)";
	}
	if (time / startTime < 0.10) {
		document.getElementById("myBar").style.backgroundColor = "rgba(255, 0, 0, 0.3)";
		if (document.getElementById("clock").style.color == "red") {
			document.getElementById("clock").style.color = "white"
		} else {
			document.getElementById("clock").style.color = "red"
		}
	}
}

function pause() {
	running = !running;
	if (running) {
		loop();
	}
}

function bonus(bonusTijd = false) {
	if (bonusTijd) {
		document.getElementById("clock").style.color = "green";
		var bonusInterval = setInterval(addSeconds, 50)
	} else {
		console.log("Typ bonus(tijdInSeconden), bv: bonus(60) voor 60 bonus seconden.");
	}

	function addSeconds() {
		time++;
		bonusTijd--;
		seconds = time % 60;
		if (seconds < 10) {
			seconds = "0" + seconds
		}
		document.getElementById("clock").innerHTML = Math.floor(time / 60) + ":" + seconds;
		if (bonusTijd <= 0){
			document.getElementById("clock").style.color = "white";
			clearInterval(bonusInterval);
		}
	}
}

function finish(veranderTip = true) {
	if (running) {
		pause();
	}
	//verander tip
	if (veranderTip) {
		document.getElementById("tip").style.fontSize = "10 em";
		document.getElementById("tip").innerHTML = "Escaped!";
		document.getElementById("tip").style.color = "green";
		document.getElementById("tip").style.fontWeight = "bolder";
	}
	if (window.localStorage.getItem("DB") == null) {
		window.localStorage.setItem("DB") == "";
	}
	window.localStorage.setItem("DB", window.localStorage.getItem("DB") + username + ":\t" + time + "\n");
	console.log("Geschreven naar DB:\n" + window.localStorage.getItem("DB"))
	objectDB.time = time;
	objectDB.username = username;
	objectDB.tips = aantalTips;
	var JSONDB = window.localStorage.getItem("jsonDB")
	if (JSONDB == null) {
		JSONDB = "";
	}
	window.localStorage.setItem("jsonDB", JSONDB + JSON.stringify(objectDB) + ",")
	console.log("Geschreven naar jsonDB:\n" + window.localStorage.getItem("jsonDB"));
}
function DataBase() {
	console.log("De DataBase(of DB) houd LOCAL de tijden en usernames bij.");
	console.log("Deze tijden kunnen later op Firebase geüpload worden.")
	console.log("   Typ readDB() om de DB te lezen");
	console.log("   Typ clearDB() om de DB naar de backup te verplaatsen \n   (Als je de tijden op Firebase hebt geüpload bv).");
	console.log("   Typ getDB() of jsonDB() om de DB als JSON te krijgen. \n   Deze JSON kun je op Firebase uploaden.")
	console.log("		Typ getOnlineDB() voor  de DB van Firebase te lezen.")
	console.log("		=> Gebruik autoDB() en download automatisch de geüpdate DB als JSON te krijgen. Deze JSON kan op Firebase direct geïmporteerd worden")
}

function getOnlineDB() {
	firebase.database().ref('/leaderboard').once('value').then(function (snapshot) {
		console.log(snapshot);
		console.log(JSON.stringify(snapshot.val()));
	});
}

function autoDB() {
	if (window.navigator.onLine) {
		var newDB = window.localStorage.getItem("jsonDB")
		var newDB = newDB.slice(0, newDB.length - 1);
		var oldDB = "";
		firebase.database().ref('/leaderboard').once('value').then(function (snapshot) {
			console.log(snapshot);
			oldDB = JSON.stringify(snapshot.val());
			var oldDB = oldDB.slice(0, oldDB.length - 1) + ",";
			var updatedDB = oldDB + newDB + "]";
			var downloadName = "escaperoomLeaderboard(" + todayDB + ").json";
			alert("If you have succesfully updated the database, please type clearDB(true)")
			console.log("Downloading as JSON: \n" + updatedDB);
			download(downloadName, updatedDB);
			window.open('https://console.firebase.google.com/u/0/project/steammaaseik/database/steammaaseik/data/leaderboard', '_blank');
		})

	} else {
		console.log("\n You are not online!")
	}
}

function getDB(showBackup = false) {
	jsonDB(showBackup);
}

function jsonDB(showBackup = false) {
	if (showBackup) {
		console.log(window.localStorage.getItem("jsonBackupDB"));
		console.log("\n--end backup--\n");
	} else {
		console.log("Typ getDB(true) als je ook de jsonBackup wilt")
	}
	console.log(window.localStorage.getItem("jsonDB"));
}

function readDB(showBackup = false) {
	if (showBackup) {
		console.log(window.localStorage.getItem("backupDB") + "\n--end backup--\n");
	} else {
		console.log("Typ readDB(true) als je ook de Backup wilt")
	}
	console.log(window.localStorage.getItem("DB"));

}

function clearDB(sure) {
	if (sure) {
		window.localStorage.setItem("backupDB", window.localStorage.getItem("backupDB") + window.localStorage.getItem("DB") + "--End backup " + today + "--");
		window.localStorage.setItem("DB", "");
		window.localStorage.setItem("jsonBackupDB", window.localStorage.getItem("jsonBackupDB") + window.localStorage.getItem("jsonDB") + "--End backup " + today + "--");
		window.localStorage.setItem("jsonDB", "");
	} else {
		console.log("Als je zeker bent typ clearDB(true)")
		console.log("De DB en jsonDB gaat dan naar backupDB en jsonBackupDB")
	}
}

var loop = function () {
	seconds = time % 60;
	if (seconds < 10) {
		seconds = "0" + seconds
	}
	document.getElementById("clock").innerHTML = Math.floor(time / 60) + ":" + seconds;
	time--;
	specialEffects();
	if (time > 0 && running) {
		setTimeout(loop, latency);
	}
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

