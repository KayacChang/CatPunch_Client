import {spin} from './spin';
import {clone, times} from 'ramda';
import {wait} from '../../../../general/utils';
import anime from 'animejs';
import {
    freeGameEffect,
    reSpinEffect,
    scoresEffect,
} from '../components/effects';
import {Coin, playCoin} from '../components/coin';

export function play(scene) {
    const {
        slot, energy, neko, freeSpinIcon,
        normalTable, freeGameTable,
    } = scene;

    const coinPos =
        slot.view.children
            .filter(({name}) => name.includes('Coin'));

    app.on('GameResult', async (result) => {
        console.log('Result =============');
        console.table(result);

        await spin(
            scene,
            slot.reels,
            result.normalGame,
        );

        if (result.earnPoints !== energy.scale) {
            await energy.update(result.earnPoints);
        }

        if (result.normalGame.scores && !result.hasReSpin) {
            await showScores(result.normalGame.scores);
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

            slot.view
                .getChildByName('FXReel_M')
                .anim
                .visible = true;

            app.sound.play('maybeBonus');

            reSpinEffect(scene);

            await spin(
                scene, [slot.reels[1]],
                result.reSpinGame,
            );

            await showScores(result.reSpinGame.scores);
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

                if (result.scores) await showScores(result.scores);
            }

            await energy.update(0);
        }

        slot.reelTables = normalTable;

        app.user.cash = result.cash;

        betLock(result.earnPoints > 0);

        console.log('Round Complete...');
        app.emit('Idle');
    });

    function betLock(flag) {
        const {optionMenu} = app.control.main;

        const betButton =
            optionMenu.getChildByName('btn@2');
        betButton.interactive = !flag;

        const betFrame =
            optionMenu.getChildByName('frame@2');
        betFrame.alpha = flag ? 0.3 : 1;

        const betIcon =
            optionMenu.getChildByName('img@bet');
        betIcon.tint = flag ? 0x7B7B7B : 0xFFFFFF;
    }

    async function showScores(scores) {
        const coinEffect =
            slot.reels
                .map((reel) => {
                    const coins = times(Coin, scores);
                    const pos = coinPos[reel.reelIdx];

                    return playCoin(scene, pos, coins);
                });

        const effect =
            scoresEffect(scene, scores);

        await Promise.all([
            ...coinEffect, effect,
        ]);

        app.user.lastWin = scores;
    }
}
