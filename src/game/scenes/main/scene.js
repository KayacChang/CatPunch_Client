import {addPackage} from 'pixi_fairygui';

import {SlotMachine} from './components/slot';

import * as data from './data';
import {spin} from './func/spin';

// import {Neko} from './components/neko';
import {EnergyBar} from './components/energy';

import {setBevel, setDropShadow} from '../../plugin/filter';
import {
    __,
    all,
    any,
    equals,
    filter,
    head,
    includes,
    range,
    reject,
} from 'ramda';

function initSlotMachine(scene, reelTables) {
    const slot =
        SlotMachine({
            view: scene.getChildByName('SlotMachine'),
            reelTables,
            ...data,
        });

    setBevel(slot.view, {thickness: 5});

    slot.reels
        .forEach((reel) =>
            setDropShadow(reel.view, {
                blur: 3.2,
                quality: 3,
                alpha: 0.58,
                distance: 15,
                rotation: [45, 90, 135][reel.reelIdx],
            }));


    const tasks =
        slot.view.children
            .map((target) => {
                if (target.name.includes('FXReel')) {
                    return whenAnimComplete(target);
                } else if (target.name.includes('Effect')) {
                    return target.children.map(whenAnimComplete);
                }
                return Promise.resolve();
            })
            .flat();

    Promise.all(tasks)
        .then(() => slot.view.emit('Ready'));

    return slot;

    function whenAnimComplete(fx) {
        fx.anim.gotoAndPlay(0);

        return new Promise((resolve) =>
            fx.anim.once('complete', resolve),
        ).then(() => {
            fx.anim.visible = false;
        });
    }
}

export function create({reelTables}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = initSlotMachine(scene, reelTables);

    const energy = EnergyBar(slot.view.getChildByName('EnergyBar'));

    // const neko = Neko(scene);

    app.on('GameResult', (result) => {
        console.log('Result =============');
        console.table(result);

        spin(slot, result)
            .then(() => energy.scale = result.earnPoints)
            .then(() => console.log('One Round Complete...'));
    });

    global.play = function(symbols) {
        const positions =
            reelTables.map((reel, index) => reel.indexOf(symbols[index]));
        const hasLink = checkHasLink(symbols);

        let earnPoints = energy.scale;

        if (hasBonusSymbol(symbols)) earnPoints += 1;

        app.emit('GameResult', {positions, symbols, hasLink, earnPoints});
    };

    slot.view.once('Ready', () => app.emit('GameReady'));

    return scene;
}

function hasBonusSymbol(symbols) {
    return symbols[1] === 1;
}

function checkHasLink(symbols) {
    const wildSet = range(0, 4 + 1);

    const isWild = includes(__, wildSet);
    const isEmpty = equals(10);

    if (any(isEmpty, symbols)) return false;

    if (filter(isWild, symbols).length >= 2) return true;

    if (filter(isWild, symbols).length >= 1) {
        const lastSymbol = reject(isWild, symbols);

        return all(equals(head(lastSymbol)), lastSymbol);
    }

    return all(equals(head(symbols)), symbols);
}
