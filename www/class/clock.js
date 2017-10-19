/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

IrClock

================================================================================
*/
(function() {

function IrClock()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = IrClock;
var _public = IrClock.prototype;
root.IrClock = IrClock;
_public.toString = function() { return "[object IrClock]"; }

_static.clocks = {};
_static.autotick = [];

/*
=====================
_construct
=====================
*/
_public._construct = function( name, manual )
{
	if (isString(name)) {
		_static.clocks[ name ] = this;
	}
	if (!manual) {
		_static.autotick.push( this );
	}
	this.time = 0;
}


/*
=====================
Get (static)
=====================
*/
_static.Get = function( name )
{
	return _static.clocks[ name ];
}

/*
=====================
UpdateAll (static)

Adds the given number of milliseconds to all automatic clocks.
=====================
*/
_static.UpdateAll = function( ms )
{
	for (var i = 0, ic = _static.autotick.length; i < ic; ++i) {
		_static.autotick[i].Tick( ms );
	}
}

/*
=====================
Tick
=====================
*/
_public.Tick = function( ms )
{
	if (!this.paused) {
		this.time += ms;
	}
}

/*
=====================
Pause

If a clock is paused, Tick() has no effect.

TODO: If `ms` is present, it is a number of milliseconds to wait before 
automatically resuming.
=====================
*/
_public.Pause = function( /* ms */ )
{
	this.paused = true;
}

/*
=====================
Resume
=====================
*/
_public.Resume = function( /* ms */ )
{
	this.paused = false;
}

/*
================================================================================
*/
})();
