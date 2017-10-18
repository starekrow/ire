/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

World

================================================================================
*/
(function() {

function World()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = World;
var _public = World.prototype;
root.World = World;
_public.toString = function() { return "[object World]"; }


_static.all = [];
_static.dirty = [];

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	this.features = [];
	this.items = [];
	this.effects = [];
	this.actors = {};

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
