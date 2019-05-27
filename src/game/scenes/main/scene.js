import {addPackage} from 'pixi_fairygui';

import {SlotMachine} from './components/slot';

import * as data from './data';
import {spin} from './func/spin';

import {EnergyBar} from './components/energy';

import {setBevel, setDropShadow} from '../../plugin/filter';
import {wait} from '../../../general/utils/time';
import {Neko} from './components/neko';
import {FreeSpinIcon} from './components/freespin';
import {
    bigWinEffect,
    freeGameEffect, numberIncrement,
    reSpinEffect,
} from './components/effects';
import {MersenneTwister19937, Random} from 'random-js';
import {until, clone} from 'ramda';
import anime from 'animejs';

const random = new Random(
    MersenneTwister19937.autoSeed(),
);

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
            slot.view.getChildByName('Icon@freespin'),
        );

    const neko = Neko(scene);

    window.freeGame = () => freeGameEffect(scene, 5);
    window.respin = () => reSpinEffect(scene);
    window.bigwin = () => bigWinEffect(scene);
    window.number = () => numberIncrement(scene, 1000);

    app.on('GameResult', async (result) => {
        console.log('Result =============');
        console.table(result);

        await spin(
            slot,
            slot.reels,
            {hasLink: result.hasLink, ...result.baseGame},
        );

        await energy.update(result.earnPoints);

        if (result.hasReSpin) {
            const reSpinTable = clone(normalTable);

            reSpinTable[1] = [
                2, 4, 3, 2, 3,
                2, 3, 4, 2, 3,
                2, 2, 3, 2, 2,
                3, 4, 2, 3, 2,
            ];

            slot.reelTables = reSpinTable;
            await wait(1000);
            await neko.appear();
            await wait(1000);
            neko.hit();

            await wait(150);

            scene.y = 10;
            anime({
                targets: scene,
                y: 0,
                easing: 'easeOutElastic(10, .1)',
                duration: 750,
            });

            reSpinEffect(scene);

            const {positions, symbols} = clone(result.baseGame);

            positions[1] = until(
                (pos) => reSpinTable[1][pos] !== 10,
                () => random.integer(0, reSpinTable[1].length - 1),
            )(1);

            symbols[1] = result.reSpin.multiply;

            await spin(
                slot,
                [slot.reels[1]],
                {hasLink: true, positions, symbols},
            );
        }

        if (energy.scale === 10) {
            freeSpinIcon.shock();
            await wait(2000);
            await neko.appear();
            await wait(1000);
            neko.hit();

            await wait(150);

            scene.y = 10;
            anime({
                targets: scene,
                y: 0,
                easing: 'easeOutElastic(10, .1)',
                duration: 750,
            });

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
                slot.reelTables = freeGameTable;
                freeGameEffect(scene, result.multiply);
                slot.view.children
                    .filter(({name}) =>
                        name === 'FXReel_L' || name === 'FXReel_R')
                    .forEach(({anim}) => anim.visible = true);

                await spin(
                    slot,
                    slot.reels.filter(({reelIdx}) => reelIdx !== 1),
                    result,
                );
            }
            await energy.update(0);
        }

        slot.reelTables = normalTable;

        console.log('Round Complete...');
        app.emit('Idle');
    });

    global.play = function(symbols) {
        const positions =
            normalTable.map((reel, index) => reel.indexOf(symbols[index]));

        app.service
            .sendOneRound({bet: 10, baseGame: {positions, symbols}})
            .then((result) => app.emit('GameResult', result));
    };

    slot.view.once('Ready', () => app.emit('GameReady'));

    return scene;
}
