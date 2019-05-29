import {spin} from './spin';
import {clone, until} from 'ramda';
import {wait} from '../../../../general/utils';
import anime from 'animejs';
import {freeGameEffect, reSpinEffect} from '../components/effects';

export function play(scene) {
    const {
        slot, energy, neko, freeSpinIcon,
        normalTable, freeGameTable,
    } = scene;

    app.on('GameResult', async (result) => {
        console.log('Result =============');
        console.table(result);

        await spin(
            slot, slot.reels,
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
                slot, [slot.reels[1]],
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
                    slot, slot.reels.filter(({reelIdx}) => reelIdx !== 1),
                    result,
                );
            }
            await energy.update(0);
        }

        slot.reelTables = normalTable;

        console.log('Round Complete...');
        app.emit('Idle');
    });
}
