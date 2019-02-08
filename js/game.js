// create scenes
let gameScene = new Phaser.Scene('Game');
let menuScene = new Phaser.Scene('Menu');
let gameOverScene = new Phaser.Scene('GameOver');
let optionsScene = new Phaser.Scene('Options');
let helpScene = new Phaser.Scene('Help');

// set the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 640,
    height: 360,
    scene: [menuScene, gameScene, gameOverScene, optionsScene, helpScene],
};

//create score variable
var timeScore;

// create a new game, pass the configuration
var game = new Phaser.Game(config);


/////////////////MENU SCENE START///////////////////////
////////////////////////////////////////////////////////


// some parameters for our scene
menuScene.init = function () {


}

// load assets
menuScene.preload = function () {

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.image('logo', 'logo.png');

    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });


    function create() {
        var logo = this.add.image(400, 300, 'logo');
    }

    /*//load audio
    this.load.audio('menuAudio', [
        'assets/audio/menuAudio.wav'
    ]);*/

    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('startbtn', 'assets/start.png');
    this.load.image('optionsbtn', 'assets/boxoptions.png');
    this.load.image('speedsign', 'assets/speedsign.png');
    this.load.image('tree', 'assets/tree.png');

    //load audio
    this.load.audio('carHorn', [
        'assets/audio/carHorn.mp3'
    ]);
};

// called once after the preload ends
menuScene.create = function () {

    //background
    this.background = this.add.tileSprite(640 / 2, 360 / 2, 640, 360, 'background');

    // create the logo
    this.logo = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 3, 'logo');

    //scaling the logo up
    this.logo.setScale(4.5);

    // create the start button
    this.startbtn = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.7, 'startbtn')
    this.startbtn.name = 'start';
    this.startbtn.setInteractive();
    this.startbtn.on('pointerdown', function () {
        buttonHandler(this)
    });

    //button handler
    let buttonHandler = function (button) {
        switch (button.name) {
            case 'start':
                this.game.scene.pause(menuScene);
                this.game.scene.start(gameScene);
                console.log("menu scene ended")
                break;
            case 'options':
                this.game.scene.sleep(menuScene);
                this.game.scene.start(optionsScene);
                console.log("menu scene ended")
                break;
            case 'help':
                this.game.scene.sleep(menuScene);
                this.game.scene.start(helpScene);
                console.log("menu scene ended")
                break;
        }
    };

    //scaling the start button up
    this.startbtn.setScale(1.6);

    // create the options button
    this.optionsbtn = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.4, 'optionsbtn');
    this.optionsbtn.name = 'options';
    this.optionsbtn.setInteractive();
    this.optionsbtn.on('pointerdown', function () {
        buttonHandler(this)
    });

    //scaling the options button up
    this.optionsbtn.setScale(1.6);

    //help button
    this.helpbtn = this.add.text(this.sys.game.config.width / 2.125, this.sys.game.config.height / 1.2, 'HELP');
    this.helpbtn.name = 'help';
    this.helpbtn.setInteractive();
    this.helpbtn.on('pointerdown', function () {
        buttonHandler(this)
    });

    //speedsign
    this.speedsigns = this.add.group({
        key: 'speedsign',
        repeat: 0,
        setXY: {
            x: 25,
            y: 50,
        }
    });


    // set random speeds
    Phaser.Actions.Call(this.speedsigns.getChildren(), function (speedsign) {
        speedsign.speed = Math.random() * .3 + 1;
    }, this);

    //tree
    this.trees = this.add.group({
        key: 'tree',
        repeat: 0,
        setXY: {
            x: 615,
            y: 200,
        }
    });

    // scale trees down
    Phaser.Actions.ScaleXY(this.trees.getChildren(), -0.3, -0.3);

    // set random speeds
    Phaser.Actions.Call(this.trees.getChildren(), function (tree) {
        tree.speed = Math.random() * .3 + 1;
    }, this);

    /*//play music
    var music = this.sound.add('munuAudio');
    music.play();*/
};

