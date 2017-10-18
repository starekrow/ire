/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

Render

This renderer spins each tile, overlay and MOB into a separate absolutely 
positioned DIV. This does mean that if a tileset moves, each component DIV
has to move with it.



================================================================================
*/
(function() {


function RenderGroup()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = RenderGroup;
var _public = RenderGroup.prototype;

_public.AddTile = function( images, x, y )
{

}

_public.AddMob = function( images, x, y )
{

}


function Render()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = Render;
var _public = Render.prototype;
root.Render = Render;
_public.toString = function() { return "[object Render]"; }

_static.handleCounter = 1;

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	this.animations = {};
}

/*
=====================
NewGroup

Create a new group of associated images. 

group.AddTile
=====================
*/
_public.NewGroup = function()
{
	var g = {

	};
	g.AddTile = function( img, x, y ) {

	}
}


/*
=====================
AddTile

Adds a tile at the given position. If `img` is an array, the tile will 
automatically cycle through the given images.

If `img` is an object, all other parameters are ignored and the main parameters
and options are mixed in the `img` object.

Possible options:
  * alpha - 0.0 to 1.0 transparency

x and y are screen positions. z is the offset from the "expected" in-world z 
value of 0 for the given screen position. Positive values move closer to the 
camera.

Returns a handle to the tile that can be used in UpdateTile. The handle will be
a non-zero integer.
=====================
*/
_public.AddTile = function( tex, x, y, z, options )
{
	var e = document.createElement( "DIV" );
	e.classList.add( "render_tile" );
	e.style.left = (x * 32 | 0) + "px";
	e.style.top = (y * 32 | 0) + "px";
	e.style.zIndex = ((-y + z) * 10 | 0);
	if (options) {
		if ("alpha" in options) {
			e.style.opacity = options.alpha;
		}
	}
	var h = this.handleCounter++;
	e.id = "r" + h;
	this.SetTileTexture( e, tex );
	this.worldDiv.appendChild( e );
}


/*
=====================
UpdateTile

options may contain one or more of:

  * x - 
  * y - 
  * z - 
  * img - 
  * alpha -

=====================
*/
_public.UpdateTile = function( hdl, options )
{
	var e = document.getElementById( "r" + hdl );
	if (!e) {
		return;
	}
	if ("x" in options)  e.style.left = (options.x * 32 | 0) + "px";
	if ("y" in options)  e.style.top = (options.y * 32 | 0) + "px";
	if ("y" in options || "z" in options) {
		e.style.zIndex = ((-options.y + options.z) * 10 | 0);
	}
	if ("alpha" in options)  e.style.opacity = options.alpha;
	if ("tex" in options)  this.SetTileTexture( e, options.tex );
}

/*
=====================
RemoveTile
=====================
*/
_public.RemoveTile = function( hdl )
{
	var e = document.getElementById( "r" + hdl );
	if (!e) {
		return;
	}
	e.parentNode.removeChild( e );
}



/*
=====================
SetTileTexture

Applies a texture to a tile's DOM node. Automatic animation can be handled at 
this level, and the renderer will perform the updates.
=====================
*/
_public.SetTileTexture = function( node, tex )
{
	if (!isObject( tex )) {
		tex = new Texture( tex );
	}
	tex.ApplyInDOM( node );
	if (tex.animated) {
		this.animations[ node.id ] = tex;
	} else {
		delete this.animations[ node.id ];
	}
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
