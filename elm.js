(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $author$project$Main$Home = {$: 'Home'};
var $author$project$Main$NavigateTo = function (a) {
	return {$: 'NavigateTo', a: a};
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$MainComponents$Structs$Dark = {$: 'Dark'};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$MainComponents$Structs$defaultHomeState = {
	backgroundArray: $elm$core$Array$fromList(
		_List_fromArray(
			[5, 3, 7, 10, 2, 1, 9, 6, 3, 12, 4, 11, 8, 2, 7, 5, 3, 9, 6, 10])),
	indexOne: 0,
	indexTwo: 0,
	targetString: 'Algorithms and Data Structures',
	theme: $author$project$MainComponents$Structs$Dark,
	typingFlag: false,
	typingIndex: 0
};
var $author$project$MainComponents$Structs$defaultSortingTrack = function (list) {
	return {
		array: $elm$core$Array$fromList(list),
		currentIndex: 1,
		currentStep: 0,
		didSwap: false,
		gap: ($elm$core$List$length(list) / 2) | 0,
		minIndex: 0,
		outerIndex: 0,
		sorted: false,
		stack: _List_fromArray(
			[
				_Utils_Tuple2(
				0,
				$elm$core$List$length(list) - 1)
			])
	};
};
var $author$project$DataStructures$ArrayList$ListType = {$: 'ListType'};
var $author$project$DataStructures$ArrayList$initModel = {dataStructure: $author$project$DataStructures$ArrayList$ListType, elements: _List_Nil, inputValue: ''};
var $author$project$DataStructures$SetMap$SetType = {$: 'SetType'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $author$project$DataStructures$SetMap$initModel = {dataStructure: $author$project$DataStructures$SetMap$SetType, keyInput: '', map: $elm$core$Dict$empty, set: $elm$core$Set$empty, valInput: ''};
var $author$project$DataStructures$StackQueue$Stack = {$: 'Stack'};
var $author$project$DataStructures$StackQueue$initModel = {dataStructure: $author$project$DataStructures$StackQueue$Stack, elements: _List_Nil, inputValue: ''};
var $author$project$Graphs$Dijkstra$initModel = {
	dijkstraSteps: _List_Nil,
	graph: {edges: _List_Nil, nodes: _List_Nil},
	index: 0,
	running: false,
	source: $elm$core$Maybe$Nothing,
	target: $elm$core$Maybe$Nothing
};
var $author$project$Graphs$MST$Prim = {$: 'Prim'};
var $author$project$Graphs$MST$initModel = {
	graph: {edges: _List_Nil, nodes: _List_Nil},
	index: 0,
	mstSteps: _List_Nil,
	running: false,
	selectedAlgorithm: $author$project$Graphs$MST$Prim,
	startNode: 0
};
var $author$project$MainComponents$Structs$Empty = {$: 'Empty'};
var $author$project$Trees$BST$initModel = {
	index: $elm$core$Maybe$Just(0),
	running: false,
	searchInput: '',
	traversalResult: _List_Nil,
	tree: $author$project$MainComponents$Structs$Empty
};
var $author$project$Trees$HeapType$MinHeap = {$: 'MinHeap'};
var $author$project$Trees$HeapType$initModel = {heapType: $author$project$Trees$HeapType$MinHeap, heapifySteps: _List_Nil, index: 0, newValue: '', running: false, tree: $author$project$MainComponents$Structs$Empty};
var $author$project$Trees$TreeTraversal$Inorder = {$: 'Inorder'};
var $author$project$Trees$TreeTraversal$initModel = {
	currentTraversal: $author$project$Trees$TreeTraversal$Inorder,
	index: $elm$core$Maybe$Just(0),
	running: false,
	traversalResult: _List_Nil,
	tree: $author$project$MainComponents$Structs$Empty
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$AL = {$: 'AL'};
var $author$project$Main$BST = {$: 'BST'};
var $author$project$Main$BinarySearch = {$: 'BinarySearch'};
var $author$project$Main$BubbleSort = {$: 'BubbleSort'};
var $author$project$Main$Dijkstra = {$: 'Dijkstra'};
var $author$project$Main$HeapType = {$: 'HeapType'};
var $author$project$Main$InsertionSort = {$: 'InsertionSort'};
var $author$project$Main$LinearSearch = {$: 'LinearSearch'};
var $author$project$Main$MST = {$: 'MST'};
var $author$project$Main$MergeSort = {$: 'MergeSort'};
var $author$project$Main$QuickSort = {$: 'QuickSort'};
var $author$project$Main$SM = {$: 'SM'};
var $author$project$Main$SQ = {$: 'SQ'};
var $author$project$Main$SelectionSort = {$: 'SelectionSort'};
var $author$project$Main$ShellSort = {$: 'ShellSort'};
var $author$project$Main$TreeTraversal = {$: 'TreeTraversal'};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.unvisited;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.value);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.path),
					$elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					$elm$core$Basics$identity)));
	});
var $author$project$Main$ALRoute = {$: 'ALRoute'};
var $author$project$Main$BSTRoute = {$: 'BSTRoute'};
var $author$project$Main$BinarySearchRoute = {$: 'BinarySearchRoute'};
var $author$project$Main$BubbleSortRoute = {$: 'BubbleSortRoute'};
var $author$project$Main$DijkstraRoute = {$: 'DijkstraRoute'};
var $author$project$Main$HeapRoute = {$: 'HeapRoute'};
var $author$project$Main$HomeRoute = {$: 'HomeRoute'};
var $author$project$Main$InsertionSortRoute = {$: 'InsertionSortRoute'};
var $author$project$Main$LinearSearchRoute = {$: 'LinearSearchRoute'};
var $author$project$Main$MSTRoute = {$: 'MSTRoute'};
var $author$project$Main$MergeSortRoute = {$: 'MergeSortRoute'};
var $author$project$Main$QuickSortRoute = {$: 'QuickSortRoute'};
var $author$project$Main$SMRoute = {$: 'SMRoute'};
var $author$project$Main$SQRoute = {$: 'SQRoute'};
var $author$project$Main$SelectionSortRoute = {$: 'SelectionSortRoute'};
var $author$project$Main$ShellSortRoute = {$: 'ShellSortRoute'};
var $author$project$Main$TreeRoute = {$: 'TreeRoute'};
var $elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.visited;
		var unvisited = _v0.unvisited;
		var params = _v0.params;
		var frag = _v0.frag;
		var value = _v0.value;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0.a;
		return $elm$url$Url$Parser$Parser(
			function (_v1) {
				var visited = _v1.visited;
				var unvisited = _v1.unvisited;
				var params = _v1.params;
				var frag = _v1.frag;
				var value = _v1.value;
				return A2(
					$elm$core$List$map,
					$elm$url$Url$Parser$mapState(value),
					parseArg(
						A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
			});
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return $elm$url$Url$Parser$Parser(
		function (state) {
			return A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var parser = _v0.a;
					return parser(state);
				},
				parsers);
		});
};
var $elm$url$Url$Parser$s = function (str) {
	return $elm$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				return _Utils_eq(next, str) ? _List_fromArray(
					[
						A5(
						$elm$url$Url$Parser$State,
						A2($elm$core$List$cons, next, visited),
						rest,
						params,
						frag,
						value)
					]) : _List_Nil;
			}
		});
};
var $elm$url$Url$Parser$top = $elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var $author$project$Main$routeParser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, $author$project$Main$HomeRoute, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$BubbleSortRoute,
			$elm$url$Url$Parser$s('bubble-sort')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$SelectionSortRoute,
			$elm$url$Url$Parser$s('selection-sort')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$InsertionSortRoute,
			$elm$url$Url$Parser$s('insertion-sort')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$ShellSortRoute,
			$elm$url$Url$Parser$s('shell-sort')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$MergeSortRoute,
			$elm$url$Url$Parser$s('merge-sort')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$QuickSortRoute,
			$elm$url$Url$Parser$s('quick-sort')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$LinearSearchRoute,
			$elm$url$Url$Parser$s('linear-search')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$BinarySearchRoute,
			$elm$url$Url$Parser$s('binary-search')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$TreeRoute,
			$elm$url$Url$Parser$s('tree-traversal')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$HeapRoute,
			$elm$url$Url$Parser$s('heap-type')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$BSTRoute,
			$elm$url$Url$Parser$s('bst')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$DijkstraRoute,
			$elm$url$Url$Parser$s('dijkstra')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$MSTRoute,
			$elm$url$Url$Parser$s('mst')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$SQRoute,
			$elm$url$Url$Parser$s('sq')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$ALRoute,
			$elm$url$Url$Parser$s('al')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Main$SMRoute,
			$elm$url$Url$Parser$s('sm'))
		]));
var $author$project$Main$parseUrl = function (url) {
	var _v0 = A2($elm$url$Url$Parser$parse, $author$project$Main$routeParser, url);
	if (_v0.$ === 'Just') {
		switch (_v0.a.$) {
			case 'HomeRoute':
				var _v1 = _v0.a;
				return $author$project$Main$Home;
			case 'BubbleSortRoute':
				var _v2 = _v0.a;
				return $author$project$Main$BubbleSort;
			case 'SelectionSortRoute':
				var _v3 = _v0.a;
				return $author$project$Main$SelectionSort;
			case 'InsertionSortRoute':
				var _v4 = _v0.a;
				return $author$project$Main$InsertionSort;
			case 'ShellSortRoute':
				var _v5 = _v0.a;
				return $author$project$Main$ShellSort;
			case 'MergeSortRoute':
				var _v6 = _v0.a;
				return $author$project$Main$MergeSort;
			case 'QuickSortRoute':
				var _v7 = _v0.a;
				return $author$project$Main$QuickSort;
			case 'LinearSearchRoute':
				var _v8 = _v0.a;
				return $author$project$Main$LinearSearch;
			case 'BinarySearchRoute':
				var _v9 = _v0.a;
				return $author$project$Main$BinarySearch;
			case 'TreeRoute':
				var _v10 = _v0.a;
				return $author$project$Main$TreeTraversal;
			case 'HeapRoute':
				var _v11 = _v0.a;
				return $author$project$Main$HeapType;
			case 'BSTRoute':
				var _v12 = _v0.a;
				return $author$project$Main$BST;
			case 'DijkstraRoute':
				var _v13 = _v0.a;
				return $author$project$Main$Dijkstra;
			case 'MSTRoute':
				var _v14 = _v0.a;
				return $author$project$Main$MST;
			case 'SQRoute':
				var _v15 = _v0.a;
				return $author$project$Main$SQ;
			case 'ALRoute':
				var _v16 = _v0.a;
				return $author$project$Main$AL;
			default:
				var _v17 = _v0.a;
				return $author$project$Main$SM;
		}
	} else {
		return $author$project$Main$Home;
	}
};
var $author$project$Main$init = F3(
	function (_v0, url, key) {
		var model = {
			alModel: $author$project$DataStructures$ArrayList$initModel,
			bstModel: $author$project$Trees$BST$initModel,
			currentPage: $author$project$Main$parseUrl(url),
			dijkstraModel: $author$project$Graphs$Dijkstra$initModel,
			heapTypeModel: $author$project$Trees$HeapType$initModel,
			homeModel: $author$project$MainComponents$Structs$defaultHomeState,
			key: key,
			mstModel: $author$project$Graphs$MST$initModel,
			running: false,
			smModel: $author$project$DataStructures$SetMap$initModel,
			sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil),
			sqModel: $author$project$DataStructures$StackQueue$initModel,
			treeTraversalModel: $author$project$Trees$TreeTraversal$initModel
		};
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$BSTMsg = function (a) {
	return {$: 'BSTMsg', a: a};
};
var $author$project$Main$DijkstraMsg = function (a) {
	return {$: 'DijkstraMsg', a: a};
};
var $author$project$Main$HeapTypeMsg = function (a) {
	return {$: 'HeapTypeMsg', a: a};
};
var $author$project$Main$HomeMsg = function (a) {
	return {$: 'HomeMsg', a: a};
};
var $author$project$Main$MSTMsg = function (a) {
	return {$: 'MSTMsg', a: a};
};
var $author$project$Main$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Main$TreeTraversalMsg = function (a) {
	return {$: 'TreeTraversalMsg', a: a};
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Graphs$Dijkstra$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Graphs$Dijkstra$subscriptions = function (model) {
	return model.running ? A2($elm$time$Time$every, 2000, $author$project$Graphs$Dijkstra$Tick) : $elm$core$Platform$Sub$none;
};
var $author$project$Graphs$MST$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Graphs$MST$subscriptions = function (model) {
	return model.running ? A2($elm$time$Time$every, 2000, $author$project$Graphs$MST$Tick) : $elm$core$Platform$Sub$none;
};
var $author$project$MainComponents$Home$SwapNeeded = {$: 'SwapNeeded'};
var $author$project$MainComponents$Home$TypingSimulation = {$: 'TypingSimulation'};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $author$project$MainComponents$Home$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2(
				$elm$time$Time$every,
				200,
				$elm$core$Basics$always($author$project$MainComponents$Home$TypingSimulation)),
				A2(
				$elm$time$Time$every,
				1000,
				$elm$core$Basics$always($author$project$MainComponents$Home$SwapNeeded))
			]));
};
var $author$project$Trees$BST$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Trees$BST$subscriptions = function (model) {
	return model.running ? A2($elm$time$Time$every, 1000, $author$project$Trees$BST$Tick) : $elm$core$Platform$Sub$none;
};
var $author$project$Trees$HeapType$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Trees$HeapType$subscriptions = function (model) {
	return model.running ? A2($elm$time$Time$every, 1000, $author$project$Trees$HeapType$Tick) : $elm$core$Platform$Sub$none;
};
var $author$project$Trees$TreeTraversal$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Trees$TreeTraversal$subscriptions = function (model) {
	return model.running ? A2($elm$time$Time$every, 1000, $author$project$Trees$TreeTraversal$Tick) : $elm$core$Platform$Sub$none;
};
var $author$project$Main$subscriptions = function (model) {
	var _v0 = model.currentPage;
	switch (_v0.$) {
		case 'Home':
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$HomeMsg,
				$author$project$MainComponents$Home$subscriptions(model.homeModel));
		case 'TreeTraversal':
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$TreeTraversalMsg,
				$author$project$Trees$TreeTraversal$subscriptions(model.treeTraversalModel));
		case 'HeapType':
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$HeapTypeMsg,
				$author$project$Trees$HeapType$subscriptions(model.heapTypeModel));
		case 'BST':
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$BSTMsg,
				$author$project$Trees$BST$subscriptions(model.bstModel));
		case 'Dijkstra':
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$DijkstraMsg,
				$author$project$Graphs$Dijkstra$subscriptions(model.dijkstraModel));
		case 'MST':
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$MSTMsg,
				$author$project$Graphs$MST$subscriptions(model.mstModel));
		default:
			return model.running ? A2($elm$time$Time$every, 500, $author$project$Main$Tick) : $elm$core$Platform$Sub$none;
	}
};
var $author$project$Main$GotOrderedArray = function (a) {
	return {$: 'GotOrderedArray', a: a};
};
var $author$project$Main$GotRandomArray = function (a) {
	return {$: 'GotRandomArray', a: a};
};
var $author$project$Main$GotRandomGraph = function (a) {
	return {$: 'GotRandomGraph', a: a};
};
var $author$project$Main$GotRandomTarget = function (a) {
	return {$: 'GotRandomTarget', a: a};
};
var $author$project$Main$GotRandomTree = function (a) {
	return {$: 'GotRandomTree', a: a};
};
var $author$project$Trees$HeapType$HeapifyStep = {$: 'HeapifyStep'};
var $author$project$Graphs$Dijkstra$SetGraph = function (a) {
	return {$: 'SetGraph', a: a};
};
var $author$project$Graphs$MST$SetGraph = function (a) {
	return {$: 'SetGraph', a: a};
};
var $author$project$Trees$BST$SetTree = function (a) {
	return {$: 'SetTree', a: a};
};
var $author$project$Trees$HeapType$SetTree = function (a) {
	return {$: 'SetTree', a: a};
};
var $author$project$Trees$TreeTraversal$SetTree = function (a) {
	return {$: 'SetTree', a: a};
};
var $author$project$Trees$TreeTraversal$TraversalStep = {$: 'TraversalStep'};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$SearchAlgorithms$BinarySearch$binarySearchStep = function (track) {
	var target = track.currentIndex;
	var right = track.minIndex;
	var left = track.outerIndex;
	var mid = (_Utils_cmp(right, left) > -1) ? (((left + right) / 2) | 0) : (-1);
	var arr = track.array;
	var length = $elm$core$Array$length(arr);
	var midVal = ((mid >= 0) && (_Utils_cmp(mid, length) < 0)) ? A2($elm$core$Array$get, mid, arr) : $elm$core$Maybe$Nothing;
	if (track.sorted) {
		return track;
	} else {
		if (_Utils_cmp(left, right) < 1) {
			if (midVal.$ === 'Just') {
				var value = midVal.a;
				return _Utils_eq(value, target) ? _Utils_update(
					track,
					{sorted: true}) : ((_Utils_cmp(value, target) < 0) ? _Utils_update(
					track,
					{currentStep: track.currentStep + 1, outerIndex: mid + 1}) : _Utils_update(
					track,
					{currentStep: track.currentStep + 1, minIndex: mid - 1}));
			} else {
				return _Utils_update(
					track,
					{currentStep: track.currentStep, sorted: false});
			}
		} else {
			return _Utils_update(
				track,
				{currentStep: track.currentStep, sorted: false});
		}
	}
};
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$SortingAlgorithms$BubbleSort$bubbleSortStep = function (track) {
	var outerIndex = track.outerIndex;
	var currentIndex = track.currentIndex;
	var arr = track.array;
	var length = $elm$core$Array$length(arr);
	if (track.sorted) {
		return track;
	} else {
		if (_Utils_cmp(currentIndex, length) < 0) {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Array$get, outerIndex, arr),
				A2($elm$core$Array$get, currentIndex, arr));
			if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
				var leftVal = _v0.a.a;
				var rightVal = _v0.b.a;
				if (_Utils_cmp(leftVal, rightVal) > 0) {
					var swappedArray = A3(
						$elm$core$Array$set,
						outerIndex,
						rightVal,
						A3($elm$core$Array$set, currentIndex, leftVal, arr));
					return _Utils_update(
						track,
						{array: swappedArray, currentIndex: currentIndex + 1, didSwap: true, outerIndex: outerIndex + 1});
				} else {
					return _Utils_update(
						track,
						{currentIndex: currentIndex + 1, outerIndex: outerIndex + 1});
				}
			} else {
				return track;
			}
		} else {
			return _Utils_update(
				track,
				{currentIndex: 1, didSwap: false, outerIndex: 0, sorted: !track.didSwap});
		}
	}
};
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $author$project$SortingAlgorithms$InsertionSort$insertionSortStep = function (track) {
	var outer = track.outerIndex;
	var current = track.currentIndex;
	var arr = track.array;
	var length = $elm$core$Array$length(arr);
	if (track.sorted || (_Utils_cmp(outer, length) > -1)) {
		return _Utils_update(
			track,
			{sorted: true});
	} else {
		if (current <= 0) {
			return _Utils_update(
				track,
				{currentIndex: outer + 1, outerIndex: outer + 1});
		} else {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Array$get, current, arr),
				A2($elm$core$Array$get, current - 1, arr));
			if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
				var currentValue = _v0.a.a;
				var previousValue = _v0.b.a;
				if (_Utils_cmp(currentValue, previousValue) < 0) {
					var swappedArray = A3(
						$elm$core$Array$set,
						current - 1,
						currentValue,
						A3($elm$core$Array$set, current, previousValue, arr));
					return _Utils_update(
						track,
						{array: swappedArray, currentIndex: current - 1});
				} else {
					return _Utils_update(
						track,
						{currentIndex: outer + 1, outerIndex: outer + 1});
				}
			} else {
				return track;
			}
		}
	}
};
var $author$project$SearchAlgorithms$LinearSearch$linearSearchStep = function (track) {
	var target = track.currentIndex;
	var scanningIndex = track.outerIndex;
	var arr = track.array;
	var length = $elm$core$Array$length(arr);
	return track.sorted ? track : (_Utils_eq(scanningIndex, target) ? _Utils_update(
		track,
		{sorted: true}) : ((_Utils_cmp(scanningIndex + 1, length) < 0) ? _Utils_update(
		track,
		{currentStep: track.currentStep + 1, outerIndex: scanningIndex + 1}) : _Utils_update(
		track,
		{currentStep: track.currentStep, sorted: false})));
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Basics$pow = _Basics_pow;
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		nodeList: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		nodeListSize: (len / $elm$core$Array$branchFactor) | 0,
		tail: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $author$project$SortingAlgorithms$MergeSort$mergeArrays = F2(
	function (leftArray, rightArray) {
		var mergeHelper = F3(
			function (leftIndex, rightIndex, combinedArray) {
				mergeHelper:
				while (true) {
					var _v0 = _Utils_Tuple2(
						A2($elm$core$Array$get, leftIndex, leftArray),
						A2($elm$core$Array$get, rightIndex, rightArray));
					if (_v0.a.$ === 'Just') {
						if (_v0.b.$ === 'Just') {
							var leftValue = _v0.a.a;
							var rightValue = _v0.b.a;
							if (_Utils_cmp(leftValue, rightValue) < 0) {
								var $temp$leftIndex = leftIndex + 1,
									$temp$rightIndex = rightIndex,
									$temp$combinedArray = A2(
									$elm$core$Array$append,
									combinedArray,
									$elm$core$Array$fromList(
										_List_fromArray(
											[leftValue])));
								leftIndex = $temp$leftIndex;
								rightIndex = $temp$rightIndex;
								combinedArray = $temp$combinedArray;
								continue mergeHelper;
							} else {
								var $temp$leftIndex = leftIndex,
									$temp$rightIndex = rightIndex + 1,
									$temp$combinedArray = A2(
									$elm$core$Array$append,
									combinedArray,
									$elm$core$Array$fromList(
										_List_fromArray(
											[rightValue])));
								leftIndex = $temp$leftIndex;
								rightIndex = $temp$rightIndex;
								combinedArray = $temp$combinedArray;
								continue mergeHelper;
							}
						} else {
							var leftValue = _v0.a.a;
							var _v1 = _v0.b;
							var $temp$leftIndex = leftIndex + 1,
								$temp$rightIndex = rightIndex,
								$temp$combinedArray = A2(
								$elm$core$Array$append,
								combinedArray,
								$elm$core$Array$fromList(
									_List_fromArray(
										[leftValue])));
							leftIndex = $temp$leftIndex;
							rightIndex = $temp$rightIndex;
							combinedArray = $temp$combinedArray;
							continue mergeHelper;
						}
					} else {
						if (_v0.b.$ === 'Just') {
							var _v2 = _v0.a;
							var rightValue = _v0.b.a;
							var $temp$leftIndex = leftIndex,
								$temp$rightIndex = rightIndex + 1,
								$temp$combinedArray = A2(
								$elm$core$Array$append,
								combinedArray,
								$elm$core$Array$fromList(
									_List_fromArray(
										[rightValue])));
							leftIndex = $temp$leftIndex;
							rightIndex = $temp$rightIndex;
							combinedArray = $temp$combinedArray;
							continue mergeHelper;
						} else {
							var _v3 = _v0.a;
							var _v4 = _v0.b;
							return combinedArray;
						}
					}
				}
			});
		return A3(mergeHelper, 0, 0, $elm$core$Array$empty);
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $author$project$SortingAlgorithms$MergeSort$processMergeStep = F3(
	function (currentStep, halfStep, array) {
		var stepSize = A2($elm$core$Basics$pow, 2, currentStep);
		var arrayLength = $elm$core$Array$length(array);
		var processSegments = F2(
			function (start, acc) {
				processSegments:
				while (true) {
					if (_Utils_cmp(start, arrayLength) > -1) {
						return acc;
					} else {
						var right = A3($elm$core$Array$slice, start + halfStep, start + stepSize, array);
						var left = A3($elm$core$Array$slice, start, start + halfStep, array);
						var merged = A2($author$project$SortingAlgorithms$MergeSort$mergeArrays, left, right);
						var $temp$start = start + stepSize,
							$temp$acc = A2($elm$core$Array$append, acc, merged);
						start = $temp$start;
						acc = $temp$acc;
						continue processSegments;
					}
				}
			});
		return A2(processSegments, 0, $elm$core$Array$empty);
	});
var $author$project$SortingAlgorithms$MergeSort$mergeSortStep = function (track) {
	var outerIndex = track.outerIndex;
	var currentStep = track.currentStep;
	var halfStep = (A2($elm$core$Basics$pow, 2, currentStep) / 2) | 0;
	var array = track.array;
	var arrayLength = $elm$core$Array$length(array);
	var totalSteps = $elm$core$Basics$ceiling(
		A2($elm$core$Basics$logBase, 2, arrayLength));
	var isSorted = _Utils_cmp(currentStep, totalSteps) > 0;
	var updatedArray = (!isSorted) ? A3($author$project$SortingAlgorithms$MergeSort$processMergeStep, currentStep, halfStep, array) : array;
	return _Utils_update(
		track,
		{
			array: updatedArray,
			currentIndex: currentStep,
			currentStep: isSorted ? currentStep : (currentStep + 1),
			outerIndex: halfStep,
			sorted: isSorted
		});
};
var $author$project$MainComponents$Structs$orderedListCmd = function (toMsg) {
	var orderedList = A2($elm$core$List$range, 1, 30);
	return A2(
		$elm$core$Task$perform,
		toMsg,
		$elm$core$Task$succeed(orderedList));
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$SortingAlgorithms$QuickSort$swap = F3(
	function (indexOne, indexTwo, arr) {
		var elementTwo = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Array$get, indexTwo, arr));
		var elementOne = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Array$get, indexOne, arr));
		return A3(
			$elm$core$Array$set,
			indexTwo,
			elementOne,
			A3($elm$core$Array$set, indexOne, elementTwo, arr));
	});
