/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

IrTask

Tasks are used to wrap and manage code that should be run at certain intervals
or under certain conditions.

Unless otherwise specified, tasks will run once per game tick and be given an
amount of time elapsed since the previous tick. If you specify an `interval` 
for the task, it will be called zero or more times per game tick depending on
how many of those intervals have passed since the previous game tick.

The "taskfunc" is run with the task object as "this" and the elapsed time in 
milliseconds as the first argument. If you wish to supply your own context, 
you can include that in options.instance and/or options.arguments.

Example:

	new IrTask( UpdateScore )

================================================================================
*/
(function( global ) {

function IrTask()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = IrTask;
var _public = IrTask.prototype;
global.IrTask = IrTask;

_public.game 			= null;
//_public.task_interval 	= 0;
_public.name 		= "unnamed";
_public.task_order 	    = 50;
_public.task_arguments	= null;
//_public.task_background	= false;
_public.task_instance	= null;
_public.paused		= false;
_public.task_wait 		= false;
_public.task_wait_exact	= false;
_public.ms	= 0;
_public.terminated	= false;
_public.task_scheduled	= false;
_public.task_errors		= false;

/*
=====================
_construct
=====================
*/
_public._construct = function( taskfunc, options )
{
	this.task_function = taskfunc;
	if (typeof options == "string") {
		options = { name: options };
	}
	this.ticks = 0;
	this.runtime = 0;
	if (options) {
		if ("name" 			in options) this.name      		= options.name;
		//if ("interval" 		in options)	this.task_interval  = options.interval;
		if ("instance" 		in options)	this.task_instance  = options.instance;
		if ("arguments" 	in options)	this.task_arguments = options.arguments;
		if ("order" 		in options)	this.task_order     = options.order;
		//if ("background" 	in options)	this.task_background= options.background;
		if ("paused" 		in options)	this.paused    		= options.paused;
		if ("wait" 			in options)	this.task_wait      = options.wait;
	}
	this.Schedule();
}

/*
=====================
Schedule

Schedules the task for execution by the game. See game.ScheduleTask()
=====================
*/
_public.Schedule = function()
{
	if (!this.game) {
		this.game = root.game;
	}
	this.game.ScheduleTask( this );
}

/*
=====================
Unschedule
=====================
*/
_public.Unschedule = function()
{
	if (this.game) {
		this.game.UnscheduleTask( this );
	}
}

/*
=====================
Log
=====================
*/
_public.Log = function( /* arguments... */ )
{
	var args = Array.prototype.slice.apply( arguments );
	var tn = "" + this.task_id;
	if (this.name)  tn += "(" + this.name + ")";

}

/*
=====================
End
=====================
*/
_public.End = function()
{
	var tl = this.game.tasklist;
	var ex = tl.indexOf( this );
	if (ex >= 0) {
		tl.splice( ex, 1 );
	}
	this.terminated = true;
}


/*
=====================
Pause
=====================
*/
_public.Pause = function()
{
	this.paused = true;
}

/*
=====================
Resume
=====================
*/
_public.Resume = function()
{
	this.paused = false;
}

/*
=====================
Run
=====================
*/
_public.Run = function( msElapsed )
{
	if (this.paused || this.terminated) {
		return;
	}
	this.ms = msElapsed;
	if (this.task_wait) {
		this.task_wait -= msElapsed;
		if (this.task_wait > 0) {
			return;
		}
		if (!this.task_wait_exact) {
			this.task_wait = false;
			return;
		}
		this.ms = msElapsed + this.task_wait;
		this.task_wait = false;
	}
	/* TODO: intervals
	if (this.task_interval) {

	}
	*/
	try {
		this.task_function.apply( 
			this.task_instance || this,
			this.task_arguments || [ this ]
		);
	} catch(e) {
		++this.ticks;
		throw e;
		if (!this.task_errors) {
			this.task_errors = [];
		}
		this.task_errors.push( e );
		if (this.task_errors.length >= 60) {
			//this.game.log( "Task " + this.task_id + )
			this.task_terminated = true;
		}
	}
	++this.ticks;
	this.runtime += msElapsed;
}


/*
================================================================================

================================================================================
*/


})(this);
