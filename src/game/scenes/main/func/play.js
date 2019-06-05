import {spin} from './spin';
import {clone} from 'ramda';
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
            scene,
            slot.reels,
            result.normalGame,
        );

        app.user.lastWin = result.normalGame.scores;

        if (result.earnPoints !== energy.scale) {
            await energy.update(result.earnPoints);
        }

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

            await spin(
                scene, [slot.reels[1]],
                result.reSpinGame,
            );

            app.user.lastWin = result.reSpinGame.scores;
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

            slot.reelTables = freeGameTable;

            const freeGame = result.freeGame;
            for (const result of freeGame) {
                console.table(result);
                const multiply =
                    freeGame.indexOf(result) + 1;

                freeGameEffect(scene, multiply);

                slot.view.children
                    .filter(({name}) =>
                        name === 'FXReel_L' || name === 'FXReel_R')
                    .forEach(({anim}) => anim.visible = true);

                app.sound.play('maybeBonus');

                await spin(
                    scene,
                    slot.reels.filter(({reelIdx}) => reelIdx !== 1),
                    result,
                );

                app.user.lastWin = result.scores;
            }

            await energy.update(0);
        }

        slot.reelTables = normalTable;

        app.user.cash = result.cash;

        console.log('Round Complete...');
        app.emit('Idle');
    });
}