var $author$project$SortingAlgorithms$QuickSort$partition = F3(
	function (low, high, track) {
		var pivot = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Array$get, high, track.array));
		var loop = F2(
			function (_v1, currentIndex) {
				var currentTrack = _v1.a;
				var partitionIndex = _v1.b;
				var currentElement = A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($elm$core$Array$get, currentIndex, currentTrack.array));
				if (_Utils_cmp(currentElement, pivot) < 0) {
					var updatedArray = A3($author$project$SortingAlgorithms$QuickSort$swap, currentIndex, partitionIndex, currentTrack.array);
					return _Utils_Tuple2(
						_Utils_update(
							currentTrack,
							{array: updatedArray}),
						partitionIndex + 1);
				} else {
					return _Utils_Tuple2(currentTrack, partitionIndex);
				}
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (currentIndex, acc) {
					return A2(loop, acc, currentIndex);
				}),
			_Utils_Tuple2(track, low),
			A2($elm$core$List$range, low, high - 1));
		var newTrack = _v0.a;
		var pivotIndex = _v0.b;
		var finalArray = A3($author$project$SortingAlgorithms$QuickSort$swap, pivotIndex, high, newTrack.array);
		return _Utils_Tuple2(
			pivotIndex,
			_Utils_update(
				newTrack,
				{array: finalArray}));
	});
var $author$project$SortingAlgorithms$QuickSort$quickSortStep = function (track) {
	var _v0 = track.stack;
	if (!_v0.b) {
		return _Utils_update(
			track,
			{sorted: true});
	} else {
		var _v1 = _v0.a;
		var low = _v1.a;
		var high = _v1.b;
		var rest = _v0.b;
		if (_Utils_cmp(low, high) < 0) {
			var _v2 = A3($author$project$SortingAlgorithms$QuickSort$partition, low, high, track);
			var pivotIndex = _v2.a;
			var newTrack = _v2.b;
			var newStack = A2(
				$elm$core$List$cons,
				_Utils_Tuple2(low, pivotIndex - 1),
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(pivotIndex + 1, high),
					rest));
			return _Utils_update(
				newTrack,
				{currentIndex: low, currentStep: track.currentStep + 1, outerIndex: pivotIndex, stack: newStack});
		} else {
			return _Utils_update(
				track,
				{stack: rest});
		}
	}
};
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				var _v1 = genA(seed);
				var result = _v1.a;
				var newSeed = _v1.b;
				var _v2 = callback(result);
				var genB = _v2.a;
				return genB(newSeed);
			});
	});
var $author$project$MainComponents$Structs$TreeNode = F3(
	function (a, b, c) {
		return {$: 'TreeNode', a: a, b: b, c: c};
	});
var $author$project$MainComponents$Structs$insertBST = F3(
	function (maxDepth, value, tree) {
		var insertHelper = F2(
			function (currentDepth, t) {
				if (_Utils_cmp(currentDepth, maxDepth) > 0) {
					return t;
				} else {
					if (t.$ === 'Empty') {
						return A3($author$project$MainComponents$Structs$TreeNode, value, $author$project$MainComponents$Structs$Empty, $author$project$MainComponents$Structs$Empty);
					} else {
						var v = t.a;
						var l = t.b;
						var r = t.c;
						return (_Utils_cmp(value, v) < 0) ? A3(
							$author$project$MainComponents$Structs$TreeNode,
							v,
							A2(insertHelper, currentDepth + 1, l),
							r) : ((_Utils_cmp(value, v) > 0) ? A3(
							$author$project$MainComponents$Structs$TreeNode,
							v,
							l,
							A2(insertHelper, currentDepth + 1, r)) : t);
					}
				}
			});
		return A2(insertHelper, 1, tree);
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$random$Random$maxInt = 2147483647;
var $elm$random$Random$minInt = -2147483648;
var $elm_community$random_extra$Random$List$anyInt = A2($elm$random$Random$int, $elm$random$Random$minInt, $elm$random$Random$maxInt);
var $elm$random$Random$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var genA = _v0.a;
		var genB = _v1.a;
		var genC = _v2.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v3 = genA(seed0);
				var a = _v3.a;
				var seed1 = _v3.b;
				var _v4 = genB(seed1);
				var b = _v4.a;
				var seed2 = _v4.b;
				var _v5 = genC(seed2);
				var c = _v5.a;
				var seed3 = _v5.b;
				return _Utils_Tuple2(
					A3(func, a, b, c),
					seed3);
			});
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$random$Random$independentSeed = $elm$random$Random$Generator(
	function (seed0) {
		var makeIndependentSeed = F3(
			function (state, b, c) {
				return $elm$random$Random$next(
					A2($elm$random$Random$Seed, state, (1 | (b ^ c)) >>> 0));
			});
		var gen = A2($elm$random$Random$int, 0, 4294967295);
		return A2(
			$elm$random$Random$step,
			A4($elm$random$Random$map3, makeIndependentSeed, gen, gen, gen),
			seed0);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm_community$random_extra$Random$List$shuffle = function (list) {
	return A2(
		$elm$random$Random$map,
		function (independentSeed) {
			return A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$sortBy,
					$elm$core$Tuple$second,
					A3(
						$elm$core$List$foldl,
						F2(
							function (item, _v0) {
								var acc = _v0.a;
								var seed = _v0.b;
								var _v1 = A2($elm$random$Random$step, $elm_community$random_extra$Random$List$anyInt, seed);
								var tag = _v1.a;
								var nextSeed = _v1.b;
								return _Utils_Tuple2(
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(item, tag),
										acc),
									nextSeed);
							}),
						_Utils_Tuple2(_List_Nil, independentSeed),
						list).a));
		},
		$elm$random$Random$independentSeed);
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$MainComponents$Structs$randomBSTGenerator = F2(
	function (minNodes, maxNodes) {
		var sizeGenerator = A2($elm$random$Random$int, minNodes, maxNodes);
		var maxDepth = 5;
		return A2(
			$elm$random$Random$andThen,
			function (n) {
				return A2(
					$elm$random$Random$map,
					function (shuffledList) {
						var values = A2($elm$core$List$take, n, shuffledList);
						return A3(
							$elm$core$List$foldl,
							$author$project$MainComponents$Structs$insertBST(maxDepth),
							$author$project$MainComponents$Structs$Empty,
							values);
					},
					$elm_community$random_extra$Random$List$shuffle(
						A2($elm$core$List$range, 1, 99)));
			},
			sizeGenerator);
	});
var $author$project$MainComponents$Structs$allUniquePairs = function (ids) {
	if (ids.b) {
		var x = ids.a;
		var rest = ids.b;
		return _Utils_ap(
			A2(
				$elm$core$List$map,
				function (r) {
					return _Utils_Tuple2(x, r);
				},
				rest),
			$author$project$MainComponents$Structs$allUniquePairs(rest));
	} else {
		return _List_Nil;
	}
};
var $elm$random$Random$constant = function (value) {
	return $elm$random$Random$Generator(
		function (seed) {
			return _Utils_Tuple2(value, seed);
		});
};
var $author$project$MainComponents$Structs$extraEdgeProbability = function (n) {
	return (n < 5) ? 1 : ((n === 5) ? 0.8 : ((n === 6) ? 0.7 : ((n === 7) ? 0.5 : 0.3)));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$MainComponents$Structs$unionCheck = F3(
	function (union, firstInt, secondInt) {
		return A3($elm$core$Dict$insert, secondInt, firstInt, union);
	});
var $author$project$MainComponents$Structs$unionFind = F2(
	function (union, node) {
		unionFind:
		while (true) {
			var _v0 = A2($elm$core$Dict$get, node, union);
			if (_v0.$ === 'Just') {
				var parent = _v0.a;
				if (_Utils_eq(parent, node)) {
					return node;
				} else {
					var $temp$union = union,
						$temp$node = parent;
					union = $temp$union;
					node = $temp$node;
					continue unionFind;
				}
			} else {
				return node;
			}
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$MainComponents$Structs$unionInit = function (size) {
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (value) {
				return _Utils_Tuple2(value, value);
			},
			A2($elm$core$List$range, 1, size)));
};
var $author$project$MainComponents$Structs$kruskalMST = F2(
	function (n, edges) {
		var step = F2(
			function (edge, _v1) {
				var union = _v1.a;
				var included = _v1.b;
				var discarded = _v1.c;
				var toRoot = A2($author$project$MainComponents$Structs$unionFind, union, edge.to);
				var fromRoot = A2($author$project$MainComponents$Structs$unionFind, union, edge.from);
				if (_Utils_eq(fromRoot, toRoot)) {
					return _Utils_Tuple3(
						union,
						included,
						A2($elm$core$List$cons, edge, discarded));
				} else {
					var updatedUnion = A3($author$project$MainComponents$Structs$unionCheck, union, fromRoot, toRoot);
					return _Utils_Tuple3(
						updatedUnion,
						A2($elm$core$List$cons, edge, included),
						discarded);
				}
			});
		var initialUnion = $author$project$MainComponents$Structs$unionInit(n);
		var _v0 = A3(
			$elm$core$List$foldl,
			step,
			_Utils_Tuple3(initialUnion, _List_Nil, _List_Nil),
			edges);
		var mst = _v0.b;
		var leftover = _v0.c;
		return _Utils_Tuple2(
			$elm$core$List$reverse(mst),
			leftover);
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var seed1 = $elm$random$Random$next(seed0);
				var range = $elm$core$Basics$abs(b - a);
				var n1 = $elm$random$Random$peel(seed1);
				var n0 = $elm$random$Random$peel(seed0);
				var lo = (134217727 & n1) * 1.0;
				var hi = (67108863 & n0) * 1.0;
				var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
				var scaled = (val * range) + a;
				return _Utils_Tuple2(
					scaled,
					$elm$random$Random$next(seed1));
			});
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
			});
	});
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0.a;
		var genB = _v1.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v2 = genA(seed0);
				var a = _v2.a;
				var seed1 = _v2.b;
				var _v3 = genB(seed1);
				var b = _v3.a;
				var seed2 = _v3.b;
				return _Utils_Tuple2(
					A2(func, a, b),
					seed2);
			});
	});
var $author$project$MainComponents$Structs$randomSubset = F2(
	function (probability, subset) {
		var boolListGen = A2(
			$elm$random$Random$list,
			$elm$core$List$length(subset),
			A2(
				$elm$random$Random$map,
				function (x) {
					return _Utils_cmp(x, probability) < 0;
				},
				A2($elm$random$Random$float, 0, 1)));
		return A3(
			$elm$random$Random$map2,
			F2(
				function (bools, elements) {
					return A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						A3(
							$elm$core$List$map2,
							F2(
								function (b, e) {
									return b ? $elm$core$Maybe$Just(e) : $elm$core$Maybe$Nothing;
								}),
							bools,
							elements));
				}),
			boolListGen,
			$elm$random$Random$constant(subset));
	});
var $elm_community$random_extra$Random$Extra$sequence = A2(
	$elm$core$List$foldr,
	$elm$random$Random$map2($elm$core$List$cons),
	$elm$random$Random$constant(_List_Nil));
var $author$project$MainComponents$Structs$randomGraphGenerator = function () {
	var sizeGenerator = A2($elm$random$Random$int, 5, 8);
	return A2(
		$elm$random$Random$andThen,
		function (n) {
			var nodes = A2(
				$elm$core$List$map,
				function (id) {
					return {id: id};
				},
				A2($elm$core$List$range, 1, n));
			var allPairs = $author$project$MainComponents$Structs$allUniquePairs(
				A2($elm$core$List$range, 1, n));
			var edgeGenerators = A2(
				$elm$core$List$map,
				function (_v1) {
					var a = _v1.a;
					var b = _v1.b;
					return A2(
						$elm$random$Random$map,
						function (w) {
							return {from: a, to: b, weight: w};
						},
						A2($elm$random$Random$int, 15, 99));
				},
				allPairs);
			var allEdgesGenerator = $elm_community$random_extra$Random$Extra$sequence(edgeGenerators);
			return A2(
				$elm$random$Random$andThen,
				function (allEdges) {
					var _v0 = A2($author$project$MainComponents$Structs$kruskalMST, n, allEdges);
					var mstEdges = _v0.a;
					var leftover = _v0.b;
					var extraEdgesGenerator = A2(
						$author$project$MainComponents$Structs$randomSubset,
						$author$project$MainComponents$Structs$extraEdgeProbability(n),
						leftover);
					return A2(
						$elm$random$Random$andThen,
						function (extraEdges) {
							var nNodes = $elm$core$List$length(nodes);
							var graph = {
								edges: _Utils_ap(mstEdges, extraEdges),
								nodes: nodes
							};
							return (nNodes > 0) ? A2(
								$elm$random$Random$andThen,
								function (sourceIndex) {
									return A2(
										$elm$random$Random$map,
										function (offset) {
											var targetIndex = A2($elm$core$Basics$modBy, nNodes, sourceIndex + offset);
											var targetId = A2(
												$elm$core$Maybe$withDefault,
												1,
												A2(
													$elm$core$Maybe$map,
													function ($) {
														return $.id;
													},
													$elm$core$List$head(
														A2($elm$core$List$drop, targetIndex, nodes))));
											var sourceId = A2(
												$elm$core$Maybe$withDefault,
												1,
												A2(
													$elm$core$Maybe$map,
													function ($) {
														return $.id;
													},
													$elm$core$List$head(
														A2($elm$core$List$drop, sourceIndex, nodes))));
											return _Utils_Tuple3(graph, sourceId, targetId);
										},
										A2($elm$random$Random$int, 1, nNodes - 1));
								},
								A2($elm$random$Random$int, 0, nNodes - 1)) : $elm$random$Random$constant(
								_Utils_Tuple3(graph, 1, 1));
						},
						extraEdgesGenerator);
				},
				allEdgesGenerator);
		},
		sizeGenerator);
}();
var $author$project$MainComponents$Structs$randomListGenerator = $elm_community$random_extra$Random$List$shuffle(
	A2($elm$core$List$range, 1, 30));
var $author$project$MainComponents$Structs$randomTargetGenerator = A2($elm$random$Random$int, 1, 30);
var $author$project$MainComponents$Structs$buildTree = F3(
	function (values, index, depth) {
		if ((_Utils_cmp(
			index,
			$elm$core$List$length(values)) > -1) || (depth >= 5)) {
			return $author$project$MainComponents$Structs$Empty;
		} else {
			var val = function () {
				var _v0 = A2($elm$core$List$drop, index, values);
				if (!_v0.b) {
					return 0;
				} else {
					var x = _v0.a;
					return x;
				}
			}();
			var rightSubtree = A3($author$project$MainComponents$Structs$buildTree, values, (2 * index) + 2, depth + 1);
			var leftSubtree = A3($author$project$MainComponents$Structs$buildTree, values, (2 * index) + 1, depth + 1);
			return A3($author$project$MainComponents$Structs$TreeNode, val, leftSubtree, rightSubtree);
		}
	});
var $author$project$MainComponents$Structs$randomTreeGenerator = F2(
	function (intOne, intTwo) {
		var sizeGenerator = A2($elm$random$Random$int, intOne, intTwo);
		return A2(
			$elm$random$Random$andThen,
			function (n) {
				return A2(
					$elm$random$Random$map,
					function (shuffledList) {
						var values = A2($elm$core$List$take, n, shuffledList);
						return A3($author$project$MainComponents$Structs$buildTree, values, 0, 0);
					},
					$elm_community$random_extra$Random$List$shuffle(
						A2($elm$core$List$range, 1, 99)));
			},
			sizeGenerator);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$SortingAlgorithms$SelectionSort$selectionSortStep = function (track) {
	var outer = track.outerIndex;
	var minimum = track.minIndex;
	var current = track.currentIndex;
	var arr = track.array;
	var length = $elm$core$Array$length(arr);
	if (track.sorted || (_Utils_cmp(outer, length) > -1)) {
		return _Utils_update(
			track,
			{sorted: true});
	} else {
		if (_Utils_cmp(current, length) < 0) {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Array$get, current, arr),
				A2($elm$core$Array$get, minimum, arr));
			if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
				var currentValue = _v0.a.a;
				var minimumValue = _v0.b.a;
				return (_Utils_cmp(currentValue, minimumValue) < 0) ? _Utils_update(
					track,
					{currentIndex: current + 1, minIndex: current}) : _Utils_update(
					track,
					{currentIndex: current + 1});
			} else {
				return track;
			}
		} else {
			var _v1 = _Utils_Tuple2(
				A2($elm$core$Array$get, outer, arr),
				A2($elm$core$Array$get, minimum, arr));
			if ((_v1.a.$ === 'Just') && (_v1.b.$ === 'Just')) {
				var outerValue = _v1.a.a;
				var minimumValue = _v1.b.a;
				var updatedArray = (!_Utils_eq(minimum, outer)) ? A3(
					$elm$core$Array$set,
					outer,
					minimumValue,
					A3($elm$core$Array$set, minimum, outerValue, arr)) : arr;
				return _Utils_update(
					track,
					{array: updatedArray, currentIndex: outer + 2, minIndex: outer + 1, outerIndex: outer + 1});
			} else {
				return track;
			}
		}
	}
};
var $author$project$SortingAlgorithms$ShellSort$shellSortStep = function (track) {
	var outer = track.outerIndex;
	var gap = track.gap;
	var current = track.currentStep;
	var arr = track.array;
	var length = $elm$core$Array$length(arr);
	if (track.sorted || (gap <= 0)) {
		return _Utils_update(
			track,
			{sorted: true});
	} else {
		if (_Utils_cmp(outer, length) > -1) {
			var newGap = (gap === 1) ? 0 : ((gap / 2) | 0);
			return _Utils_update(
				track,
				{currentStep: newGap, gap: newGap, outerIndex: newGap});
		} else {
			if (_Utils_cmp(current, gap) < 0) {
				return _Utils_update(
					track,
					{currentStep: outer + 1, outerIndex: outer + 1});
			} else {
				var _v0 = _Utils_Tuple2(
					A2($elm$core$Array$get, current, arr),
					A2($elm$core$Array$get, current - gap, arr));
				if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
					var currentValue = _v0.a.a;
					var gapValue = _v0.b.a;
					if (_Utils_cmp(currentValue, gapValue) < 0) {
						var updatedArray = A3(
							$elm$core$Array$set,
							current,
							gapValue,
							A3($elm$core$Array$set, current - gap, currentValue, arr));
						return _Utils_update(
							track,
							{array: updatedArray, currentIndex: current - gap, currentStep: current - gap});
					} else {
						return _Utils_update(
							track,
							{currentStep: outer + 1, outerIndex: outer + 1});
					}
				} else {
					return track;
				}
			}
		}
	}
};
var $author$project$DataStructures$ArrayList$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SetInput':
				var val = msg.a;
				return _Utils_update(
					model,
					{inputValue: val});
			case 'AddItem':
				if ($elm$core$List$length(model.elements) < 10) {
					var _v1 = $elm$core$String$toInt(model.inputValue);
					if (_v1.$ === 'Just') {
						var num = _v1.a;
						var newElements = _Utils_ap(
							model.elements,
							_List_fromArray(
								[num]));
						return _Utils_update(
							model,
							{elements: newElements, inputValue: ''});
					} else {
						return model;
					}
				} else {
					return model;
				}
			case 'ResetStruct':
				return _Utils_update(
					model,
					{elements: _List_Nil, inputValue: ''});
			default:
				var ds = msg.a;
				return _Utils_update(
					model,
					{dataStructure: ds});
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $author$project$DataStructures$SetMap$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SetKeyInput':
				var val = msg.a;
				return _Utils_update(
					model,
					{keyInput: val});
			case 'SetValInput':
				var val = msg.a;
				return _Utils_update(
					model,
					{valInput: val});
			case 'AddItem':
				var _v1 = model.dataStructure;
				if (_v1.$ === 'SetType') {
					var _v2 = $elm$core$String$toInt(model.keyInput);
					if (_v2.$ === 'Just') {
						var number = _v2.a;
						return _Utils_update(
							model,
							{
								keyInput: '',
								set: A2($elm$core$Set$insert, number, model.set)
							});
					} else {
						return model;
					}
				} else {
					return (model.keyInput !== '') ? _Utils_update(
						model,
						{
							keyInput: '',
							map: A3($elm$core$Dict$insert, model.keyInput, model.valInput, model.map),
							valInput: ''
						}) : model;
				}
			case 'ResetStruct':
				return _Utils_update(
					model,
					{keyInput: '', map: $elm$core$Dict$empty, set: $elm$core$Set$empty, valInput: ''});
			default:
				var ds = msg.a;
				return _Utils_update(
					model,
					{dataStructure: ds});
		}
	});
