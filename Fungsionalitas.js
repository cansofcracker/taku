//Koneksi

window.onload = StartConnect;
try{
	userList = JSON.parse(sessionStorage.getItem("userList"));
}
catch{
	userList = {};
}
function StartConnect(){
//if (sessionStorage.getItem("userList") == {}){
	//userList = JSON.parse(sessionStorage.getItem("userList"));
//}
console.log(userList);
var hostname = "m16.cloudmqtt.com";
var port = 33383;
var clientID = parseInt(Math.random() * 100).toString();
var username = "joxbhppc";
var password = "8O3_Lk242C87";

mqttClient = new Paho.MQTT.Client(hostname, port, clientID);
if (document.getElementById("searchbyid") == null){
	console.log("all");
	mqttClient.onMessageArrived =  onMessageArrived;
}
else {
	console.log("search");
	mqttClient.onMessageArrived =  onSearchArrived;
}
mqttClient.onConnectionLost = StartConnect;

Connect();

}
/*Initiates a connection to the MQTT broker*/
function Connect(){
	mqttClient.connect({
		userName: "joxbhppc",
		useSSL: true,
		password: "8O3_Lk242C87",
		onSuccess: Connected,
		onFailure: ConnectionFailed
	});
}

/*Callback for successful MQTT connection */
function Connected() {
	console.log("Connected");
 // Fetch the MQTT topic from the form

    // Print output for the user in the messages div
    document.getElementById("log").innerHTML += 'Connected<br/>';
	
	subscribeTopic1();
	subscribeTopic2();
	subscribeTopic3();
}

function subscribeTopic1(){
	//Area 1
	var topic1 = "Area 1";

    // Print output for the user in the messages div
    document.getElementById("log").innerHTML += '<span>Subscribing to: ' + topic1 + '</span><br/>';
	
	// Subscribe to the requested topic
    mqttClient.subscribe(topic1);
	
}

function subscribeTopic2(){
	//Area 2
	var topic2 = "Area 2";

    // Print output for the user in the messages div
    document.getElementById("log").innerHTML += '<span>Subscribing to: ' + topic2 + '</span><br/>';
	
	// Subscribe to the requested topic
    mqttClient.subscribe(topic2);
}

function subscribeTopic3(){
	//Area 3
	var topic3 = "Area 3";

    // Print output for the user in the messages div
    document.getElementById("log").innerHTML += '<span>Subscribing to: ' + topic3 + '</span><br/>';
	
	// Subscribe to the requested topic
    mqttClient.subscribe(topic3);
	
	
	
}

/*Callback for incoming message processing */
function onMessageArrived(message) {
	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}

	var d = new Date();
	var h = addZero(d.getHours());
	var m = addZero(d.getMinutes());
	var s = addZero(d.getSeconds());
	
	/*
	var myObj = JSON.parse(message.payloadString);
	var rssi = myObj.RSSI;
	var getDistance1 = Math.pow(10,((-77-(rssi))/20));
	
	var myObj = JSON.parse(message.payloadString);
	var rssi = myObj.RSSI;
	var getDistance2 = Math.pow(10,((-77-(rssi))/20));
	
	var myObj = JSON.parse(message.payloadString);
	var rssi = myObj.RSSI;
	var getDistance3 = Math.pow(10,((-77-(rssi))/20));
	
	if (subscribeTopic1() < subscribeTopic2()) {
		message.destinationName = "Area 1";
	}else if (subscribeTopic1() > subscribeTopic2()) {
		message.destinationName = "Area 2";
	}else if (subscribeTopic1() < subscribeTopic3()) {
		message.destinationName = "Area 1";
	}else if (subscribeTopic1() > subscribeTopic3()) {
		message.destinationName = "Area 3";
	}else if (subscribeTopic2() < subscribeTopic3()) {
		message.destinationName = "Area 2";
	}else if (subscribeTopic2() > subscribeTopic3()) {
		message.destinationName = "Area 3";
	}
	
	*/
    console.log("onMessageArrived: " + message.payloadString);
	var myObj = JSON.parse(message.payloadString);
	var idP = myObj.IDPengunjung;
	userList[idP] = {"area": message.destinationName, "rssi": myObj.RSSI, "date": h + ':' + m + ':' + s }
	sessionStorage.setItem("userList", JSON.stringify(userList));
    updateScroll("messages"); // Scroll to bottom of window
	console.log(userList);
    document.getElementById("messages").innerHTML += '<span>Time: ' + h + ':' + m + ':' + s + ' | ' +  'ID Pengunjung: '+idP +  ' | '  + 'Area: '+ message.destinationName + '</span><br/>';
  }

