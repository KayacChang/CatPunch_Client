import anime from 'animejs';
import {
    wait, nth, floor, mod,
} from '../../../../general';

import {
    spinDuration,
    spinStopInterval,
    symbolConfig,
    maybeBonusFXDuration,
} from '../data';

import {Status} from '../components/slot';

import {setBevel, setGlow} from '../../../plugin/filter';
import {bubbleEffect} from '../components/effects';

const maybeBonusIcon =
    symbolConfig.find(({maybeBonus}) => maybeBonus).id;

const emptyIcon = symbolConfig.length;

export async function spin(scene, reels, result) {
    const {slot} = scene;

    spinStart(slot, reels);

    let time = spinDuration[app.user.speed];

    app.on('QuickStop', () => time = 0);

    while (time > 0) {
        await wait(100);
        time -= 100;
    }

    await spinStop(slot, reels, result);

    await wait(500);

    await spinComplete(scene, reels, result);
}

async function spinStart(it, reels) {
    console.log('Spin Start...');

    const mask = it.view.getChildByName('SlotBaseMask');
    anime({
        targets: mask,
        alpha: 0,
        easing: 'linear',
        duration: 500,
    });

    it.reels
        .forEach((reel) =>
            reel.results.forEach((result) =>
                result.visible = true));

    it.view
        .children
        .filter(({name}) => name.includes('Effect'))
        .forEach((effect) => {
            effect.visible = false;

            effect.children
                .filter(({name}) => name.includes('anim'))
                .forEach(({anim}) => {
                    anim.visible = false;
                    anim.filters = [];
                });
        });

    for (const reel of reels) {
        reel.status = Status.Start;

        anime({
            targets: reel,
            axis: '+=' + 300,
            easing: 'easeInOutQuad',
            duration: 6000,
        });

        await wait(120);
    }
}

function spinStop(it, reels, {positions, symbols}) {
    console.log('Spin Stop...');

    const fxReels =
        ['L', 'M', 'R'].map((pos) =>
            it.view.getChildByName(`FXReel_${pos}`).anim);

    return Promise.all(reels.map(stop));

    function isMaybeBonus() {
        return (
            symbols[0] !== emptyIcon &&
            symbols[1] === maybeBonusIcon
        );
    }

    async function stop(reel, index) {
        const results = reel.results;

        const position = positions[reel.reelIdx];

        let resultPos = [2, 4];

        const reelTable =
            reel.reelTable.filter((num) => num !== 10);

        if (symbols[reel.reelIdx] !== 10) {
            results[0].icon = symbols[reel.reelIdx];
            results[1].icon = nth(
                mod(position + 1, reelTable.length),
                reelTable,
            );
        } else {
            results[0].icon = nth(
                mod(position - 1, reelTable.length),
                reelTable,
            );
            results[1].icon = nth(
                mod(position + 1, reelTable.length),
                reelTable,
            );

            resultPos = [1, 3];
        }

        let time = index * spinStopInterval[app.user.speed];

        if (reel.reelIdx === 2 && isMaybeBonus()) {
            time += maybeBonusFXDuration;
        }

        results.forEach(({view}) => {
            view.filters = [];
            view.scale.set(1);
        });

        await wait(time);

        reel.status = Status.Stop;

        setTimeout(() =>
            app.sound.play('bounce'), 400);

        await anime({
            targets: reel.results,
            pos: (el, index) => resultPos[index],
            easing: 'easeOutElastic(1, .3)',
            duration: 500,
            complete() {
                fxReels
                    .forEach((reel) => reel.visible = false);

                const flag = (reel.reelIdx === 1 && isMaybeBonus());

                fxReels[2].visible = flag;

                if (flag) {
                    app.sound.play('maybeBonus', 1.5);
                }

                anime.remove(reel);

                reel.status = Status.Idle;
            },
        }).finished;

        reel.results
            .forEach((result) =>
                result.pos = floor(result.pos));
    }
}

