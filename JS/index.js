

(function() {
  var addThing, applyDamage, background, bossman, bossmanDownHandler, bossmanUpHandler, buildLevel, bungee, canvasHeight, canvasWidth, collision, create, dragging, emitter, firePos, game, particleBurst, preload, preview, releasePoint, render, resetBossman, score, scoreText, setBodyType, stuff, update, updateBossmanPos, updateScore;

  //preview = new PreviewImage("https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/angry-bossman-v2.png");

  canvasWidth = 900;

  canvasHeight = 650;

  stuff = null;

  emitter = null;

  bossman = null;

  background = null;

  releasePoint = null;

  bungee = null;

  dragging = false;

  score = 0;

  scoreText = null;

  firePos = {
    x: 280,
    y: 900
  };

  preload = function() {
    var beer, blockx, blocky, boombox, box, lamp, particle, printer;
    background = game.load.image("background", "Images/background.jpg");
    background.crossOrigin = "Anonymous";
    lamp = game.load.image("lamp", "Images/lamp.jpg");
    lamp.crossOrigin = "Anonymous";
    beer = game.load.image("beer", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/beer.png");
    beer.crossOrigin = "Anonymous";
    printer = game.load.image("printer", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/printer.png");
    printer.crossOrigin = "Anonymous";
    boombox = game.load.image("boombox", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/boombox.png");
    boombox.crossOrigin = "Anonymous";
    blockx = game.load.image("blockx", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/blockx.png");
    blockx.crossOrigin = "Anonymous";
    blocky = game.load.image("blocky", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/blocky.png");
    blocky.crossOrigin = "Anonymous";
    box = game.load.image("box", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/box.png");
    box.crossOrigin = "Anonymous";
    particle = game.load.image("particle", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/star.png");
    particle.crossOrigin = "Anonymous";
    bossman = game.load.image("bossman", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/bossmanv2.png");
    bossman.crossOrigin = "Anonymous";
    releasePoint = game.load.image("releasePoint", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/release-point.png?v=2");
    releasePoint.crossOrigin = "Anonymous";
    return game.load.physics('physicsData', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/angry-physics.json');
    
  };

  create = function() {
    var instructionsText;
    //preview.clear();
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;
    game.world.setBounds(0, 0, 3000, 1200);
    game.camera.setBoundsToWorld();
    game.stage.backgroundColor = '#888888';
    background = game.add.sprite(0, 0, "background");
    background.width = game.world.width;
    background.height = game.world.height + 5;
    scoreText = game.add.text(50, 65, score, {
      font: '74px Arial Black',
      fill: '#c51b7d'
    });
    scoreText.stroke = '#de77ae';
    scoreText.anchor.setTo(0, 0);
    scoreText.strokeThickness = 16;
    scoreText.setShadow(2, 2, '#333333', 2, false, false);
    scoreText.fixedToCamera = true;
    instructionsText = game.add.text(50, 25, "Test", {
      font: '25px Arial Black',
      fill: '#c51b7d'
    });
    instructionsText.stroke = '#de77ae';
    instructionsText.anchor.setTo(0, 0);
    instructionsText.strokeThickness = 6;
    instructionsText.setShadow(2, 2, '#333333', 2, false, false);
    instructionsText.fixedToCamera = true;
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 1200;
    buildLevel();
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('particle');
    emitter.gravity = 200;
    releasePoint = game.add.sprite(firePos.x, firePos.y, "releasePoint");
    releasePoint.anchor.setTo(0.5, 0.5);
    bossman = game.add.sprite(firePos.x, firePos.y, "bossman");
    game.physics.p2.enable(bossman);
    bossman.anchor.setTo(0.5, 0.5);
    bossman.body.clearShapes();
    bossman.body.loadPolygon('physicsData', 'bossman');
    bossman.body.onBeginContact.add(collision, this);
    bossman.inputEnabled = true;
    game.camera.follow(bossman);
    resetBossman();
    bossman.events.onInputDown.add(bossmanDownHandler, this);
    bossman.events.onInputUp.add(bossmanUpHandler, this);
    return bungee = new Phaser.Line(bossman.x, bossman.y, releasePoint.x, releasePoint.y);
  };

  buildLevel = function() {
    var i, j, k, results, x, xOffset, y, yOffset;
    stuff = game.add.group();

    /* BOXES */
    for (yOffset = i = 1; i <= 3; yOffset = i += 1) {
      y = game.world.height - (game.cache.getImage("box").height * yOffset * 1);
      addThing("box", 2300, y, 10);
    }
    for (yOffset = j = 1; j <= 5; yOffset = j += 1) {
      y = game.world.height - (game.cache.getImage("box").height * yOffset * 1);
      addThing("box", 2800, y, 10);
    }

    /* LAMPS */
    addThing("lamp", 900, 700, 15, true);
    addThing("lamp", 2000, 700, 15, true);

    /* TABLE */
    addThing("blocky", 600, 1000, 5);
    addThing("blocky", 800, 1000, 5);
    addThing("blockx", 700, 800, 10);

    /* TABLE */
    addThing("blocky", 1600, 1000, 5);
    addThing("blocky", 1800, 1000, 5);
    addThing("blockx", 1700, 800, 10);
    addThing("boombox", 2400, 700, 40);
    addThing("boombox", 1400, 700, 40);
    addThing("printer", 700, 700, 20, true);
    addThing("beer", 580, 700, 5);
    addThing("beer", 820, 700, 5);
    addThing("beer", 580, 700, 5);
    addThing("beer", 820, 700, 5);
    addThing("beer", 1580, 700, 5);
    addThing("beer", 1820, 700, 5);
    addThing("beer", 2580, 700, 5);
    addThing("beer", 2820, 700, 5);
    results = [];
    for (xOffset = k = 1; k <= 10; xOffset = k += 1) {
      x = (200 * xOffset + Math.floor((Math.random() * 200) + 1)) + 400;
      results.push(addThing("beer", x, 150, 5));
    }
    return results;
  };

  addThing = function(key, x, y, health, physicsData) {
    var thing;
    if (key == null) {
      key = null;
    }
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (health == null) {
      health = 10;
    }
    if (physicsData == null) {
      physicsData = false;
    }
    thing = stuff.create(x, y, key);
    thing.health = health;
    game.physics.p2.enable(thing);
    if (physicsData) {
      thing.body.clearShapes();
      return thing.body.loadPolygon('physicsData', key);
    }
  };

  updateScore = function(points) {
    score += points;
    return scoreText.text = score;
  };

  collision = function(body) {
    var damage, ref;
    if (body != null ? (ref = body.sprite) != null ? ref.key : void 0 : void 0) {
      damage = Math.floor(bossman.body.velocity.destination[0] + bossman.body.velocity.destination[1] / 10) * -1;
      if (damage >= 1) {
        return applyDamage(body.sprite, damage);
      }
    }
  };

  setBodyType = function(entity, type) {
    switch (type) {
      case "dynamic":
        return entity.body.data.motionState = 1;
      case "static":
        return entity.body.data.motionState = 2;
    }
  };

  resetBossman = function() {
    setBodyType(bossman, "static");
    bossman.body.x = firePos.x;
    bossman.body.y = firePos.y;
    bossman.body.angle = 0;
    bossman.body.velocity.x = 0;
    bossman.body.velocity.y = 0;
    return bossman.body.angularVelocity = 0;
  };

  bossmanDownHandler = function(obj) {
    setBodyType(bossman, "static");
    return dragging = true;
  };

  bossmanUpHandler = function(obj) {
    var diffx, diffy;
    diffx = game.input.worldX - firePos.x;
    diffy = game.input.worldY - firePos.y;
    updateBossmanPos(diffx, diffy);
    setBodyType(bossman, "dynamic");
    dragging = false;
    obj.body.thrust(-diffx * 500);
    return obj.body.thrust(diffy * 500);
  };

  updateBossmanPos = function(dx, dy) {
    var distance;
    bossman.body.x = firePos.x + (dx * 0.3);
    bossman.body.y = firePos.y + (dy * 0.3);
    distance = Math.sqrt((dx * dx) + (dy * dy));
    return bossman.body.angle = distance * 0.1;
  };

  applyDamage = function(thing, damage) {
    if (damage == null) {
      damage = 3;
    }
    thing.health -= damage;
    updateScore(damage);
    if (thing.health <= 0) {
      particleBurst(thing, 20);
      return thing.kill();
    } else {
      return particleBurst(thing);
    }
  };

  particleBurst = function(obj, count) {
    if (count == null) {
      count = 10;
    }
    emitter.x = obj.x;
    emitter.y = obj.y;
    return emitter.start(true, 2000, null, count);
  };

  update = function() {
    var diffx, diffy;
    if (dragging) {
      diffx = game.input.worldX - firePos.x;
      diffy = game.input.worldY - firePos.y;
      updateBossmanPos(diffx, diffy);
      return bungee.fromSprite(bossman, releasePoint, false);
    }
  };

  render = function() {
    return game.debug.geom(bungee);
  };

  game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, "game", {
    preload: preload,
    create: create,
    update: update,
    render: render
  });

}).call(this);