// this is called up to 60 times per second
menuScene.update = function () {

    //moves background
    this.background.tilePositionY -= 1;

    // speedsigns movement
    let speedsigns = this.speedsigns.getChildren();
    let numSpeedsigns = speedsigns.length;

    for (let i = 0; i < numSpeedsigns; i++) {

        // move speedsigns
        speedsigns[i].y += speedsigns[i].speed;

        if (speedsigns[i].y >= 400) {
            speedsigns[i].y = -100;
        }
    }


    // tree movement
    let trees = this.trees.getChildren();
    let numTrees = trees.length;

    for (let i = 0; i < numTrees; i++) {

        // move trees
        trees[i].y += trees[i].speed;

        if (trees[i].y >= 400) {
            trees[i].y = -100;
        }
    }
};

// end the scene
menuScene.startGame = function () {

    console.log("game ended");

    //    console.log(game.scene.start('Game'));


    //game.scene.start('Game');

}


/////////////////MENU SCENE END///////////////////////
////////////////////////////////////////////////////////

/////////////////GAME SCENE START///////////////////////
////////////////////////////////////////////////////////


// some parameters for our scene
gameScene.init = function () {

    console.log("GAME SCENE STARTED");

    /*this.forceLandscape = false;*/

    //console.log(this)
    /*this.playerSpeed = 1.5;*/
    this.playerMaxX = 360;
    this.playerMinX = 0;
}

// load assets
gameScene.preload = function () {

    /*this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.forceOrientation(true);*/

    //load audio
    this.load.audio('gameAudio', [
        'assets/audio/gameAudio.mp3'
    ]);

    this.load.audio('start', [
        'assets/audio/carStart.mp3'
    ]);

    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/traffic.png');
    this.load.image('speedsign', 'assets/speedsign.png');
    this.load.image('tree', 'assets/tree.png');
    this.load.image('gameover', 'assets/gameover.png');
    this.load.image('playerRight', 'assets/playerright.png');
    this.load.image('logo', 'assets/logo.png');
};

// called once after the preload ends
gameScene.create = function () {

    console.log("GAME SCENE STARTED");

    //bg
    this.background = this.add.tileSprite(640 / 2, 360 / 2, 640, 360, 'background');

    // create the player
    this.player = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'player');

    // we are reducing the width and height by 50%
    this.player.setScale(0.5);


    //group of enemies
    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 4,
        setXY: {
            x: 110,
            y: 50,
            stepX: 105,
            stepY: 20
        }
    });

    // scale enemies down
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

    // set random speeds
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.speed = Math.random() * 2 + 2;
    }, this);

    //speedsign
    this.speedsigns = this.add.group({
        key: 'speedsign',
        repeat: 0,
        setXY: {
            x: 25,
            y: 50,
        }
    });


    // set random speeds
    Phaser.Actions.Call(this.speedsigns.getChildren(), function (speedsign) {
        speedsign.speed = Math.random() * 1.2 + 1.2;
    }, this);

    //tree
    this.trees = this.add.group({
        key: 'tree',
        repeat: 0,
        setXY: {
            x: 615,
            y: 200,
        }
    });

    // scale trees down
    Phaser.Actions.ScaleXY(this.trees.getChildren(), -0.3, -0.3);

    // set random speeds
    Phaser.Actions.Call(this.trees.getChildren(), function (tree) {
        tree.speed = Math.random() * 1.2 + 1.2;
    }, this);

    // player is alive
    this.isPlayerAlive = true;

    // reset camera effects. Not sure if this is needed
    this.cameras.main.resetFX();

    //pause
    this.pausebtn = this.add.text(520, 08, 'PAUSE'
        /*, {
                font: '16px Courier',
                fill: '#111'    
            }*/
    );
    this.pausebtn.name = 'pause';
    this.pausebtn.setInteractive();
    this.pausebtn.on('pointerdown', function () {
        buttonHandler(this)
    });

    //play text
    this.playbtn = this.add.text(580, 08, 'PLAY'
        /*, {
                font: '16px Courier',
                fill: '#111'    
            }*/
    );
    this.playbtn.name = 'play';
    this.playbtn.setInteractive();
    this.playbtn.on('pointerdown', function () {
        buttonHandler(this)
    });


    //button handler
    let buttonHandler = function (button) {
        switch (button.name) {
            case 'play':
                this.game.scene.resume(gameScene);
                console.log("game scene resumed");
                break;
            case 'pause':
                this.game.scene.pause(gameScene);
                console.log("game scene paused");
                break;

        }
    };

    //score text
    timeScore = this.add.text(10, 08, {
        font: '16px Courier',
        fill: '#111'
    });

    //play music
    var music = this.sound.add('gameAudio');
    music.play();

    var music = this.sound.add('start');
    music.play();


};

