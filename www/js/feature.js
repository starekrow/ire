/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

Feature

Features are placed in the world. They (usually) overlay the terrain.

Whereas terrain is largely static with environmental effects, features may
be interactive with triggered effects.

Items, Actors and Effects are rendered as features

================================================================================
*/
(function() {

function Terrain()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = Terrain;
var _public = Terrain.prototype;
root.Terrain = Terrain;

_static.all = [];
_static.dirty = [];

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	if (!config)  config = {};

	//this.texture = config.image || config.texture;
	this.texture = new Texture( config.image || config.texture );
	this.x = config.x || 0;
	this.y = config.y || 0;
	var ctr = new Image();
	ctr.src = this.texture.url;
	ctr.style.left = "-10000px";
	ctr.style.top = "-10000px";
	ctr.style.position = "absolute";
	this.w = this.texture.w;
	this.h = this.texture.h;
	if ("w" in config) {
		this.w = +config.w;
		this.h = +config.h;
		ctr.style.width = this.w + "px";
		ctr.style.height = this.h + "px";
	}
	this.node = ctr;
	game.container.appendChild( ctr );
	_static.all.push( this );
	this.MarkDirty();
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