async function spinComplete(scene, reels, {hasLink, symbols}) {
    console.log('Spin Complete...');
    app.sound.stop('maybeBonus');

    const {slot} = scene;

    slot.view.children
        .filter(({name}) => name.includes('FXReel'))
        .forEach(({anim}) => anim.visible = false);

    if (hasLink) {
        const mask = slot.view.getChildByName('SlotBaseMask');

        anime({
            targets: mask,
            alpha: 0.3,
            easing: 'linear',
            duration: 500,
        });

        let soundFlag = false;

        reels.map((reel) => {
            const symbolName =
                getSymbolName(symbols[reel.reelIdx]);

            if (isNormalSymbol(symbolName)) {
                normalEffect(reel);

                if (!soundFlag) {
                    app.sound.play('normal');
                    soundFlag = true;
                }
            }

            if (isSpecialSymbol(symbolName)) {
                specialEffect(slot, reel, symbolName);
            }
        });
    }

    const midReel =
        reels.find(({reelIdx}) => reelIdx === 1);

    if (midReel && getSymbolName(symbols[1]) === 'neko') {
        const symbol =
            midReel.results
                .find((symbol) => symbol.pos === 2)
                .view;

        anime({
            targets: symbol.scale,
            x: [
                {value: 1.1, duration: 1000},
                {value: 1, duration: 500},
            ],
            y: [
                {value: 1.1, duration: 1000, delay: 120},
                {value: 1, duration: 500},
            ],
            easing: 'easeOutElastic(5, .2)',
        });

        const glow =
            setGlow(symbol, {
                distance: 15,
                outerStrength: 0.1,
                innerStrength: 0.1,
                color: 0x0288D1,
            });

        anime({
            targets: glow,
            outerStrength: [0.1, 8],
            direction: 'alternate',
            duration: 750,
            complete() {
                symbol.filters = [];
            },
        });

        setBevel(symbol);

        app.sound.play('catAppear');
        app.sound.play('normal');

        await bubbleEffect(scene);
    }
}

function normalEffect(reel) {
    const symbol =
        reel.results
            .find((symbol) => symbol.pos === 2)
            .view;

    anime({
        targets: symbol.scale,
        x: [{value: 1.1, duration: 1000}],
        y: [{value: 1.1, duration: 1000, delay: 120}],
        easing: 'easeOutElastic(5, .2)',
    });

    setGlow(symbol, {
        distance: 15,
        outerStrength: 1,
        innerStrength: 5,
        color: 0xFCFFA3,
    });

    setBevel(symbol);
}

function specialEffect(it, reel, symbolName) {
    reel.results
        .find((symbol) => symbol.pos === 2)
        .visible = false;

    const effect =
        it.view.getChildByName(`Effect_${reel.reelIdx}`);

    effect.visible = true;

    const anim =
        effect.getChildByName(`anim@${symbolName}`).anim;

    setBevel(anim, {thickness: 1, lightAlpha: 0.4});


    if (symbolName === 'neko') {
        const glow =
            setGlow(anim, {
                distance: 15,
                outerStrength: 0.1,
                innerStrength: 0.1,
                color: 0x0288D1,
            });

        anime({
            targets: glow,
            outerStrength: [0.1, 8],
            direction: 'alternate',
            duration: 750,
            complete() {
                anim.filters = [];
            },
        });
    }

    anim.visible = true;
    anim.gotoAndPlay(0);
    app.sound.play(
        symbolName.replace(/@.*/, ''),
    );
}

function isNormalSymbol(name) {
    return name.includes('bar') || name.includes('seven');
}

function isSpecialSymbol(name) {
    return name.includes('koi') ||
        name.includes('neko') ||
        name.includes('taiko');
}

function getSymbolName(icon) {
    if (icon === emptyIcon) return 'empty';

    return symbolConfig
        .find(({id}) => id === icon)
        .name;
}
