/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

IrTerrain

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




================================================================================
*/
(function() {

function IrTerrain()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = IrTerrain;
var _public = IrTerrain.prototype;
root.IrTerrain = IrTerrain;
_public.toString = function() { return "[object IrTerrain]"; }

_static.terrainCounter = 1;

/*
=====================
_construct
=====================
*/
_public._construct = function( def )
{
	if (!def) {
		def = {};
	}
	this.id = _static.terrainCounter++;
	this.idCounter = 1;
	this.tiledefs = [ null ];
	this.map = [];
	this.rows = 0;
	this.cols = 0;
	this.x = 0;
	this.y = 0;

	if (def) {
		this.Load( def );
	}
}

/*
=====================
Load
=====================
*/
_public.Load = function( def )
{
	if (typeof def == "string") {
		// TODO: Load from resource
	}
	if (typeof def.map == "string") {
		this.LoadStringMap( def.map, def.tiles );
	} else {
		throw new IrDataError;
	}
}

/*
=====================
LoadStringMap
=====================
*/
_public.LoadStringMap = function( map, tiles )
{
	var ml = map.split( "\n" );

	var xtc = {};
	for (let c in tiles) {
		let tdef = copy( tiles[c] );
		if (tdef.texture) {
			tdef.texture = new IrTexture( tdef.texture );
		}
		tdef.id = this.tiledefs.length;
		this.tiledefs.push( tdef );
		xtc[ c ] = tdef;
	}
	this.rows = ml.length;
	this.cols = 0;
	for (let i = 0; i < this.rows; i++) {
		let l = ml[i];
		if (l.length > this.cols) {
			this.cols = l.length;
		}
	}
	this.map = [];
	for (let i = 0; i < this.rows; i++) {
		let l = ml[i];
		for (let j = 0, jc = l.length; j < jc; j++) {
			let c = l.charAt( j );
			if (!(c in xtc)) {
				this.map[ i * this.cols + j ] = 0;
				continue;
			}
			this.map[ i * this.cols + j ] = xtc[c].id;
		}
	}
}


/*
=====================
Render
=====================
*/
_public.Render = function( playfield )
{
	this.playfield = playfield || game.playfield;
	for (let i = 0; i < this.rows; i++) {
		for (let j = 0; j < this.cols; j++) {
			var td = this.tiledefs[ this.map[ i * this.cols + j ] ];
			if (!td) {
				continue;
			}
			this.playfield.NewSprite( {
				 texture: td.texture
				,x: j * 32
				,y: i * 32

			})
		}
	}
}


/*
================================================================================
*/
})();
