autowatch = 1;
outlets = 2;
var drawto = 0;
declareattribute("drawto", null, null, 1);
var locklook = 1;
var tripod = 1;

var keydownmap = {
		"a" : function() {outlet(0, "ui_key", "a")},
		"d" : function() {outlet(0, "ui_key", "d")},
		"z" : function() {outlet(0, "ui_key", "z")},
		"q" : function() {outlet(0, "ui_key", "q")},
		"w" : function() {outlet(0, "ui_key", "w")},
		"s" : function() {outlet(0, "ui_key", "s")},
		"r" : function() {outlet(0, "anim_reset"); outlet(1, "anim_reset");},
		"f" : function() { fixwindows();},
		"l" : function() {locklook++;locklook %= 2; outlet(1, "locklook",locklook );},
		"t" : function() {tripod++;tripod %= 2; outlet(1, "tripod",tripod );}
		
	};
	
var keyupmap = {
		"a" : function() {outlet(0, "ui_keyup", "a")},
		"d" : function() {outlet(0, "ui_keyup", "d")},
		"z" : function() {outlet(0, "ui_keyup", "z")},
		"q" : function() {outlet(0, "ui_keyup", "q")},
		"w" : function() {outlet(0, "ui_keyup", "w")},
		"s" : function() {outlet(0, "ui_keyup", "s")},
	};
	
function findwindowbytitle(title) {
	var win = max.frontpatcher.wind;
	while(win != null ) {
		if(win.title == title) {
			break;
		}
		win = win.next;
	}
	return win;
}

function key(x) {
	var s = keydownmap[x];
	if(s) {
		// do not send commands if patcher is unlocked so as not confused with other key commands
		// unless the jit.world window is frontmost. 
		if(this.patcher.locked) {
			if(max.frontpatcher.wind.title == this.patcher.wind.title) //wind objects show as different objects but titles match ¯\_(ツ)_/¯
			{  
				s();//outlet(0, s);
			}
		} else if(drawto == max.frontpatcher.wind.title) {
			s();
		}
	}
}

function keyup(x) {
	var s = keyupmap[x];
	if(s) {
		// do not send commands if patcher is unlocked so as not confused with other key commands
		// unless the jit.world window is frontmost. 
		if(this.patcher.locked) {
			if(max.frontpatcher.wind.title == this.patcher.wind.title) //wind objects show as different objects but titles match ¯\_(ツ)_/¯
			{  
				s();//outlet(0, s);
			}
		} else if(drawto == max.frontpatcher.wind.title) {
			s();
		}
	}
}


function mouse() {
	// do not send commands if patcher is unlocked so as not confused with other key commands
	// unless the jit.world window is frontmost. 
	if(this.patcher.locked) {
		if(max.frontpatcher.wind.title == this.patcher.wind.title) //wind objects show as different objects but titles match ¯\_(ツ)_/¯
		{  
			outlet(0, "ui_mouse", arrayfromargs(arguments));
		}
	} else if(drawto == max.frontpatcher.wind.title) {
		outlet(0, "ui_mouse", arrayfromargs(arguments));
	}
}


var patcherlocation = [0,0,0,0];

function getlocation() {

	if(patcherlocation.toString() !== this.patcher.wind.location.toString()) {//i think acceptable in this case
		var w = findwindowbytitle(drawto);
		
		if(w) {
			w.setlocation(this.patcher.wind.location[0], this.patcher.wind.location[1], this.patcher.wind.location[2], this.patcher.wind.location[3]);
		}
	}
	patcherlocation = this.patcher.wind.location;
}



var pollpatcherlocation = new Task(getlocation, this);
pollpatcherlocation.interval = 100;
pollpatcherlocation.repeat();

function fixwindows() {
	var w = findwindowbytitle(drawto);
	w.bringtofront();
	this.patcher.wind.bringtofront();
	w.setlocation(this.patcher.wind.location[0], this.patcher.wind.location[1], this.patcher.wind.location[2], this.patcher.wind.location[3]);

}

var delayfixingwindows = new Task(fixwindows, this);


function loadbang() {
	this.patcher.setattr("enabletransparentbgwithtitlebar", 1);
	delayfixingwindows.schedule(500);
}
