

(function() {
    var addItem, background, applyDamage, ammo, ammoDownHandler, ammoUpHandler, buildLevel, bungee, canvasHeight, canvasWidth, collision, create, dragging,
        emitter, firePos, game, preload, releasePoint, render, resetAmmo, score, scoreText, setBodyType, stuff, update, updateAmmoPos, updateScore;

    canvasWidth = 900;
    canvasHeight = 650;
    stuff = null;
    emitter = null;
    ammo = null;
    background = null;
    releasePoint = null;
    bungee = null;
    dragging = false;
    score = 0;
    scoreText = null;
    firePos = {
        x:280,
        y:900
    };

    preload = function(){
        var lrectangle, box, srectangle ;

        background = game.load.image("background", "Images/background.png");
        background.crossOrigin = "Anonymous";
        lrectangle = game.load.image("lrectangle", "Images/lyingrectangle.png");
        lrectangle.crossOrigin = "Anonymous";
        box = game.load.image("box", "Images/box.png");
        box.crossOrigin = "Anonymous";
        srectangle = game.load.image("srectangle", "Images/standingrectangle.png");
        srectangle.crossOrigin = "Anonymous";
        ammo = game.load.image("ammo", "Images/ammo.png");
        ammo.crossOrigin = "Anonymous";
        releasePoint = game.load.image("releasePoint", "Images/slingshot.png");
        releasePoint.crossOrigin = "Anonymous";
        return game.load.physics("physicsData", "package.json");
    };

    create = function() {
        var instructionsText;

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignVertically =true;
        game.scale.pageAlignHorizontally =true;
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
        scoreText.strokeThickness = 8;
        scoreText.setShadow(2, 2, '#333333', 2, false, false);
        scoreText.fixedToCamera = true;
        instructionsText = game.add.text(50,25, "Knock Stuff Over With Your Sling Shot", {
            font: '25px Arial Black',
            fill: '#c51b7d'
        });
        instructionsText.stroke = '#de77ae';
        instructionsText.anchor.setTo(0,0);
        instructionsText.strokeThickness = 6;
        instructionsText.setShadow(2, 2, '#333333', 2, false, false);
        instructionsText.fixedToCamera = true;
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 1200;
        buildLevel();
        releasePoint = game.add.sprite(firePos.x, firePos.y, "releasePoint");
        releasePoint.anchor.setTo(0.5, 0.5);
        ammo = game.add.sprite(firePos.x, firePos.y, "ammo");
        game.physics.p2.enable(ammo);
        ammo.anchor.setTo(0.5, 0.5);
        ammo.body.clearShapes();
        ammo.body.loadPolygon('physicsData', 'ammo');
        ammo.body.onBeginContact.add(collision, this);
        ammo.inputEnabled = true;
        game.camera.follow(ammo);
        resetAmmo();
        ammo.events.onInputDown.add(ammoDownHandler, this);
        ammo.events.onInputUp.add(ammoUpHandler, this);
        return bungee = new Phaser.Line(ammo.x, ammo.y, releasePoint.x, releasePoint.y);
    };

    buildLevel = function() {
        var i, j, k, results, x, xOffset, y, yOffset;
        stuff = game.add.group();

        /* BOXES */
       /* for (yOffset = i = 1; i <= 3; yOffset = i += 1) {
            y = game.world.height - (game.cache.getImage("box").height * yOffset * 1);
            addItem("box", 2300, y, 10);
        }
        for (yOffset = j = 1; j <= 5; yOffset = j += 1) {
            y = game.world.height - (game.cache.getImage("box").height * yOffset * 1);
            addItem("box", 2800, y, 10);
        }*/


        /* TABLE */
        addItem("srectangle", 600, 1000, 5);
        addItem("srectangle", 800, 1000, 5);
        addItem("lrectangle", 700, 800, 10);

        /* TABLE */
        addItem("srectangle", 1600, 1000, 5);
        addItem("srectangle", 1800, 1000, 5);
        addItem("lrectangle", 1700, 800, 10);



        results = [];

        for (xOffset = k = 1; k <= 10; xOffset = k += 1) {
            x = (200 * xOffset + Math.floor((Math.random() * 200) + 1)) + 400;
            results.push(addItem("box", x, 150, 5));
        }
        return results;
    };

    addItem = function(key, x, y, health, physicsData) {
        var item;

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
            health = 100;
        }
        if (physicsData == null) {
            physicsData = false;
        }
        item = stuff.create(x, y, key);
        item.health = health;
        game.physics.p2.enable(item);
        if (physicsData) {
            item.body.clearShapes();
            return item.body.loadPolygon('physicsData', key);
        }
    };

    updateScore = function(points) {
        score += points;
        return scoreText.text = score;
    };

    collision = function(body) {
        var damage, ref;
        if (body != null ? (ref = body.sprite) != null ? ref.key : void 0 : void 0) {
            damage = Math.floor(ammo.body.velocity.destination[0] + ammo.body.velocity.destination[1] / 10) * -1;
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

    resetAmmo = function() {
        setBodyType(ammo, "static");
        ammo.body.x = firePos.x;
        ammo.body.y = firePos.y;
        ammo.body.angle = 0;
        ammo.body.velocity.x = 0;
        ammo.body.velocity.y = 0;
        return ammo.body.angularVelocity = 0;
    };

    ammoDownHandler = function(obj) {
        setBodyType(ammo, "static");
        return dragging = true;
    };

    ammoUpHandler = function(obj) {
        var diffx, diffy;

        diffx = game.input.worldX - firePos.x;
        diffy = game.input.worldY - firePos.y;
        updateAmmoPos(diffx, diffy);
        setBodyType(ammo, "dynamic");
        dragging = false;
        obj.body.thrust(-diffx * 500);
        return obj.body.thrust(diffy * 500);
    };

    updateAmmoPos = function(dx, dy) {
        var distance;

        ammo.body.x = firePos.x + (dx *0.3);
        ammo.body.y = firePos.y + (dy * 0.3);
        distance = Math.sqrt((dx * dx) + (dy * dy));
        return ammo.body.angle = distance * 0.1;
    };

    applyDamage = function(item, damage) {
        if (damage == null) {
            damage = 3;
        }
        item.health -= damage;
        updateScore(damage);
    };

    update = function() {
        var diffx, diffy;
        if (dragging) {
            diffx = game.input.worldX - firePos.x;
            diffy = game.input.worldY - firePos.y;
            updateAmmoPos(diffx, diffy);
            return bungee.fromSprite(ammo, releasePoint, false);
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