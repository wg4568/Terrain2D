// Standard helper functions
var Helpers = {};

Helpers.ToRadians = function(degrees) {
	return degrees * Math.PI / 180;
}

Helpers.ToDegrees = function(radians) {
	return radians * 180 / Math.PI;
}

Helpers.AngleBetween = function(point1, point2) {
	var norm = {
		x: p2.x - p1.x,
		y: p2.y - p1.y
	};

	var deg = -ToDegrees(Math.atan2(norm.y, norm.x));
	if (deg < 0) deg = 360 + deg;

	return deg;
}

Helpers.UnitCircle = function(degrees, size=1) {
	var rad = Helpers.ToRadians(degrees);
	var x   = Math.cos(rad) * size;
	var y   = Math.sin(rad) * size;
	return {x: x, y: y};
}

Helpers.DistanceBetween = function(point1, point2) {
	return Math.sqrt(
		  Math.pow(point1.x-point2.x, 2)
		+ Math.pow(point1.y-point2.y, 2)
	);
}

Helpers.StepBetween = function(point1, point2) {
	if (point1.x == 0 && point1.y == 0 && point2.x == 0 && point2.y == 0) return Vector.Empty;
	var hype = Helpers.DistanceBetween(point1, point2);
	var dx = (point1.x-point2.x)/hype;
	var dy = (point1.y-point2.y)/hype;
	return new Vector(dx, dy);
}

Helpers.RandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

Helpers.RandomColor = function() {
	var r = Helpers.RandomInt(0, 255);
	var g = Helpers.RandomInt(0, 255);
	var b = Helpers.RandomInt(0, 255);
	return new Color(r, g, b);
}

Helpers.LoadImage = function(url) {
	var img = new Image();
    img.src = url;
	return img;
}

Helpers.Now = function() {
	return new Date().getTime() / 1000;
}

Helpers.Constrict = function(val, min, max) {
	if (val < min) { return min; }
	if (val > max) { return max; }
	else { return val; }
}

Helpers.PadZeros = function(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

Helpers.RandomString = function() {
	var s1 = Math.random().toString(36).substring(2, 15);
	var s2 = Math.random().toString(36).substring(2, 15);
	return s1 + s2
}

Helpers.ArrayMax = function(array) {
	var max = array[0];
	var idx = 0;

	for (var i = 1; i < array.length; i++) {
		if (array[i] > max) {
			max = array[i];
			idx = i;
		}
	}

	return {value: max, index: idx};
}

Helpers.ArrayMin = function(array) {
	var min = array[0];
	var idx = 0;

	for (var i = 1; i < array.length; i++) {
		if (array[i] < min) {
			min = array[i];
			idx = i;
		}
	}

	return {value: min, index: idx};
}

// Useful standalone classes
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static get Empty() {
		return {x: 0, y: 0};
	}

	static IsVector(vector) {
		return vector.hasOwnProperty("x") && vector.hasOwnProperty("y");
	}

	static Inverse(vector) {
		return Vector.Multiply(vector, -1);
	}

	static Add() {
		var total = new Vector(0, 0);
		for (var i = 0; i < arguments.length; i++ ) {
			if (Vector.IsVector(arguments[i])) {
				total.x += arguments[i].x;
				total.y += arguments[i].y;
			} else {
				total.x += arguments[i];
				total.y += arguments[i];
			}
		}
		return total;
	}

	static Subtract() {
		var total = new Vector(arguments[0].x, arguments[0].y);
		for (var i = 1; i < arguments.length; i++ ) {
			if (Vector.IsVector(arguments[i])) {
				total.x -= arguments[i].x;
				total.y -= arguments[i].y;
			} else {
				total.x -= arguments[i];
				total.y -= arguments[i];
			}
		}
		return total;
	}

	static Multiply() {
		var total = new Vector(1, 1);
		for (var i = 0; i < arguments.length; i++ ) {
			if (Vector.IsVector(arguments[i])) {
				total.x *= arguments[i].x;
				total.y *= arguments[i].y;
			} else {
				total.x *= arguments[i];
				total.y *= arguments[i];
			}
		}
		return total;
	}

	static Divide() {
		var total = new Vector(arguments[0].x, arguments[0].y);
		for (var i = 1; i < arguments.length; i++ ) {
			if (Vector.IsVector(arguments[i])) {
				total.x /= arguments[i].x;
				total.y /= arguments[i].y;
			} else {
				total.x /= arguments[i];
				total.y /= arguments[i];
			}
		}
		return total;
	}
}

