/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

main

Main program for TSEUQ (Titanic Super Elite Ultra Quest)

================================================================================
*/
(function() {

function MainClass()
{
	this._construct && this._construct.apply( this, arguments );
}

var _static = MainClass;
var _public = MainClass.prototype;
root.MainClass = MainClass;

/*
=====================
_construct
=====================
*/
_public._construct = function( config )
{
	new Task( this.Loader, { instance: this } );
	new Task( Sprite.DoUpdate, { order: 90 } );
}

/*
=====================
Loader
=====================
*/
_public.Loader = function( task )
{
	if (!task.ticks) {
		new Texture( "ball.png" );
		Texture.ready.then( function() {
			task.ready = true;
		} );
	}
	if (task.ready) {
		task.End();
		new Task( this.Bounce, { instance: this } );
	}
}


/*
=====================
Bounce
=====================
*/
_public.Bounce = function( task )
{
	if (!task.ticks) {
		this.ball = new Sprite( {
			image: "ball", x:0, y:100, w:50, h:50

		} );
	}
	var v = 400/1000;	// px/ms
	if (this.pong) {
		this.ball.x -= v * task.ms;
		if (this.ball.x < 0) {
			this.ball.x = -this.ball.x;
			this.pong = !this.pong;
		}
	} else {
		this.ball.x += v * task.ms;
		if (this.ball.x > game.w - this.ball.w) {
			this.ball.x -= game.w - this.ball.w;
			this.ball.x = game.w - this.ball.w - this.ball.x;
			this.pong = !this.pong;
		}
	}
	this.ball.MarkDirty();
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