var $author$project$DataStructures$StackQueue$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SetInput':
				var val = msg.a;
				return _Utils_update(
					model,
					{inputValue: val});
			case 'AddItem':
				if ($elm$core$List$length(model.elements) < 10) {
					var _v1 = $elm$core$String$toInt(model.inputValue);
					if (_v1.$ === 'Just') {
						var num = _v1.a;
						var newElements = function () {
							var _v2 = model.dataStructure;
							if (_v2.$ === 'Stack') {
								return A2($elm$core$List$cons, num, model.elements);
							} else {
								return _Utils_ap(
									model.elements,
									_List_fromArray(
										[num]));
							}
						}();
						return _Utils_update(
							model,
							{elements: newElements, inputValue: ''});
					} else {
						return model;
					}
				} else {
					return model;
				}
			case 'RemoveItem':
				var _v3 = model.elements;
				if (!_v3.b) {
					return model;
				} else {
					var rest = _v3.b;
					return _Utils_update(
						model,
						{elements: rest});
				}
			default:
				var newStructure = msg.a;
				return _Utils_update(
					model,
					{dataStructure: newStructure});
		}
	});
var $author$project$Graphs$Dijkstra$resetAndGenerateGraph = function (model) {
	var cmd = A2($elm$random$Random$generate, $author$project$Graphs$Dijkstra$SetGraph, $author$project$MainComponents$Structs$randomGraphGenerator);
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{dijkstraSteps: _List_Nil, index: 0, running: false}),
		cmd);
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Graphs$Dijkstra$getNeighbors = F2(
	function (graph, node) {
		return A2(
			$elm$core$List$map,
			function (edge) {
				return _Utils_eq(edge.from, node) ? _Utils_Tuple2(edge.to, edge.weight) : _Utils_Tuple2(edge.from, edge.weight);
			},
			A2(
				$elm$core$List$filter,
				function (edge) {
					return _Utils_eq(edge.from, node) || _Utils_eq(edge.to, node);
				},
				graph.edges));
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$Graphs$Dijkstra$simulate = F9(
	function (graph, distances, previous, queue, visited, steps, traversedEdges, target, source) {
		simulate:
		while (true) {
			if (!queue.b) {
				return $elm$core$List$reverse(steps);
			} else {
				var sortedQueue = A2(
					$elm$core$List$sortBy,
					function (_v7) {
						var dist = _v7.b;
						return dist;
					},
					queue);
				if (sortedQueue.b) {
					var _v2 = sortedQueue.a;
					var node = _v2.a;
					var distance = _v2.b;
					var rest = sortedQueue.b;
					if (A2($elm$core$Set$member, node, visited)) {
						var $temp$graph = graph,
							$temp$distances = distances,
							$temp$previous = previous,
							$temp$queue = rest,
							$temp$visited = visited,
							$temp$steps = steps,
							$temp$traversedEdges = traversedEdges,
							$temp$target = target,
							$temp$source = source;
						graph = $temp$graph;
						distances = $temp$distances;
						previous = $temp$previous;
						queue = $temp$queue;
						visited = $temp$visited;
						steps = $temp$steps;
						traversedEdges = $temp$traversedEdges;
						target = $temp$target;
						source = $temp$source;
						continue simulate;
					} else {
						var updateNeighbor = F2(
							function (_v5, _v6) {
								var neighbor = _v5.a;
								var edgeWeight = _v5.b;
								var upDist = _v6.a;
								var upPrev = _v6.b;
								var upQueue = _v6.c;
								var oldDist = A2(
									$elm$core$Maybe$withDefault,
									10000,
									A2($elm$core$Dict$get, neighbor, upDist));
								var newDist = distance + edgeWeight;
								return (_Utils_cmp(newDist, oldDist) < 0) ? _Utils_Tuple3(
									A3($elm$core$Dict$insert, neighbor, newDist, upDist),
									A3($elm$core$Dict$insert, neighbor, node, upPrev),
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(neighbor, newDist),
										upQueue)) : _Utils_Tuple3(upDist, upPrev, upQueue);
							});
						var newVisited = A2($elm$core$Set$insert, node, visited);
						var neighbors = A2($author$project$Graphs$Dijkstra$getNeighbors, graph, node);
						var maybeEdge = _Utils_eq(node, source) ? $elm$core$Maybe$Nothing : A2($elm$core$Dict$get, node, previous);
						var newTraversedEdges = function () {
							if (maybeEdge.$ === 'Just') {
								var parent = maybeEdge.a;
								return _Utils_ap(
									traversedEdges,
									_List_fromArray(
										[
											_Utils_Tuple2(parent, node)
										]));
							} else {
								return traversedEdges;
							}
						}();
						var _v3 = A3(
							$elm$core$List$foldl,
							updateNeighbor,
							_Utils_Tuple3(distances, previous, _List_Nil),
							neighbors);
						var newDistances = _v3.a;
						var newPrevious = _v3.b;
						var newQueueEntries = _v3.c;
						var newStep = {
							currentNode: $elm$core$Maybe$Just(node),
							distances: newDistances,
							finalCost: _Utils_eq(node, target) ? $elm$core$Maybe$Just(distance) : $elm$core$Maybe$Nothing,
							graph: graph,
							options: sortedQueue,
							previous: newPrevious,
							traversedEdges: newTraversedEdges,
							visitedNodes: $elm$core$Set$toList(newVisited)
						};
						var updatedQueue = _Utils_ap(rest, newQueueEntries);
						if (_Utils_eq(node, target)) {
							return $elm$core$List$reverse(
								A2($elm$core$List$cons, newStep, steps));
						} else {
							var $temp$graph = graph,
								$temp$distances = newDistances,
								$temp$previous = newPrevious,
								$temp$queue = updatedQueue,
								$temp$visited = newVisited,
								$temp$steps = A2($elm$core$List$cons, newStep, steps),
								$temp$traversedEdges = newTraversedEdges,
								$temp$target = target,
								$temp$source = source;
							graph = $temp$graph;
							distances = $temp$distances;
							previous = $temp$previous;
							queue = $temp$queue;
							visited = $temp$visited;
							steps = $temp$steps;
							traversedEdges = $temp$traversedEdges;
							target = $temp$target;
							source = $temp$source;
							continue simulate;
						}
					}
				} else {
					return $elm$core$List$reverse(steps);
				}
			}
		}
	});
var $author$project$Graphs$Dijkstra$simulateDijkstra = F3(
	function (graph, source, target) {
		var initialVisited = $elm$core$Set$empty;
		var initialQueue = _List_fromArray(
			[
				_Utils_Tuple2(source, 0)
			]);
		var initialPrevious = $elm$core$Dict$empty;
		var initialDistances = A3(
			$elm$core$List$foldl,
			F2(
				function (node, dict) {
					return A3(
						$elm$core$Dict$insert,
						node.id,
						_Utils_eq(node.id, source) ? 0 : 10000,
						dict);
				}),
			$elm$core$Dict$empty,
			graph.nodes);
		return A9($author$project$Graphs$Dijkstra$simulate, graph, initialDistances, initialPrevious, initialQueue, initialVisited, _List_Nil, _List_Nil, target, source);
	});
var $author$project$Graphs$Dijkstra$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'GenerateGraph':
				return $author$project$Graphs$Dijkstra$resetAndGenerateGraph(model);
			case 'SetGraph':
				var _v1 = msg.a;
				var newGraph = _v1.a;
				var sourceId = _v1.b;
				var targetId = _v1.c;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dijkstraSteps: A3($author$project$Graphs$Dijkstra$simulateDijkstra, newGraph, sourceId, targetId),
							graph: newGraph,
							index: 0,
							running: false,
							source: $elm$core$Maybe$Just(sourceId),
							target: $elm$core$Maybe$Just(targetId)
						}),
					$elm$core$Platform$Cmd$none);
			case 'DijkstraStep':
				var totalSteps = $elm$core$List$length(model.dijkstraSteps);
				var newIndex = model.index + 1;
				return (_Utils_cmp(newIndex, totalSteps) < 0) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{index: newIndex}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'Tick':
				var totalSteps = $elm$core$List$length(model.dijkstraSteps);
				var newIndex = model.index + 1;
				return (_Utils_cmp(newIndex, totalSteps) < 0) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{index: newIndex}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{running: false}),
					$elm$core$Platform$Cmd$none);
			case 'StartDijkstra':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: true}),
					$elm$core$Platform$Cmd$none);
			case 'StopDijkstra':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: false}),
					$elm$core$Platform$Cmd$none);
			default:
				return $author$project$Graphs$Dijkstra$resetAndGenerateGraph(model);
		}
	});
var $author$project$Graphs$MST$Kruskal = {$: 'Kruskal'};
var $author$project$Graphs$MST$initialKruskalState = function (graph) {
	var union = $author$project$MainComponents$Structs$unionInit(
		$elm$core$List$length(graph.nodes));
	var sortedEdges = A2(
		$elm$core$List$sortBy,
		function (e) {
			return e.weight;
		},
		graph.edges);
	return {currentEdge: $elm$core$Maybe$Nothing, edgeQueue: sortedEdges, finalCost: $elm$core$Maybe$Nothing, graph: graph, treeEdges: _List_Nil, union: union, visitedNodes: _List_Nil};
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Graphs$MST$updateStateWithEdge = F2(
	function (state, edge) {
		var totalEdgesNeeded = $elm$core$List$length(state.graph.nodes) - 1;
		var toRoot = A2($author$project$MainComponents$Structs$unionFind, state.union, edge.to);
		var remainingEdges = function () {
			var _v1 = state.edgeQueue;
			if (_v1.b) {
				var tail = _v1.b;
				return tail;
			} else {
				return _List_Nil;
			}
		}();
		var fromRoot = A2($author$project$MainComponents$Structs$unionFind, state.union, edge.from);
		var _v0 = function () {
			if (_Utils_eq(fromRoot, toRoot)) {
				return _Utils_Tuple3(state.treeEdges, state.union, state.visitedNodes);
			} else {
				var updatedUnion = A3($author$project$MainComponents$Structs$unionCheck, state.union, fromRoot, toRoot);
				var updatedTreeEdges = A2($elm$core$List$cons, edge, state.treeEdges);
				var addNode = F2(
					function (nodes, node) {
						return A2($elm$core$List$member, node, nodes) ? nodes : A2($elm$core$List$cons, node, nodes);
					});
				var updatedVisited = function (visited) {
					return A2(addNode, visited, edge.to);
				}(
					function (visited) {
						return A2(addNode, visited, edge.from);
					}(state.visitedNodes));
				return _Utils_Tuple3(updatedTreeEdges, updatedUnion, updatedVisited);
			}
		}();
		var newTreeEdges = _v0.a;
		var newunion = _v0.b;
		var newVisited = _v0.c;
		var cost = _Utils_eq(
			$elm$core$List$length(newTreeEdges),
			totalEdgesNeeded) ? $elm$core$Maybe$Just(
			A3(
				$elm$core$List$foldl,
				F2(
					function (e, acc) {
						return acc + e.weight;
					}),
				0,
				newTreeEdges)) : $elm$core$Maybe$Nothing;
		return _Utils_update(
			state,
			{
				currentEdge: $elm$core$Maybe$Just(edge),
				edgeQueue: remainingEdges,
				finalCost: cost,
				treeEdges: newTreeEdges,
				union: newunion,
				visitedNodes: newVisited
			});
	});
var $author$project$Graphs$MST$generateKruskalSteps = function (graph) {
	var initialState = $author$project$Graphs$MST$initialKruskalState(graph);
	var states = A3(
		$elm$core$List$foldl,
		F2(
			function (edge, acc) {
				var current = A2(
					$elm$core$Maybe$withDefault,
					initialState,
					$elm$core$List$head(acc));
				var newState = A2($author$project$Graphs$MST$updateStateWithEdge, current, edge);
				return A2($elm$core$List$cons, newState, acc);
			}),
		_List_fromArray(
			[initialState]),
		initialState.edgeQueue);
	return $elm$core$List$reverse(states);
};
var $author$project$Graphs$MST$edgesFromNode = F2(
	function (graph, node) {
		return A2(
			$elm$core$List$filter,
			function (edge) {
				return _Utils_eq(edge.from, node) || _Utils_eq(edge.to, node);
			},
			graph.edges);
	});
var $author$project$Graphs$MST$initialPrimState = F2(
	function (graph, startNode) {
		var visited = _List_fromArray(
			[startNode]);
		var outgoingEdges = A2(
			$elm$core$List$sortBy,
			function ($) {
				return $.weight;
			},
			A2($author$project$Graphs$MST$edgesFromNode, graph, startNode));
		return {
			currentEdge: $elm$core$Maybe$Nothing,
			edgeQueue: outgoingEdges,
			finalCost: $elm$core$Maybe$Nothing,
			graph: graph,
			treeEdges: _List_Nil,
			union: $author$project$MainComponents$Structs$unionInit(0),
			visitedNodes: visited
		};
	});
var $author$project$Graphs$MST$findValidPrimEdge = F2(
	function (visited, edges) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (edge) {
					return (A2($elm$core$List$member, edge.from, visited) && (!A2($elm$core$List$member, edge.to, visited))) || (A2($elm$core$List$member, edge.to, visited) && (!A2($elm$core$List$member, edge.from, visited)));
				},
				A2(
					$elm$core$List$sortBy,
					function ($) {
						return $.weight;
					},
					edges)));
	});
var $author$project$Graphs$MST$pickNextPrimEdge = function (state) {
	var _v0 = A2($author$project$Graphs$MST$findValidPrimEdge, state.visitedNodes, state.edgeQueue);
	if (_v0.$ === 'Just') {
		var edge = _v0.a;
		var updatedMSTEdges = A2($elm$core$List$cons, edge, state.treeEdges);
		var newNode = A2($elm$core$List$member, edge.from, state.visitedNodes) ? edge.to : edge.from;
		var newVisited = A2($elm$core$List$cons, newNode, state.visitedNodes);
		var newEdges = A2(
			$elm$core$List$filter,
			function (e) {
				return !(A2($elm$core$List$member, e.to, newVisited) && A2($elm$core$List$member, e.from, newVisited));
			},
			A2($author$project$Graphs$MST$edgesFromNode, state.graph, newNode));
		var filteredQueue = A2(
			$elm$core$List$filter,
			$elm$core$Basics$neq(edge),
			state.edgeQueue);
		var updatedQueue = A2(
			$elm$core$List$sortBy,
			function ($) {
				return $.weight;
			},
			_Utils_ap(filteredQueue, newEdges));
		return _Utils_update(
			state,
			{
				currentEdge: $elm$core$Maybe$Just(edge),
				edgeQueue: updatedQueue,
				treeEdges: updatedMSTEdges,
				visitedNodes: newVisited
			});
	} else {
		return state;
	}
};
var $author$project$Graphs$MST$unfoldPrimSteps = F2(
	function (state, accumulator) {
		unfoldPrimSteps:
		while (true) {
			var visitedCount = $elm$core$List$length(state.visitedNodes);
			var totalNodes = $elm$core$List$length(state.graph.nodes);
			if (_Utils_eq(visitedCount, totalNodes)) {
				var maybeCost = $elm$core$Maybe$Just(
					A3(
						$elm$core$List$foldl,
						F2(
							function (e, accumulatorCost) {
								return accumulatorCost + e.weight;
							}),
						0,
						state.treeEdges));
				var finalState = _Utils_update(
					state,
					{finalCost: maybeCost});
				return A2($elm$core$List$cons, finalState, accumulator);
			} else {
				var nextState = $author$project$Graphs$MST$pickNextPrimEdge(state);
				var $temp$state = nextState,
					$temp$accumulator = A2($elm$core$List$cons, state, accumulator);
				state = $temp$state;
				accumulator = $temp$accumulator;
				continue unfoldPrimSteps;
			}
		}
	});
var $author$project$Graphs$MST$generatePrimSteps = F2(
	function (graph, startNode) {
		var initialState = A2($author$project$Graphs$MST$initialPrimState, graph, startNode);
		var states = A2($author$project$Graphs$MST$unfoldPrimSteps, initialState, _List_Nil);
		return $elm$core$List$reverse(states);
	});
var $author$project$Graphs$MST$resetAndGenerateGraph = function (model) {
	var cmd = A2(
		$elm$random$Random$generate,
		function (_v0) {
			var graph = _v0.a;
			var source = _v0.b;
			var target = _v0.c;
			return $author$project$Graphs$MST$SetGraph(
				_Utils_Tuple2(graph, source));
		},
		$author$project$MainComponents$Structs$randomGraphGenerator);
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{index: 0, mstSteps: _List_Nil, running: false}),
		cmd);
};
var $author$project$Graphs$MST$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'GenerateGraph':
				return $author$project$Graphs$MST$resetAndGenerateGraph(model);
			case 'SetGraph':
				var _v1 = msg.a;
				var newGraph = _v1.a;
				var startNode = _v1.b;
				var steps = function () {
					var _v2 = model.selectedAlgorithm;
					if (_v2.$ === 'Kruskal') {
						return $author$project$Graphs$MST$generateKruskalSteps(newGraph);
					} else {
						return A2($author$project$Graphs$MST$generatePrimSteps, newGraph, startNode);
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{graph: newGraph, index: 0, mstSteps: steps, running: false, startNode: startNode}),
					$elm$core$Platform$Cmd$none);
			case 'MSTStep':
				var totalSteps = $elm$core$List$length(model.mstSteps);
				var newIndex = model.index + 1;
				return (_Utils_cmp(newIndex, totalSteps) < 0) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{index: newIndex}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'Tick':
				var totalSteps = $elm$core$List$length(model.mstSteps);
				var newIndex = model.index + 1;
				return (_Utils_cmp(newIndex, totalSteps) < 0) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{index: newIndex}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{running: false}),
					$elm$core$Platform$Cmd$none);
			case 'StartMST':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: true}),
					$elm$core$Platform$Cmd$none);
			case 'StopMST':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: false}),
					$elm$core$Platform$Cmd$none);
			case 'ResetGraph':
				return $author$project$Graphs$MST$resetAndGenerateGraph(model);
			case 'SelectPrim':
				var _v3 = $author$project$Graphs$MST$resetAndGenerateGraph(model);
				var newModel = _v3.a;
				var cmd = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{selectedAlgorithm: $author$project$Graphs$MST$Prim}),
					cmd);
			default:
				var _v4 = $author$project$Graphs$MST$resetAndGenerateGraph(model);
				var newModel = _v4.a;
				var cmd = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						newModel,
						{selectedAlgorithm: $author$project$Graphs$MST$Kruskal}),
					cmd);
		}
	});
var $author$project$MainComponents$Home$IndexSwap = function (a) {
	return {$: 'IndexSwap', a: a};
};
var $author$project$MainComponents$Structs$Light = {$: 'Light'};
var $elm$random$Random$pair = F2(
	function (genA, genB) {
		return A3(
			$elm$random$Random$map2,
			F2(
				function (a, b) {
					return _Utils_Tuple2(a, b);
				}),
			genA,
			genB);
	});
var $author$project$MainComponents$Home$swap = F3(
	function (indexOne, indexTwo, array) {
		var _v0 = _Utils_Tuple2(
			A2($elm$core$Array$get, indexOne, array),
			A2($elm$core$Array$get, indexTwo, array));
		if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
			var valueOne = _v0.a.a;
			var valueTwo = _v0.b.a;
			return A3(
				$elm$core$Array$set,
				indexTwo,
				valueOne,
				A3($elm$core$Array$set, indexOne, valueTwo, array));
		} else {
			return array;
		}
	});
