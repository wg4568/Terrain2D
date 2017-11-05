function UnitCircle(degrees, size=1) {
	var rad = ToRadians(degrees);
	var x   = Math.cos(rad) * size;
	var y   = Math.sin(rad) * size;
	return {x: x, y: y};
}

function AngleBetween(p1, p2) {
	var norm = {
		x: p2.x - p1.x,
		y: p2.y - p1.y
	};

	var deg = -ToDegrees(Math.atan2(norm.y, norm.x));
	if (deg < 0) deg = 360 + deg;

	return deg;
}

function DistanceBetween(point1, point2) {
	return Math.sqrt(
		  Math.pow(point1.x-point2.x, 2)
		+ Math.pow(point1.y-point2.y, 2)
	);
}

function ToRadians(degrees) {
	return degrees * Math.PI / 180;
}

function ToDegrees(radians) {
	return radians * 180 / Math.PI;
}

function ArrayMax(array) {
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

function ArrayMin(array) {
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


function FindPoints(player, obj, obj_size) {
	var z = AngleBetween(player, obj);

	var d = DistanceBetween(player, obj);
	var o = ToDegrees(Math.asin(obj_size / d));

	var S = 100;

	var p1 = new Elemental.Vector(
		Math.cos(ToRadians(o + z)) *  d * S,
		Math.sin(ToRadians(o + z)) * -d * S
	);

	var p2 = new Elemental.Vector(
		Math.cos(ToRadians(o - z)) * d * S,
		Math.sin(ToRadians(o - z)) * d * S
	);

	p1 = Elemental.Vector.Add(p1, player);
	p2 = Elemental.Vector.Add(p2, player);

	return [p1, p2];
}

function FindPointsPoly(player, points) {
	var angles = [];

	points.forEach(function(point) {
		var angle = AngleBetween(player, point);

		angles.push(angle);
	});

	var i_max = ArrayMax(angles).index;
	var i_min = ArrayMin(angles).index;

	// angles = angles.map(function(angle) {
	// 	debug(angle );
	// 	return angle + 90;
	// });

	return [points[i_min], points[i_max]];
}

function debug(txt) {
	viewport.drawText("30px Arial", txt, new Elemental.Vector(10, 30));
}


var canvas = new Elemental.Canvas("game", fullscreen=true);
var viewport = new Elemental.Viewport(canvas);
var game = new Elemental.Game(viewport);

// var tree = new Elemental.Vector(100, 100);
// var tree_size = 50;
// var tree_sprite = new Elemental.Sprite.Ellipse(tree_size, config={lineWidth:10});
var poly = Elemental.Vector.Empty;
var poly_sprite = new Elemental.Sprite.Points([
	new Elemental.Vector(-50, -50),
	new Elemental.Vector(100, -50),
	new Elemental.Vector(50, 0),
	new Elemental.Vector(100, 100)
], config={lineWidth:10});

var light = Elemental.Vector.Empty;
var speed = 5;

game.start(function() {
	viewport.drawFill("white");

	if (game.keyHeld(Elemental.Keycodes.W)) light.y -= speed;
	if (game.keyHeld(Elemental.Keycodes.S)) light.y += speed;
	if (game.keyHeld(Elemental.Keycodes.A)) light.x -= speed;
	if (game.keyHeld(Elemental.Keycodes.D)) light.x += speed;

	// tree = viewport.canvasToWorld(game.mousePos);
	poly = viewport.canvasToWorld(game.mousePos);

	// points = FindPoints(light, tree, tree_size);
	var poly_points = poly_sprite.points.map(function(point) {
			return Elemental.Vector.Add(point, poly);
	});
	points = FindPointsPoly(light, poly_points);
	points = points.map(function(point) {
		return Elemental.Vector.Multiply(point, 100);
	})

	// viewport.drawSprite(tree_sprite, tree);
	viewport.drawSprite(poly_sprite, poly);

	viewport.drawLine(light, points[0], color="black", width=10);
	viewport.drawLine(light, points[1], color="black", width=10);
});
