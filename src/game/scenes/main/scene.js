import {addPackage} from 'pixi_fairygui';

import {SlotMachine} from './components/slot';

import * as data from './data';
import {spin} from './func/spin';

import {EnergyBar} from './components/energy';

import {setBevel, setDropShadow} from '../../plugin/filter';
import {wait} from '../../../general/utils/time';
import {Neko} from './components/neko';
import {FreeSpinIcon} from './components/freespin';
import {freeGameEffect, reSpinEffect} from './components/effects';

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
            fx.anim.once('complete', function onComplete() {
                fx.anim.visible = false;
                fx.anim.off('complete', onComplete);
                resolve();
            }),
        );
    }
}

export function create({normalTable, freeGameTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = initSlotMachine(scene, normalTable);

    const energy = EnergyBar(slot.view.getChildByName('EnergyBar'));

    const freeSpinIcon =
        FreeSpinIcon(
            slot.view.getChildByName('icon@freespin'),
        );

    const neko = Neko(scene);

    window.respin = () => reSpinEffect(app.stage);

    app.on('GameResult', async (result) => {
        console.log('Result =============');
        console.table(result);

        await spin(
            slot,
            slot.reels,
            {hasLink: result.hasLink, ...result.baseGame},
        );

        await energy.update(result.earnPoints);

        if (energy.scale === 10) {
            freeSpinIcon.shock();
            await wait(2000);
            await neko.appear();
            await wait(1000);
            await neko.hit();
            freeSpinIcon.stop();
            const freeGameResults =
                result.freeGame.eachPositions
                    .map((positions, index) => {
                        const symbols =
                            result.freeGame.eachSymbols[index];

                        const hasLink =
                            result.freeGame.hasLinks[index];

                        const multiply =
                            result.freeGame.multiply[index];

                        return {positions, symbols, hasLink, multiply};
                    });

            for (const result of freeGameResults) {
                slot.setReelTables(freeGameTable);
                freeGameEffect(app.stage, result.multiply);
                slot.view.children
                    .filter(({name}) =>
                        name === 'FXReel_L' || name === 'FXReel_R')
                    .forEach(({anim}) => {
                        anim.visible = true;
                    });
                await spin(
                    slot,
                    slot.reels.filter(({reelIdx}) => reelIdx !== 1),
                    result,
                );
            }

            slot.setReelTables(normalTable);
            await energy.update(0);
        }

        console.log('Round Complete...');
        app.emit('Idle');
    });

    global.play = function(symbols) {
        const positions =
            normalTable.map((reel, index) => reel.indexOf(symbols[index]));

        app.service
            .getOneRound({bet: 10, baseGame: {positions, symbols}})
            .then((result) => app.emit('GameResult', result));
    };

    slot.view.once('Ready', () => app.emit('GameReady'));

    return scene;
}