class Color {
	constructor() {
		this._red = 0;
		this._green = 0;
		this._blue = 0;

		if (arguments.length == 1) {
			var color = Color.ParseHEX(arguments[0]);
			this.red = color[0];
			this.green = color[1];
			this.blue = color[2];
		} else {
			this.red = arguments[0];
			this.green = arguments[1];
			this.blue = arguments[2];
		}
	}

	get red() { return this._red; }
	get green() { return this._green; }
	get blue() { return this._blue; }

	get hue() { return this.hsv[0]; }
	get saturation() { return this.hsv[1]; }
	get value() { return this.hsv[2]; }

	get hsv() { return Color.RGBtoHSV(this.rgb); }
	get rgb() { return [this.red, this.green, this.blue]; }

	set red(val) { this._red = Math.floor(Helpers.Constrict(val, 0, 255)); }
	set green(val) { this._green = Math.floor(Helpers.Constrict(val, 0, 255)); }
	set blue(val) { this._blue = Math.floor(Helpers.Constrict(val, 0, 255)); }

	set hue(val) { this.hsv = [Helpers.Constrict(val, 0, 255), this.hsv[1], this.hsv[2]]; }
	set saturation(val) { this.hsv = [this.hsv[0], Helpers.Constrict(val, 0, 255), this.hsv[2]]; }
	set value(val) { this.hsv = [this.hsv[0], this.hsv[1], Helpers.Constrict(val, 0, 255)]; }

	set hsv(val) { this.rgb = Color.HSVtoRGB(val); }
	set rgb(val) { this.red = val[0]; this.green = val[1]; this.blue = val[2]; }

	formatRGB() {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`
	}

	formatHEX() {
		var red = Helpers.PadZeros(this.red.toString(16), 2);
		var green = Helpers.PadZeros(this.green.toString(16), 2);
		var blue = Helpers.PadZeros(this.blue.toString(16), 2);

		return `#${red}${green}${blue}`;
	}

	static RGBtoHSV(color) {
		var r = color[0];
		var g = color[1];
		var b = color[2];
	    var max = Math.max(r, g, b), min = Math.min(r, g, b),
	        d = max - min,
	        h,
	        s = (max === 0 ? 0 : d / max),
	        v = max / 255;

	    switch (max) {
	        case min: h = 0; break;
	        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
	        case g: h = (b - r) + d * 2; h /= 6 * d; break;
	        case b: h = (r - g) + d * 4; h /= 6 * d; break;
	    }

	    return [h*255, s*255, v*255];
	}

	static HSVtoRGB(color) {
		var h = color[0] / 255;
		var s = color[1] / 255;
		var v = color[2] / 255;
	    var r, g, b, i, f, p, q, t;
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
	        case 0: r = v, g = t, b = p; break;
	        case 1: r = q, g = v, b = p; break;
	        case 2: r = p, g = v, b = t; break;
	        case 3: r = p, g = q, b = v; break;
	        case 4: r = t, g = p, b = v; break;
	        case 5: r = v, g = p, b = q; break;
	    }
	    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	static ParseRGB(string) {
		var array = string.substring(4, string.length-1).replace(/ /g, '').split(',');
		array = array.map(function(x) { return parseInt(x) });
		var red = array[0];
		var green = array[1];
		var blue = array[2];
		return [red, green, blue];
	}

