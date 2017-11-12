class Canvas {
	constructor(id, fullscreen=false) {
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext("2d");

		if (fullscreen) {
			document.body.style.margin = 0;

			var parent = this;
			window.addEventListener("resize", function(event){
				parent.fillWindow();
			});

			this.fillWindow();
		}
	}

	fillWindow() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
	}

	// Getters and setters
	get width() { return this.canvas.width; }
	set width(val) { this.canvas.width = val; }

	get height() { return this.canvas.height; }
	set height(val) { this.canvas.height = val; }

	get center() { return new Vector(this.width/2, this.height/2); }

	setContextProperty(prop, value) {
		if (Color.IsColor(value)) { value = value.formatHEX(); }

		this.context[prop] = value;
	}

	// Draw functions
	drawFill(color) {
		this.drawRect(color, Vector.Empty, this.width, this.height);
	}

	drawLine(p1, p2, color="black", width=1, caps="round") {
		this.setContextProperty("strokeStyle", color);
		this.setContextProperty("lineWidth", width);
		this.setContextProperty("lineCap", caps);

		this.context.beginPath();
		this.context.moveTo(p1.x, p1.y);
		this.context.lineTo(p2.x, p2.y);
		this.context.stroke();
	}

	drawText(font, text, posn, color="black") {
		this.setContextProperty("fillStyle", color);
		this.setContextProperty("font", font);
		this.context.fillText(text, posn.x, posn.y);
	}

	drawRect(color, posn, w, h) {
		this.setContextProperty("fillStyle", color);
		this.context.fillRect(posn.x, posn.y, w, h);
	}

	drawImage(image, posn, scale=1) {
		this.context.drawImage(image, posn.x, posn.y, image.width*scale, image.height*scale);
	}

	drawSprite(sprite, posn, rotation=0, alpha=1, scale=1) {
		sprite.draw(this, posn, rotation=rotation, alpha=alpha, scale=scale);
	}
}

class World {
	constructor(tiles, tileMappings, tileSize, entities=[]) {
		this.entities = entities;
		this.cameraPosn = Vector.Empty;
		this.tileSize = tileSize;
		this.tiles = tiles;
		this.tileMappings = tileMappings;
	}

	worldToCanvas(point) {
		var origin = Vector.Subtract(canvas.center, this.cameraPosn);
		return Vector.Add(point, origin);
	}

	draw(canvas) {
		var toLeft = Math.ceil(canvas.width / 2 / this.tileSize);
		var toTop = Math.ceil(canvas.height / 2 / this.tileSize);
		var xmin = (Math.ceil(this.cameraPosn.x / this.tileSize) - toLeft);
		var xmax = (Math.ceil(this.cameraPosn.x / this.tileSize) + toLeft);
		var ymin = (Math.ceil(this.cameraPosn.y / this.tileSize) - toTop);
		var ymax = (Math.ceil(this.cameraPosn.y / this.tileSize) + toTop);

		xmin = Helpers.Constrict(xmin - 1, 0, this.tiles.width);
		xmax = Helpers.Constrict(xmax + 1, 0, this.tiles.width);
		ymin = Helpers.Constrict(ymin - 1, 0, this.tiles.height);
		ymax = Helpers.Constrict(ymax + 1, 0, this.tiles.height);

		var parent = this;
		this.tiles.iterateRange(xmin, xmax, ymin, ymax, function(posn, value) {
			var sprite = parent.tileMappings[value];
			var worldPosn = Vector.Multiply(posn, parent.tileSize);
			var canvasPosn = parent.worldToCanvas(worldPosn);

			var scale = parent.tileSize / sprite.width;

			// canvas.drawRect(new Color(0, 0, value*255), canvasPosn, parent.tileSize, parent.tileSize);
			canvas.drawSprite(sprite, canvasPosn, 0, 1, scale);
		});

		this.entities.forEach(function(entity) {
			var canvasPosn = parent.worldToCanvas(entity.posn)
			var scale = parent.tileSize / entity.sprite.width * 2;

			var xmin = parent.cameraPosn.x - (canvas.width / 2) - (2 * parent.tileSize);
			var xmax = parent.cameraPosn.x + (canvas.width / 2) + (2 * parent.tileSize);
			var ymin = parent.cameraPosn.y - (canvas.height / 2) - (2 * parent.tileSize);
			var ymax = parent.cameraPosn.y + (canvas.height / 2) + (2 * parent.tileSize);

			// console.log(xmin, xmax);

			var xgood = (entity.posn.x > xmin && entity.posn.y < xmax);
			var ygood = (entity.posn.y > ymin && entity.posn.y < ymax);

			if (xgood && ygood) {
				canvasPosn = Vector.Subtract(canvasPosn,
					new Vector(0, parent.tileSize)
				);

				canvasPosn.y -= parent.tileSize;

				canvas.drawSprite(entity.sprite, canvasPosn, 0, 1, scale);
			}
		});
	}
}

class Entity {
	constructor(posn, sprite) {
		this.posn = posn;
		this.sprite = sprite;
	}
}
