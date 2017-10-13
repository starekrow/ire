/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

Texture

================================================================================
*/
(function() {

function Texture()
{
	return this._construct && this._construct.apply( this, arguments );
}

var _static = Texture;
var _public = Texture.prototype;
root.Texture = Texture;

_static.ready = Promise.resolve();
_static.loading_count = 0;
_static.loading_errors = 0;
_static.loadcache = {};

/*
=====================
_construct
=====================
*/
_public._construct = function( file )
{
	var that = this;

	if (file instanceof Texture) {
		return file;
	}

	var t = /^(.*\/)?([^\/]*?)(\.[^\.\/]+)?$/.exec( file );
	var path = t[1] || "";
	var fn = t[2];
	var ext = t[3] || ".png";
	var url = "tex/" + path + fn + ext;
	this.name = path + fn;
	this.url = url;
	if (_static.loadcache[ this.name ]) {
		return _static.loadcache[ this.name ];
	}
	this.img = new Image();
	if (!_static.loading_count) {
		_static.loading_errors = 0;
		_static.ready = new Promise( function( resolve, reject ) {
			_static.MarkLoadingDone = resolve;
		} );
	}
	++_static.loading_count;
	var handled = false;
	this.img.onload = function() {
		//console.log( "onload" + _static.load)
		if (handled)  return;
		if (--_static.loading_count == 0) {
			console.log( "YEah done!" );
			_static.MarkLoadingDone();
		}
		that.w = that.img.width;
		that.h = that.img.height;
		handled = true;
	}
	this.img.onerror = function() {
		if (handled)  return;
		++_static.loading_errors;
		if (--_static.loading_count == 0) {
			_static.MarkLoadingDone();
		}
		handled = true;
	}
	this.img.src = url;
	_static.loadcache[ this.name ] = this;
}

/*
=====================
xxx
=====================
*/

/*
=====================
xxx
=====================
*/


/*
================================================================================

================================================================================
*/

})();
