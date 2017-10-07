/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

lib

Mostly global support functions; stuff that's missing from Javascript or basic 
stuff that needs abstraction for whatever reason.

================================================================================
*/
(function( global ) {

/*
=====================
copy
=====================
*/
global.copy = function( thing, depth )
{
    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" != typeof obj) return obj;

    if (depth && depth !== true) {
    	--depth;
    }

    // Handle Array
    if (obj instanceof Array) {
        if (!depth) {
        	return obj.slice( 0 );
        }
        let res = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            res[i] = copy( obj[i], depth );
        }
        return res;
    }

    // Handle Date
    if (obj instanceof Date) {
    	return new Date(+obj);
    }

    // Handle "simple" objects
    if (obj instanceof Object) {
        let res = {};
        if (!depth) {
	        for (let attr in obj) {
	            if (obj.hasOwnProperty(attr))  res[attr] = obj[attr];
	        }
        } else {
	        for (let attr in obj) {
	            if (obj.hasOwnProperty(attr)) {
	            	res[attr] = copy( obj[attr], depth );
	            }
	        }
        }
        return res;
    }

    // Fallback is to assume that the item is not a container.
    return obj;
}


/*
================================================================================

================================================================================
*/
})(this);
