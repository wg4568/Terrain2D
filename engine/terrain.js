function Perlin2D(posn, seed=0, scale=100) {
	var value = noise.perlin3(posn.x / scale, posn.y / scale, seed);
	return (value + 1) / 2;
}

function GenerateIsland(width, height, seed=null) {
	if (!seed) seed = Helpers.RandomInt(0, 10000);
	var middle = new Vector(width / 2, height / 2);

	var perlin = new Grid(width, height, function(point) {
		return Perlin2D(point, seed, 25);
	});

	var biomes = new Grid(width, height, function(point) {
		return Perlin2D(point, seed, 25);
	});

	var normalizer = Helpers.DistanceBetween(middle, new Vector(0, middle.y));
	var gradient = new Grid(width, height, function(point) {
		var distance = Helpers.DistanceBetween(middle, point) / normalizer;
		if (distance > 1) distance = 1;

		var curved = 2 * Math.pow(6, (distance*2) - 2);
		return curved / 1.2;
	});

	var combined = Grid.Subtract(perlin, gradient);

	var terrain = new Grid(width, height, function(point) {
		var value = combined.getPosn(point);

		if (value < -0.2) return 4;	// ocean
		if (value < 0)	  return 3;	// water
		if (value < 0.1)  return 2; // sand
		else 			  return 1; // grass
	});

	var trees = [];
	new Grid(width, height, function(point) {
		var is_grass = terrain.getPosn(point) == 1;
		var is_forest = biomes.getPosn(point) <= 0.5;

		var prob = (biomes.getPosn(point) - 0.5) * 100;
		var random = Helpers.RandomInt(0, 100) < 50;
		// console.log(prob, random);

		if (is_grass && is_forest && random) trees.push(point);
	});

	return {
		terrain: terrain,
		trees: trees
	};
}
