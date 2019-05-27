import {Container, Sprite, extras} from 'pixi.js';

import {map} from 'ramda';

import anime from 'animejs';

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

    return Promise
        .all([textEffects])
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

    return Promise
        .all([textEffects])
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

    title1.scale.set(0.75);

    const winSprites = map(
        (char) => new Sprite(sheet.textures[`${char}.png`])
        , 'win');

    setFlex(winSprites);

    const title2 = new Container();
    title2.addChild(...winSprites);

    title2.scale.set(0.75);

    const it = new Container();
    it.addChild(title1, title2);

    scene.addChild(it);

    title1.pivot.set(title1.width / 2, title1.height / 2);
    title1.position.set(title1.width / 2, title1.height / 2);
    title2.pivot.set(title2.width / 2, title2.height / 2);
    title2.position.set(title2.width / 2, title2.height / 2);

    const {width} =
        [...bigSprites, ...winSprites]
            .reduce((a, b) => a.width > b.width ? a : b);

    setFlex(it.children, {padding: width * 0.75});

    it.position.set(scene._width / 2, scene._height / 2);
    it.pivot.set(it.width / 2, it.height / 2);

    const effects = TextEffect4(it.children);

    return Promise
        .all([effects])
        .then(() => scene.removeChild(it));
}

export function numberIncrement(scene, num) {
    const number =
        new extras.BitmapText('0123456789.', {
            font: '90px Effect',
        });

    const it = new Container();
    it.addChild(number);

    scene.addChild(it);

    it.position.set(scene._width / 2, scene._height / 2);
    it.pivot.set(it.width / 2, it.height / 2);

    window.number = {
        set text(str) {
            number.text = str;
            it.position.set(scene._width / 2, scene._height / 2);
            it.pivot.set(it.width / 2, it.height / 2);
        },
    };
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
