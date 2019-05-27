import {Container, Sprite, extras} from 'pixi.js';

import {map} from 'ramda';

import anime from 'animejs';

function setFlex(elements) {
    return elements.reduce((pre, cur) => {
        cur.x = pre.x + pre.width;
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

    const textEffects = TextEffect4(it);

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

    const textEffects = TextEffect4(it);

    return Promise
        .all([textEffects])
        .then(() => scene.removeChild(it));
}

export function bigwinEffect(scene) {
    const sheet = app.resource.get('effect-text').spritesheet;

    const textSprites =
        map((char) => new Sprite(sheet.textures[`${char}.png`]),
            'bigwin');

    setFlex(textSprites);

    const title = new Container();
    title.addChild(...textSprites);
    title.scale.set(0.75);

    const it = new Container();
    it.addChild(title);

    scene.addChild(it);

    it.position.set(scene._width / 2, scene._height / 2);
    it.pivot.set(it.width / 2, it.height / 2);

    const textEffects = TextEffect4(it);

    return Promise
        .all([textEffects])
        .then(() => scene.removeChild(it));
}

function TextEffect4(target) {
    const config = {
        alphaIn: [0, 1],
        alphaOut: 0,
        scaleIn: [0.2, 1],
        scaleOut: 3,
        durationIn: 800,
        durationOut: 600,
        delay: 500,
    };

    const alpha =
        anime
            .timeline({
                targets: target,
            })
            .add({
                alpha: config.alphaIn,
                duration: config.durationIn,
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
                targets: target.scale,
            })
            .add({
                x: config.scaleIn,
                y: config.scaleIn,
                duration: config.durationIn,
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
