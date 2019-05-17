import {Container, Sprite, extras} from 'pixi.js';
import {setZoom} from '../../../plugin/filter';
import anime from 'animejs';

export function freeGameEffect(scene, multiply) {
    const sheet = app.resource.get('effect-text').spritesheet;
    const F = new Sprite(sheet.textures['f.png']);
    const R = new Sprite(sheet.textures['r.png']);
    const E_0 = new Sprite(sheet.textures['e.png']);
    const E_1 = new Sprite(sheet.textures['e.png']);
    const G = new Sprite(sheet.textures['g.png']);
    const A = new Sprite(sheet.textures['a.png']);
    const M = new Sprite(sheet.textures['m.png']);
    const E_2 = new Sprite(sheet.textures['e.png']);

    const top = new Container();

    [F, R, E_0, E_1, G, A, M, E_2]
        .map((sprite) => {
            sprite.scale.set(0.75);
            return sprite;
        })
        .reduce(function(pre, cur) {
            cur.x = pre.x + pre.width;
            return cur;
        });

    top.addChild(F, R, E_0, E_1, G, A, M, E_2);

    top.position.set(scene.width / 2, scene.height / 2 - F.height);
    top.pivot.set(top.width / 2, top.height / 2);

    const bottom = new Container();
    const X = new Sprite(sheet.textures['x.png']);

    const number =
        new extras.BitmapText(`${multiply}`, {font: '90px Effect'});
    number.y += number.height / 2;

    [X, number]
        .reduce(function(pre, cur) {
            cur.x = pre.x + pre.width;
            return cur;
        });

    bottom.addChild(X, number);

    bottom.position.set(scene.width / 2, scene.height / 2 + X.height / 2);
    bottom.pivot.set(bottom.width / 2, bottom.height / 2);

    scene.addChild(top, bottom);

    const zoom = setZoom(scene, {
        strength: 0.1,
        center: [scene.width / 2, scene.height / 2],
        innerRadius: 960,
    });

    anime.timeline()
        .add({
            targets: zoom,
            innerRadius: 750,
            easing: 'easeOutExpo',
            duration: 300,
        })
        .add({
            targets: zoom,
            innerRadius: 960,
            duration: 600,
            easing: 'easeInExpo',
            delay: 1000,
        })
        .finished.then(() => scene.filters = []);

    return Promise
        .all([top, bottom].map(textEffect4))
        .then(() => scene.removeChild(top, bottom));
}

export function reSpinEffect(scene) {
    const sheet = app.resource.get('effect-text').spritesheet;
    const R = new Sprite(sheet.textures['r.png']);
    const E = new Sprite(sheet.textures['e.png']);
    const S = new Sprite(sheet.textures['s.png']);
    const P = new Sprite(sheet.textures['p.png']);
    const I = new Sprite(sheet.textures['i.png']);
    const N = new Sprite(sheet.textures['n.png']);

    const text = [R, E, S, P, I, N];

    const comp = new Container();
    text
        .map((sprite) => {
            sprite.scale.set(0.75);
            return sprite;
        })
        .reduce(function(pre, cur) {
            cur.x = pre.x + pre.width;
            return cur;
        });

    comp.addChild(...text);

    comp.position.set(scene.width / 2, scene.height / 2);
    comp.pivot.set(comp.width / 2, comp.height / 2);

    scene.addChild(comp);

    const zoom = setZoom(scene, {
        strength: 0.1,
        center: [scene.width / 2, scene.height / 2],
        innerRadius: 960,
    });

    anime.timeline()
        .add({
            targets: zoom,
            innerRadius: 750,
            easing: 'easeOutExpo',
            duration: 300,
        })
        .add({
            targets: zoom,
            innerRadius: 960,
            duration: 600,
            easing: 'easeInExpo',
            delay: 1000,
        })
        .finished.then(() => scene.filters = []);

    return Promise
        .all([comp].map(textEffect4))
        .then(() => scene.removeChild(comp));
}

function textEffect4(target) {
    const config = {
        opacityIn: [0, 1],
        scaleIn: [0.2, 1],
        scaleOut: 3,
        durationIn: 800,
        durationOut: 600,
        delay: 500,
    };

    const alpha =
        anime.timeline()
            .add({
                targets: target,
                alpha: config.opacityIn,
                duration: config.durationIn,
            })
            .add({
                targets: target,
                alpha: 0,
                duration: config.durationOut,
                easing: 'easeInExpo',
                delay: config.delay,
            })
            .finished;
    const scale =
        anime.timeline()
            .add({
                targets: target.scale,
                x: config.scaleIn,
                y: config.scaleIn,
                duration: config.durationIn,
            })
            .add({
                targets: target.scale,
                x: config.scaleOut,
                y: config.scaleOut,
                duration: config.durationOut,
                easing: 'easeInExpo',
                delay: config.delay,
            })
            .finished;
    return Promise.all([alpha, scale]);
}
