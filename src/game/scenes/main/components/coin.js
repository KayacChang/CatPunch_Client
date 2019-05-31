import {extras} from 'pixi.js';
import {randomInt} from 'mathjs';
import anime from 'animejs';
import Easing from 'easing-functions';

export function Coin() {
    const spriteSheet = app.resource.get('coin').spritesheet;

    const it =
        new extras.AnimatedSprite(spriteSheet.animations['coin']);

    const startFrom =
        randomInt(it.totalFrames);

    it.animationSpeed = 0.6;

    it.gotoAndPlay(startFrom);

    return it;
}

export async function playCoin(scene, {x, y}) {
    const coin = Coin();

    scene.addChild(coin);

    coin.position.set(x, y);

    anime({
        targets: coin.scale,
        x: [0.1, 0.2],
        y: [0.1, 0.2],
        duration: 500,
    });

    const x1 = coin.x + randomInt(-300, 300);
    const y1 = coin.y - randomInt(300, 500);
    const y2 = coin.y + randomInt(-150, 150);
    anime
        .timeline({targets: coin})
        .add({
            x: x1,
            duration: 1000,
            easing: 'linear',
        });

    await anime.timeline({targets: coin})
        .add({
            y: y1,
            duration: 250,
            easing: 'easeOutQuart',
        })
        .add({
            y: y2,
            duration: 750,
            easing: function() {
                return Easing.Bounce.Out;
            },
        })
        .finished;

    anime.timeline({targets: coin})
        .add({
            x: scene._width / 2,
            y: 1300,
            delay: randomInt(300, 600),
            duration: 500,
            easing: 'easeInExpo',
        });
}
