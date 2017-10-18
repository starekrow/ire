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

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	
}

/*
=====================
MoveTo
=====================
*/
_public.MoveTo = function( x, y )
{
}


/*
=====================
xxx

Clears all tasks and loaded 
=====================
*/


/*
================================================================================

================================================================================
*/

})();