// this is called up to 60 times per second
gameScene.update = function (time) {


    //check is player isPlayer dead -> exit the update loop
    if (!this.isPlayerAlive) {

        return;
    }

    //console.log(this.player.x);

    // stops player going off screen left
    if (this.player.x < 24) {

        this.player.x = 24;

    }

    // stops player going off screen right
    if (this.player.x > 616) {

        this.player.x = 616;

    }

    // check for active input
    if (this.input.activePointer.downX > this.sys.game.config.width / 2) {

        // player moves right
        this.player.x += 3;

        //this.playerright = this.add.sprite('playerright');
    } else if (this.input.activePointer.downX < this.sys.game.config.width / 1) {

        // player moves left
        this.player.x += -3;
    }

    this.background.tilePositionY -= 3;

    //add collision detection for each member of the enemies group
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {

        // move enemies
        enemies[i].y -= enemies[i].speed;


        if (enemies[i].y <= -100) {
            enemies[i].y = 400;
        }

        // enemy collision
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
            this.gameOver();
            break;
        }
    }

    //  add collision detection for each member of the speedsigns group
    let speedsigns = this.speedsigns.getChildren();
    let numSpeedsigns = speedsigns.length;

    for (let i = 0; i < numSpeedsigns; i++) {

        // move speedsigns
        speedsigns[i].y += speedsigns[i].speed;

        if (speedsigns[i].y >= 400) {
            speedsigns[i].y = -100;
        }

        // speedsign collision
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), speedsigns[i].getBounds())) {
            this.gameOver();
            break;
        }

    }


    // add collision detection for each member of the trees group
    let trees = this.trees.getChildren();
    let numTrees = trees.length;

    for (let i = 0; i < numTrees; i++) {

        // move trees
        trees[i].y += trees[i].speed;

        if (trees[i].y >= 400) {
            trees[i].y = -100;
        }

        //  tree collision
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), trees[i].getBounds())) {
            this.gameOver();
           //this.scene.start(gameOverScene);

            break;
        }
    }

    timeScore.setText('SCORE: ' + time, {
        font: '16px Courier',
        fill: '#111'
    });
};

// end the game
gameScene.gameOver = function () {

    // player alive flag set to  dead
    this.isPlayerAlive = false;


    //replace this.scene.restart with a camera Shake effect
    this.cameras.main.shake(500);

    // fading out
    this.time.delayedCall(250, function () {
        this.cameras.main.fade(250);
    }, [], this);

    // restart game
    this.time.delayedCall(500, function () {
        console.log("player dieddddd");
        //this.game.scene.sleep(gameScene);
        console.log("game scene ended");
        //this.game.scene.start(gameOverScene);
        console.log("gameover scene starts");
        this.scene.start(gameOverScene);
        //this.scene.restart();
//       this.scene.start('gameOver');
        //this.game.scene.start(gameOverScene);
    }, [], this);

    /*console.log("player diedd");
    
    this.game.scene.start(gameOverScene);*/


}

/////////////////GAME SCENE END///////////////////////
////////////////////////////////////////////////////////

/////////////////OPTIONS SCENE START///////////////////////
////////////////////////////////////////////////////////


// some parameters for our scene
optionsScene.init = function () {


}

