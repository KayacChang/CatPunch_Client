import anime from 'animejs';
import {wait} from '../../../../general/utils/time';
import {toAxis} from '../../../components/slot';
import {
    spinDuration,
    timeIntervalPerReel,
    symbolConfig,
    maybeBonusFXDuration,
} from '../data';

import * as filters from 'pixi-filters';

const maybeBonusIcon =
    symbolConfig.find(({maybeBonus}) => maybeBonus).id;

const emptyIcon = symbolConfig.length;

export async function spin(result) {
    const it = this;

    it.view.children
        .filter(({name}) => name.includes('Effect'))
        .forEach((effect) => {
            effect.children
                .forEach((anim) => anim.visible = false);
            effect.visible = false;
        });
    it.reels.forEach(({symbols}) =>
        symbols.forEach((symbol) => {
            symbol.view.visible = true;
            symbol.readyToChange = false;
        }));

    const mask = it.view.getChildByName('SlotBaseMask');

    anime({
        targets: mask,
        alpha: 0,
        easing: 'linear',
        duration: 500,
    });

    onSpinStart(it);

    await wait(spinDuration);

    await onSpinStop(it, result);

    await wait(500);

    return onSpinComplete(it, result);
}

function onSpinStart(it) {
    console.log('Spin Start...');

    const reels = it.reels;

    return anime({
        targets: reels,
        axis: '+=' + 300,
        easing: 'easeInOutQuad',
        duration: 10000,
        delay: anime.stagger(50, {easing: 'easeInCubic'}),
    });
}

function onSpinStop(it, result) {
    console.log('Spin Stop...');

    const reels = it.reels;

    const fxReelRight = it.view.getChildByName('FXReel_R');

    const thisRoundReelPos = result['indexOfEachWheel'];
    const thisRoundShowHand = result['enum_SymboTableForTable'];

    return Promise.all(reels.map(stop));

    function isMaybeBonus() {
        return (
            thisRoundShowHand[0] !== emptyIcon &&
            thisRoundShowHand[1] === maybeBonusIcon
        );
    }

    async function stop(reel) {
        const pos = thisRoundReelPos[reel.reelIdx];
        const icon = thisRoundShowHand[reel.reelIdx];

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

            if (symbol === undefined) debugger;

            symbol.icon = icon;
        }

        return anime({
            targets: reel,
            axis: targetAxis,
            easing: 'easeOutElastic(1, .2)',
            duration: 500,
            complete() {
                fxReelRight.visible = reel.reelIdx === 1 && isMaybeBonus();
            },
        }).finished;
    }
}

function GlowFilter(
    {
        distance = 10,
        outerStrength = 1,
        innerStrength = 2,
        color = 0xffffff,
    },
) {
    const filter = new filters.GlowFilter(
        distance,
        outerStrength,
        innerStrength,
        color,
    );

    return filter;
}

function onSpinComplete(it, result) {
    console.log('Spin Complete...');

    const mask = it.view.getChildByName('SlotBaseMask');

    anime({
        targets: mask,
        alpha: 0.3,
        easing: 'linear',
        duration: 500,
    });

    result['enum_SymboTableForTable']
        .forEach((symbol, idx) => {
            const symbolName = (symbol === emptyIcon) ?
                'empty' : symbolConfig.find(({id}) => id === symbol).name;

            console.log(symbolName);
            if (['bar01', 'bar02', 'bar03', 'seven01', 'seven02']
                .includes(symbolName)) {
                const displaySymbol =
                    it.reels[idx].symbols
                        .find((symbol) => symbol.displayPos === 2);

                anime({
                    targets: displaySymbol.view.scale,
                    x: [{value: 1.1, duration: 1000}],
                    y: [{value: 1.1, duration: 1000, delay: 120}],
                    easing: 'easeOutElastic(5, .2)',
                });

                const glow = GlowFilter({
                    distance: 15,
                    outerStrength: 1,
                    innerStrength: 5,
                    color: 0xFCFFA3,
                });

                const bevel = new filters.BevelFilter();

                displaySymbol.view.filters = [glow, bevel];

                displaySymbol.view.on('displayPosChange', function reset(pos) {
                    if (pos >= it.reels[idx].displayLength - 1) {
                        displaySymbol.view.filters = [];
                        displaySymbol.view.scale.set(1);

                        displaySymbol.view.off('displayPosChange', reset);
                    }
                });
            }

            if (['koi', 'neko', 'taiko_7', 'taiko_10'].includes(symbolName)) {
                it.reels[idx].symbols
                    .forEach((symbol) => symbol.view.visible = false);

                const effect =
                    it.view
                        .getChildByName(`Effect_${idx}`);

                effect.visible = true;

                const anim =
                    effect
                        .getChildByName(`anim@${symbolName}`);

                const bevel = new filters.BevelFilter();

                anim.filters = [bevel];

                anim.visible = true;
                anim.gotoAndPlay(0);
            }
        });
}
