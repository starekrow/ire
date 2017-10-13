/* Copyright (C) 2017 David O'Riva. All rights reserved.
 *************************************************************/


/*
================================================================================

lib

Mostly global support functions; stuff that's missing from Javascript or basic 
stuff that needs abstraction for whatever reason.

================================================================================
*/
(function() {

/*
=====================
copy
=====================
*/
root.copy = function( thing, depth )
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
=====================
String.repeat polyfill (from MDN)
=====================
*/
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (var i = 0; i < count; i++) {
      rpt += str;
    }
    return rpt;
  }
}

/*
=====================
formatFP

Multi-purpose decimal number formatting.
  * prec - Number of digits of precision following the decimal point.
    If set to 0, no decimal point is printed. If unspecified, null or false,
    precision is automatic.
  * wid - Minimum width. If the result is not at least this many characters
    wide, it will be padded on the left with spaces (unless otherwise specified,
    see below). If wid is negative, the result is padded as needed on the right.
  * sign - If true, a "+" sign is added if the value is positive
  * fill - Fill character. Only applies if the result is padded. If this is 
    `true`, it will use "0". Normally padding is applied around the result,
    but if the fill character is "0" and padding is on the left, the padding is
    inserted between any sign character and the rest of the result.
=====================
*/
root.formatFP = function( val, prec, wid, sign, fill )
{
	var s;
	if (typeof prec == "undefined" || prec === null || prec === false) {
		s = "" + (+val);
	} else {
		s = (+val).toFixed( prec );
	}
	sign = sign ? (s[0] == "-" || s == "NaN" ? "" : "+") : "";
	w = Math.abs(wid) - sign.length - s.length;
	if (w <= 0) {
		return sign + s;
	}
	fill = !fill ? " " : (typeof fill != "string") ? "0" : fill.substr(0,1);
	if (wid < 0) {
		return sign + s + fill.repeat( w );
	}
	if (fill == "0") {
		if (s[0] == "-") {
			return "-" + fill.repeat( w ) + s.substr(1);
		}
		return sign + fill.repeat( w ) + s;
	}
	return fill.repeat( w ) + sign + s;
}


/*
================================================================================

================================================================================
*/
})();
