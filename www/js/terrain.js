/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

Terrain

Terrain is built up in layers. Each layer is built from tiles.

Terrain is largely mapped on an X/Y grid, with a Z ground height. In the 
tile-based isometric perspective, apparent depth is a function of Y and Z.
It is also possible to have multiple floor levels at the same X/Y coordinate.
This is accomplished with overlays.

The character may only be standing on a single piece of terrain at any given 
time. Collisions are detected within tilegroups and between them. A space that
contains no tilegroups is considered unwalkable.

Flight (as opposed to simple levitation) would require some additional work.

A tilegroup adds terrain to the portion of the world it covers. Tilegroups
may themselves be repeated.

       X
    01234567
  0 ........ 
  1 ..._.... +5
  2 ../ \... +4 Z (tree)
Y 3 .|   |.. +3
  4 ..\ /... +2
  5 ...|.... +1
  6 ........
  7 ........ 

In this case, the terrain is flat. A tree is placed in the middle of the 
tilegroup,

Each visible tile has the following attributes:

  * Z - actual world Z height of terrain
  * type - tile stack type


stack is:
  * 

At runtime, each on-screen tile is stored as:

 * z - Z offset of base terrain (if applicable)
 * t - base tile image
 * f - flags
 * o - overlays (array). Each overlay has:
   * z - z offset
   * t - tile image
   * f - flags

Flags are:
  * bit 0 - traversable 
  *     1 - hidden
  *     2 - 


A tilestack is:
  [ image, dz, image, dz, ... ]

Knowing the base Z for the stack and any sprite Z values, the sprites and tiles
can be rendered in the right order.

In the case where there is no overlay at all, the tilestack may simply be a 
number.

Traversability is handled with edges. An edgemap stores a number per tile, with
the following meanings:
   * bit 0 - top blocked
   *     1 - right blocked
   *     2 - bottom blocked
   *     3 - left blocked
   *     4-6 - type: 
   	 * 0 - normal
   	 * 1 - ice
   	 * 2 - fire
   	 * 3 - poison
   	 * 4 - zap
   	 * 5 - 
   	 * 6 - 
   	 * 7 - 
   *     8-15 - special

If "special" is set, it is a reference to an entry in the special
table, where connections to other edgemaps and more complicated traversal 
situations are handled.

Edgemaps are laid out over the world grid. They have the following data:
  * map - array of entries
  * x, y, z - world position of edgemap
  * w, h - width & height of the edgemap
  * special - table of special entries:
    * top, bottom, left, right:
      * bit 0 - 
      * bit 1 - slidable cliff (bottom only?)
      * bit 2 - conveyor
      * bit 3 - accelerator
      * bit 4 - stairs (left/right only?)
      * bit 5 - exit
    * connect - connect to other edgemap
      * t, r, b, l - map ID
    * trigger - event trigger when tile is stepped on
      * may be object or array of objects
      * require - list of event statuses that must match
      * event - string name of event to trigger
      * radius - radius of trigger, default 0.75
      * shape - shape of trigger - round, square (default square)


Tileset is:

  * map - array of entries
     * bit 0-7 - base tile
     *     8-15 - overlay tile
     *     16-19 - overlay +Z
     *     20 - special (bits 8-19 specify)
  * x, y, z - world position of tilemap
  * w, h - width & height of the tilemap
  * tiles - array of tile graphics
    * if integer - simple tile
    * if array - animated tile
    * 
  * special - array of 
    * tiles - [ z, tile, ... ]
    * triggers - alternate layouts based on events, array. Entire array is
      processed in order
      * event - name(s) of event to check. May be multiple, e.g. "wind,!gate1"
      * replace - replace entire tilestack with this one
      * add - add these tiles


The on-screen tileset is unpacked in 8x8 groups for display and navigation:
  * 

Rendering:

Any moving item will generally require a 2x2 area to be redrawn. This is done
by for each tile, look up position in tilemap

All moving actors are processed and a list of tiles to redraw is 



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
_public.toString = function() { return "[object Terrain]"; }

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