var $author$project$MainComponents$Home$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'ToggleTheme':
				var switched = function () {
					var _v1 = model.theme;
					if (_v1.$ === 'Light') {
						return $author$project$MainComponents$Structs$Dark;
					} else {
						return $author$project$MainComponents$Structs$Light;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{theme: switched}),
					$elm$core$Platform$Cmd$none);
			case 'TypingSimulation':
				return ((_Utils_cmp(
					model.typingIndex,
					$elm$core$String$length(model.targetString) + 5) < 0) && (!model.typingFlag)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{typingIndex: model.typingIndex + 1}),
					$elm$core$Platform$Cmd$none) : (((model.typingIndex > 1) && model.typingFlag) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{typingIndex: model.typingIndex - 1}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{typingFlag: !model.typingFlag}),
					$elm$core$Platform$Cmd$none));
			case 'SwapNeeded':
				var arrLength = $elm$core$Array$length(model.backgroundArray);
				var randomCmd = A2(
					$elm$random$Random$generate,
					$author$project$MainComponents$Home$IndexSwap,
					A2(
						$elm$random$Random$pair,
						A2($elm$random$Random$int, 0, arrLength - 1),
						A2($elm$random$Random$int, 0, arrLength - 1)));
				return _Utils_Tuple2(model, randomCmd);
			default:
				var _v2 = msg.a;
				var indexOne = _v2.a;
				var indexTwo = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							backgroundArray: A3($author$project$MainComponents$Home$swap, indexOne, indexTwo, model.backgroundArray),
							indexOne: indexOne,
							indexTwo: indexTwo
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Trees$BST$TreeGenerated = function (a) {
	return {$: 'TreeGenerated', a: a};
};
var $author$project$Trees$BST$searchPath = F2(
	function (target, tree) {
		if (tree.$ === 'TreeNode') {
			var value = tree.a;
			var left = tree.b;
			var right = tree.c;
			return _Utils_eq(value, target) ? _List_fromArray(
				[value]) : ((_Utils_cmp(target, value) < 0) ? A2(
				$elm$core$List$cons,
				value,
				A2($author$project$Trees$BST$searchPath, target, left)) : A2(
				$elm$core$List$cons,
				value,
				A2($author$project$Trees$BST$searchPath, target, right)));
		} else {
			return _List_Nil;
		}
	});
var $author$project$Trees$BST$stepTraversal = F2(
	function (isAuto, model) {
		var _v0 = model.index;
		if (_v0.$ === 'Just') {
			var i = _v0.a;
			var nextIdx = i + 1;
			var done = _Utils_cmp(
				nextIdx,
				$elm$core$List$length(model.traversalResult)) > -1;
			return _Utils_update(
				model,
				{
					index: $elm$core$Maybe$Just(nextIdx),
					running: isAuto ? (!done) : false
				});
		} else {
			return model;
		}
	});
var $author$project$Trees$BST$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SetTree':
				var newTree = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							index: $elm$core$Maybe$Just(0),
							traversalResult: _List_Nil,
							tree: newTree
						}),
					$elm$core$Platform$Cmd$none);
			case 'TraversalStep':
				return _Utils_Tuple2(
					A2($author$project$Trees$BST$stepTraversal, false, model),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				return _Utils_Tuple2(
					A2($author$project$Trees$BST$stepTraversal, true, model),
					$elm$core$Platform$Cmd$none);
			case 'StartTraversal':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: true}),
					$elm$core$Platform$Cmd$none);
			case 'StopTraversal':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: false}),
					$elm$core$Platform$Cmd$none);
			case 'ResetTraversal':
				var cmd = A2(
					$elm$random$Random$generate,
					$author$project$Trees$BST$TreeGenerated,
					A2($author$project$MainComponents$Structs$randomBSTGenerator, 9, 31));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							index: $elm$core$Maybe$Just(0),
							running: false,
							searchInput: '',
							traversalResult: _List_Nil
						}),
					cmd);
			case 'TreeGenerated':
				var newTree = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							index: $elm$core$Maybe$Just(0),
							tree: newTree
						}),
					$elm$core$Platform$Cmd$none);
			case 'SetSearchInput':
				var str = msg.a;
				var _v1 = $elm$core$String$toInt(str);
				if (_v1.$ === 'Just') {
					var tgt = _v1.a;
					var path = A2($author$project$Trees$BST$searchPath, tgt, model.tree);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								index: $elm$core$Maybe$Just(0),
								running: false,
								searchInput: str,
								traversalResult: path
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								index: $elm$core$Maybe$Just(0),
								running: false,
								searchInput: str,
								traversalResult: _List_Nil
							}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				var _v2 = $elm$core$String$toInt(model.searchInput);
				if (_v2.$ === 'Just') {
					var tgt = _v2.a;
					var path = A2($author$project$Trees$BST$searchPath, tgt, model.tree);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								index: $elm$core$Maybe$Just(0),
								running: false,
								traversalResult: path
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Trees$HeapType$buildSubtree = F2(
	function (arr, index) {
		if (_Utils_cmp(
			index,
			$elm$core$List$length(arr)) < 0) {
			var _v0 = $elm$core$List$head(
				A2($elm$core$List$drop, index, arr));
			if (_v0.$ === 'Just') {
				var actualVal = _v0.a;
				return A3(
					$author$project$MainComponents$Structs$TreeNode,
					actualVal,
					A2($author$project$Trees$HeapType$buildSubtree, arr, (2 * index) + 1),
					A2($author$project$Trees$HeapType$buildSubtree, arr, (2 * index) + 2));
			} else {
				return $author$project$MainComponents$Structs$Empty;
			}
		} else {
			return $author$project$MainComponents$Structs$Empty;
		}
	});
var $author$project$Trees$HeapType$levelArrayToTree = function (arr) {
	return A2($author$project$Trees$HeapType$buildSubtree, arr, 0);
};
var $author$project$Trees$HeapType$swapIndices = F3(
	function (arr, indexOne, indexTwo) {
		if (_Utils_eq(indexOne, indexTwo)) {
			return arr;
		} else {
			var valueTwo = $elm$core$List$head(
				A2($elm$core$List$drop, indexTwo, arr));
			var valueOne = $elm$core$List$head(
				A2($elm$core$List$drop, indexOne, arr));
			var _v0 = _Utils_Tuple2(valueOne, valueTwo);
			if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
				var x = _v0.a.a;
				var y = _v0.b.a;
				return A2(
					$elm$core$List$indexedMap,
					F2(
						function (idx, val) {
							return _Utils_eq(idx, indexOne) ? y : (_Utils_eq(idx, indexTwo) ? x : val);
						}),
					arr);
			} else {
				return arr;
			}
		}
	});
var $author$project$Trees$HeapType$heapifySteps = F4(
	function (arr, index, size, heapType) {
		var withinBounds = function (idx) {
			return _Utils_cmp(idx, size) < 0;
		};
		var right = (2 * index) + 2;
		var left = (2 * index) + 1;
		var get = F2(
			function (array, idx) {
				var _v1 = $elm$core$List$head(
					A2($elm$core$List$drop, idx, array));
				if (_v1.$ === 'Just') {
					var x = _v1.a;
					return x;
				} else {
					return -1;
				}
			});
		var compareIndex = F3(
			function (currentArr, indexOne, indexTwo) {
				var valueTwo = A2(get, currentArr, indexTwo);
				var valueOne = A2(get, currentArr, indexOne);
				if (heapType.$ === 'MaxHeap') {
					return (_Utils_cmp(valueTwo, valueOne) > 0) ? indexTwo : indexOne;
				} else {
					return (_Utils_cmp(valueTwo, valueOne) < 0) ? indexTwo : indexOne;
				}
			});
		if (!withinBounds(index)) {
			return _List_Nil;
		} else {
			var target1 = withinBounds(left) ? A3(compareIndex, arr, index, left) : index;
			var target2 = withinBounds(right) ? A3(compareIndex, arr, target1, right) : target1;
			if (!_Utils_eq(target2, index)) {
				var swappedArray = A3($author$project$Trees$HeapType$swapIndices, arr, index, target2);
				var subsequentStates = A4($author$project$Trees$HeapType$heapifySteps, swappedArray, target2, size, heapType);
				var oldValue = A2(get, arr, index);
				var newValue = A2(get, arr, target2);
				var currentStep = {
					swappedIndices: $elm$core$Maybe$Just(
						_Utils_Tuple2(oldValue, newValue)),
					tree: $author$project$Trees$HeapType$levelArrayToTree(swappedArray)
				};
				return A2($elm$core$List$cons, currentStep, subsequentStates);
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$Trees$HeapType$levelOrderHelper = F2(
	function (queue, accumulatorList) {
		levelOrderHelper:
		while (true) {
			if (queue.b) {
				var tree = queue.a;
				var rest = queue.b;
				if (tree.$ === 'TreeNode') {
					var val = tree.a;
					var left = tree.b;
					var right = tree.c;
					var $temp$queue = _Utils_ap(
						rest,
						_List_fromArray(
							[left, right])),
						$temp$accumulatorList = _Utils_ap(
						accumulatorList,
						_List_fromArray(
							[val]));
					queue = $temp$queue;
					accumulatorList = $temp$accumulatorList;
					continue levelOrderHelper;
				} else {
					var $temp$queue = rest,
						$temp$accumulatorList = accumulatorList;
					queue = $temp$queue;
					accumulatorList = $temp$accumulatorList;
					continue levelOrderHelper;
				}
			} else {
				return accumulatorList;
			}
		}
	});
var $author$project$Trees$HeapType$treeToLevelArray = function (tree) {
	return A2(
		$author$project$Trees$HeapType$levelOrderHelper,
		_List_fromArray(
			[tree]),
		_List_Nil);
};
var $author$project$Trees$HeapType$buildHeapSteps = F2(
	function (arr, heapType) {
		var length = $elm$core$List$length(arr);
		var processIndex = F2(
			function (index, _v2) {
				var currentArr = _v2.a;
				var stepsSoFar = _v2.b;
				var newStates = A4($author$project$Trees$HeapType$heapifySteps, currentArr, index, length, heapType);
				var updatedArr = function () {
					var _v1 = $elm$core$List$reverse(newStates);
					if (_v1.b) {
						var step = _v1.a;
						return $author$project$Trees$HeapType$treeToLevelArray(step.tree);
					} else {
						return currentArr;
					}
				}();
				return _Utils_Tuple2(
					updatedArr,
					_Utils_ap(stepsSoFar, newStates));
			});
		var initialStep = {
			swappedIndices: $elm$core$Maybe$Nothing,
			tree: $author$project$Trees$HeapType$levelArrayToTree(arr)
		};
		var indices = $elm$core$List$reverse(
			A2($elm$core$List$range, 0, ((length / 2) | 0) - 1));
		if (!length) {
			return _List_Nil;
		} else {
			var _v0 = A3(
				$elm$core$List$foldl,
				processIndex,
				_Utils_Tuple2(
					arr,
					_List_fromArray(
						[initialStep])),
				indices);
			var steps = _v0.b;
			return steps;
		}
	});
var $author$project$Trees$HeapType$deleteRoot = F2(
	function (arr, heapType) {
		var n = $elm$core$List$length(arr);
		if (n === 1) {
			return _List_Nil;
		} else {
			var rootVal = A2(
				$elm$core$Maybe$withDefault,
				-1,
				$elm$core$List$head(arr));
			var lastIndex = n - 1;
			var lastVal = A2(
				$elm$core$Maybe$withDefault,
				-1,
				$elm$core$List$head(
					A2($elm$core$List$drop, lastIndex, arr)));
			var swapped = A3($author$project$Trees$HeapType$swapIndices, arr, 0, lastIndex);
			var removed = A2($elm$core$List$take, lastIndex, swapped);
			var reheapifySteps = A4(
				$author$project$Trees$HeapType$heapifySteps,
				removed,
				0,
				$elm$core$List$length(removed),
				heapType);
			var removeStep = {
				swappedIndices: $elm$core$Maybe$Just(
					_Utils_Tuple2(lastVal, lastVal)),
				tree: $author$project$Trees$HeapType$levelArrayToTree(removed)
			};
			var swapStep = {
				swappedIndices: $elm$core$Maybe$Just(
					_Utils_Tuple2(rootVal, lastVal)),
				tree: $author$project$Trees$HeapType$levelArrayToTree(swapped)
			};
			return A2(
				$elm$core$List$cons,
				swapStep,
				A2($elm$core$List$cons, removeStep, reheapifySteps));
		}
	});
var $author$project$Trees$HeapType$TreeGenerated = function (a) {
	return {$: 'TreeGenerated', a: a};
};
var $author$project$Trees$HeapType$resetAndGenerateTree = F2(
	function (newHeapType, model) {
		var cmd = A2(
			$elm$random$Random$generate,
			$author$project$Trees$HeapType$TreeGenerated,
			A2($author$project$MainComponents$Structs$randomTreeGenerator, 9, 30));
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{heapType: newHeapType, heapifySteps: _List_Nil, index: 0, newValue: '', running: false}),
			cmd);
	});
var $author$project$Trees$HeapType$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'ChangeHeapType':
				var newHeapType = msg.a;
				return A2($author$project$Trees$HeapType$resetAndGenerateTree, newHeapType, model);
			case 'SetTree':
				var newTree = msg.a;
				return A2($author$project$Trees$HeapType$resetAndGenerateTree, model.heapType, model);
			case 'UpdateNewValue':
				var val = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{newValue: val}),
					$elm$core$Platform$Cmd$none);
			case 'AddNode':
				var _v1 = $elm$core$String$toInt(model.newValue);
				if (_v1.$ === 'Just') {
					var num = _v1.a;
					var arrayBefore = $author$project$Trees$HeapType$treeToLevelArray(model.tree);
					var canInsert = ($elm$core$List$length(arrayBefore) < 31) && (!A2($elm$core$List$member, num, arrayBefore));
					if (!canInsert) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var arrayWithNew = _Utils_ap(
							arrayBefore,
							_List_fromArray(
								[num]));
						var steps = A2($author$project$Trees$HeapType$buildHeapSteps, arrayWithNew, model.heapType);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{heapifySteps: steps, index: 0, newValue: '', running: false}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'DeleteRoot':
				var arrayBefore = $author$project$Trees$HeapType$treeToLevelArray(model.tree);
				if (arrayBefore.b && (!arrayBefore.b.b)) {
					var _int = arrayBefore.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var steps = A2($author$project$Trees$HeapType$deleteRoot, arrayBefore, model.heapType);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{heapifySteps: steps, index: 0, running: false}),
						$elm$core$Platform$Cmd$none);
				}
			case 'HeapifyStep':
				var totalSteps = $elm$core$List$length(model.heapifySteps);
				var newIndex = model.index + 1;
				if (_Utils_cmp(newIndex, totalSteps) < 0) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{index: newIndex}),
						$elm$core$Platform$Cmd$none);
				} else {
					var finalTree = function () {
						var _v3 = $elm$core$List$reverse(model.heapifySteps);
						if (_v3.b) {
							var last = _v3.a;
							return last.tree;
						} else {
							return model.tree;
						}
					}();
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{index: newIndex - 1, running: false, tree: finalTree}),
						$elm$core$Platform$Cmd$none);
				}
			case 'Tick':
				var totalSteps = $elm$core$List$length(model.heapifySteps);
				var newIndex = model.index + 1;
				if (_Utils_cmp(newIndex, totalSteps) < 0) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{index: newIndex}),
						$elm$core$Platform$Cmd$none);
				} else {
					var finalTree = function () {
						var _v4 = $elm$core$List$reverse(model.heapifySteps);
						if (_v4.b) {
							var last = _v4.a;
							return last.tree;
						} else {
							return model.tree;
						}
					}();
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{index: newIndex - 1, running: false, tree: finalTree}),
						$elm$core$Platform$Cmd$none);
				}
			case 'StartHeapify':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: true}),
					$elm$core$Platform$Cmd$none);
			case 'StopHeapify':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: false}),
					$elm$core$Platform$Cmd$none);
			case 'ResetHeap':
				return A2($author$project$Trees$HeapType$resetAndGenerateTree, model.heapType, model);
			default:
				var newTree = msg.a;
				var arr = $author$project$Trees$HeapType$treeToLevelArray(newTree);
				var states = A2($author$project$Trees$HeapType$buildHeapSteps, arr, model.heapType);
				var finalArr = function () {
					var _v5 = $elm$core$List$reverse(states);
					if (_v5.b) {
						var lastStep = _v5.a;
						return $author$project$Trees$HeapType$treeToLevelArray(lastStep.tree);
					} else {
						return arr;
					}
				}();
				var finalTree = $author$project$Trees$HeapType$levelArrayToTree(finalArr);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{heapifySteps: _List_Nil, index: 0, tree: finalTree}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Trees$TreeTraversal$TreeGenerated = function (a) {
	return {$: 'TreeGenerated', a: a};
};
var $author$project$Trees$TreeTraversal$inorder = function (node) {
	if (node.$ === 'TreeNode') {
		var val = node.a;
		var left = node.b;
		var right = node.c;
		return _Utils_ap(
			$author$project$Trees$TreeTraversal$inorder(left),
			_Utils_ap(
				_List_fromArray(
					[val]),
				$author$project$Trees$TreeTraversal$inorder(right)));
	} else {
		return _List_Nil;
	}
};
var $author$project$Trees$TreeTraversal$postorder = function (node) {
	if (node.$ === 'TreeNode') {
		var val = node.a;
		var left = node.b;
		var right = node.c;
		return _Utils_ap(
			$author$project$Trees$TreeTraversal$postorder(left),
			_Utils_ap(
				$author$project$Trees$TreeTraversal$postorder(right),
				_List_fromArray(
					[val])));
	} else {
		return _List_Nil;
	}
};
var $author$project$Trees$TreeTraversal$preorder = function (node) {
	if (node.$ === 'TreeNode') {
		var val = node.a;
		var left = node.b;
		var right = node.c;
		return A2(
			$elm$core$List$cons,
			val,
			_Utils_ap(
				$author$project$Trees$TreeTraversal$preorder(left),
				$author$project$Trees$TreeTraversal$preorder(right)));
	} else {
		return _List_Nil;
	}
};
var $author$project$Trees$TreeTraversal$getTraversal = F2(
	function (traversalType, tree) {
		switch (traversalType.$) {
			case 'Preorder':
				return $author$project$Trees$TreeTraversal$preorder(tree);
			case 'Inorder':
				return $author$project$Trees$TreeTraversal$inorder(tree);
			default:
				return $author$project$Trees$TreeTraversal$postorder(tree);
		}
	});
