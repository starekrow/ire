/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

Sprite

================================================================================
*/
(function() {

function Sprite()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = Sprite;
var _public = Sprite.prototype;
root.Sprite = Sprite;

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
	this.x = +x || 0;
	this.y = +y || 0;
	this.MarkDirty();
}

/*
=====================
MarkDirty
=====================
*/
_public.MarkDirty = function( x, y )
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
