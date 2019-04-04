// @flow

import {
    Application, filters, Sprite,
    Container, Graphics, Text, TextStyle,
} from 'pixi.js';

const app = new Application(800, 600);
document.body.appendChild(app.view);

app.loader
    .add('eggHead', 'assets/eggHead.png')
    .add('flowerTop', 'assets/flowerTop.png')
    .add('helmlok', 'assets/helmLok.png')
    .add('skully', 'assets/skully.png')
    .load(onAssetsLoaded);

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

// onAssetsLoaded handler builds the example.
function onAssetsLoaded(loader, resources) {
    // Create different slot symbols.
    const slotTextures = [
        resources['eggHead'].texture,
        resources['flowerTop'].texture,
        resources['helmlok'].texture,
        resources['skully'].texture,
    ];

    // Build the reels
    const reels = [];
    const reelContainer = new Container();
    for (let i = 0; i < 5; i++) {
        const rc = new Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new filters.BlurFilter(),
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        // Build the symbols
        for (let j = 0; j < 4; j++) {
            const symbol = new Sprite(
                slotTextures[Math.floor(Math.random() * slotTextures.length)],
            );
            // Scale the symbol to fit symbol area.
            symbol.y = j * SYMBOL_SIZE;

            if (i === 0 && j === 0) console.log(symbol.y);

            symbol.scale.x = symbol.scale.y =
                Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
    const top = new Graphics();
    top.beginFill(0, 1);
    top.drawRect(0, 0, app.screen.width, margin);
    const bottom = new Graphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);

    // Add play text
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    const playText = new Text('Spin the wheels!', style);
    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y =
        app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);

    // Add header text
    const headerText = new Text('PIXI MONSTER SLOTS!', style);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);

    app.stage.addChild(top);
    app.stage.addChild(bottom);

    // Set the interactivity.
    bottom.interactive = true;
    bottom.buttonMode = true;
    bottom.addListener('pointerdown', startPlay);

    let running = false;

    // Function to start playing.
    function startPlay() {
        if (running) return;
        running = true;
        console.log('====');
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);

            // console.log(extra);

            tweenTo(
                r,
                'position',
                r.position + extra, 2500 + i * 600 + extra * 600, backout(0.6),
                null,
                i == reels.length - 1 ? reelsComplete : null,
            );
        }
    }

    // Reels done handler.
    function reelsComplete() {
        running = false;
    }

    // Listen for animate update.
    app.ticker.add(function(delta) {
        // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also.
            // Now blur depends on frame rate.

            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                //  const prevy = s.y;

                s.y = (r.position + j) % r.symbols.length * SYMBOL_SIZE;

                if (i === 0 && j === 0) {
                    console.log((r.position + j) % r.symbols.length);
                }

                if (s.y < 0) {
                    // Detect going over and swap a texture.
                    // This should in proper product be determined from some logical reel.
                    s.texture =
                        slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(
                        SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height,
                    );
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });
}

// Very simple tweening utility function.
// This should be replaced with a proper tweening library in a real product.
const tweening = [];

function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object: object,
        property: property,
        propertyBeginValue: object[property],
        target: target,
        easing: easing,
        time: time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}

// Listen for animate update.
app.ticker.add(function(delta) {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] =
            lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase == 1) {
            t.object[t.property] = t.target;
            if (t.complete) {
                t.complete(t);
            }
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

// Basic lerp funtion.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
    return function(t) {
        return (--t * t * ((amount + 1) * t + amount) + 1);
    };
};