var $author$project$Trees$TreeTraversal$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'ChangeTraversal':
				var traversalType = msg.a;
				var newTraversal = A2($author$project$Trees$TreeTraversal$getTraversal, traversalType, model.tree);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentTraversal: traversalType,
							index: $elm$core$Maybe$Just(0),
							traversalResult: newTraversal
						}),
					$elm$core$Platform$Cmd$none);
			case 'SetTree':
				var newTree = msg.a;
				var newResult = A2($author$project$Trees$TreeTraversal$getTraversal, model.currentTraversal, newTree);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							index: $elm$core$Maybe$Just(0),
							traversalResult: newResult,
							tree: newTree
						}),
					$elm$core$Platform$Cmd$none);
			case 'TraversalStep':
				var totalSteps = $elm$core$List$length(model.traversalResult);
				var newIndex = function () {
					var _v2 = model.index;
					if (_v2.$ === 'Just') {
						var i = _v2.a;
						return $elm$core$Maybe$Just(i + 1);
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var updatedModel = function () {
					if (newIndex.$ === 'Just') {
						var ni = newIndex.a;
						return (_Utils_cmp(ni, totalSteps) < 0) ? _Utils_update(
							model,
							{
								index: $elm$core$Maybe$Just(ni)
							}) : _Utils_update(
							model,
							{
								index: $elm$core$Maybe$Just(ni),
								running: false
							});
					} else {
						return model;
					}
				}();
				return _Utils_Tuple2(updatedModel, $elm$core$Platform$Cmd$none);
			case 'Tick':
				var totalSteps = $elm$core$List$length(model.traversalResult);
				var newIndex = function () {
					var _v4 = model.index;
					if (_v4.$ === 'Just') {
						var i = _v4.a;
						return $elm$core$Maybe$Just(i + 1);
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var updatedModel = function () {
					if (newIndex.$ === 'Just') {
						var ni = newIndex.a;
						return (_Utils_cmp(ni, totalSteps) < 0) ? _Utils_update(
							model,
							{
								index: $elm$core$Maybe$Just(ni)
							}) : _Utils_update(
							model,
							{
								index: $elm$core$Maybe$Just(ni),
								running: false
							});
					} else {
						return model;
					}
				}();
				return _Utils_Tuple2(updatedModel, $elm$core$Platform$Cmd$none);
			case 'StartTraversal':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: true}),
					$elm$core$Platform$Cmd$none);
			case 'StopTraversal':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{running: false}),
					$elm$core$Platform$Cmd$none);
			case 'ResetTraversal':
				var cmd = A2(
					$elm$random$Random$generate,
					$author$project$Trees$TreeTraversal$TreeGenerated,
					A2($author$project$MainComponents$Structs$randomTreeGenerator, 9, 31));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							index: $elm$core$Maybe$Just(0),
							running: false,
							traversalResult: _List_Nil
						}),
					cmd);
			default:
				var newTree = msg.a;
				var newResult = A2($author$project$Trees$TreeTraversal$getTraversal, model.currentTraversal, newTree);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							index: $elm$core$Maybe$Just(0),
							traversalResult: newResult,
							tree: newTree
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NavigateTo':
				var page = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{currentPage: page, running: false}),
					$elm$core$Platform$Cmd$none);
			case 'HomeMsg':
				var homeMsg = msg.a;
				var _v1 = A2($author$project$MainComponents$Home$update, homeMsg, model.homeModel);
				var newHome = _v1.a;
				var homeCmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{homeModel: newHome}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$HomeMsg, homeCmd));
			case 'TreeTraversalMsg':
				var treeMsg = msg.a;
				var _v2 = A2($author$project$Trees$TreeTraversal$update, treeMsg, model.treeTraversalModel);
				var newTreeTraversalModel = _v2.a;
				var treeCmd = _v2.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{treeTraversalModel: newTreeTraversalModel}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$TreeTraversalMsg, treeCmd));
			case 'HeapTypeMsg':
				var heapMsg = msg.a;
				var _v3 = A2($author$project$Trees$HeapType$update, heapMsg, model.heapTypeModel);
				var newHeapTypeModel = _v3.a;
				var heapCmd = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{heapTypeModel: newHeapTypeModel}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$HeapTypeMsg, heapCmd));
			case 'BSTMsg':
				var bstMsg = msg.a;
				var _v4 = A2($author$project$Trees$BST$update, bstMsg, model.bstModel);
				var newBSTModel = _v4.a;
				var bstCmd = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bstModel: newBSTModel}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$BSTMsg, bstCmd));
			case 'DijkstraMsg':
				var dijkstraMsg = msg.a;
				var _v5 = A2($author$project$Graphs$Dijkstra$update, dijkstraMsg, model.dijkstraModel);
				var newDijkstraModel = _v5.a;
				var dijkstraCmd = _v5.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dijkstraModel: newDijkstraModel}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$DijkstraMsg, dijkstraCmd));
			case 'MSTMsg':
				var mstMsg = msg.a;
				var _v6 = A2($author$project$Graphs$MST$update, mstMsg, model.mstModel);
				var newMSTModel = _v6.a;
				var mstCmd = _v6.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{mstModel: newMSTModel}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$MSTMsg, mstCmd));
			case 'SQMsg':
				var sqMsg = msg.a;
				var newSQModel = A2($author$project$DataStructures$StackQueue$update, sqMsg, model.sqModel);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{sqModel: newSQModel}),
					$elm$core$Platform$Cmd$none);
			case 'ALMsg':
				var alMsg = msg.a;
				var newALModel = A2($author$project$DataStructures$ArrayList$update, alMsg, model.alModel);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{alModel: newALModel}),
					$elm$core$Platform$Cmd$none);
			case 'SMMsg':
				var smMsg = msg.a;
				var newSMModel = A2($author$project$DataStructures$SetMap$update, smMsg, model.smModel);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{smModel: newSMModel}),
					$elm$core$Platform$Cmd$none);
			case 'SelectAlgorithm':
				var algName = msg.a;
				switch (algName) {
					case 'Bubble Sort':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$BubbleSort,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator));
					case 'Selection Sort':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$SelectionSort,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator));
					case 'Insertion Sort':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$InsertionSort,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator));
					case 'Shell Sort':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$ShellSort,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator));
					case 'Merge Sort':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$MergeSort,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator));
					case 'Quick Sort':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$QuickSort,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator));
					case 'Linear Search':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$LinearSearch,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2($elm$random$Random$generate, $author$project$Main$GotRandomTarget, $author$project$MainComponents$Structs$randomTargetGenerator),
										A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator)
									])));
					case 'Binary Search':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$BinarySearch,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2($elm$random$Random$generate, $author$project$Main$GotRandomTarget, $author$project$MainComponents$Structs$randomTargetGenerator),
										$author$project$MainComponents$Structs$orderedListCmd($author$project$Main$GotOrderedArray)
									])));
					case 'Tree Traversal':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$TreeTraversal,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2(
								$elm$random$Random$generate,
								$author$project$Main$GotRandomTree,
								A2($author$project$MainComponents$Structs$randomTreeGenerator, 9, 31)));
					case 'Heap Type':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$HeapType,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2(
								$elm$random$Random$generate,
								$author$project$Main$GotRandomTree,
								A2($author$project$MainComponents$Structs$randomTreeGenerator, 9, 30)));
					case 'BST':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$BST,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2(
								$elm$random$Random$generate,
								$author$project$Main$GotRandomTree,
								A2($author$project$MainComponents$Structs$randomBSTGenerator, 9, 30)));
					case 'Dijkstra':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$Dijkstra,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2($elm$random$Random$generate, $author$project$Main$GotRandomGraph, $author$project$MainComponents$Structs$randomGraphGenerator));
					case 'MST':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$MST,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							A2($elm$random$Random$generate, $author$project$Main$GotRandomGraph, $author$project$MainComponents$Structs$randomGraphGenerator));
					case 'StacksQueues':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$SQ,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							$elm$core$Platform$Cmd$none);
					case 'ArraysLists':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$AL,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							$elm$core$Platform$Cmd$none);
					case 'SetMap':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$SM,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									currentPage: $author$project$Main$Home,
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							$elm$core$Platform$Cmd$none);
				}
			case 'ControlMsg':
				var controlMsg = msg.a;
				switch (controlMsg.$) {
					case 'Run':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{running: true}),
							$elm$core$Platform$Cmd$none);
					case 'Pause':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{running: false}),
							$elm$core$Platform$Cmd$none);
					case 'Reset':
						var resetCmds = function () {
							var _v9 = model.currentPage;
							switch (_v9.$) {
								case 'LinearSearch':
									return _List_fromArray(
										[
											A2($elm$random$Random$generate, $author$project$Main$GotRandomTarget, $author$project$MainComponents$Structs$randomTargetGenerator),
											A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator)
										]);
								case 'BinarySearch':
									return _List_fromArray(
										[
											A2($elm$random$Random$generate, $author$project$Main$GotRandomTarget, $author$project$MainComponents$Structs$randomTargetGenerator),
											$author$project$MainComponents$Structs$orderedListCmd($author$project$Main$GotOrderedArray)
										]);
								case 'TreeTraversal':
									return _List_fromArray(
										[
											A2(
											$elm$random$Random$generate,
											$author$project$Main$GotRandomTree,
											A2($author$project$MainComponents$Structs$randomTreeGenerator, 9, 31))
										]);
								default:
									return _List_fromArray(
										[
											A2($elm$random$Random$generate, $author$project$Main$GotRandomArray, $author$project$MainComponents$Structs$randomListGenerator)
										]);
							}
						}();
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									running: false,
									sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(_List_Nil)
								}),
							$elm$core$Platform$Cmd$batch(resetCmds));
					default:
						var _v10 = model.currentPage;
						switch (_v10.$) {
							case 'BubbleSort':
								var updatedTrack = $author$project$SortingAlgorithms$BubbleSort$bubbleSortStep(model.sortingAlgorithm);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{sortingAlgorithm: updatedTrack}),
									$elm$core$Platform$Cmd$none);
							case 'SelectionSort':
								var updatedTrack = $author$project$SortingAlgorithms$SelectionSort$selectionSortStep(model.sortingAlgorithm);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{sortingAlgorithm: updatedTrack}),
									$elm$core$Platform$Cmd$none);
							case 'InsertionSort':
								var updatedTrack = $author$project$SortingAlgorithms$InsertionSort$insertionSortStep(model.sortingAlgorithm);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{sortingAlgorithm: updatedTrack}),
									$elm$core$Platform$Cmd$none);
							case 'ShellSort':
								var updatedTrack = $author$project$SortingAlgorithms$ShellSort$shellSortStep(model.sortingAlgorithm);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{sortingAlgorithm: updatedTrack}),
									$elm$core$Platform$Cmd$none);
							case 'MergeSort':
								var updatedTrack = $author$project$SortingAlgorithms$MergeSort$mergeSortStep(model.sortingAlgorithm);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{sortingAlgorithm: updatedTrack}),
									$elm$core$Platform$Cmd$none);
							case 'QuickSort':
								var updatedTrack = $author$project$SortingAlgorithms$QuickSort$quickSortStep(model.sortingAlgorithm);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{sortingAlgorithm: updatedTrack}),
									$elm$core$Platform$Cmd$none);
							case 'LinearSearch':
								var updatedTrack = $author$project$SearchAlgorithms$LinearSearch$linearSearchStep(model.sortingAlgorithm);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{sortingAlgorithm: updatedTrack}),
									$elm$core$Platform$Cmd$none);
							case 'BinarySearch':
								var updatedTrack = $author$project$SearchAlgorithms$BinarySearch$binarySearchStep(model.sortingAlgorithm);
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{sortingAlgorithm: updatedTrack}),
									$elm$core$Platform$Cmd$none);
							case 'TreeTraversal':
								var _v11 = A2($author$project$Trees$TreeTraversal$update, $author$project$Trees$TreeTraversal$TraversalStep, model.treeTraversalModel);
								var updatedTreeModel = _v11.a;
								var treeCmd = _v11.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{treeTraversalModel: updatedTreeModel}),
									A2($elm$core$Platform$Cmd$map, $author$project$Main$TreeTraversalMsg, treeCmd));
							case 'HeapType':
								var _v12 = A2($author$project$Trees$HeapType$update, $author$project$Trees$HeapType$HeapifyStep, model.heapTypeModel);
								var updatedHeapModel = _v12.a;
								var heapCmd = _v12.b;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{heapTypeModel: updatedHeapModel}),
									A2($elm$core$Platform$Cmd$map, $author$project$Main$HeapTypeMsg, heapCmd));
							default:
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
				}
			case 'Tick':
				if (model.running) {
					var _v13 = model.currentPage;
					switch (_v13.$) {
						case 'BubbleSort':
							var updatedTrack = $author$project$SortingAlgorithms$BubbleSort$bubbleSortStep(model.sortingAlgorithm);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{sortingAlgorithm: updatedTrack}),
								$elm$core$Platform$Cmd$none);
						case 'SelectionSort':
							var updatedTrack = $author$project$SortingAlgorithms$SelectionSort$selectionSortStep(model.sortingAlgorithm);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{sortingAlgorithm: updatedTrack}),
								$elm$core$Platform$Cmd$none);
						case 'InsertionSort':
							var updatedTrack = $author$project$SortingAlgorithms$InsertionSort$insertionSortStep(model.sortingAlgorithm);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{sortingAlgorithm: updatedTrack}),
								$elm$core$Platform$Cmd$none);
						case 'ShellSort':
							var updatedTrack = $author$project$SortingAlgorithms$ShellSort$shellSortStep(model.sortingAlgorithm);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{sortingAlgorithm: updatedTrack}),
								$elm$core$Platform$Cmd$none);
						case 'MergeSort':
							var updatedTrack = $author$project$SortingAlgorithms$MergeSort$mergeSortStep(model.sortingAlgorithm);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{sortingAlgorithm: updatedTrack}),
								$elm$core$Platform$Cmd$none);
						case 'QuickSort':
							var updatedTrack = $author$project$SortingAlgorithms$QuickSort$quickSortStep(model.sortingAlgorithm);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{sortingAlgorithm: updatedTrack}),
								$elm$core$Platform$Cmd$none);
						case 'LinearSearch':
							var updatedTrack = $author$project$SearchAlgorithms$LinearSearch$linearSearchStep(model.sortingAlgorithm);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{sortingAlgorithm: updatedTrack}),
								$elm$core$Platform$Cmd$none);
						case 'BinarySearch':
							var updatedTrack = $author$project$SearchAlgorithms$BinarySearch$binarySearchStep(model.sortingAlgorithm);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{sortingAlgorithm: updatedTrack}),
								$elm$core$Platform$Cmd$none);
						case 'TreeTraversal':
							var _v14 = A2($author$project$Trees$TreeTraversal$update, $author$project$Trees$TreeTraversal$TraversalStep, model.treeTraversalModel);
							var updatedTreeModel = _v14.a;
							var treeCmd = _v14.b;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{treeTraversalModel: updatedTreeModel}),
								A2($elm$core$Platform$Cmd$map, $author$project$Main$TreeTraversalMsg, treeCmd));
						case 'HeapType':
							var _v15 = A2($author$project$Trees$HeapType$update, $author$project$Trees$HeapType$HeapifyStep, model.heapTypeModel);
							var updatedHeapModel = _v15.a;
							var heapCmd = _v15.b;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{heapTypeModel: updatedHeapModel}),
								A2($elm$core$Platform$Cmd$map, $author$project$Main$HeapTypeMsg, heapCmd));
						default:
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GotRandomArray':
				var list = msg.a;
				var newTrack = $author$project$MainComponents$Structs$defaultSortingTrack(list);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(list)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GotOrderedArray':
				var orderedList = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							sortingAlgorithm: $author$project$MainComponents$Structs$defaultSortingTrack(orderedList)
						}),
					$elm$core$Platform$Cmd$none);
			case 'GotRandomTarget':
				var newTarget = msg.a;
				var currentSortingAlgorithm = model.sortingAlgorithm;
				var updatedSortingAlgorithm = function () {
					var array = currentSortingAlgorithm.array;
					var targetValue = function () {
						var _v16 = A2($elm$core$Array$get, newTarget, array);
						if (_v16.$ === 'Just') {
							var value = _v16.a;
							return value;
						} else {
							return 0;
						}
					}();
					return _Utils_update(
						currentSortingAlgorithm,
						{array: array, currentIndex: newTarget, gap: targetValue, minIndex: 29, outerIndex: 0, sorted: false});
				}();
				var updatedModel = _Utils_update(
					model,
					{sortingAlgorithm: updatedSortingAlgorithm});
				return _Utils_Tuple2(updatedModel, $elm$core$Platform$Cmd$none);
			case 'GotRandomTree':
				var newTree = msg.a;
				var _v17 = model.currentPage;
				switch (_v17.$) {
					case 'TreeTraversal':
						var _v18 = A2(
							$author$project$Trees$TreeTraversal$update,
							$author$project$Trees$TreeTraversal$SetTree(newTree),
							model.treeTraversalModel);
						var newTreeModel = _v18.a;
						var treeCmd = _v18.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{treeTraversalModel: newTreeModel}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$TreeTraversalMsg, treeCmd));
					case 'HeapType':
						var _v19 = A2(
							$author$project$Trees$HeapType$update,
							$author$project$Trees$HeapType$SetTree(newTree),
							model.heapTypeModel);
						var newHeapTypeModel = _v19.a;
						var heapCmd = _v19.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{heapTypeModel: newHeapTypeModel}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$HeapTypeMsg, heapCmd));
					case 'BST':
						var _v20 = A2(
							$author$project$Trees$BST$update,
							$author$project$Trees$BST$SetTree(newTree),
							model.bstModel);
						var newBstModel = _v20.a;
						var bstCmd = _v20.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{bstModel: newBstModel}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$BSTMsg, bstCmd));
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				var triplet = msg.a;
				var _v21 = model.currentPage;
				switch (_v21.$) {
					case 'Dijkstra':
						var _v22 = A2(
							$author$project$Graphs$Dijkstra$update,
							$author$project$Graphs$Dijkstra$SetGraph(triplet),
							model.dijkstraModel);
						var newDijkstraModel = _v22.a;
						var cmd = _v22.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{dijkstraModel: newDijkstraModel}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$DijkstraMsg, cmd));
					case 'MST':
						var _v23 = triplet;
						var graph = _v23.a;
						var source = _v23.b;
						var target = _v23.c;
						var _v24 = A2(
							$author$project$Graphs$MST$update,
							$author$project$Graphs$MST$SetGraph(
								_Utils_Tuple2(graph, source)),
							model.mstModel);
						var newMSTModel = _v24.a;
						var cmd = _v24.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{mstModel: newMSTModel}),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$MSTMsg, cmd));
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Main$ALMsg = function (a) {
	return {$: 'ALMsg', a: a};
};
var $author$project$Main$ControlMsg = function (a) {
	return {$: 'ControlMsg', a: a};
};
var $elm$browser$Browser$Document = F2(
	function (title, body) {
		return {body: body, title: title};
	});
var $author$project$Main$SMMsg = function (a) {
	return {$: 'SMMsg', a: a};
};
var $author$project$Main$SQMsg = function (a) {
	return {$: 'SQMsg', a: a};
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$DataStructures$ArrayList$AddItem = {$: 'AddItem'};
var $author$project$DataStructures$ArrayList$ArrayType = {$: 'ArrayType'};
var $author$project$DataStructures$ArrayList$ChangeDataStructure = function (a) {
	return {$: 'ChangeDataStructure', a: a};
};
var $author$project$DataStructures$ArrayList$ResetStruct = {$: 'ResetStruct'};
var $author$project$DataStructures$ArrayList$SetInput = function (a) {
	return {$: 'SetInput', a: a};
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$DataStructures$ArrayList$bigOItem = F2(
	function (kind, cost) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('big-o-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(kind)
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(cost)
						]))
				]));
	});
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$DataStructures$ArrayList$getAccess = function (ds) {
	if (ds.$ === 'ListType') {
		return 'O(n)';
	} else {
		return 'O(1)';
	}
};
var $author$project$DataStructures$ArrayList$getDescription = function (ds) {
	if (ds.$ === 'ListType') {
		return 'Linked List: A linear data structure where elements (nodes) are stored in the heap and linked together using pointers.\r\n                Lists don\'t require a fixed size like arrays.';
	} else {
		return 'Array: A fixed-size, index-based data structure stored in contiguous memory on the stack.\r\n                Arrays are ideal when element positions are known and performance is critical.';
	}
};
var $author$project$DataStructures$ArrayList$getInsert = function (ds) {
	if (ds.$ === 'ListType') {
		return 'O(1) Head | O(n) Tail';
	} else {
		return 'O(n) Beginning | O(1) End';
	}
};
var $author$project$DataStructures$ArrayList$getRemove = function (ds) {
	if (ds.$ === 'ListType') {
		return 'O(1) Head | O(n) Tail';
	} else {
		return 'O(n) Beginning | O(1) End';
	}
};
var $author$project$DataStructures$ArrayList$infoTextFor = function (ds) {
	if (ds.$ === 'ListType') {
		return 'List: elements can be added and removed as needed thanks to using the heap.';
	} else {
		return 'Array: elements are bounded to the length allocated thanks to using the stack.';
	}
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $author$project$DataStructures$ArrayList$renderElement = F4(
	function (list, dsType, index, value) {
		var len = $elm$core$List$length(list);
		var isLast = _Utils_eq(index, len - 1);
		var isFirst = !index;
		var label = function () {
			if (dsType.$ === 'ListType') {
				return isFirst ? 'Head' : (isLast ? 'Tail' : '');
			} else {
				return '';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('element-box')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('element-label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('element-value')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(value))
						]))
				]));
	});
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$DataStructures$ArrayList$view = function (model) {
	var orderedElements = model.elements;
	var arr = $elm$core$Array$fromList(model.elements);
	var arraySlots = A2(
		$elm$core$List$map,
		function (i) {
			return A2($elm$core$Array$get, i, arr);
		},
		A2($elm$core$List$range, 0, 9));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sort-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sort-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Arrays and Lists')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$DataStructures$ArrayList$getDescription(model.dataStructure))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('traversal-controls')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.dataStructure, $author$project$DataStructures$ArrayList$ListType) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$DataStructures$ArrayList$ChangeDataStructure($author$project$DataStructures$ArrayList$ListType))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('List')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.dataStructure, $author$project$DataStructures$ArrayList$ArrayType) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$DataStructures$ArrayList$ChangeDataStructure($author$project$DataStructures$ArrayList$ArrayType))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Array')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('insert-delete-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('insert-delete-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$DataStructures$ArrayList$AddItem)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Add')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Enter number'),
										$elm$html$Html$Attributes$value(model.inputValue),
										$elm$html$Html$Events$onInput($author$project$DataStructures$ArrayList$SetInput)
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$DataStructures$ArrayList$ResetStruct)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Reset')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('disclaimer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$DataStructures$ArrayList$infoTextFor(model.dataStructure))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('element-container')
					]),
				function () {
					var _v0 = model.dataStructure;
					if (_v0.$ === 'ListType') {
						return $elm$core$List$isEmpty(orderedElements) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('element-placeholder')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(' ')
									]))
							]) : A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, v) {
									return A4($author$project$DataStructures$ArrayList$renderElement, orderedElements, $author$project$DataStructures$ArrayList$ListType, i, v);
								}),
							orderedElements);
					} else {
						return A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, mVal) {
									var label = $elm$core$String$fromInt(i);
									var display = function () {
										if (mVal.$ === 'Just') {
											var n = mVal.a;
											return $elm$core$String$fromInt(n);
										} else {
											return '‎';
										}
									}();
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('element-box wireframe-slot')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('element-label')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(label)
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('element-value')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(display)
													]))
											]));
								}),
							arraySlots);
					}
				}()),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('variable-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('List: Allow data to be stored non-contiguously.')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Array: Data is contiguous, so random access is supported.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Big(O) Notation')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-list')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$DataStructures$ArrayList$bigOItem,
						'Insert',
						$author$project$DataStructures$ArrayList$getInsert(model.dataStructure)),
						A2(
						$author$project$DataStructures$ArrayList$bigOItem,
						'Remove',
						$author$project$DataStructures$ArrayList$getRemove(model.dataStructure)),
						A2(
						$author$project$DataStructures$ArrayList$bigOItem,
						'Access',
						$author$project$DataStructures$ArrayList$getAccess(model.dataStructure))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-complexity')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Space Complexity: O(n)')
					]))
			]));
};
var $author$project$DataStructures$SetMap$AddItem = {$: 'AddItem'};
var $author$project$DataStructures$SetMap$ChangeDataStructure = function (a) {
	return {$: 'ChangeDataStructure', a: a};
};
var $author$project$DataStructures$SetMap$MapType = {$: 'MapType'};
var $author$project$DataStructures$SetMap$ResetStruct = {$: 'ResetStruct'};
var $author$project$DataStructures$SetMap$SetKeyInput = function (a) {
	return {$: 'SetKeyInput', a: a};
};
var $author$project$DataStructures$SetMap$SetValInput = function (a) {
	return {$: 'SetValInput', a: a};
};
var $author$project$DataStructures$SetMap$bigOItem = F2(
	function (kind, cost) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('big-o-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(kind)
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(cost)
						]))
				]));
	});
