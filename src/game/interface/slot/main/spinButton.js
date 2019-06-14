import {Clickable, defaultFont} from '../../components';
import {Container, Text} from 'pixi.js';
import anime from 'animejs';
import {setBehaviour} from './button';

import {pi, clone} from '../../../../general';

const {assign} = Object;

export function SpinButton(view) {
    let it = Clickable(
        view.getChildByName('spin'),
    );

    const img = it.getChildByName('frame');

    const block =
        view.getChildByName('block');

    const msg = defaultFont(
        new Text(translate('common:message.insufficientBalance')),
        {
            fontFamily: 'Candal',
            fontSize: 48,
            fill: '#ffc105',
            stroke: '#121212',
            strokeThickness: 5,
        },
    );

    const comp = new Container();
    comp.addChild(msg);
    comp.position.set(view.width / 2, view.height / 2 - msg.height);
    msg.alpha = 0;
    msg.pivot.set(comp.width / 2, comp.height / 2);
    view.addChild(comp);

    setBehaviour(it);

    let isBlocking = false;
    let isRunning = false;
    let isAuto = false;
    let isQuickStop = false;
    let whenAnim = false;
    let count = 0;
    let speed = app.user.speed;

    const countField =
        defaultFont(new Text(), {
            fontFamily: 'Candal',
            fontSize: 48,
            fill: '#FAFAFA',
        });
    it.addChildAt(
        countField,
        it.getChildIndex(
            it.getChildByName('hover'),
        ),
    );

    countField.anchor.set(.5);

    countField.pivot
        .set(countField.width / 2, countField.height / 2);

    countField.position
        .set(it.width / 2, it.height / 2);

    const auto = {
        get() {
            return count;
        },
        set(newCount) {
            count = newCount;

            if (newCount === 0) {
                countField.text = '';

                isAuto = false;

                return;
            }

            countField.text = newCount;

            isAuto = true;
        },
    };

    it = assign(it, {
        auto,
        checkState,
    });

    const arrow = it.getChildByName('arrow');
    const arrowScale = clone(arrow.scale);

    const square = it.getChildByName('square');

    it.on('Click', onClick);

    app.on('Idle', checkState);

    return it;

    function checkState() {
        if (it.auto.get() > 0 && isAuto) {
            isRunning = false;
            play();
            it.auto.set(it.auto.get() - 1);
        } else {
            anime.remove(arrow);

            anime({
                targets: square.scale,
                x: 0, y: 0,
            });

            anime({
                targets: arrow.scale,
                x: arrowScale.x,
                y: arrowScale.y,
            });

            anime({
                targets: arrow,
                rotation: 0,
                alpha: 1,

                complete() {
                    view.menuBtn.interactive = true;
                    view.option.btn.interactive = true;

                    isRunning = false;
                    isQuickStop = false;

                    app.user.speed = speed;
                },
            });

            anime({
                targets: view,
                alpha: 1,
                easing: 'easeOutCubic',
                duration: 1000,
            });
        }

        if (cashLessThanBet()) {
            img.tint = 0x999999;
            isBlocking = true;

            it.auto.set(0);
        } else {
            img.tint = 0xFFFFFF;
            isBlocking = false;
        }
    }

    function cashLessThanBet() {
        return app.user.cash < app.user.betOptions[app.user.bet];
    }

    function onClick() {
        if (isBlocking) {
            if (whenAnim) return;

            whenAnim = true;
            anime({
                targets: msg,
                alpha: 1,
                duration: 500,
                direction: 'alternate',
                easing: 'easeOutExpo',
            });

            anime({
                targets: block,
                alpha: 0.5,
                duration: 500,
                direction: 'alternate',
                easing: 'easeOutExpo',
                complete() {
                    whenAnim = false;
                },
            });

            app.sound.play('cancel');

            return;
        }

        if (isRunning) {
            app.user.auto = 0;
            it.auto.set(0);

            const max = app.user.speedOptions.length - 1;
            app.user.speed = max;

            if (!isQuickStop) {
                isQuickStop = true;

                setTimeout(() => app.emit('QuickStop'), 250);
            }

            return;
        }

        return play();
    }

    function play() {
        if (isRunning) return;

        it.scale.x -= 0.1;
        it.scale.y -= 0.1;

        anime({
            targets: it.scale,
            x: 1,
            y: 1,
            easing: 'easeOutElastic(1, .5)',
            duration: 300,
        });

        anime({
            targets: square.scale,
            x: 1, y: 1,
        });

        anime({
            targets: arrow.scale,
            x: 0, y: 0,
        });

        anime({
            targets: arrow,
            alpha: 0,
        });

        anime({
            targets: arrow,
            rotation: '-=' + 2 * pi,
            loop: true,
            easing: 'linear',
            duration: 1000,
        });

        anime({
            targets: view,
            alpha: 0.6,
            easing: 'easeOutCubic',
            duration: 1000,
        });

        app.sound.play('spin');

        app.user.cash -= app.user.betOptions[app.user.bet];
        app.user.lastWin = 0;

        speed = app.user.speed;
        view.menuBtn.interactive = false;
        view.option.btn.interactive = false;

        isRunning = true;

        app.service
            .sendOneRound({bet: app.user.bet})
            .then((result) => app.emit('GameResult', result));
    }
}