// load assets
optionsScene.preload = function () {

    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('speedsign', 'assets/speedsign.png');
    this.load.image('tree', 'assets/tree.png');
    this.load.image('optionsbackground', 'assets/optionsbackground.png');
    this.load.image('options', 'assets/options.png');
    this.load.image('soundonbtn', 'assets/soundon.png');
    this.load.image('soundoffbtn', 'assets/soundoff.png');
    this.load.image('mainmenubtn', 'assets/mainmenu.png');
    this.load.image('logo', 'assets/logo.png');

    /*//load audio
    this.load.audio('menuAudio', [
        'assets/audio/menuAudio.wav'
    ]);*/
};

// called once after the preload ends
optionsScene.create = function () {

    //background
    this.background = this.add.tileSprite(640 / 2, 360 / 2, 640, 360, 'background');

    // create the black backround
    this.optionsbackground = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'optionsbackground');

    //create the logo
    this.logo = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.1, 'logo');

    //create the options header
    this.options = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 4, 'options');

    //scale options header
    this.options.setScale(3.5);

    // create the main menu button
    this.mainmenubtn = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2.4, 'mainmenubtn');
    this.mainmenubtn.name = 'mainMenu';
    this.mainmenubtn.setInteractive();
    this.mainmenubtn.on('pointerdown', function () {
        buttonHandler(this)
    });


    //button handler
    let buttonHandler = function (button) {
        switch (button.name) {
            case 'mainMenu':
                this.game.scene.sleep(optionsScene);
                console.log("options scene ended");
                this.game.scene.wake(menuScene);
                console.log("menu scene resumed");
                /*this.game.scene.start(menuScene);
                console.log("menu scene started")*/
                ;
                break;

        }
    };

    //scaling the main menu button up
    this.mainmenubtn.setScale(1.6);

    // create the sound on button
    this.soundonbtn = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.9, 'soundonbtn');

    //scaling the sound on button up
    this.soundonbtn.setScale(1.6);

    // create the sound off button
    this.soundoffbtn = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.6, 'soundoffbtn');

    //scaling the sound off button up
    this.soundoffbtn.setScale(1.6);

    //speedsign
    this.speedsigns = this.add.group({
        key: 'speedsign',
        repeat: 0,
        setXY: {
            x: 25,
            y: 50,
        }
    });


    // set random speeds
    Phaser.Actions.Call(this.speedsigns.getChildren(), function (speedsign) {
        speedsign.speed = Math.random() * .3 + 1;
    }, this);

    //tree
    this.trees = this.add.group({
        key: 'tree',
        repeat: 0,
        setXY: {
            x: 615,
            y: 200,
        }
    });

    // scale trees down
    Phaser.Actions.ScaleXY(this.trees.getChildren(), -0.3, -0.3);

    // set random speeds
    Phaser.Actions.Call(this.trees.getChildren(), function (tree) {
        tree.speed = Math.random() * .3 + 1;
    }, this);

    /*//play music
    var music = this.sound.add('munuAudio');
    music.play();*/
};

// this is called up to 60 times per second
optionsScene.update = function () {

    //moves background
    this.background.tilePositionY -= 1;

    // speedsigns movement
    let speedsigns = this.speedsigns.getChildren();
    let numSpeedsigns = speedsigns.length;

    for (let i = 0; i < numSpeedsigns; i++) {

        // move speedsigns
        speedsigns[i].y += speedsigns[i].speed;

        if (speedsigns[i].y >= 400) {
            speedsigns[i].y = -100;
        }
    }


    // tree movement
    let trees = this.trees.getChildren();
    let numTrees = trees.length;

    for (let i = 0; i < numTrees; i++) {

        // move trees
        trees[i].y += trees[i].speed;

        if (trees[i].y >= 400) {
            trees[i].y = -100;
        }
    }
};

// end the scene
optionsScene.startGame = function () {

    game.scene.start('Game');

}


/////////////////OPTIONS SCENE END///////////////////////
////////////////////////////////////////////////////////

/////////////////GAMEOVER SCENE START///////////////////////
////////////////////////////////////////////////////////


// some parameters for our scene
gameOverScene.init = function () {


}

