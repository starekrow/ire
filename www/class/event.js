/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

IrEvent

================================================================================
*/
(function() {

function IrEvent()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = IrEvent;
var _public = IrEvent.prototype;
root.IrEvent = IrEvent;
_public.toString = function() { return "[object IrEvent]"; }

_static.events = {};

/*
=====================
_construct
=====================
*/
_public._construct = function( name )
{
	this.name = name;
	_static.events[ name ] = this;
	this.state = 0;
}

/*
=====================
Trigger
=====================
*/
_public.Trigger = function( value )
{
	this.state = 1;
	this.value = value;
	if (this.callbacks) {
		for (var i = 0, ic = this.callbacks.length - 1; i < ic; i++) {
			this.callbacks[i]( value );
		}
	}
}

/*
=====================
Notify
=====================
*/
_public.Notify = function( callback )
{
	if (!this.callbacks) {
		this.callbacks = [];
	}
	this.callbacks.push( callback );
}

/*
=====================
DeNotify
=====================
*/
_public.DeNotify = function( callback )
{
	if (!this.callbacks) {
		return;
	}
	var i = this.callbacks.indexOf( callback );
	if (i < 0) {
		return;
	}
	this.callbacks.splice( i, 1 );
}

/*
================================================================================
*/
})();
