/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

game

Main loop and top-level support for the game. This is mostly a singleton, but 
you can create other game objects with the GameClass class.

================================================================================
*/
(function() {

function GameClass()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = GameClass;
var _public = GameClass.prototype;
global.GameClass = GameClass;

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	this.window = config.window;
	this.tasklist = [];
	this.tasks = {};
	this.ticks = 0;
	this.time = (+new Date);
}

/*
=====================
Task

Register a new task. Tasks are called once per game tick
=====================
*/



/*
=====================
Reset

Clears all tasks and loaded 
=====================
*/


/*
=====================
GetTime

Gets the highest accuracy clock available.
=====================
*/
_public.GetTime = function()
{
	return (+new Date);
}

try {
	if (root.performance && root.performance.now && 
		root.performance.now()
	) {
		_public.GetTime = function() {
			return root.performance.now();
		}
	}
} catch(e) {}

/*
=====================
Start

Starts running the game loop
=====================
*/
_public.Start = function()
{
	var that = this;
	var cb = function() {
		that.Tick();
	}
	var fps = 60;
	if (this.gameLoopTimer) {
		clearInterval( this.gameLoopTimer );
	}
	this.gameLoopTimer = setInterval( cb, 1000 / fps );
}

/*
=====================
Tick

Runs one iteration of the game loop
=====================
*/
_public.Tick = function()
{
	var i;
	this.frameTime = (+new Date);
	++this.ticks;
	var tl = this.tasklist.slice(0);
	var tllen = tl.length;
	for (i = 0; i < tllen; i++) {
		var t = tl[i];
		t.Run();
	}
}


/*
================================================================================

================================================================================
*/

global.game = new GameClass();

})();
