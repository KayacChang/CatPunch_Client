import anime from 'animejs';
import {wait} from '../../../general/utils/time';
import {toAxis} from '../../components/slot';
import {
    spinDuration,
    timeIntervalPerReel,
    symbolConfig,
    maybeBonusFXDuration,
} from './data';

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
        const preAxis = targetAxis - (reel.displayLength);

        anime.set(reel, {axis: preAxis});

        reel.symbols
            .find((symbol) => symbol.displayPos === 2)
            .icon = icon;

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

function onSpinComplete(it, result) {
    console.log('Spin Complete...');

    result['enum_SymboTableForTable']
        .forEach((symbol, idx) => {
            const symbolName =
                symbolConfig
                    .find(({id}) => id === symbol)
                    .name;

            if (['koi', 'neko'].includes(symbolName)) {
                console.log(symbolName);

                it.reels[idx].symbols
                    .forEach((symbol) => symbol.view.visible = false);

                const effect =
                    it.view
                        .getChildByName(`Effect_${idx}`);

                effect.visible = true;

                const anim =
                    effect
                        .getChildByName(`anim@${symbolName}`);

                anim.visible = true;
                anim.gotoAndPlay(0);
            } else if (['taiko_7', 'taiko_10'].includes(symbolName)) {
                console.log(symbolName);

                it.reels[idx].symbols
                    .forEach((symbol) => symbol.view.visible = false);

                const effect =
                    it.view
                        .getChildByName(`Effect_${idx}`);

                effect.visible = true;

                const anim =
                    effect
                        .getChildByName(`anim@${symbolName}`);

                anim.visible = true;
                anim.gotoAndPlay(0);
            }
        });
}