var $author$project$DataStructures$SetMap$getAccess = function (ds) {
	if (ds.$ === 'SetType') {
		return 'O(1) avg';
	} else {
		return 'O(1) avg';
	}
};
var $author$project$DataStructures$SetMap$getDescription = function (ds) {
	if (ds.$ === 'SetType') {
		return 'Set: An unordered collection of unique elements, typically implemented using hash tables.\r\n            Sets automatically enforce uniqueness and provide fast insertion, deletion, and lookup.';
	} else {
		return 'Hash Map: A collection of key-value pairs with fast access, insertion, and deletion.\r\n            Keys must be unique, and values are retrieved by hashing the key to a location in memory.';
	}
};
var $author$project$DataStructures$SetMap$getInsert = function (ds) {
	if (ds.$ === 'SetType') {
		return 'O(1) avg | O(n) worst';
	} else {
		return 'O(1) avg | O(n) worst';
	}
};
var $author$project$DataStructures$SetMap$getRemove = function (ds) {
	if (ds.$ === 'SetType') {
		return 'O(1) avg';
	} else {
		return 'O(1) avg';
	}
};
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$isEmpty(dict);
};
var $author$project$DataStructures$SetMap$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sort-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sort-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Sets and Maps')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$DataStructures$SetMap$getDescription(model.dataStructure))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('traversal-controls')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.dataStructure, $author$project$DataStructures$SetMap$SetType) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$DataStructures$SetMap$ChangeDataStructure($author$project$DataStructures$SetMap$SetType))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Set')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.dataStructure, $author$project$DataStructures$SetMap$MapType) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$DataStructures$SetMap$ChangeDataStructure($author$project$DataStructures$SetMap$MapType))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Map')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('insert-delete-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('insert-delete-row')
							]),
						function () {
							var _v0 = model.dataStructure;
							if (_v0.$ === 'SetType') {
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$DataStructures$SetMap$AddItem)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Add')
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$placeholder('Enter number'),
												$elm$html$Html$Attributes$value(model.keyInput),
												$elm$html$Html$Events$onInput($author$project$DataStructures$SetMap$SetKeyInput)
											]),
										_List_Nil),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$DataStructures$SetMap$ResetStruct)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Reset')
											]))
									]);
							} else {
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$DataStructures$SetMap$AddItem)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Add')
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$placeholder('Key'),
												$elm$html$Html$Attributes$value(model.keyInput),
												$elm$html$Html$Events$onInput($author$project$DataStructures$SetMap$SetKeyInput)
											]),
										_List_Nil),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$placeholder('Value'),
												$elm$html$Html$Attributes$value(model.valInput),
												$elm$html$Html$Events$onInput($author$project$DataStructures$SetMap$SetValInput)
											]),
										_List_Nil),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$DataStructures$SetMap$ResetStruct)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Reset')
											]))
									]);
							}
						}())
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('element-container')
					]),
				function () {
					var _v1 = model.dataStructure;
					if (_v1.$ === 'SetType') {
						return $elm$core$Set$isEmpty(model.set) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('element-placeholder')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(' ')
									]))
							]) : A2(
							$elm$core$List$map,
							function (n) {
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('element-box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('element-label')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Value')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('element-value light-theme')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(n))
												]))
										]));
							},
							$elm$core$Set$toList(model.set));
					} else {
						return $elm$core$Dict$isEmpty(model.map) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('element-placeholder')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(' ')
									]))
							]) : A2(
							$elm$core$List$map,
							function (_v2) {
								var k = _v2.a;
								var v = _v2.b;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('element-box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('element-label')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Key: ' + k)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('element-value light-theme')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(v)
												]))
										]));
							},
							$elm$core$Dict$toList(model.map));
					}
				}()),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('variable-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Set: Similar to a list but doesn\'t allow duplicates.')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Map: A special type of set that has key-value pairs.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Big(O) Notation')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-list')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$DataStructures$SetMap$bigOItem,
						'Insert',
						$author$project$DataStructures$SetMap$getInsert(model.dataStructure)),
						A2(
						$author$project$DataStructures$SetMap$bigOItem,
						'Remove',
						$author$project$DataStructures$SetMap$getRemove(model.dataStructure)),
						A2(
						$author$project$DataStructures$SetMap$bigOItem,
						'Access',
						$author$project$DataStructures$SetMap$getAccess(model.dataStructure))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-complexity')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Space Complexity: O(n)')
					]))
			]));
};
var $author$project$DataStructures$StackQueue$AddItem = {$: 'AddItem'};
var $author$project$DataStructures$StackQueue$ChangeDataStructure = function (a) {
	return {$: 'ChangeDataStructure', a: a};
};
var $author$project$DataStructures$StackQueue$Queue = {$: 'Queue'};
var $author$project$DataStructures$StackQueue$RemoveItem = {$: 'RemoveItem'};
var $author$project$DataStructures$StackQueue$SetInput = function (a) {
	return {$: 'SetInput', a: a};
};
var $author$project$DataStructures$StackQueue$bigOItem = F2(
	function (kind, cost) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('big-o-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(kind)
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(cost)
						]))
				]));
	});
var $author$project$DataStructures$StackQueue$getDescription = function (dsType) {
	if (dsType.$ === 'Stack') {
		return 'Stack: A data structure that follows the LIFO principle (Last In, First Out).\r\n                Think of it like a stack of plates: the last plate you put on top is the first one you take off.';
	} else {
		return 'Queue: A data structure that follows the FIFO principle (First In, First Out).\r\n                Imagine a line at a grocery store: the first person to get in line is the first to be served.';
	}
};
var $author$project$DataStructures$StackQueue$getInsert = function (ds) {
	if (ds.$ === 'Stack') {
		return 'O(1) Push (End at Top)';
	} else {
		return 'O(1) Insert (End)';
	}
};
var $author$project$DataStructures$StackQueue$getRemove = function (ds) {
	if (ds.$ === 'Stack') {
		return 'O(1) Pop (End at Top)';
	} else {
		return 'O(1) Remove (Beginning)';
	}
};
var $author$project$DataStructures$StackQueue$infoTextFor = function (ds) {
	if (ds.$ === 'Stack') {
		return 'Stack: elements are removed from the top (last added).';
	} else {
		return 'Queue: elements are removed from the front (first added).';
	}
};
var $author$project$DataStructures$StackQueue$renderElement = F4(
	function (list, dsType, index, value) {
		var len = $elm$core$List$length(list);
		var isLast = _Utils_eq(index, len - 1);
		var isFirst = !index;
		var label = function () {
			if (dsType.$ === 'Stack') {
				return isLast ? 'Top' : (isFirst ? 'Bottom' : '');
			} else {
				return isFirst ? 'Front' : (isLast ? 'Back' : '');
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('element-box')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('element-label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('element-value')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(value))
						]))
				]));
	});
var $author$project$DataStructures$StackQueue$view = function (model) {
	var orderedElements = _Utils_eq(model.dataStructure, $author$project$DataStructures$StackQueue$Stack) ? $elm$core$List$reverse(model.elements) : model.elements;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sort-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sort-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Stacks and Queues')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$DataStructures$StackQueue$getDescription(model.dataStructure))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('traversal-controls')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.dataStructure, $author$project$DataStructures$StackQueue$Stack) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$DataStructures$StackQueue$ChangeDataStructure($author$project$DataStructures$StackQueue$Stack))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Stack (LIFO)')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.dataStructure, $author$project$DataStructures$StackQueue$Queue) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$DataStructures$StackQueue$ChangeDataStructure($author$project$DataStructures$StackQueue$Queue))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Queue (FIFO)')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('insert-delete-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('insert-delete-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$DataStructures$StackQueue$AddItem)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										_Utils_eq(model.dataStructure, $author$project$DataStructures$StackQueue$Queue) ? 'Add' : 'Push')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Enter number'),
										$elm$html$Html$Attributes$value(model.inputValue),
										$elm$html$Html$Events$onInput($author$project$DataStructures$StackQueue$SetInput)
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$DataStructures$StackQueue$RemoveItem)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										_Utils_eq(model.dataStructure, $author$project$DataStructures$StackQueue$Queue) ? 'Remove' : 'Pop')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('disclaimer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$DataStructures$StackQueue$infoTextFor(model.dataStructure))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('element-container')
					]),
				$elm$core$List$isEmpty(orderedElements) ? _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('element-placeholder')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(' ')
							]))
					]) : A2(
					$elm$core$List$indexedMap,
					A2($author$project$DataStructures$StackQueue$renderElement, orderedElements, model.dataStructure),
					orderedElements)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('variable-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Stack: inserts/removes from the top. LIFO.')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Queue: inserts at the back, removes from the front. FIFO.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Big(O) Notation')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-list')
					]),
				_List_fromArray(
					[
						A2(
						$author$project$DataStructures$StackQueue$bigOItem,
						'Insert',
						$author$project$DataStructures$StackQueue$getInsert(model.dataStructure)),
						A2(
						$author$project$DataStructures$StackQueue$bigOItem,
						'Remove',
						$author$project$DataStructures$StackQueue$getRemove(model.dataStructure))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-complexity')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Space Complexity: O(n)')
					]))
			]));
};
var $author$project$Graphs$Dijkstra$DijkstraStep = {$: 'DijkstraStep'};
var $author$project$Graphs$Dijkstra$ResetGraph = {$: 'ResetGraph'};
var $author$project$Graphs$Dijkstra$StartDijkstra = {$: 'StartDijkstra'};
var $author$project$Graphs$Dijkstra$StopDijkstra = {$: 'StopDijkstra'};
var $author$project$Graphs$Dijkstra$convertControlMsg = function (control) {
	switch (control.$) {
		case 'Run':
			return $author$project$Graphs$Dijkstra$StartDijkstra;
		case 'Pause':
			return $author$project$Graphs$Dijkstra$StopDijkstra;
		case 'Step':
			return $author$project$Graphs$Dijkstra$DijkstraStep;
		default:
			return $author$project$Graphs$Dijkstra$ResetGraph;
	}
};
var $author$project$Graphs$Dijkstra$getPath = F3(
	function (previous, source, target) {
		if (_Utils_eq(source, target)) {
			return _List_fromArray(
				[source]);
		} else {
			var _v0 = A2($elm$core$Dict$get, target, previous);
			if (_v0.$ === 'Just') {
				var parent = _v0.a;
				return _Utils_ap(
					A3($author$project$Graphs$Dijkstra$getPath, previous, source, parent),
					_List_fromArray(
						[target]));
			} else {
				return _List_Nil;
			}
		}
	});
var $author$project$Graphs$Dijkstra$pairs = function (list) {
	if (list.b && list.b.b) {
		var a = list.a;
		var _v1 = list.b;
		var b = _v1.a;
		var rest = _v1.b;
		return A2(
			$elm$core$List$cons,
			_Utils_Tuple2(a, b),
			$author$project$Graphs$Dijkstra$pairs(
				A2($elm$core$List$cons, b, rest)));
	} else {
		return _List_Nil;
	}
};
var $author$project$Graphs$GraphVisualization$nodePositions = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			1,
			_Utils_Tuple2(200, 125)),
			_Utils_Tuple2(
			2,
			_Utils_Tuple2(800, 125)),
			_Utils_Tuple2(
			3,
			_Utils_Tuple2(200, 275)),
			_Utils_Tuple2(
			4,
			_Utils_Tuple2(800, 275)),
			_Utils_Tuple2(
			5,
			_Utils_Tuple2(500, 25)),
			_Utils_Tuple2(
			6,
			_Utils_Tuple2(300, 375)),
			_Utils_Tuple2(
			7,
			_Utils_Tuple2(700, 375)),
			_Utils_Tuple2(
			8,
			_Utils_Tuple2(500, 225))
		]));
var $author$project$Graphs$GraphVisualization$buildPositionsDict = function (nodes) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (node, dict) {
				return A3(
					$elm$core$Dict$insert,
					node.id,
					A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2(50, 50),
						A2($elm$core$Dict$get, node.id, $author$project$Graphs$GraphVisualization$nodePositions)),
					dict);
			}),
		$elm$core$Dict$empty,
		nodes);
};
var $elm$core$Basics$atan2 = _Basics_atan2;
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$Graphs$GraphVisualization$drawEdges = F4(
	function (edges, positionsDict, traversedEdges, finalRouteEdges) {
		return A2(
			$elm$core$List$map,
			function (edge) {
				var labelBias = 0.75;
				var isTraversed = A2(
					$elm$core$List$member,
					_Utils_Tuple2(edge.from, edge.to),
					traversedEdges) || A2(
					$elm$core$List$member,
					_Utils_Tuple2(edge.to, edge.from),
					traversedEdges);
				var isFinalRoute = A2(
					$elm$core$List$member,
					_Utils_Tuple2(edge.from, edge.to),
					finalRouteEdges) || A2(
					$elm$core$List$member,
					_Utils_Tuple2(edge.to, edge.from),
					finalRouteEdges);
				var gapSize = 15;
				var color = isFinalRoute ? '#81C784' : (isTraversed ? '#ff5722' : '#adb5bd');
				var _v0 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					A2($elm$core$Dict$get, edge.to, positionsDict));
				var x2Pos = _v0.a;
				var y2Pos = _v0.b;
				var _v1 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					A2($elm$core$Dict$get, edge.from, positionsDict));
				var x1Pos = _v1.a;
				var y1Pos = _v1.b;
				var dx = x2Pos - x1Pos;
				var gapX = x1Pos + (dx * labelBias);
				var dy = y2Pos - y1Pos;
				var angleRad = A2($elm$core$Basics$atan2, dy, dx);
				var angleDeg = function () {
					var rawAngle = (angleRad * 180) / $elm$core$Basics$pi;
					return (rawAngle > 90) ? (rawAngle - 180) : ((_Utils_cmp(rawAngle, -90) < 0) ? (rawAngle + 180) : rawAngle);
				}();
				var dist = $elm$core$Basics$sqrt((dx * dx) + (dy * dy)) + 0.1;
				var shortenX = (dx / dist) * gapSize;
				var shortenY = (dy / dist) * gapSize;
				var gapY = y1Pos + (dy * labelBias);
				var _v2 = _Utils_Tuple2(gapX + shortenX, gapY + shortenY);
				var x2New = _v2.a;
				var y2New = _v2.b;
				var edgeLabel = A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(gapX)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(gapY + 4)),
							$elm$svg$Svg$Attributes$fill('#adb5bd'),
							$elm$svg$Svg$Attributes$fontSize('12'),
							$elm$svg$Svg$Attributes$textAnchor('middle'),
							$elm$svg$Svg$Attributes$transform(
							'rotate(' + ($elm$core$String$fromFloat(angleDeg) + (' ' + ($elm$core$String$fromFloat(gapX) + (' ' + ($elm$core$String$fromFloat(gapY) + ')'))))))
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text(
							$elm$core$String$fromInt(edge.weight))
						]));
				var _v3 = _Utils_Tuple2(gapX - shortenX, gapY - shortenY);
				var x1New = _v3.a;
				var y1New = _v3.b;
				return A2(
					$elm$svg$Svg$g,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1(
									$elm$core$String$fromFloat(x1Pos)),
									$elm$svg$Svg$Attributes$y1(
									$elm$core$String$fromFloat(y1Pos)),
									$elm$svg$Svg$Attributes$x2(
									$elm$core$String$fromFloat(x1New)),
									$elm$svg$Svg$Attributes$y2(
									$elm$core$String$fromFloat(y1New)),
									$elm$svg$Svg$Attributes$stroke(color),
									$elm$svg$Svg$Attributes$strokeWidth('2')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$line,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x1(
									$elm$core$String$fromFloat(x2New)),
									$elm$svg$Svg$Attributes$y1(
									$elm$core$String$fromFloat(y2New)),
									$elm$svg$Svg$Attributes$x2(
									$elm$core$String$fromFloat(x2Pos)),
									$elm$svg$Svg$Attributes$y2(
									$elm$core$String$fromFloat(y2Pos)),
									$elm$svg$Svg$Attributes$stroke(color),
									$elm$svg$Svg$Attributes$strokeWidth('2')
								]),
							_List_Nil),
							edgeLabel
						]));
			},
			edges);
	});
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $author$project$Graphs$GraphVisualization$drawNodes = F4(
	function (nodes, positionsDict, maybeCurrentNode, visited) {
		return $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (node) {
					var isVisited = A2($elm$core$List$member, node.id, visited);
					var isActive = function () {
						if (maybeCurrentNode.$ === 'Just') {
							var activeId = maybeCurrentNode.a;
							return _Utils_eq(activeId, node.id);
						} else {
							return false;
						}
					}();
					var circleColor = isActive ? '#ff5722' : (isVisited ? '#adb5bd' : '#64b5f6');
					var _v0 = A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2(0, 0),
						A2($elm$core$Dict$get, node.id, positionsDict));
					var xPos = _v0.a;
					var yPos = _v0.b;
					var label = A2(
						$elm$svg$Svg$text_,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$x(
								$elm$core$String$fromFloat(xPos)),
								$elm$svg$Svg$Attributes$y(
								$elm$core$String$fromFloat(yPos + 5)),
								$elm$svg$Svg$Attributes$fill('white'),
								$elm$svg$Svg$Attributes$fontSize('14'),
								$elm$svg$Svg$Attributes$textAnchor('middle')
							]),
						_List_fromArray(
							[
								$elm$svg$Svg$text(
								$elm$core$String$fromInt(node.id))
							]));
					var myCircle = A2(
						$elm$svg$Svg$circle,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$cx(
								$elm$core$String$fromFloat(xPos)),
								$elm$svg$Svg$Attributes$cy(
								$elm$core$String$fromFloat(yPos)),
								$elm$svg$Svg$Attributes$r('15'),
								$elm$svg$Svg$Attributes$fill(circleColor),
								$elm$svg$Svg$Attributes$style('transition: fill 0.5s ease')
							]),
						_List_Nil);
					return _List_fromArray(
						[myCircle, label]);
				},
				nodes));
	});
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Graphs$GraphVisualization$view = F6(
	function (graph, maybeCurrentNode, visited, traversedEdges, finalRouteEdges, running) {
		var positionsDict = $author$project$Graphs$GraphVisualization$buildPositionsDict(graph.nodes);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('graph-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width('1000'),
							$elm$svg$Svg$Attributes$height('400'),
							$elm$svg$Svg$Attributes$style('transition: fill 0.6s ease')
						]),
					_Utils_ap(
						A4($author$project$Graphs$GraphVisualization$drawEdges, graph.edges, positionsDict, traversedEdges, finalRouteEdges),
						A4($author$project$Graphs$GraphVisualization$drawNodes, graph.nodes, positionsDict, maybeCurrentNode, visited)))
				]));
	});
var $author$project$MainComponents$Controls$Pause = {$: 'Pause'};
var $author$project$MainComponents$Controls$Reset = {$: 'Reset'};
var $author$project$MainComponents$Controls$Run = {$: 'Run'};
var $author$project$MainComponents$Controls$Step = {$: 'Step'};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$MainComponents$Controls$view = F2(
	function (running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('control-buttons')
				]),
			_List_fromArray(
				[
					running ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sorting-button'),
							$elm$html$Html$Events$onClick(
							toMsg($author$project$MainComponents$Controls$Pause))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('button-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Pause')
								]))
						])) : A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sorting-button'),
							$elm$html$Html$Events$onClick(
							toMsg($author$project$MainComponents$Controls$Run))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('button-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Run')
								]))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sorting-button'),
							$elm$html$Html$Events$onClick(
							toMsg($author$project$MainComponents$Controls$Step))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('button-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Step')
								]))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sorting-button'),
							$elm$html$Html$Events$onClick(
							toMsg($author$project$MainComponents$Controls$Reset))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('button-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Reset')
								]))
						]))
				]));
	});
