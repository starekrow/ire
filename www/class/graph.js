/* Copyright (C) 2018 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

IrGraph

The basic graph object. All rendering is performed through the graph.

Graph objects have:
  * tick()
  * atTick
  * draw()
  * inputs - map of { "field": [ object, "output" ] }
  * outputs



  * parent
  * child
  * next
  * prev



* position
  * transform
  * scale
  * rotate (RPY)
  * parent
  * child
  * next
  * prev
  * priority
  * type
  * render()
  * isVisible()
  * z_bias
  * hide
  * tick()
  * optional/advanced?
	  * alpha
	  * tint
	  * 
================================================================================
*/
(function() {

function IrGraph(config)
{
	this.atTick = -1;
	this.myself = this;
	this.inputs = null;
	this.outputs = null;


	this.position = [0,0,0];
	
	this.window = window;
	this.tasklist = [];
	this.tasks = {};
	this.newTasks = [];
	this.ticks = 0;
	this.time = (+new Date);
	this.preferredFPS = 60;
	this.runtime = 0;
	this.taskCounter = 0;
	this.container = document.body;
	this.w = this.container.clientWidth;
	this.h = this.container.clientHeight;
	this.profiling = true;
}

var _static = IrGraph;
var _public = IrGraph.prototype;
root.IrGraph = IrGraph;
_public.toString = function() { return "[object IrGraph]"; }

_static.

/*
=====================
processTick
=====================
*/
_public.processTick = function( state )
{
	var now = state.atTick;
	if (this.atTick < now) {
		this.wasTick = this.atTick;
		this.atTick = now;
		if (this.inputs) {
			for (k in this.inputs) {
				let p = this.inputs[k];
				if (p[0].atTick != now) {
					p[0].processTick();
				}
				this[k] = p[0][p[1]];
			}
		}
		this.tick( state );
	}
}

/*
=====================
attachInput
=====================
*/
_public.attachInput = function( targetField, sourceObject, sourceField )
{
	if (this.inputs[targetField]) {
		if (sourceObject != this.inputs[targetField][0]
			|| sourceField != this.inputs[targetField][1]) {
			this.inputs[targetField][0].removeOutput(this.inputs[targetField][1], this, targetField);
		}
	}
	if (!sourceObject) {
		delete this.inputs[targetField];
	} else {
		this.inputs[targetField] = [sourceObject, sourceField];
		sourceObject.addOutput(sourceField, this, destField);
	}
}

/*
=====================
addOutput
=====================
*/
_public.addOutput = function( field, targetObject, targetField )
{
	// ...don't even bother doing anything
}

/*
=====================
removeOutput
=====================
*/
_public.removeOutput = function( field, targetObject, targetField )
{
	// ...don't even bother doing anything
}

/*
=====================
tick
=====================
*/
_public.tick = function( state )
{
	this.atTick = state.atTick;
}

/*
=====================
draw

General-purpose rendering follows "child" and "sibling" inputs. Drawing is
top-down; parents are given a chance to render before their automatically-
scanned children and siblings. When overriding draw(), you should generally 
call the superclass's draw() _after_ doing whatever work you need to do.
=====================
*/
_public.draw = function( config )
{
	if (this.inputs.child) {
		var c = this.inputs.child
		var child = c[1] ? c[0][c[1]].call(c[0],config) : c[0];
		
	}
}

/*
=====================

=====================
*/
_public.foo = function( config )
{
}



/*
================================================================================

================================================================================
*/

root.game = new IrGame();

})();
