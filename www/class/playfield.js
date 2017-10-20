/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

IrPlayfield

A playfield is a single on-screen layer that may contain any amount of visuals.
The playfield allows these items to be grouped for easy motion and layering.

By default, playfields have essentially infinite in size and are transparent 
where no visuals are placed.



================================================================================
*/
(function() {

function IrPlayfield()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = IrPlayfield;
var _public = IrPlayfield.prototype;
root.IrPlayfield = IrPlayfield;
_public.toString = function() { return "[object IrPlayfield]"; }

_static.all = { "unnamed" : [] };

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	if (!config)  config = {};

	this.x = config.x || 0;
	this.y = config.y || 0;

	this.w = config.w || null;
	this.h = config.h || null;

	this.order = config.order || 50;
	this.hidden = config.hidden || false;
	this.bg = config.bg || null;
	this.alpha = config.alpha || 1.0;

	this.name = config.name || "unnamed";

	var n = this.node = document.createElement( "div" );
	n.style.position = "absolute";
	n.style.left = this.x + "px";
	n.style.right = this.y + "px";
	if (this.bg !== null) {
		n.style.backgroundColor = this.bg;
	}
	n.style.opacity = this.alpha;
	n.style.zIndex = this.order;

	if (this.w !== null || this.h !== null) {
		n.style.overflow = "hidden";
		n.style.width = this.w;
		n.style.height = this.h;
	}
	game.container.appendChild( n );

	if (this.name == "unnamed") {
		_static.all.unnamed.push( this );
	} else {
		if (_static.all[ this.name ] ) {
			_static.all[ this.name ].Destroy();
		}
		_static.all[ this.name ] = this;
	}

	this.sprites = [];
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
	this.node.style.left = (this.x | 0) + "px";
	this.node.style.right = (this.y | 0) + "px";
}

/*
=====================
NewSprite
=====================
*/
_public.NewSprite = function( config )
{
	return new IrSprite( config, this );
}


/*
================================================================================

================================================================================
*/

})();
