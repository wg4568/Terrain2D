function Perlin2D(posn, seed=0, scale=100) {
	var value = noise.perlin3(posn.x / scale, posn.y / scale, seed);
	return (value + 1) / 2;
}

function Lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}


function GenerateIsland(width, height, seed=null) {
	if (!seed) seed = Helpers.RandomInt(0, 10000);
	var middle = new Vector(width / 2, height / 2);

	var perlin = new Grid(width, height, function(point) {
		return Perlin2D(point, seed, 25);
	});

	var normalizer = Helpers.DistanceBetween(middle, new Vector(0, middle.y));
	var gradient = new Grid(width, height, function(point) {
		var distance = Helpers.DistanceBetween(middle, point) / normalizer;
		if (distance > 1) distance = 1;

		var curved = 2 * Math.pow(6, (distance*2) - 2);
		return curved / 2;
	});

	var combined = Grid.Subtract(perlin, gradient);

	return new Grid(width, height, function(point) {
		var value = combined.getPosn(point);
		if (value < 0)   return 3;	// water
		if (value < 0.3) return 2;	// sand
		else			 return 1;	// grass
	});
}
