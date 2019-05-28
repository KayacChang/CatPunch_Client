import {Container, Sprite, extras, particles} from 'pixi.js';

import {map, times} from 'ramda';

import anime from 'animejs';
import {currencyFormat, currencyValue} from '../../../utils';
import {wait} from '../../../../general/utils/time';

import {
    random, randomInt, pi,
} from 'mathjs';
import {degreeToRadian, radianToDegree} from '../../../../general/utils/logic';

function setFlex(elements, options = {}) {
    const padding = options.padding || 0;
    return elements.reduce((pre, cur) => {
        cur.x = pre.x + pre.width + padding;
        return cur;
    });
}

export function freeGameEffect(scene, multiply) {
    const sheet = app.resource.get('effect-text').spritesheet;

    const textSprites =
        map((char) => new Sprite(sheet.textures[`${char}.png`]),
            'freegame');

    setFlex(textSprites);

    const title = new Container();
    title.addChild(...textSprites);
    title.scale.set(0.75);

    const X =
        new Sprite(sheet.textures['x.png']);
    const number =
        new extras.BitmapText(`${multiply}`, {font: '90px Effect'});
    number.y += number.height / 2;

    const content = new Container();
    content.addChild(X, number);

    setFlex(content.children);

    const it = new Container();
    it.addChild(title, content);

    scene.addChild(it);

    content.position.set(it.width / 2, it.height * (3 / 2));
    content.pivot.set(content.width / 2, content.height / 2);

    it.position.set(scene._width / 2, scene._height / 2);
    it.pivot.set(it.width / 2, it.height / 2);

    const textEffects = TextEffect4([it]);

    const maskEffects =
        anime
            .timeline({
                targets: scene.getChildByName('effectMask'),
                easing: 'easeOutCirc',
            })
            .add({
                alpha: 0.5,
                duration: 800,
            })
            .add({
                alpha: 0,
                duration: 600,
            })
            .finished;

    return Promise
        .all([textEffects, maskEffects])
        .then(() => scene.removeChild(it));
}

export function reSpinEffect(scene) {
    const sheet = app.resource.get('effect-text').spritesheet;

    const textSprites =
        map((char) => new Sprite(sheet.textures[`${char}.png`]),
            'respin');

    setFlex(textSprites);

    const title = new Container();
    title.addChild(...textSprites);
    title.scale.set(0.75);

    const it = new Container();
    it.addChild(title);

    scene.addChild(it);

    it.position.set(scene._width / 2, scene._height / 2);
    it.pivot.set(it.width / 2, it.height / 2);

    const textEffects = TextEffect4([it]);

    const maskEffects =
        anime
            .timeline({
                targets: scene.getChildByName('effectMask'),
                easing: 'easeOutCirc',
            })
            .add({
                alpha: 0.5,
                duration: 800,
            })
            .add({
                alpha: 0,
                duration: 600,
            })
            .finished;

    return Promise
        .all([textEffects, maskEffects])
        .then(() => scene.removeChild(it));
}

export function bigWinEffect(scene) {
    const sheet = app.resource.get('effect-text').spritesheet;

    const bigSprites = map(
        (char) => new Sprite(sheet.textures[`${char}.png`])
        , 'big');

    setFlex(bigSprites);

    const title1 = new Container();
    title1.addChild(...bigSprites);

    const winSprites = map(
        (char) => new Sprite(sheet.textures[`${char}.png`])
        , 'win');

    setFlex(winSprites);

    const title2 = new Container();
    title2.addChild(...winSprites);

    const it = new Container();
    it.addChild(title1, title2);

    scene.addChild(it);

    title1.pivot.set(title1.width / 2, title1.height / 2);
    title2.pivot.set(title2.width / 2, title2.height / 2);
    title1.position.set(title1.width / 2, title1.height / 2);
    title2.position.set(title2.width / 2, title2.height / 2);

    const {width, height} =
        [...bigSprites, ...winSprites]
            .reduce((a, b) => a.width > b.width ? a : b);

    setFlex(it.children);

    it.position.set(scene._width / 2, scene._height / 2 - height);
    it.pivot.set(it.width / 2, it.height / 2);

    title2.x += width / 2;

    const config = {
        alphaIn: [0, 1],
        alphaOut: 0,
        scaleIn: [0.2, 0.9],
        scaleOut: 3,
        durationIn: 800,
        durationOut: 600,
        delay: (el, i) => 350 * i,
    };

    const alphaIn =
        anime({
            targets: it.children,
            alpha: config.alphaIn,
            duration: config.durationIn,
            delay: config.delay,
        }).finished;

    const scaleIn =
        anime({
            targets: it.children.map(({scale}) => scale),
            x: config.scaleIn,
            y: config.scaleIn,
            duration: config.durationIn,
            delay: config.delay,
        }).finished;

    const maskIn =
        anime({
            targets: scene.getChildByName('effectMask'),
            alpha: 0.5,
            duration: config.durationIn,
            easing: 'easeOutCirc',
            delay: config.delay,
        }).finished;

    const numberEffect = numberIncrementEffect(scene, 1000);

    return Promise
        .all([alphaIn, scaleIn, maskIn])
        .then(() => {
            numberEffect.fadeIn();
            return numberEffect.numberAnim();
        })
        .then(() => coinEffect(scene))
        .then(() => {
            anime({
                targets: it.children,
                y: '-=' + height,
                alpha: config.alphaOut,
                duration: config.durationOut,
                easing: 'easeInExpo',
            });

            anime({
                targets: it.children.map(({scale}) => scale),
                x: config.scaleOut,
                y: config.scaleOut,
                easing: 'easeInExpo',
                duration: config.durationOut,
            });

            anime({
                targets: scene.getChildByName('effectMask'),
                alpha: 0,
                duration: config.durationOut,
                easing: 'easeOutCirc',
            });

            return numberEffect.fadeOut();
        })
        .then(() => scene.removeChild(it));
}