	static ParseHEX(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		var red = parseInt(result[1], 16);
		var green = parseInt(result[2], 16);
		var blue = parseInt(result[3], 16);
		return [red, green, blue];
	}

	static IsColor(color) {
		return color instanceof Color;
	}
}

class Timer {
	constructor() {
		this.lastTime = 0;
		this.gameTick = null;
		this.prevElapsed = 0;
		this.prevElapsed2 = 0;
	}

	start(gameTick) {
		var prevTick = this.gameTick;
		this.gameTick = gameTick;
		if (this.lastTime == 0)
		{
			// Once started, the loop never stops.
			// But this function is called to change tick functions.
			// Avoid requesting multiple frames per frame.
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); } );
			this.lastTime = 0;
		}
	}

	stop() {
		this.start(null);
	}

	tick() {
		if (this.gameTick != null)
		{
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); } );
		}
		else
		{
			this.lastTime = 0;
			return;
		}
		var timeNow = Date.now();
		var elapsed = timeNow - this.lastTime;
		if (elapsed > 0)
		{
			if (this.lastTime != 0)
			{
				if (elapsed > 1000) // Cap max elapsed time to 1 second to avoid death spiral
				elapsed = 1000;
				// Hackish fps smoothing
				var smoothElapsed = (elapsed + this.prevElapsed + this.prevElapsed2)/3;
				this.gameTick(0.001*smoothElapsed);
				this.prevElapsed2 = this.prevElapsed;
				this.prevElapsed = elapsed;
			}
			this.lastTime = timeNow;
		}
	}
}

class Grid {
	constructor(width, height, generator=function(posn) { return 0; }) {
		this.data = [];
		this.width = width;
		this.height = height;
		this.generator = generator;

		this.generate();
	}

	indexToPosn(index) {
		var y = Math.floor(index / this.width);
		var x = index - (y * this.width);
		return new Vector(x, y);
	}

	posnToIndex(posn) {
		return (posn.y * this.width) + posn.x;
	}

	generate() {
		var length = this.width * this.height;

		this.data = [];
		for (var i = 0; i < length; i++) {
			var coord = this.indexToPosn(i);
			var value = this.generator(coord);
			this.data.push(value);
		}
	}

	iterate(func) {
		var parent = this;
		this.data.forEach(function(value, index) {
			var posn = parent.indexToPosn(index);
			func(posn, value);
		});
	}

	iterateRange(xmin, xmax, ymin, ymax, func) {
		for (var x = xmin; x < xmax; x++) {
			for (var y = ymin; y < ymax; y++) {
				var posn = new Vector(x, y);
				var value = this.getPosn(posn);
				func(posn, value);
			}
		}
	}

	getPosn(posn) {
		var index = this.posnToIndex(posn);
		return this.data[index];
	}

	setPosn(posn, value) {
		var index = this.posnToIndex(posn);
		this.data[index] = value;
	}
}

// Sprite classes
class Sprite {
	constructor() {
		// pass
	}

	draw(canvas, posn, rotation=0, alpha=1, scale=1) {
		canvas.context.translate(posn.x, posn.y);
		canvas.context.rotate(Helpers.ToRadians(rotation));
		canvas.setContextProperty("globalAlpha", alpha);

		this.draw_code(canvas, scale=scale);

		canvas.setContextProperty("globalAlpha", 1);
		canvas.context.rotate(-Helpers.ToRadians(rotation));
		canvas.context.translate(-posn.x, -posn.y);
	}
}

Sprite.Image = class extends Sprite {
	constructor(src) {
		super();

		this.image = Helpers.LoadImage(src);
	}

	get width() { return this.image.width; }
	get height() { return this.image.height; }
	get size() { return new Vector(this.height, this.width); }

	draw_code(canvas, scale=1) {
		canvas.drawImage(this.image, Vector.Empty, scale=scale);
	}
}
