' Copyright (C) 2017 David O'Riva. All rights reserved.
'*************************************************************/

def dict map1
    map = def chars
        ................................ 
        ................................ 
        .....########................... 
        .....#......#................... 
        .....#......#................... 
        .....#......#................... 
        .....###D####................... 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ............#.#.###............. 
        ............#.#..#.............. 
        ............###..#.............. 
        ............#.#..#.............. 
        ............#.#.###............. 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................ 
        ................................

    tiles = dict
        "." = dict
            texture = "terrain/dirt_full_new"
        "#" = dict
            texture = "terrain/stone_brick_1"
            is_wall = true
        "D" = dict
            texture = "terrain/closed_door"
            is_door = true

def job loader
    if task.init
        new IrTexture "ball.png"
        *terrain = new IrTerrain map1
        when IrTexture ready
            stop task
            render *terrain
            start bounce this



def job bounce
	if task.init
		*balls = []
		for i = 0 to 5
			b = new Sprite {
				image = "ball", x = 0, y = 100, w = 50, h = (50 * 300 / 212) | 1
            }
			v = 300 / 1000      ' px/ms
			b.vx = v * 2 * rand 1.0 - v
			b.vy = v * 2 * rand 1.0 - v
            push b to *balls
            *balls.push b
            >balls[] = b
            >balls.push b
            /balls[] = b
            /balls.push b
            .balls push b
    for i = 0 to len *balls
        b = *balls[i]
        b.x += b.vx * *ms
        b.y += b.vy * *ms
        if b.x < 0
            b.x = -b.x
            b.vx = -b.vx
        else if b.x + b.w > game.w
            b.x = -b.x + (game.x - b.w) * 2
            b.vx = -b.vx
        if b.y < 0
            b.y = -b.y
            b.vy = -b.vy
        else if b.y + b.h > game.h
            b.y = -b.y + (game.y - b.h) * 2
            b.vy = -b.vy
        b.dirty = true







/*
================================================================================

IrMain

Main program for TSEUQ (Titanic Super Elite Ultra Quest)

================================================================================
*/
(function() {

function IrMain()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = IrMain;
var _public = IrMain.prototype;
root.IrMain = IrMain;
_public.toString = function() { return "[object IrMain]"; }

_static.map1 = {
	"map" :
		"................................\n" + 
		"................................\n" + 
		".....########...................\n" + 
		".....#......#...................\n" + 
		".....#......#...................\n" + 
		".....#......#...................\n" + 
		".....###D####...................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"............#.#.###.............\n" + 
		"............#.#..#..............\n" + 
		"............###..#..............\n" + 
		"............#.#..#..............\n" + 
		"............#.#.###.............\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" + 
		"................................\n" +
		""

	,"tiles" : {
		 "." : {
		 	 "texture": "terrain/dirt_full_new"
		 }
		,"#" : {
			 "texture": "terrain/stone_brick_1"
			,"is_wall" : true
		 }
		,"D" : {
			 "texture": "terrain/closed_door"
			,"is_door" : true
		 }
	 }
};

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	new IrTask( this.Loader, { instance: this } );
	new IrTask( IrSprite.DoUpdate, { order: 90 } );
}

/*
=====================
Loader
=====================
*/
_public.Loader = function( task )
{
	if (!task.ticks) {
		new IrTexture( "ball.png" );
		this.terrain = new IrTerrain( _static.map1 );
		IrTexture.ready.then( function() {
			task.ready = true;
		} );
	}
	if (task.ready) {
		task.End();
		this.terrain.Render();
		new IrTask( this.Bounce, { instance: this } );
	}
}


/*
=====================
Bounce
=====================
*/
_public.Bounce = function( task )
{
	var i,ic,j,k;
	if (!task.ticks) {
		this.balls = [];
		for (i = 0; i < 5; i++) {
			var b = new IrSprite( {
				image: "ball", x:0, y:100, w:50, h:(50*300/212)|1
			} );
			var v = 300/1000;	// px/ms
			b.vx = v * 2 * Math.random() - v;
			b.vy = v * 2 * Math.random() - v;
			this.balls.push( b );
		}
	}
	for (i = 0, ic = this.balls.length; i < ic; i++) {
		var b = this.balls[i];
		b.x += b.vx * task.ms;
		b.y += b.vy * task.ms;
		if (b.x < 0) {
			b.x = -b.x;
			b.vx = -b.vx;
		} else if (b.x + b.w > game.w) {
			b.x = -b.x + (game.w - b.w) * 2;
			b.vx = -b.vx;
		}
		if (b.y < 0) {
			b.y = -b.y;
			b.vy = -b.vy;
		} else if (b.y + b.h > game.h) {
			b.y = -b.y + (game.h - b.h) * 2;
			b.vy = -b.vy;
		}
		b.MarkDirty();
	}
}


/*
=====================
Reset

Clears all tasks and loaded 
=====================
*/


/*
================================================================================

================================================================================
*/

})();