export function coinEffect(scene) {
    const it = new particles.ParticleContainer(10000, {
        vertices: true,
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true,
    });

    scene.addChildAt(it,
        scene.getChildIndex(
            scene.getChildByName('effectMask'),
        ) + 1,
    );

    const coins = times(Coin, 200);

    it.addChild(...coins);

    app.ticker.add(update);

    return wait(3000)
        .then(fadeOut)
        .then(reset);

    function fadeOut() {
        return anime({
            targets: it,
            alpha: 0,
            duration: 600,
            easing: 'easeInExpo',
        }).finished;
    }

    function reset() {
        app.ticker.remove(update);
        scene.removeChild(it);
    }

    function update() {
        coins.forEach(updateCoin);
    }

    function updateCoin(coin) {
        const direction = radianToDegree(coin.direction);
        const angle = 180 - (direction + 90);

        if (direction > 0 && direction < 180) {
            coin.x +=
                coin.speed * Math.sin(direction) / Math.sin(coin.speed);
        } else {
            coin.x -=
                coin.speed * Math.sin(direction) / Math.sin(coin.speed);
        }
        if (direction > 90 && direction < 270) {
            coin.y +=
                coin.speed * Math.sin(angle) / Math.sin(coin.speed);
        } else {
            coin.y -=
                coin.speed * Math.sin(angle) / Math.sin(coin.speed);
        }

        coin.direction -= coin.turningSpeed;
        return coin;
    }

    function Coin() {
        const spriteSheet = app.resource.get('coin').spritesheet;

        const it =
            new extras.AnimatedSprite(spriteSheet.animations['coin']);

        it.position.set(
            scene._width / 2, scene._height / 2,
        );

        it.anchor.set(0.5);

        it.scale.set(
            randomInt(25, 45) / 100,
        );

        it.rotation =
            random(pi * 2);

        it.direction =
            random(pi * 2);

        it.speed =
            randomInt(5, 10);

        it.turningSpeed = degreeToRadian(0.01);

        const startFrom =
            randomInt(it.totalFrames);

        it.animationSpeed = 0.6;

        it.gotoAndPlay(startFrom);

        return it;
    }
}

export function numberIncrementEffect(scene, num) {
    const number =
        new extras.BitmapText(currencyFormat(0), {
            font: '72px Effect',
        });

    const it = new Container();
    it.addChild(number);


    updatePos();

    const proxy = {
        get number() {
            return currencyValue(number.text);
        },
        set number(num) {
            number.text = currencyFormat(num);
            updatePos();
        },
        numberAnim,
        fadeIn,
        fadeOut,
    };

    const config = {
        alphaIn: [0, 1],
        alphaOut: 0,
        scaleIn: [0.2, 1],
        scaleOut: 3,
        durationIn: 800,
        durationOut: 600,
        delay: (el, i) => 350 * i,
    };

    return proxy;

    function numberAnim() {
        return anime({
            targets: proxy,
            number: num,
            easing: 'easeInOutQuart',
            delay: 850,
            duration: 3000,
        }).finished;
    }

    function fadeIn() {
        scene.addChild(it);

        anime({
            targets: number,
            alpha: config.alphaIn,
            duration: config.durationIn,
            delay: config.delay,
        });

        anime({
            targets: number.scale,
            x: config.scaleIn,
            y: config.scaleIn,
            duration: config.durationIn,
            delay: config.delay,
        });
    }

    function fadeOut() {
        anime({
            targets: it,
            alpha: config.alphaOut,
            easing: 'easeInExpo',
            duration: config.durationOut,
            delay: config.delay,
        });

        return anime({
            targets: it.scale,
            x: config.scaleOut,
            y: config.scaleOut,
            easing: 'easeInExpo',
            duration: config.durationOut,
            delay: config.delay,
            complete() {
                scene.removeChild(it);
            },
        }).finished;
    }

    function updatePos() {
        it.position.set(scene._width / 2, scene._height / 2 + it.height);
        it.pivot.set(it.width / 2, it.height / 2);
    }
}

function TextEffect4(targets) {
    const config = {
        alphaIn: [0, 1],
        alphaOut: 0,
        scaleIn: [0.2, 1],
        scaleOut: 3,
        durationIn: 800,
        durationOut: 600,
        delay: (el, i) => 350 * i,
    };

    const alpha =
        anime
            .timeline({targets})
            .add({
                alpha: config.alphaIn,
                duration: config.durationIn,
                delay: config.delay,
            })
            .add({
                alpha: config.alphaOut,
                easing: 'easeInExpo',
                duration: config.durationOut,
                delay: config.delay,
            })
            .finished;

    const scale =
        anime
            .timeline({
                targets: targets.map(({scale}) => scale),
            })
            .add({
                x: config.scaleIn,
                y: config.scaleIn,
                duration: config.durationIn,
                delay: config.delay,
            })
            .add({
                x: config.scaleOut,
                y: config.scaleOut,
                easing: 'easeInExpo',
                duration: config.durationOut,
                delay: config.delay,
            })
            .finished;

    return Promise.all([alpha, scale]);
}
