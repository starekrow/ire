/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

IrSprite

================================================================================
*/
(function() {

function IrSprite()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = IrSprite;
var _public = IrSprite.prototype;
root.IrSprite = IrSprite;
_public.toString = function() { return "[object IrSprite]"; }

_static.all = [];
_static.dirty = [];

/*
=====================
_construct
=====================
*/
_public._construct = function( config, pf )
{
	if (!config)  config = {};

	if (!pf) {
		pf = game.playfield;
	}

	this.playfield = pf;
	this.texture = new IrTexture( config.image || config.texture );
	this.x = +config.x || 0;
	this.y = +config.y || 0;
	this.z = +config.z || 0;
	var ctr = new Image();
	ctr.src = this.texture.url;
	ctr.style.left = "-10000px";
	ctr.style.top = "-10000px";
	ctr.style.zIndex = this.z | 0;
	ctr.style.position = "absolute";
	this.w = this.texture.w;
	this.h = this.texture.h;
	if ("w" in config) {
		this.w = +config.w || 0;
		this.h = +config.h || 0;
		ctr.style.width = this.w + "px";
		ctr.style.height = this.h + "px";
	}
	this.node = ctr;
	pf.node.appendChild( ctr );
	pf.sprites.push( this );
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
	var ox = this.x, oy = this.y;
	this.x = +x || 0;
	this.y = +y || 0;
	if (this.x | 0 != ox | 0) {
		this.node.style.left = "" + (s.x | 0) + "px";
	}
	if (this.y | 0 != oy | 0) {
		this.node.style.top = "" + (s.y | 0) + "px";
	}
}

/*
=====================
MoveToZ
=====================
*/
_public.MoveToZ = function( z )
{
	var oz = this.z;
	this.z = +z || 0;
	if (this.z | 0 != oz | 0) {
		this.node.style.zIndex = this.z | 0;
	}
}

/*
=====================
Transfer

Moves a sprite to a different playfield
=====================
*/
_public.Transfer = function( pf, x, y, z )
{
	var opf = this.playfield;
	var sl = opf.sprites;
	sl.splice( sl.indexof( this ), 1 );
	this.playfield = pf;
	pf.sprites.push( this );
	if (typeof x != "undefined") {
		if (x == "auto") {
			x = this.x + opf.x - pf.x;
		}
		this.x = +x || 0;
	}
	if (typeof y != "undefined") {
		if (y == "auto") {
			y = this.y + opf.y - pf.y;
		}
		this.y = +y || 0;
	}
	if (typeof z != "undefined") {
		this.z = +z || 0;
	}
	this.MarkDirty();
}

/*
=====================
MarkDirty
=====================
*/
_public.MarkDirty = function()
{
	if (!this.dirty) {
		this.dirty = true;
		_static.dirty.push( this );
	}
}

/*
=====================
DoUpdate
=====================
*/
_static.DoUpdate = function( task )
{
	var i, ic, dl;
	dl = _static.dirty;
	for (i = 0, ic = dl.length; i < ic; ++i) {
		var s = dl[i];
		var n = s.node;
		n.style.left = "" + (s.x|0) + "px";
		n.style.top = "" + (s.y|0) + "px";
		n.style.zIndex = s.z|0;
		s.dirty = false;
	}
	_static.dirty = [];
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
