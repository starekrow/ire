/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

Task

Tasks are used to wrap and manage code that should be run at certain intervals
or under certain conditions.

Unless otherwise specified, tasks will run once per game tick.

The "taskfunc" is run with the task object as "this". If you wish to supply 
your own context, you can include that in options.instance, options.arguments.

Example:

	game.Schedule( new Task( UpdateScore ) )

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
_public.task_interval 	= 0;
_public.task_ticks 		= 1;
_public.task_name 		= "unnamed";
_public.task_priority 	= 50;
_public.task_arguments	= null;
_public.task_instance	= null;
_public.task_paused		= false;
_public.task_wait 		= false;

/*
=====================
_construct
=====================
*/
_public._construct = function( taskfunc, options )
{
	this.task_function = taskfunc;
	if (!options) {
		return;
	}
	if (typeof options == "string") {
		options = { name: options };
	}
	if ("name" 			in options) this.task_name     = options.name;
	if ("interval" 		in options)	this.task_interval = options.interval;
	if ("ticks" 		in options)	this.task_ticks    = options.ticks;
	if ("instance" 		in options)	this.task_instance = options.instance;
	if ("arguments" 	in options)	this.task_arguments= options.arguments;
	if ("priority" 		in options)	this.task_priority = options.priority;
	if ("paused" 		in options)	this.task_paused   = options.paused;
	if ("wait" 			in options)	this.task_wait     = options.wait;
}

/*
=====================
Schedule
=====================
*/


/*
=====================
Pause
=====================
*/

/*
=====================
Continue
=====================
*/

/*
=====================
Run
=====================
*/
_public.Run = function()
{
	if (this.task_paused) {
		return;
	}
	if (this.task_wait) {
		if (--this.task_wait <= 0) {
			this.task_wait = false;
		}
		return;
	}
	this.task_function.apply( 
		this.task_instance || this,
		this.task_arguments || []
	);
}


/*
================================================================================

================================================================================
*/


})(this);