var $author$project$Graphs$Dijkstra$view = function (model) {
	var maybeCurrentStep = $elm$core$List$head(
		A2($elm$core$List$drop, model.index, model.dijkstraSteps));
	var currentState = A2(
		$elm$core$Maybe$withDefault,
		{currentNode: $elm$core$Maybe$Nothing, distances: $elm$core$Dict$empty, finalCost: $elm$core$Maybe$Nothing, graph: model.graph, options: _List_Nil, previous: $elm$core$Dict$empty, traversedEdges: _List_Nil, visitedNodes: _List_Nil},
		maybeCurrentStep);
	var finalRouteEdges = function () {
		var _v2 = _Utils_Tuple3(currentState.finalCost, model.source, model.target);
		if (((_v2.a.$ === 'Just') && (_v2.b.$ === 'Just')) && (_v2.c.$ === 'Just')) {
			var src = _v2.b.a;
			var tgt = _v2.c.a;
			var nodePath = A3($author$project$Graphs$Dijkstra$getPath, currentState.previous, src, tgt);
			return $author$project$Graphs$Dijkstra$pairs(nodePath);
		} else {
			return _List_Nil;
		}
	}();
	var queueText = A2(
		$elm$core$String$join,
		', ',
		A2(
			$elm$core$List$map,
			function (_v1) {
				var node = _v1.a;
				var cost = _v1.b;
				return '(' + ($elm$core$String$fromInt(node) + (', ' + ($elm$core$String$fromInt(cost) + ')')));
			},
			currentState.options));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sort-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sort-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Dijkstra\'s Algorithm')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Dijkstra\'s algorithm traverses weighted graphs, finding the shortest path between a source node and target node.\r\n                This algorithm implements a priority queue, selecting the closest unvisited node until the target node is found.\r\n                By utilizing a priority queue, the most optimal path between the source node and target node is always found first.')
					])),
				A6($author$project$Graphs$GraphVisualization$view, currentState.graph, currentState.currentNode, currentState.visitedNodes, currentState.traversedEdges, finalRouteEdges, false),
				A2($author$project$MainComponents$Controls$view, model.running, $author$project$Graphs$Dijkstra$convertControlMsg),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Current Step: ' + ($elm$core$String$fromInt(model.index) + (' | Source: ' + (A2(
							$elm$core$Maybe$withDefault,
							'None',
							A2($elm$core$Maybe$map, $elm$core$String$fromInt, model.source)) + (' | Target: ' + (A2(
							$elm$core$Maybe$withDefault,
							'None',
							A2($elm$core$Maybe$map, $elm$core$String$fromInt, model.target)) + function () {
							var _v0 = currentState.finalCost;
							if (_v0.$ === 'Just') {
								var cost = _v0.a;
								return ' | Total Cost: ' + $elm$core$String$fromInt(cost);
							} else {
								return '';
							}
						}()))))))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Queue: ' + queueText)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('variable-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Current Step: number of steps taken in the traversal.')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Source: the starting node in the graph for the search.')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Target: the node we\'re trying to find the optimal path to from the source node.')
									])),
								A2(
								$elm$html$Html$ul,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$li,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Total Cost: final cost to get from source node to the target node.')
											]))
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Queue: list in ascending order of weights of next edges to search.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Big(O) Notation')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Best-Case')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O((V + E) log V)')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Average-Case')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O((V + E) log V)')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Worst-Case')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O(n²)')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-complexity')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Space Complexity: O(V) or O(V + E)')
					]))
			]));
};
var $author$project$Graphs$MST$SelectKruskal = {$: 'SelectKruskal'};
var $author$project$Graphs$MST$SelectPrim = {$: 'SelectPrim'};
var $author$project$Graphs$MST$MSTStep = {$: 'MSTStep'};
var $author$project$Graphs$MST$ResetGraph = {$: 'ResetGraph'};
var $author$project$Graphs$MST$StartMST = {$: 'StartMST'};
var $author$project$Graphs$MST$StopMST = {$: 'StopMST'};
var $author$project$Graphs$MST$convertControlMsg = function (control) {
	switch (control.$) {
		case 'Run':
			return $author$project$Graphs$MST$StartMST;
		case 'Pause':
			return $author$project$Graphs$MST$StopMST;
		case 'Step':
			return $author$project$Graphs$MST$MSTStep;
		default:
			return $author$project$Graphs$MST$ResetGraph;
	}
};
var $author$project$Graphs$MST$edgeToString = function (edge) {
	return '(' + ($elm$core$String$fromInt(edge.from) + (', ' + ($elm$core$String$fromInt(edge.to) + (', ' + ($elm$core$String$fromInt(edge.weight) + ')')))));
};
var $author$project$Graphs$MST$edgesToString = function (edges) {
	return '[' + (A2(
		$elm$core$String$join,
		', ',
		A2($elm$core$List$map, $author$project$Graphs$MST$edgeToString, edges)) + ']');
};
var $author$project$Graphs$MST$getDescription = function (algorithm) {
	if (algorithm.$ === 'Prim') {
		return 'Prim\'s algorithm constructs a Minimum Spanning Tree (MST) by expanding from a starting node,\r\n                always selecting the cheapest edge that connects to an unvisited node.\r\n                Using a priority queue, Prim\'s gradually forms a spanning tree with the minimal total weight.';
	} else {
		return 'Kruskal\'s algorithm builds a Minimum Spanning Tree (MST) by sorting\r\n                edges by weight and adding them one by one, ensuring no cycles form.\r\n                By utilizing a union structure, Kruskal\'s always selects the cheapest\r\n                available edge to achieve the minimal total weight.';
	}
};
var $author$project$Graphs$MST$view = function (model) {
	var maybeState = $elm$core$List$head(
		A2($elm$core$List$drop, model.index, model.mstSteps));
	var currentState = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Graphs$MST$initialKruskalState(model.graph),
		maybeState);
	var queueText = A2(
		$elm$core$String$join,
		', ',
		A2(
			$elm$core$List$map,
			function (edge) {
				return '(' + ($elm$core$String$fromInt(edge.from) + (', ' + ($elm$core$String$fromInt(edge.to) + ')')));
			},
			currentState.edgeQueue));
	var costText = function () {
		var _v1 = currentState.finalCost;
		if (_v1.$ === 'Just') {
			var cost = _v1.a;
			return ' | Total Cost: ' + $elm$core$String$fromInt(cost);
		} else {
			return '';
		}
	}();
	var algorithmName = function () {
		var _v0 = model.selectedAlgorithm;
		if (_v0.$ === 'Kruskal') {
			return 'Kruskal\'s Algorithm';
		} else {
			return 'Prim\'s Algorithm';
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sort-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sort-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Minimum Spanning Tree')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Graphs$MST$getDescription(model.selectedAlgorithm))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('traversal-controls')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.selectedAlgorithm, $author$project$Graphs$MST$Prim) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick($author$project$Graphs$MST$SelectPrim)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Prim\'s')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.selectedAlgorithm, $author$project$Graphs$MST$Kruskal) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick($author$project$Graphs$MST$SelectKruskal)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Kruskal\'s')
							]))
					])),
				A6(
				$author$project$Graphs$GraphVisualization$view,
				currentState.graph,
				$elm$core$Maybe$Nothing,
				currentState.visitedNodes,
				A2(
					$elm$core$List$map,
					function (edge) {
						return _Utils_Tuple2(edge.from, edge.to);
					},
					currentState.treeEdges),
				_List_Nil,
				false),
				A2($author$project$MainComponents$Controls$view, model.running, $author$project$Graphs$MST$convertControlMsg),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Current Step: ' + ($elm$core$String$fromInt(model.index) + costText))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						'MST Edges: ' + $author$project$Graphs$MST$edgesToString(currentState.treeEdges))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('variable-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Current Step: number of simulation steps taken.')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Total Cost: cumulative weight of the MST (when complete).')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('MST Edges: list of edges that have been added to the minimum spanning tree.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Big(O) Notation')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Prim\'s Algorithm:')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O((V + E) log V)')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Kruskal\'s Algorithm:')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O(E log E)')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-complexity')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Space Complexity: O(V + E)')
					]))
			]));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$SortingAlgorithms$SortingVisualization$renderBackgroundBars = F3(
	function (array, indexOne, indexTwo) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'flex-end'),
					A2($elm$html$Html$Attributes$style, 'z-index', '-1'),
					A2($elm$html$Html$Attributes$style, 'filter', 'blur(10px) opacity(0.9)'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', 'none')
				]),
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (idx, val) {
						var isTwo = _Utils_eq(idx, indexTwo);
						var isOne = _Utils_eq(idx, indexOne);
						var barColor = isOne ? 'linear-gradient(180deg, #FF5722, #FF8A65)' : (isTwo ? 'linear-gradient(180deg, #FFC107, #FFE082)' : 'linear-gradient(180deg, #2196F3, #64B5F6)');
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'width', '100px'),
									A2($elm$html$Html$Attributes$style, 'margin', '0 10px'),
									A2(
									$elm$html$Html$Attributes$style,
									'height',
									$elm$core$String$fromInt(val * 30) + 'px'),
									A2($elm$html$Html$Attributes$style, 'background-image', barColor),
									A2($elm$html$Html$Attributes$style, 'transition', 'height 0.5s ease')
								]),
							_List_Nil);
					}),
				$elm$core$Array$toList(array)));
	});
var $author$project$MainComponents$Home$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('home-container')
			]),
		_List_fromArray(
			[
				A3($author$project$SortingAlgorithms$SortingVisualization$renderBackgroundBars, model.backgroundArray, model.indexOne, model.indexTwo),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('home-typed-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($elm$core$String$left, model.typingIndex, model.targetString))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('home-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Select an algorithm to walkthrough from the dropdowns above.')
					]))
			]));
};
var $author$project$SortingAlgorithms$SortingVisualization$renderBar = F6(
	function (sorted, outerIndex, currentIndex, maybeMinIndex, position, value) {
		var isOuter = _Utils_eq(position, outerIndex);
		var isMin = function () {
			if (maybeMinIndex.$ === 'Just') {
				var mi = maybeMinIndex.a;
				return _Utils_eq(position, mi);
			} else {
				return false;
			}
		}();
		var isCurrent = function () {
			var ci = currentIndex;
			return _Utils_eq(position, ci);
		}();
		var barColor = sorted ? 'linear-gradient(180deg, #4CAF50, #81C784)' : (isOuter ? 'linear-gradient(180deg, #FF5722, #FF8A65)' : (isMin ? 'linear-gradient(180deg, #FFA500, #FFD54F)' : (isCurrent ? 'linear-gradient(180deg, #FFC107, #FFE082)' : 'linear-gradient(180deg, #2196F3, #64B5F6)')));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'margin', '2px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sorting-bar'),
							A2(
							$elm$html$Html$Attributes$style,
							'height',
							$elm$core$String$fromInt(value * 10) + 'px'),
							A2($elm$html$Html$Attributes$style, 'background-image', barColor),
							A2($elm$html$Html$Attributes$style, 'border-radius', '5px')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('index'),
							A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '10px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(value))
						]))
				]));
	});
var $author$project$SortingAlgorithms$SortingVisualization$renderComparison = F6(
	function (array, title, sorted, outerIndex, currentIndex, maybeMinIndex) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('bar-chart'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'width', '150%'),
					A2($elm$html$Html$Attributes$style, 'height', '400px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '20px'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '35px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'flex-end'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
							A2($elm$html$Html$Attributes$style, 'height', '300px'),
							A2($elm$html$Html$Attributes$style, 'padding', '10px')
						]),
					A2(
						$elm$core$List$indexedMap,
						A4($author$project$SortingAlgorithms$SortingVisualization$renderBar, sorted, outerIndex, currentIndex, maybeMinIndex),
						$elm$core$Array$toList(array)))
				]));
	});
var $author$project$SearchAlgorithms$BinarySearch$view = F3(
	function (track, running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sort-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sort-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Binary Search')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Binary Search is more efficient than linear search but requires the array to be sorted.\r\n                The algorithm functions by repeatedly dividing the search range in half,\r\n                comparing whether the target value is less than or greater than the current pointer value.\r\n                If the current pointer value is less than the target, it searches the right half;\r\n                otherwise, it searches the left half.')
						])),
					A6(
					$author$project$SortingAlgorithms$SortingVisualization$renderComparison,
					track.array,
					'Walk through the steps below',
					track.sorted,
					track.outerIndex,
					track.currentIndex,
					$elm$core$Maybe$Just(track.minIndex)),
					A2($author$project$MainComponents$Controls$view, running, toMsg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('indices')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Left index: ' + $elm$core$String$fromInt(track.outerIndex)),
							$elm$html$Html$text(
							' | Right index: ' + $elm$core$String$fromInt(track.minIndex)),
							$elm$html$Html$text(
							' | Target Value: ' + $elm$core$String$fromInt(track.gap)),
							$elm$html$Html$text(
							' | Element Found: ' + (track.sorted ? 'Yes' : 'No'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('variable-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Left Index: left bound of our current search window.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Right Index: right bound of our current search window.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Target Value: the element we want to find (must be in sorted array).')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Found: indicates if we’ve located the target.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Big(O) Notation')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Best-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(1)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Average-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(log n)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Worst-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(log n)')
										]))
								]))
						]))
				]));
	});
var $author$project$SearchAlgorithms$LinearSearch$view = F3(
	function (track, running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sort-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sort-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Linear Search')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('As the easiest searching algorithm to implement,\r\n                linear search starts at the first element in the array and searches until it finds the target element or hits the end of the array.\r\n                If the target element is found, the algorithm stops and returns the index of the element.\r\n                If the element isn\'t found, the algorithm returns -1 indicating it\'s not in the array.')
						])),
					A6($author$project$SortingAlgorithms$SortingVisualization$renderComparison, track.array, 'Walk through the steps below', track.sorted, track.outerIndex, track.currentIndex, $elm$core$Maybe$Nothing),
					A2($author$project$MainComponents$Controls$view, running, toMsg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('indices')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Current Index: ' + $elm$core$String$fromInt(track.outerIndex)),
							$elm$html$Html$text(
							' | Target: ' + $elm$core$String$fromInt(track.gap)),
							$elm$html$Html$text(
							' | Element Found: ' + (track.sorted ? 'Yes' : 'No'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('variable-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Current Index: index being compared to what we\'re searching for.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Target: element we want to find.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Element Found: tells us whether or not the element has been found in the list.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Big(O) Notation')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Best-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(1)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Average-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Worst-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n)')
										]))
								]))
						]))
				]));
	});
var $author$project$SortingAlgorithms$BubbleSort$view = F3(
	function (track, running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sort-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sort-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Bubble Sort')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Bubble Sort is one of the simplest sorting algorithms.\r\n                It steps through the array one element at a time,\r\n                comparing and swapping adjacent elements if the right one is less than the left one.\r\n                It does this repeatedly until the array is sorted.')
						])),
					A6($author$project$SortingAlgorithms$SortingVisualization$renderComparison, track.array, 'Walk through the steps below', track.sorted, track.outerIndex, track.currentIndex, $elm$core$Maybe$Nothing),
					A2($author$project$MainComponents$Controls$view, running, toMsg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('indices')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Current Index: ' + $elm$core$String$fromInt(track.outerIndex)),
							$elm$html$Html$text(
							' | Next Index: ' + $elm$core$String$fromInt(track.currentIndex)),
							$elm$html$Html$text(
							' | Element Swapped: ' + (track.didSwap ? 'Yes' : 'No')),
							$elm$html$Html$text(
							' | Sorted: ' + (track.sorted ? 'Yes' : 'No'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('variable-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Current Index: the left index being compared.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Next Index: the right index being compared.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Element Swapped: tells us if an element has been swapped on the current pass of the array.'),
											A2(
											$elm$html$Html$ul,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$li,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('If no elements were swapped, then the array is sorted.')
														]))
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Sorted: tells us once the array is sorted.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Big(O) Notation')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Best-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Average-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Worst-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('space-complexity')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Space Complexity: O(1)')
						]))
				]));
	});
var $author$project$SortingAlgorithms$InsertionSort$view = F3(
	function (track, running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sort-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sort-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Insertion Sort')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Insertion Sort moves elements from their current locations toward the beginning of the array.\r\n                An element is moved until a smaller element is found in the sorted section of the array.\r\n                This allows the algorithm to move elements into their correct relative positions one at a time until the array is sorted.')
						])),
					A6($author$project$SortingAlgorithms$SortingVisualization$renderComparison, track.array, 'Walk through the steps below', track.sorted, track.outerIndex, track.currentIndex, $elm$core$Maybe$Nothing),
					A2($author$project$MainComponents$Controls$view, running, toMsg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('indices')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Outer Index: ' + $elm$core$String$fromInt(track.outerIndex)),
							$elm$html$Html$text(
							' | Current Index: ' + $elm$core$String$fromInt(track.currentIndex)),
							$elm$html$Html$text(
							' | Sorted: ' + (track.sorted ? 'Yes' : 'No'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('variable-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Outer Index: tracks the last element of the sorted section of the array.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Current index: tracks the element being moved to it\'s correct relative location.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Sorted: tells us once the array is sorted.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Big(O) Notation')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Best-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Average-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Worst-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('space-complexity')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Space Complexity: O(1)')
						]))
				]));
	});
var $author$project$SortingAlgorithms$MergeSort$view = F3(
	function (track, running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sort-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sort-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Merge Sort')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Merge Sort is a divide-and-conquer sorting algorithm\r\n                that recursively splits an array into smaller subarrays.\r\n                This splitting occurs until each subarray contains one element.\r\n                Then, it merges these subarrays together in sorted order.\r\n                Every merge step ensures that the combined subarrays are sorted,\r\n                resulting in the larger array being fully sorted.')
						])),
					A6($author$project$SortingAlgorithms$SortingVisualization$renderComparison, track.array, 'Walk through the steps below', track.sorted, track.outerIndex, track.currentIndex, $elm$core$Maybe$Nothing),
					A2($author$project$MainComponents$Controls$view, running, toMsg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('indices')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Middle Index: ' + $elm$core$String$fromInt(track.outerIndex)),
							$elm$html$Html$text(
							' | Outer Index: ' + $elm$core$String$fromInt(track.currentIndex)),
							$elm$html$Html$text(
							' | Sorted: ' + (track.sorted ? 'Yes' : 'No'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('variable-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Middle Index:  The middle of the subarrays being merged.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Outer Index: the rightmost index of the merging arrays.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Sorted: tells us once the array is sorted.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Big(O) Notation')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Best-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n log(n))')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Average-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n log(n))')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Worst-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n log(n))')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('space-complexity')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Space Complexity: O(n)')
						]))
				]));
	});
var $author$project$SortingAlgorithms$QuickSort$view = F3(
	function (track, running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sort-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sort-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Quick Sort')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Quick Sort selects a pivot element and partitions the array around it\r\n                (the rightmost element in this example).\r\n                During partitioning, elements that are smaller than the pivot are to the left,\r\n                and elements larger than the pivot are to the right.\r\n                The algorithm recursively applies the partitioning to the left and right subarrays\r\n                until the greater array is fully sorted (one element in the left subarray).')
						])),
					A6($author$project$SortingAlgorithms$SortingVisualization$renderComparison, track.array, 'Walk through the steps below', track.sorted, track.outerIndex, track.currentIndex, $elm$core$Maybe$Nothing),
					A2($author$project$MainComponents$Controls$view, running, toMsg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('indices')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Pivot Index: ' + $elm$core$String$fromInt(track.outerIndex)),
							$elm$html$Html$text(
							' | Current Index: ' + $elm$core$String$fromInt(track.currentIndex)),
							$elm$html$Html$text(
							' | Sorted: ' + (track.sorted ? 'Yes' : 'No'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('variable-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Pivot Index: the index where the pivot is.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Current Index: the leftmost index of the subarray.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Sorted: tells us once the array is sorted.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Big(O) Notation')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Best-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n log(n))')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Average-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n log(n))')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Worst-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('space-complexity')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Space Complexity: O(n)')
						]))
				]));
	});
var $author$project$SortingAlgorithms$SelectionSort$view = F3(
	function (track, running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sort-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sort-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Selection Sort')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Selection Sort loops through the entire array, tracking the location of the smallest found element.\r\n                Once the pass over the array is complete, the smallest element is swapped with the current location being looked at.\r\n                As a result, there is always a sorted and unsorted section of the array on either side of the current index.')
						])),
					A6(
					$author$project$SortingAlgorithms$SortingVisualization$renderComparison,
					track.array,
					'Walk through the steps below',
					track.sorted,
					track.outerIndex,
					track.currentIndex,
					$elm$core$Maybe$Just(track.minIndex)),
					A2($author$project$MainComponents$Controls$view, running, toMsg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('indices')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Current Index: ' + $elm$core$String$fromInt(track.outerIndex)),
							$elm$html$Html$text(
							' | Compare Index: ' + $elm$core$String$fromInt(track.currentIndex)),
							$elm$html$Html$text(
							' | Minimum Index: ' + $elm$core$String$fromInt(track.minIndex)),
							$elm$html$Html$text(
							' | Element Swapped: ' + (track.didSwap ? 'Yes' : 'No')),
							$elm$html$Html$text(
							' | Sorted: ' + (track.sorted ? 'Yes' : 'No'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('variable-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Current Index:  the index that will be swapped at the end of the pass.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Compare Index: the index being compared to see if it\'s smaller.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Minimum Index: the index with the smallest value in the array during this pass.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Sorted: tells us once the array is sorted.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Big(O) Notation')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Best-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Average-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Worst-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('space-complexity')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Space Complexity: O(1)')
						]))
				]));
	});
var $author$project$SortingAlgorithms$ShellSort$view = F3(
	function (track, running, toMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sort-page')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sort-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Shell Sort')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Shell Sort is an optimized version of insertion sort\r\n                and works by sorting elements that are far apart in the array first.\r\n                As the algorithm runs, the gap between elements being compared reduces,\r\n                resulting in elements moving toward their correct positions more quickly than insertion sort.')
						])),
					A6(
					$author$project$SortingAlgorithms$SortingVisualization$renderComparison,
					track.array,
					'Walk through the steps below',
					track.sorted,
					track.outerIndex,
					track.currentIndex,
					$elm$core$Maybe$Just(track.gap)),
					A2($author$project$MainComponents$Controls$view, running, toMsg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('indices')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Outer Index: ' + $elm$core$String$fromInt(track.outerIndex)),
							$elm$html$Html$text(
							' | Current Index: ' + $elm$core$String$fromInt(track.currentIndex)),
							$elm$html$Html$text(
							' | Gap: ' + $elm$core$String$fromInt(track.gap)),
							$elm$html$Html$text(
							' | Sorted: ' + (track.sorted ? 'Yes' : 'No'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('variable-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Outer Index: tracks the last element of the sorted section of the array.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Current Index: tracks the element being moved to it\'s correct relative location.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Gap: tracks the gap elements are being swapped from in the array.')
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Sorted: tells us once the array is sorted.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Big(O) Notation')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('big-o-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Best-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n log(n))')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Average-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n log(n))')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('big-o-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Worst-Case')
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('O(n²)')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('space-complexity')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Space Complexity: O(1)')
						]))
				]));
	});
