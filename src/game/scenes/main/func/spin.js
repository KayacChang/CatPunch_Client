import anime from 'animejs';
import {wait} from '../../../../general/utils/time';
import {toAxis} from '../components/slot';
import {
    spinDuration,
    timeIntervalPerReel,
    symbolConfig,
    maybeBonusFXDuration,
} from '../data';

import {setBevel, setGlow} from '../../../plugin/filter';

const maybeBonusIcon =
    symbolConfig.find(({maybeBonus}) => maybeBonus).id;

const emptyIcon = symbolConfig.length;

export async function spin(it, result) {
    spinStart(it);

    await wait(spinDuration);

    await spinStop(it, result);

    await wait(500);

    return spinComplete(it, result);
}

function spinStart(it) {
    console.log('Spin Start...');
    it.view.emit('spinStart');

    return anime({
        targets: it.reels,
        axis: '+=' + 300,
        easing: 'easeInOutQuad',
        duration: 10000,
        delay: anime.stagger(50, {easing: 'easeInCubic'}),
    });
}

function spinStop(it, {positions, symbols}) {
    console.log('Spin Stop...');

    const reels = it.reels;
    const fxReelRight = it.view.getChildByName('FXReel_R').anim;

    return Promise.all(reels.map(stop));

    function isMaybeBonus() {
        return (
            symbols[0] !== emptyIcon &&
            symbols[1] === maybeBonusIcon
        );
    }

    async function stop(reel) {
        const pos = positions[reel.reelIdx];
        const icon = symbols[reel.reelIdx];

        let time = reel.reelIdx * timeIntervalPerReel;

        if (reel.reelIdx === 2 && isMaybeBonus()) {
            time += maybeBonusFXDuration;
        }

        await wait(time);

        anime.remove(reel);

        const targetAxis = toAxis(reel, pos);
        let preAxis = targetAxis - (reel.displayLength);

        preAxis =
            preAxis > 0 ? preAxis : reel.reelTable.length - preAxis;

        anime.set(reel, {axis: preAxis});

        if (icon !== emptyIcon) {
            const symbol =
                reel.symbols.find((symbol) => symbol.displayPos === 2);

            symbol.icon = icon;
        }

        return anime({
            targets: reel,
            //  @TODO Current Algorithm must be fix in future...
            axis: '+=' + (reel.displayLength),
            easing: 'easeOutElastic(1, .3)',
            duration: 500,
            complete() {
                fxReelRight.visible = reel.reelIdx === 1 && isMaybeBonus();

                const table = reel.symbols
                    .map(({icon, displayPos}) => {
                        const name = getSymbolName(icon);
                        return {displayPos, icon, name};
                    })
                    .sort((a, b) => a.displayPos - b.displayPos);

                console.table(table);

                reel.symbols
                    .forEach((symbol) => symbol.readyToChange = false);
            },
        }).finished;
    }
}

async function spinComplete(it, {hasLink, symbols}) {
    console.log('Spin Complete...');

    if (!hasLink) {
        await wait(500);
        return;
    }

    it.view.children
        .filter(({name}) => name.includes('FXReel'))
        .forEach(({anim}) => anim.visible = false);

    setEffectMask(it);

    symbols
        .forEach((iconId, idx) => {
            const symbolName = getSymbolName(iconId);

            const reel = it.reels[idx];

            if (isNormalSymbol(symbolName)) {
                normalEffect(reel);
            }

            if (isSpecialSymbol(symbolName)) {
                specialEffect(it, idx, symbolName);
            }
        });

    await wait(1500);
}

function setSymbolsVisiblePerReel({symbols}, flag) {
    symbols.forEach(({view}) => view.visible = flag);
}

function normalEffect(reel) {
    const symbol =
        getDisplaySymbol(reel).view;

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

    symbol.once('outside', () => {
        symbol.filters = [];
        symbol.scale.set(1);
    });
}

function isNormalSymbol(name) {
    return name.includes('bar') || name.includes('seven');
}

function isSpecialSymbol(name) {
    return name.includes('koi') ||
        name.includes('neko') ||
        name.includes('taiko');
}

function getDisplaySymbol(reel) {
    return reel.symbols.find(
        (symbol) => symbol.displayPos === 2);
}

function getSymbolName(icon) {
    if (icon === emptyIcon) return 'empty';

    return symbolConfig
        .find(({id}) => id === icon)
        .name;
}

function setEffectMask(it) {
    const mask = it.view.getChildByName('SlotBaseMask');

    anime({
        targets: mask,
        alpha: 0.3,
        easing: 'linear',
        duration: 500,
    });

    it.view.once('spinStart', () => {
        anime({
            targets: mask,
            alpha: 0,
            easing: 'linear',
            duration: 500,
        });
    });
}

function specialEffect(it, idx, symbolName) {
    setSymbolsVisiblePerReel(it.reels[idx], false);

    const effect =
        it.view.getChildByName(`Effect_${idx}`);

    effect.visible = true;

    const anim =
        effect.getChildByName(`anim@${symbolName}`).anim;

    setBevel(anim, {thickness: 1, lightAlpha: 0.4});

    anim.visible = true;
    anim.gotoAndPlay(0);

    it.view.once('spinStart', () => {
        setSymbolsVisiblePerReel(it.reels[idx], true);

        anim.visible = false;
        effect.visible = false;
    });
}