/*Callback for failed connection*/
function ConnectionFailed(res) {
	document.getElementById("log").innerHTML += '<span>Connect failed </span><br/>';
	console.log("Connect failed:" + res.errorMessage);
}

/*Callback for lost connection*/				
function ConnectionLost(res) {
	document.getElementById("log").innerHTML += '<span>Connection Lost </span><br/>';
	console.log("ConnectionLost: Connection Lost");
    if (res.errorCode !== 0) {
        console.log("ConnectionLost: " + res.errorMessage);
    }
}


  // Called when the disconnection button is pressed
function startDisconnect() {
    mqttClient.disconnect();
    document.getElementById("log").innerHTML += '<span>Disconnected</span><br/>';
    updateScroll("log"); // Scroll to bottom of window
}

// Updates #messages div to auto-scroll
function updateScroll(fromPage) {
    var element = document.getElementById(fromPage);
    element.scrollTop = element.scrollHeight;
}

function onSearchArrived(message){
	function addZero(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
	
	var userId = document.getElementById("fullname").value;
	console.log(userId);
	
	var d = new Date();
	var h = addZero(d.getHours());
	var m = addZero(d.getMinutes());
	var s = addZero(d.getSeconds());
	
	console.log("onSearchArrived: " + message.payloadString);
	var myObj = JSON.parse(message.payloadString);
	console.log("A");
	var idP = myObj.IDPengunjung;
	console.log("B");
	userList[idP] = {"area": message.destinationName, "rssi": myObj.RSSI, "date": h + ':' + m + ':' + s };
	sessionStorage.setItem("userList", JSON.stringify(userList));
	console.log("C");
    updateScroll("searchbyid"); // Scroll to bottom of window
	console.log("D");
	console.log(userList);
	console.log("E");
	
	if (userId == idP){
		if(userList[userId]["area"] == "Area 1"){
			adaT1=myObj.RSSI;
		}
		if(userList[userId]["area"] == "Area 2"){
			adaT2=myObj.RSSI;
		}
		if(userList[userId]["area"] == "Area 3"){
			adaT3=myObj.RSSI;
		}
		
		if (adaT1 != null && adaT3 != null) {
			if (adaT1 < adaT3){
				userList[userId]["area"] == "Area 1";
			}else{
				userList[userId]["area"] == "Area 3";
			}
		}
		if (adaT2 != null && adaT3 != null) {
			if (adaT2 < adaT3){
				userList[userId]["area"] == "Area 2";
			}else{
				userList[userId]["area"] == "Area 3";
			}
		}
		document.getElementById("searchbyid").innerHTML += '<span>Time: ' + h + ':' + m + ':' + s + ' | ' +  'ID Pengunjung: '+userId +  ' | '  + 'Area: '+ userList[userId]["area"] + '</span><br/>';
		console.log("F");
	}
}

function searchByID(){
	
	var userId = document.getElementById("fullname").value;
	
	
	try{
		document.getElementById("searchbyid").innerHTML += '<span>Time: ' + userList[userId]["date"] + ' | ' +  'ID Pengunjung: '+userId +  ' | '  + 'Area: '+ userList[userId]["area"] + '</span><br/>';
	}
	catch{
		console.log('new user');
	}
}