// load assets
gameOverScene.preload = function () {

    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('speedsign', 'assets/speedsign.png');
    this.load.image('tree', 'assets/tree.png');
    this.load.image('optionsbackground', 'assets/optionsbackground.png');
    this.load.image('gameover', 'assets/gameover.png');
    this.load.image('playagainbtn', 'assets/playagain.png');
    this.load.image('mainmenubtn', 'assets/mainmenu.png');
    this.load.image('logo', 'assets/logo.png');

    /*//load audio
    this.load.audio('menuAudio', [
        'assets/audio/menuAudio.wav'
    ]);*/
};

// called once after the preload ends
gameOverScene.create = function () {
    
    
    
    console.log("GAMEOVER SCENE");
    //background
    this.background = this.add.tileSprite(640 / 2, 360 / 2, 640, 360, 'background');

    // create the black backround
    this.optionsbackground = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'optionsbackground');

    //create the logo
    this.logo = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.1, 'logo');

    //create the game over header
    this.gameover = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 4, 'gameover');

    //scale game over header
    this.gameover.setScale(3.5);

    // create the main menu button
    this.mainmenubtn = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.9, 'mainmenubtn');
    this.mainmenubtn.name = 'mainMenu';
    this.mainmenubtn.setInteractive();
    this.mainmenubtn.on('pointerdown', function () {
        buttonHandler(this)
    });


    //button handler
    let buttonHandler = function (button) {
        switch (button.name) {
            case 'mainMenu':
                this.game.scene.sleep(gameOverScene);
                console.log("game over scene ended");
                this.game.scene.wake(menuScene);
                console.log("menu scene resumed");
                break;
            case 'playAgain':
                this.game.scene.sleep(gameOverScene);
                console.log("game over scene ended");
                this.game.scene.start(gameScene);
                console.log("game scene resumed");
                break;
        }
    };

    //scaling the main menu button up
    this.mainmenubtn.setScale(1.6);


    // create the play again button
    this.playagainbtn = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.6, 'playagainbtn');
    this.playagainbtn.name = 'playAgain';
    this.playagainbtn.setInteractive();
    this.playagainbtn.on('pointerdown', function () {
        buttonHandler(this)
    });

    //scaling the play again button up
    this.playagainbtn.setScale(1.6);

    //speedsign
    this.speedsigns = this.add.group({
        key: 'speedsign',
        repeat: 0,
        setXY: {
            x: 25,
            y: 50,
        }
    });


    // set random speeds
    Phaser.Actions.Call(this.speedsigns.getChildren(), function (speedsign) {
        speedsign.speed = Math.random() * .3 + 1;
    }, this);

    //tree
    this.trees = this.add.group({
        key: 'tree',
        repeat: 0,
        setXY: {
            x: 615,
            y: 200,
        }
    });

    // scale trees down
    Phaser.Actions.ScaleXY(this.trees.getChildren(), -0.3, -0.3);

    // set random speeds
    Phaser.Actions.Call(this.trees.getChildren(), function (tree) {
        tree.speed = Math.random() * .3 + 1;
    }, this);

    /*//play music
    var music = this.sound.add('munuAudio');
    music.play();*/
};

// this is called up to 60 times per second
gameOverScene.update = function () {

    //moves background
    this.background.tilePositionY -= 1;

    // speedsigns movement
    let speedsigns = this.speedsigns.getChildren();
    let numSpeedsigns = speedsigns.length;

    for (let i = 0; i < numSpeedsigns; i++) {

        // move speedsigns
        speedsigns[i].y += speedsigns[i].speed;

        if (speedsigns[i].y >= 400) {
            speedsigns[i].y = -100;
        }
    }


    // tree movement
    let trees = this.trees.getChildren();
    let numTrees = trees.length;

    for (let i = 0; i < numTrees; i++) {

        // move trees
        trees[i].y += trees[i].speed;

        if (trees[i].y >= 400) {
            trees[i].y = -100;
        }
    }
};

// end the scene
gameOverScene.startGame = function () {

    game.scene.start('Game');

}


/////////////////GAMEOVER SCENE END///////////////////////
////////////////////////////////////////////////////////

/////////////////HELP SCENE START///////////////////////
////////////////////////////////////////////////////////


// some parameters for our scene
helpScene.init = function () {


}