var $author$project$Trees$BST$SetSearchInput = function (a) {
	return {$: 'SetSearchInput', a: a};
};
var $author$project$Trees$BST$ResetTraversal = {$: 'ResetTraversal'};
var $author$project$Trees$BST$StartTraversal = {$: 'StartTraversal'};
var $author$project$Trees$BST$StopTraversal = {$: 'StopTraversal'};
var $author$project$Trees$BST$TraversalStep = {$: 'TraversalStep'};
var $author$project$Trees$BST$convertMsg = function (control) {
	switch (control.$) {
		case 'Run':
			return $author$project$Trees$BST$StartTraversal;
		case 'Pause':
			return $author$project$Trees$BST$StopTraversal;
		case 'Step':
			return $author$project$Trees$BST$TraversalStep;
		default:
			return $author$project$Trees$BST$ResetTraversal;
	}
};
var $author$project$Trees$TreeVisualization$countNodes = function (node) {
	if (node.$ === 'Empty') {
		return 0;
	} else {
		var left = node.b;
		var right = node.c;
		return (1 + $author$project$Trees$TreeVisualization$countNodes(left)) + $author$project$Trees$TreeVisualization$countNodes(right);
	}
};
var $author$project$Trees$TreeVisualization$currentIndexNode = F2(
	function (traversal, maybeIdx) {
		if (maybeIdx.$ === 'Just') {
			var idx = maybeIdx.a;
			return ((idx > 0) && (_Utils_cmp(
				idx,
				$elm$core$List$length(traversal)) < 1)) ? $elm$core$List$head(
				A2($elm$core$List$drop, idx - 1, traversal)) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Trees$TreeVisualization$PositionedNode = function (a) {
	return {$: 'PositionedNode', a: a};
};
var $author$project$Trees$TreeVisualization$layoutHelper = F5(
	function (tree, x, dx, y, dy) {
		if (tree.$ === 'Empty') {
			return _Utils_Tuple2($elm$core$Maybe$Nothing, x);
		} else {
			var val = tree.a;
			var left = tree.b;
			var right = tree.c;
			var currentX = x;
			var _v1 = A5($author$project$Trees$TreeVisualization$layoutHelper, right, x + (6 * dx), dx / 2, y + dy, dy);
			var maybeRightTree = _v1.a;
			var rightSubtreeWidth = _v1.b;
			var _v2 = A5($author$project$Trees$TreeVisualization$layoutHelper, left, x - (6 * dx), dx / 2, y + dy, dy);
			var maybeLeftTree = _v2.a;
			var leftSubtreeWidth = _v2.b;
			var updatedNode = $author$project$Trees$TreeVisualization$PositionedNode(
				{left: maybeLeftTree, right: maybeRightTree, val: val, x: currentX, y: y});
			return _Utils_Tuple2(
				$elm$core$Maybe$Just(updatedNode),
				rightSubtreeWidth);
		}
	});
var $author$project$Trees$TreeVisualization$lines = function (tree) {
	var node = tree.a;
	var parentToChild = function (childNode) {
		return A2(
			$elm$svg$Svg$line,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1(
					$elm$core$String$fromFloat(node.x)),
					$elm$svg$Svg$Attributes$y1(
					$elm$core$String$fromFloat(node.y)),
					$elm$svg$Svg$Attributes$x2(
					$elm$core$String$fromFloat(childNode.x)),
					$elm$svg$Svg$Attributes$y2(
					$elm$core$String$fromFloat(childNode.y)),
					$elm$svg$Svg$Attributes$stroke('#808080'),
					$elm$svg$Svg$Attributes$strokeWidth('2')
				]),
			_List_Nil);
	};
	var rightLines = function () {
		var _v3 = node.right;
		if (_v3.$ === 'Just') {
			var childTree = _v3.a;
			var childNode = childTree.a;
			return A2(
				$elm$core$List$cons,
				parentToChild(childNode),
				$author$project$Trees$TreeVisualization$lines(childTree));
		} else {
			return _List_Nil;
		}
	}();
	var leftLines = function () {
		var _v1 = node.left;
		if (_v1.$ === 'Just') {
			var childTree = _v1.a;
			var childNode = childTree.a;
			return A2(
				$elm$core$List$cons,
				parentToChild(childNode),
				$author$project$Trees$TreeVisualization$lines(childTree));
		} else {
			return _List_Nil;
		}
	}();
	return _Utils_ap(leftLines, rightLines);
};
var $author$project$Trees$TreeVisualization$nodes = F3(
	function (tree, maybeActive, maybeSwapIndex) {
		var node = tree.a;
		var rightNodes = function () {
			var _v5 = node.right;
			if (_v5.$ === 'Just') {
				var r = _v5.a;
				return A3($author$project$Trees$TreeVisualization$nodes, r, maybeActive, maybeSwapIndex);
			} else {
				return _List_Nil;
			}
		}();
		var leftNodes = function () {
			var _v4 = node.left;
			if (_v4.$ === 'Just') {
				var l = _v4.a;
				return A3($author$project$Trees$TreeVisualization$nodes, l, maybeActive, maybeSwapIndex);
			} else {
				return _List_Nil;
			}
		}();
		var label = A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(node.x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(node.y + 5)),
					$elm$svg$Svg$Attributes$fill('white'),
					$elm$svg$Svg$Attributes$fontSize('14'),
					$elm$svg$Svg$Attributes$textAnchor('middle')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(
					$elm$core$String$fromInt(node.val))
				]));
		var isSwapped = function () {
			if (maybeSwapIndex.$ === 'Just') {
				var _v3 = maybeSwapIndex.a;
				var a = _v3.a;
				var b = _v3.b;
				return _Utils_eq(node.val, a) || _Utils_eq(node.val, b);
			} else {
				return false;
			}
		}();
		var isActive = function () {
			if (maybeActive.$ === 'Just') {
				var x = maybeActive.a;
				return _Utils_eq(x, node.val);
			} else {
				return false;
			}
		}();
		var circleColor = (isActive || isSwapped) ? '#FF5722' : '#64B5F6';
		var myCircle = A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx(
					$elm$core$String$fromFloat(node.x)),
					$elm$svg$Svg$Attributes$cy(
					$elm$core$String$fromFloat(node.y)),
					$elm$svg$Svg$Attributes$r('15'),
					$elm$svg$Svg$Attributes$fill(circleColor),
					$elm$svg$Svg$Attributes$style('transition: fill 0.5s ease')
				]),
			_List_Nil);
		return _Utils_ap(
			_List_fromArray(
				[myCircle, label]),
			_Utils_ap(leftNodes, rightNodes));
	});
var $author$project$Trees$TreeVisualization$renderHighlighted = F2(
	function (xs, maybeIdx) {
		if (maybeIdx.$ === 'Just') {
			var idx = maybeIdx.a;
			var visited = A2($elm$core$List$take, idx, xs);
			var visitedStr = '[' + (A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $elm$core$String$fromInt, visited)) + ']');
			return visitedStr;
		} else {
			return 'No step';
		}
	});
var $author$project$Trees$TreeVisualization$view = F5(
	function (tree, maybeCurrentIndex, maybeSwapIndex, traversalResult, running) {
		var totalNodes = $author$project$Trees$TreeVisualization$countNodes(tree);
		var maybeActiveVal = A2($author$project$Trees$TreeVisualization$currentIndexNode, traversalResult, maybeCurrentIndex);
		var _v0 = A5($author$project$Trees$TreeVisualization$layoutHelper, tree, 500, 25, 40, 75);
		var maybePositionedRoot = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('tree-page')
				]),
			_List_fromArray(
				[
					function () {
					if (maybePositionedRoot.$ === 'Nothing') {
						return A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Empty Tree')
								]));
					} else {
						var positionedRoot = maybePositionedRoot.a;
						return A2(
							$elm$svg$Svg$svg,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('1000'),
									$elm$svg$Svg$Attributes$height('375'),
									$elm$svg$Svg$Attributes$style('transition: fill 0.6s ease')
								]),
							_Utils_ap(
								$author$project$Trees$TreeVisualization$lines(positionedRoot),
								A3($author$project$Trees$TreeVisualization$nodes, positionedRoot, maybeActiveVal, maybeSwapIndex)));
					}
				}(),
					function () {
					if (maybeCurrentIndex.$ === 'Just') {
						var currentIndex = maybeCurrentIndex.a;
						return A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Traversal so far: ' + A2(
										$author$project$Trees$TreeVisualization$renderHighlighted,
										traversalResult,
										$elm$core$Maybe$Just(currentIndex)))
								]));
					} else {
						return $elm$html$Html$text('');
					}
				}()
				]));
	});
var $author$project$Trees$BST$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sort-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sort-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Binary Search Tree')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Binary search trees are a special type of tree where every node has a maximum of two child nodes.\r\n              Additionally, left hcild nodes are always smaller than the parent, while right child nodes are always larger.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('insert-delete-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('insert-delete-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Value to find'),
										$elm$html$Html$Attributes$value(model.searchInput),
										$elm$html$Html$Events$onInput($author$project$Trees$BST$SetSearchInput)
									]),
								_List_Nil)
							]))
					])),
				A5($author$project$Trees$TreeVisualization$view, model.tree, model.index, $elm$core$Maybe$Nothing, model.traversalResult, model.running),
				A2($author$project$MainComponents$Controls$view, model.running, $author$project$Trees$BST$convertMsg),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('indices')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Current Step: ' + $elm$core$String$fromInt(
							A2($elm$core$Maybe$withDefault, 0, model.index)))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('variable-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Current Step: number of steps taken in the traversal.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Big(O) Notation')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Time Complexity (search)')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O(n)')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-complexity')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Space Complexity (tree): O(n)')
					]))
			]));
};
var $author$project$Trees$HeapType$AddNode = {$: 'AddNode'};
var $author$project$Trees$HeapType$ChangeHeapType = function (a) {
	return {$: 'ChangeHeapType', a: a};
};
var $author$project$Trees$HeapType$DeleteRoot = {$: 'DeleteRoot'};
var $author$project$Trees$HeapType$MaxHeap = {$: 'MaxHeap'};
var $author$project$Trees$HeapType$UpdateNewValue = function (a) {
	return {$: 'UpdateNewValue', a: a};
};
var $author$project$Trees$HeapType$ResetHeap = {$: 'ResetHeap'};
var $author$project$Trees$HeapType$StartHeapify = {$: 'StartHeapify'};
var $author$project$Trees$HeapType$StopHeapify = {$: 'StopHeapify'};
var $author$project$Trees$HeapType$convertMsg = function (control) {
	switch (control.$) {
		case 'Run':
			return $author$project$Trees$HeapType$StartHeapify;
		case 'Pause':
			return $author$project$Trees$HeapType$StopHeapify;
		case 'Step':
			return $author$project$Trees$HeapType$HeapifyStep;
		default:
			return $author$project$Trees$HeapType$ResetHeap;
	}
};
var $author$project$Trees$HeapType$getDescription = function (heapType) {
	if (heapType.$ === 'MinHeap') {
		return 'Min Heap: A binary tree where the smallest element is always the root.\r\n                Elements get larger as the tree levels get deeper,\r\n                ensuring parent nodes are smaller than their children.';
	} else {
		return 'Max Heap: A binary tree where the largest element is always the root.\r\n                Elements get smaller as the tree levels get deeper,\r\n                ensuring parent nodes are larger than their children.';
	}
};
var $author$project$Trees$HeapType$view = function (model) {
	var currentTree = $elm$core$List$isEmpty(model.heapifySteps) ? {swappedIndices: $elm$core$Maybe$Nothing, tree: model.tree} : A2(
		$elm$core$Maybe$withDefault,
		{swappedIndices: $elm$core$Maybe$Nothing, tree: model.tree},
		$elm$core$List$head(
			A2($elm$core$List$drop, model.index, model.heapifySteps)));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sort-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sort-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Heap Operations')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Trees$HeapType$getDescription(model.heapType))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('traversal-controls')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.heapType, $author$project$Trees$HeapType$MinHeap) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$Trees$HeapType$ChangeHeapType($author$project$Trees$HeapType$MinHeap))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('MinHeap')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.heapType, $author$project$Trees$HeapType$MaxHeap) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$Trees$HeapType$ChangeHeapType($author$project$Trees$HeapType$MaxHeap))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('MaxHeap')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('insert-delete-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('insert-delete-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Trees$HeapType$AddNode)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Insert')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Value To Add'),
										$elm$html$Html$Attributes$value(model.newValue),
										$elm$html$Html$Events$onInput($author$project$Trees$HeapType$UpdateNewValue)
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Trees$HeapType$DeleteRoot)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Delete')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('disclaimer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Duplicates are not allowed.')
							]))
					])),
				function () {
				var currentStep = function () {
					var _v0 = A2($elm$core$List$drop, model.index, model.heapifySteps);
					if (_v0.b) {
						var step = _v0.a;
						return step;
					} else {
						return {swappedIndices: $elm$core$Maybe$Nothing, tree: model.tree};
					}
				}();
				return A5($author$project$Trees$TreeVisualization$view, currentStep.tree, $elm$core$Maybe$Nothing, currentStep.swappedIndices, _List_Nil, model.running);
			}(),
				A2($author$project$MainComponents$Controls$view, model.running, $author$project$Trees$HeapType$convertMsg),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('indices')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Current Step: ' + $elm$core$String$fromInt(model.index))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('variable-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Current Step: number of steps taken in the traversal.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Big(O) Notation')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Insertion Complexity')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O(log n)')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Deletion Complexity')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O(log n)')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-complexity')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Space Complexity (heap): O(n)')
					]))
			]));
};
var $author$project$Trees$TreeTraversal$ChangeTraversal = function (a) {
	return {$: 'ChangeTraversal', a: a};
};
var $author$project$Trees$TreeTraversal$Postorder = {$: 'Postorder'};
var $author$project$Trees$TreeTraversal$Preorder = {$: 'Preorder'};
var $author$project$Trees$TreeTraversal$ResetTraversal = {$: 'ResetTraversal'};
var $author$project$Trees$TreeTraversal$StartTraversal = {$: 'StartTraversal'};
var $author$project$Trees$TreeTraversal$StopTraversal = {$: 'StopTraversal'};
var $author$project$Trees$TreeTraversal$convertMsg = function (msg) {
	switch (msg.$) {
		case 'Run':
			return $author$project$Trees$TreeTraversal$StartTraversal;
		case 'Pause':
			return $author$project$Trees$TreeTraversal$StopTraversal;
		case 'Step':
			return $author$project$Trees$TreeTraversal$TraversalStep;
		default:
			return $author$project$Trees$TreeTraversal$ResetTraversal;
	}
};
var $author$project$Trees$TreeTraversal$getDescription = function (traversal) {
	switch (traversal.$) {
		case 'Preorder':
			return 'Preorder Traversals visit the nodes in the order: Root, Left Child, Right Child.\r\n                This type of traversal is useful for creating a copy of the tree\r\n                because it starts at the topmost root node and works toward the leaf nodes.';
		case 'Inorder':
			return 'Inorder Traversal visit the nodes in the order: Left Child, Root, Right Child.\r\n                This type of traversal is useful for binary search trees\r\n                because it traverses the tree in ascending/descending for sorted trees.';
		default:
			return 'Postorder Traversal visits nodes in the order: Left Child, Right Child, Root.\r\n                This type of traversal is useful for deleting trees\r\n                because it starts at the leaf nodes and works toward the root of the tree.';
	}
};
var $author$project$Trees$TreeTraversal$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sort-page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sort-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Tree Traversal')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Trees$TreeTraversal$getDescription(model.currentTraversal))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('traversal-controls')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.currentTraversal, $author$project$Trees$TreeTraversal$Preorder) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$Trees$TreeTraversal$ChangeTraversal($author$project$Trees$TreeTraversal$Preorder))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Preorder')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.currentTraversal, $author$project$Trees$TreeTraversal$Inorder) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$Trees$TreeTraversal$ChangeTraversal($author$project$Trees$TreeTraversal$Inorder))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Inorder')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('traversal-button'),
								_Utils_eq(model.currentTraversal, $author$project$Trees$TreeTraversal$Postorder) ? $elm$html$Html$Attributes$class('selected') : $elm$html$Html$Attributes$class(''),
								$elm$html$Html$Events$onClick(
								$author$project$Trees$TreeTraversal$ChangeTraversal($author$project$Trees$TreeTraversal$Postorder))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Postorder')
							]))
					])),
				A5($author$project$Trees$TreeVisualization$view, model.tree, model.index, $elm$core$Maybe$Nothing, model.traversalResult, model.running),
				A2($author$project$MainComponents$Controls$view, model.running, $author$project$Trees$TreeTraversal$convertMsg),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('indices')
					]),
				_List_fromArray(
					[
						function () {
						var _v0 = model.index;
						if (_v0.$ === 'Just') {
							var idx = _v0.a;
							return $elm$html$Html$text(
								'Current Step Number: ' + $elm$core$String$fromInt(idx));
						} else {
							return $elm$html$Html$text('Current Step Number: 0');
						}
					}()
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('variable-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Current Step: number of steps taken in the traversal.')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Big(O) Notation')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('big-o-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('big-o-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Time Complexity (traversal)')
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('O(n)')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('space-complexity')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Space Complexity (tree): O(n)')
					]))
			]));
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Main$viewFooter = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('footer-left')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('An educational platform built by '),
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href('https://www.willmaberry.com/'),
					$elm$html$Html$Attributes$target('_blank'),
					$elm$html$Html$Attributes$class('underline')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Will Maberry')
				]))
		]));
var $author$project$Main$SelectAlgorithm = function (a) {
	return {$: 'SelectAlgorithm', a: a};
};
var $author$project$Main$viewHeader = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('header')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('home-button'),
					$elm$html$Html$Events$onClick(
					$author$project$Main$NavigateTo($author$project$Main$Home))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('🏠')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Comparison-based')
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Bubble Sort'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Bubble Sort')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Selection Sort'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Selection Sort')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Insertion Sort'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Insertion Sort')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Shell Sort'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Shell Sort')
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Divide & Conquer')
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Merge Sort'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Merge Sort')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Quick Sort'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Quick Sort')
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Searches')
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Linear Search'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Linear Search')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Binary Search'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Binary Search')
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Trees')
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Tree Traversal'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Traversals')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Heap Type'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Heaps')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('BST'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('BSTs')
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Graphs')
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('Dijkstra'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Dijkstra\'s')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('MST'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('MSTs')
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Linear Structures')
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('ArraysLists'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Arrays/Lists')
												]))
										])),
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('StacksQueues'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Stacks/Queues')
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dropdown-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Associative Structures')
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dropdown-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick(
													$author$project$Main$SelectAlgorithm('SetMap'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Sets/Maps')
												]))
										]))
								]))
						]))
				]))
		]));
var $author$project$MainComponents$Home$ToggleTheme = {$: 'ToggleTheme'};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Main$viewThemeToggle = function (model) {
	var _v0 = _Utils_eq(model.homeModel.theme, $author$project$MainComponents$Structs$Light) ? _Utils_Tuple2('☼', 'Switch to Dark Mode') : _Utils_Tuple2('☾', 'Switch to Light Mode');
	var icon = _v0.a;
	var tooltip = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('theme-toggle-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('theme-toggle-btn'),
						$elm$html$Html$Events$onClick(
						$author$project$Main$HomeMsg($author$project$MainComponents$Home$ToggleTheme)),
						$elm$html$Html$Attributes$title(tooltip)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(icon)
					]))
			]));
};
var $author$project$Main$view = function (model) {
	var themeClass = function () {
		var _v1 = model.homeModel.theme;
		if (_v1.$ === 'Light') {
			return 'light-theme';
		} else {
			return 'dark-theme';
		}
	}();
	return A2(
		$elm$browser$Browser$Document,
		'Algorithms & Data Structures',
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('main-container ' + themeClass)
					]),
				_List_fromArray(
					[
						$author$project$Main$viewHeader,
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('page-content')
							]),
						_List_fromArray(
							[
								function () {
								var _v0 = model.currentPage;
								switch (_v0.$) {
									case 'Home':
										return A2(
											$elm$html$Html$map,
											$author$project$Main$HomeMsg,
											$author$project$MainComponents$Home$view(model.homeModel));
									case 'BubbleSort':
										return A3($author$project$SortingAlgorithms$BubbleSort$view, model.sortingAlgorithm, model.running, $author$project$Main$ControlMsg);
									case 'SelectionSort':
										return A3($author$project$SortingAlgorithms$SelectionSort$view, model.sortingAlgorithm, model.running, $author$project$Main$ControlMsg);
									case 'InsertionSort':
										return A3($author$project$SortingAlgorithms$InsertionSort$view, model.sortingAlgorithm, model.running, $author$project$Main$ControlMsg);
									case 'ShellSort':
										return A3($author$project$SortingAlgorithms$ShellSort$view, model.sortingAlgorithm, model.running, $author$project$Main$ControlMsg);
									case 'MergeSort':
										return A3($author$project$SortingAlgorithms$MergeSort$view, model.sortingAlgorithm, model.running, $author$project$Main$ControlMsg);
									case 'QuickSort':
										return A3($author$project$SortingAlgorithms$QuickSort$view, model.sortingAlgorithm, model.running, $author$project$Main$ControlMsg);
									case 'LinearSearch':
										return A3($author$project$SearchAlgorithms$LinearSearch$view, model.sortingAlgorithm, model.running, $author$project$Main$ControlMsg);
									case 'BinarySearch':
										return A3($author$project$SearchAlgorithms$BinarySearch$view, model.sortingAlgorithm, model.running, $author$project$Main$ControlMsg);
									case 'TreeTraversal':
										return A2(
											$elm$html$Html$map,
											$author$project$Main$TreeTraversalMsg,
											$author$project$Trees$TreeTraversal$view(model.treeTraversalModel));
									case 'HeapType':
										return A2(
											$elm$html$Html$map,
											$author$project$Main$HeapTypeMsg,
											$author$project$Trees$HeapType$view(model.heapTypeModel));
									case 'BST':
										return A2(
											$elm$html$Html$map,
											$author$project$Main$BSTMsg,
											$author$project$Trees$BST$view(model.bstModel));
									case 'Dijkstra':
										return A2(
											$elm$html$Html$map,
											$author$project$Main$DijkstraMsg,
											$author$project$Graphs$Dijkstra$view(model.dijkstraModel));
									case 'MST':
										return A2(
											$elm$html$Html$map,
											$author$project$Main$MSTMsg,
											$author$project$Graphs$MST$view(model.mstModel));
									case 'SQ':
										return A2(
											$elm$html$Html$map,
											$author$project$Main$SQMsg,
											$author$project$DataStructures$StackQueue$view(model.sqModel));
									case 'AL':
										return A2(
											$elm$html$Html$map,
											$author$project$Main$ALMsg,
											$author$project$DataStructures$ArrayList$view(model.alModel));
									default:
										return A2(
											$elm$html$Html$map,
											$author$project$Main$SMMsg,
											$author$project$DataStructures$SetMap$view(model.smModel));
								}
							}()
							])),
						$author$project$Main$viewThemeToggle(model),
						$author$project$Main$viewFooter
					]))
			]));
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{
		init: $author$project$Main$init,
		onUrlChange: function (url) {
			return $author$project$Main$NavigateTo(
				$author$project$Main$parseUrl(url));
		},
		onUrlRequest: function (_v0) {
			return $author$project$Main$NavigateTo($author$project$Main$Home);
		},
		subscriptions: $author$project$Main$subscriptions,
		update: $author$project$Main$update,
		view: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));