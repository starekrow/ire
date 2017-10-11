/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

Task

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

	new Task( UpdateScore )

================================================================================
*/
(function( global ) {

function Task()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = Task;
var _public = Task.prototype;
global.Task = Task;

_public.game 			= null;
//_public.task_interval 	= 0;
_public.task_name 		= "unnamed";
_public.task_order 	    = 50;
_public.task_arguments	= null;
//_public.task_background	= false;
_public.task_instance	= null;
_public.task_paused		= false;
_public.task_wait 		= false;
_public.task_wait_exact	= false;
_public.task_elapsed	= 0;
_public.task_terminated	= false;
_public.task_scheduled	= false;

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
	this.task_ticks = 0;
	this.task_runtime = 0;
	if (options) {
		if ("name" 			in options) this.task_name      = options.name;
		//if ("interval" 		in options)	this.task_interval  = options.interval;
		if ("instance" 		in options)	this.task_instance  = options.instance;
		if ("arguments" 	in options)	this.task_arguments = options.arguments;
		if ("order" 		in options)	this.task_order     = options.order;
		//if ("background" 	in options)	this.task_background= options.background;
		if ("paused" 		in options)	this.task_paused    = options.paused;
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
	this.task_terminated = true;
}


/*
=====================
Pause
=====================
*/
_public.Pause = function()
{
	this.task_paused = true;
}

/*
=====================
Resume
=====================
*/
_public.Resume = function()
{
	this.task_paused = false;
}

/*
=====================
Run
=====================
*/
_public.Run = function( msElapsed )
{
	if (this.task_paused || this.task_terminated) {
		return;
	}
	this.task_elapsed = msElapsed;
	if (this.task_wait) {
		this.task_wait -= msElapsed;
		if (this.task_wait > 0) {
			return;
		}
		this.task_wait = false;
		if (!this.task_wait_exact) {
			return;
		}
		this.task_elapsed = msElapsed + this.task_wait;
	}
	/* TODO: intervals
	if (this.task_interval) {

	}
	*/
	++this.task_ticks;
	this.task_function.apply( 
		this.task_instance || this,
		this.task_arguments || [ msElapsed ]
	);
	this.task_runtime += msElapsed;
}


/*
================================================================================

================================================================================
*/


})(this);
