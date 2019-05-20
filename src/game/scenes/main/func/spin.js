import anime from 'animejs';
import {wait} from '../../../../general/utils/time';
import {nth} from 'ramda';
import {floor, mod} from 'mathjs';

import {
    spinDuration,
    spinStopInterval,
    symbolConfig,
    maybeBonusFXDuration,
} from '../data';

import {Status} from '../components/slot';

import {setBevel, setGlow} from '../../../plugin/filter';

const maybeBonusIcon =
    symbolConfig.find(({maybeBonus}) => maybeBonus).id;

const emptyIcon = symbolConfig.length;

export async function spin(it, reels, result) {
    spinStart(it, reels);

    await wait(spinDuration);

    await spinStop(it, reels, result);

    await wait(500);

    await spinComplete(it, reels, result);
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
                .forEach(({anim}) => anim.visible = false);
        });

    for (const reel of reels) {
        reel.status = Status.Start;

        anime({
            targets: reel,
            axis: '+=' + 300,
            easing: 'easeInOutQuad',
            duration: 10000,
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

    async function stop(reel) {
        const index = reel.reelIdx;
        const results = reel.results;

        const position = positions[index];

        let resultPos = [2, 4];

        const reelTable =
            reel.reelTable.filter((num) => num !== 10);

        if (symbols[index] !== 10) {
            results[0].icon = symbols[index];
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

        let time = index * spinStopInterval;

        if (reel.reelIdx === 2 && isMaybeBonus()) {
            time += maybeBonusFXDuration;
        }

        await wait(time);
        reel.status = Status.Stop;

        await anime({
            targets: reel.results,
            pos: (el, index) => resultPos[index],
            easing: 'easeOutElastic(1, .3)',
            duration: 500,
            complete() {
                fxReels
                    .forEach((reel) => reel.visible = false);
                fxReels[2].visible =
                    (reel.reelIdx === 1 && isMaybeBonus());

                anime.remove(reel);

                reel.status = Status.Idle;
            },
        }).finished;

        reel.results
            .forEach((result) =>
                result.pos = floor(result.pos));
    }
}

async function spinComplete(it, reels, {hasLink, symbols}) {
    console.log('Spin Complete...');

    it.view.children
        .filter(({name}) => name.includes('FXReel'))
        .forEach(({anim}) => anim.visible = false);

    if (hasLink) {
        const mask = it.view.getChildByName('SlotBaseMask');

        anime({
            targets: mask,
            alpha: 0.3,
            easing: 'linear',
            duration: 500,
        });

        reels
            .forEach((reel) => {
                const symbolName =
                    getSymbolName(symbols[reel.reelIdx]);

                if (isNormalSymbol(symbolName)) {
                    normalEffect(reel);
                }

                if (isSpecialSymbol(symbolName)) {
                    specialEffect(it, reel, symbolName);
                }
            });

        await wait(1000);
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

    anim.visible = true;
    anim.gotoAndPlay(0);
}
