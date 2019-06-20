import {spin} from './spin';
import {
    wait, clone, times, ceil,
} from '../../../../general';
import anime from 'animejs';
import {
    bigWinEffect,
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

        const normalWin = result.normalGame.scores;
        const reSpinWin = result.hasReSpin ? result.reSpinGame.scores : 0;
        const freeWin = result.hasFreeGame ?
            result.freeGame.reduce((a, b) => a.scores + b.scores) : 0;
        const totalWin = normalWin + reSpinWin + freeWin;

        await spin(
            scene,
            slot.reels,
            result.normalGame,
        );

        if (result.earnPoints !== energy.scale) {
            await energy.update(result.earnPoints);
        }

        if (result.normalGame.scores && !result.hasReSpin) {
            await showScores(normalWin);
            app.user.cash += normalWin;

            await showBigWinEffect(normalWin);
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

            await showScores(reSpinWin);
            app.user.cash += reSpinWin;

            await showBigWinEffect(reSpinWin);
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
            let totalScores = 0;
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

                totalScores += result.scores;
                if (result.scores) {
                    await showScores(result.scores);
                }
            }

            await showBigWinEffect(totalScores);

            await energy.update(0);
        }

        app.user.cash = result.cash;
        app.user.totalWin += totalWin;
        app.user.lastWin = totalWin;

        slot.reelTables = normalTable;

        betLock(energy.scale > 0);

        console.log('Round Complete...');
        app.emit('Idle');
    });

    function betLock(flag) {
        const menu = app.control.main.option.menu;

        const betButton = menu.btns[2];

        betButton.enable = !flag;
    }

    async function showScores(scores) {
        const odds = ceil(scores / app.user.betOptions[app.user.bet]);

        const coinEffect =
            slot.reels
                .map((reel) => {
                    const coins = times(Coin, odds);

                    const pos = coinPos[reel.reelIdx];

                    return playCoin(scene, pos, coins);
                });

        const effect =
            scoresEffect(scene, scores);

        await Promise.all([
            ...coinEffect, effect,
        ]);
    }

    async function showBigWinEffect(scores) {
        const odds = scores / app.user.betOptions[app.user.bet];

        if (odds <= 8) return;

        await bigWinEffect(scene, scores);
    }
}
