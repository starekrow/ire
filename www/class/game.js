/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

IrGame

Main loop and top-level support for the game. This is mostly a singleton, but 
you can create other game objects with the IrGame class.

================================================================================
*/
(function() {

function IrGame()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = IrGame;
var _public = IrGame.prototype;
root.IrGame = IrGame;
_public.toString = function() { return "[object IrGame]"; }

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	this.window = window;
	this.tasklist = [];
	this.tasks = {};
	this.newTasks = [];
	this.ticks = 0;
	this.time = (+new Date);
	this.preferredFPS = 60;
	this.runtime = 0;
	this.taskCounter = 0;
	this.container = document.body;
	this.w = this.container.clientWidth;
	this.h = this.container.clientHeight;
	this.profiling = true;
}

/*
=====================
Init

Second-stage initialization. Do the things that require a game to exist
before they can be done.
=====================
*/
_public.Init = function()
{
	this.playfield = new IrPlayfield();
}


/*
=====================
Reset

Clears all tasks and loaded 
=====================
*/


/*
=====================
ScheduleTask

Schedules the task for execution by the game. Some considerations:
  * If the task is already scheduled, it will be unscheduled and then 
    rescheduled.
  * Newly scheduled tasks are ordered after all existing tasks with the same 
    order value.
  * Each task may only be scheduled once per game object.
  * A newly scheduled task will not be run until the next game tick.
=====================
*/
_public.ScheduleTask = function( task )
{
	if (task.game) {
		task.game.UnscheduleTask( task );
	}
	task.game = this;
	task.task_id = ++this.taskCounter;
	this.newTasks.push( task );
	task.task_scheduled = true;
	console.log( "Scheduled " + task.task_id );
}

/*
=====================
UnscheduleTask
=====================
*/
_public.UnscheduleTask = function( task )
{
	var ex = this.tasklist.indexOf( task );
	if (ex >= 0) {
		this.tasklist.splice( ex, 1 );
	}
	ex = this.newTasks.indexOf( task );
	if (ex >= 0) {
		this.newTasks.splice( ex, 1 );
	}
	task.task_scheduled = false;
}

/*
=====================
SetupNewTasks
=====================
*/
_public.SetupNewTasks = function()
{
	if (!this.newTasks.length) {
		return;
	}
	this.tasklist = this.tasklist.concat( this.newTasks );
	this.newTasks = [];
	this.tasklist.sort( function( a, b ) {
		var d = b.task_order - a.task_order;
		if (d)  return d;
		return b.task_id - a.task_id;
	} );
	console.log( this.tasklist.length );
}


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
_public.Start = function( gameclass )
{
	var that = this;

	this.game_class = gameclass;

	var withRAF = function() {
		var startframe = function( ms ) {
			that.gameLoopTimer = requestAnimationFrame( startframe );
			that.Tick( ms );
		}
		// TODO: adapt following
		/*
		var lastTime = 0,
		    vendors = ['ms', 'moz', 'webkit', 'o'],
		    polyfill = function(callback, element) {
		        var currTime = new Date().getTime(),
		            timeToCall = Math.max(0, 16 - (currTime - lastTime)),
		            id = window.setTimeout(function() { 
		                callback(currTime + timeToCall); 
		            }, timeToCall);

		        lastTime = currTime + timeToCall;

		        return id;
		    };
		for(var x = 0, xx = vendors.length; x < xx && !window.requestAnimationFrame; ++x) {
		    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
		                               || window[vendors[x]+'CancelRequestAnimationFrame'];
		}
		*/
		requestAnimationFrame( startframe );
	}
	var noRAF = function() {
		var startframe = function() {
			var t = that.GetTime();
			that.gameLoopTimer = setTimeout( nextframe, 0 );
			that.norafRealTime = t;
			var dt = that.norafNextTick - t;
			if (dt >= -2 && dt <= 2) {
				t = that.norafNextTick;
			} else {
				//console.log( "frameskip, dt=" + dt );
				that.norafNextTick = t;
			}
			that.norafNextTick += 1000 / that.preferredFPS;
			that.Tick( t );
		}
		var nextframe = function() {
			var left = that.norafNextTick - that.GetTime();
			left = (left < 0) ? 0 : left;
			that.gameLoopTimer = setTimeout( startframe, left );
		}
		that.norafNextTick = that.GetTime();
		startframe();
	}
	noRAF();
	//withRAF();
	this.game_instance = new gameclass();
}

/*
=====================
ProfileMark
=====================
*/
_public.ProfileMark = function( clr )
{
	if (this.profiling) {
		this.profile.push( this.GetTime() );
		this.profile.push( clr );
	}
}

/*
=====================
ProfileDraw
=====================
*/
_public.ProfileDraw = function()
{
	if (this.profileNode) {
		this.profileNode.parentNode.removeChild( this.profileNode );
		this.profileNode = null;
	}
	if (!this.profiling) {
		return;
	}
	var t2 = this.GetTime();
	var t1 = this.profile[0];
	var n = this.profileNode = document.createElement( "div" );
	n.style.position = "absolute";
	n.style.bottom = "3%";
	n.style.height = "4px";
	n.style.left = "0px";
	n.style.width = (t2 - t1) / (1000 / this.preferredFPS) * 100 + "%";
	n.style.backgroundColor = "#ff0000";
	game.container.appendChild( n );
}

/*
=====================
Tick

Runs one iteration of the game loop. Call with the intended game clock for 
the iteration.
=====================
*/
_public.Tick = function( mstime )
{
	var i;
	this.msElapsed = mstime - this.msTime;
	this.profile = [ this.GetTime(), 0xff0000 ];
	// Limit warping to 1/15th of a second
	//console.log( mstime );
	if (this.msElapsed > 75) {
		if (this.msElapsed > 250) {
			// Something major has interrupted the game. Don't warp.
			this.msElapsed = 1000 / this.preferredFPS;
		} else {
			this.msElapsed = 75;
		}
	}
	this.msTime = mstime;
	this.runtime += this.msElapsed;
	++this.ticks;
	var tl = this.tasklist.slice(0);
	var tllen = tl.length;
	for (i = 0; i < tllen; i++) {
		var t = tl[i];
		t.task_last_tick = this.ticks;
		t.Run( this.msElapsed );
	}
	// TODO: background tasks
	this.SetupNewTasks();
	this.ProfileDraw();
}


/*
================================================================================

================================================================================
*/

})();