// load assets
helpScene.preload = function () {

    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('speedsign', 'assets/speedsign.png');
    this.load.image('tree', 'assets/tree.png');
    this.load.image('optionsbackground', 'assets/optionsbackground.png');
    this.load.image('mainmenubtn', 'assets/mainmenu.png');
    this.load.image('logo', 'assets/logo.png');

    /*//load audio
    this.load.audio('menuAudio', [
        'assets/audio/menuAudio.wav'
    ]);*/
};

// called once after the preload ends
helpScene.create = function () {

    //background
    this.background = this.add.tileSprite(640 / 2, 360 / 2, 640, 360, 'background');

    // create the black backround
    this.optionsbackground = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'optionsbackground');

    //create the logo
    this.logo = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.1, 'logo');

    //create the help text
    this.add.text(this.sys.game.config.width / 2.5, this.sys.game.config.height / 8, 'Hello driver...');
    this.add.text(this.sys.game.config.width / 2.8, this.sys.game.config.height / 5, 'To move your car left');
    this.add.text(this.sys.game.config.width / 3.3, this.sys.game.config.height / 4, 'tap the left side of screen');
    this.add.text(this.sys.game.config.width / 2.1, this.sys.game.config.height / 3, 'and');
    this.add.text(this.sys.game.config.width / 2.9, this.sys.game.config.height / 2.4, 'To move your car right');
    this.add.text(this.sys.game.config.width / 3.4, this.sys.game.config.height / 2.1, 'tap the right side of screen');
    this.add.text(this.sys.game.config.width / 2.35, this.sys.game.config.height / 1.8, 'GOOD LUCK!!');

    // create the main menu button
    this.mainmenubtn = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 1.5, 'mainmenubtn');
    this.mainmenubtn.name = 'mainMenu';
    this.mainmenubtn.setInteractive();
    this.mainmenubtn.on('pointerdown', function () {
        buttonHandler(this)
    });


    //button handler
    let buttonHandler = function (button) {
        switch (button.name) {
            case 'mainMenu':
                this.game.scene.sleep(helpScene);
                console.log("game over scene ended");
                this.game.scene.wake(menuScene);
                console.log("menu scene resumed");
                break;
        }
    };

    //scaling the main menu button up
    this.mainmenubtn.setScale(1.6);



    //speedsign
    this.speedsigns = this.add.group({
        key: 'speedsign',
        repeat: 0,
        setXY: {
            x: 25,
            y: 50,
        }
    });


    // set random speeds
    Phaser.Actions.Call(this.speedsigns.getChildren(), function (speedsign) {
        speedsign.speed = Math.random() * .3 + 1;
    }, this);

    //tree
    this.trees = this.add.group({
        key: 'tree',
        repeat: 0,
        setXY: {
            x: 615,
            y: 200,
        }
    });

    // scale trees down
    Phaser.Actions.ScaleXY(this.trees.getChildren(), -0.3, -0.3);

    // set random speeds
    Phaser.Actions.Call(this.trees.getChildren(), function (tree) {
        tree.speed = Math.random() * .3 + 1;
    }, this);

    /*//play music
    var music = this.sound.add('munuAudio');
    music.play();*/
};

// this is called up to 60 times per second
helpScene.update = function () {

    //moves background
    this.background.tilePositionY -= 1;

    // speedsigns movement
    let speedsigns = this.speedsigns.getChildren();
    let numSpeedsigns = speedsigns.length;

    for (let i = 0; i < numSpeedsigns; i++) {

        // move speedsigns
        speedsigns[i].y += speedsigns[i].speed;

        if (speedsigns[i].y >= 400) {
            speedsigns[i].y = -100;
        }
    }


    // tree movement
    let trees = this.trees.getChildren();
    let numTrees = trees.length;

    for (let i = 0; i < numTrees; i++) {

        // move trees
        trees[i].y += trees[i].speed;

        if (trees[i].y >= 400) {
            trees[i].y = -100;
        }
    }
};

// end the scene
helpScene.startGame = function () {

    game.scene.start('Game');

}


/////////////////HELP SCENE END///////////////////////
////////////////////////////////////////////////////////
