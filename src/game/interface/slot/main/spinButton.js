import {Clickable, defaultFont} from '../../components';
import {Container, Text} from 'pixi.js';
import {setColorMatrix} from '../../../plugin/filter';
import anime from 'animejs';
import {pi} from 'mathjs';
import {setBehaviour} from './button';

const {assign} = Object;

export function SpinButton(view) {
    let it = Clickable(
        view.getChildByName('spin'),
    );

    const block =
        view.getChildByName('block');

    const msg = defaultFont(
        new Text('insufficient funds to spin...'.toUpperCase()),
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

    const color = setColorMatrix(it);

    setBehaviour(it);

    let isBlocking = false;
    let isRunning = false;
    let whenAnim = false;
    let count = 0;

    const countField =
        defaultFont(new Text(), {
            fontFamily: 'Candal',
            fontSize: 48,
            fill: '#FAFAFA',
            dropShadow: false,
        });
    it.addChildAt(
        countField,
        it.getChildIndex(
            it.getChildByName('hover'),
        ),
    );
    countField.anchor
        .set(0.5);
    countField.position
        .set(it._width / 2, it._height / 2);

    const auto = {
        get() {
            return count;
        },
        set(newCount) {
            count = newCount;

            if (newCount === 0) return countField.text = '';

            countField.text = newCount;
        },
    };

    it = assign(it, {
        auto,
        checkState,
    });

    const circle = it.getChildByName('circle');
    const arrow = it.getChildByName('arrow');

    it.on('Click', onClick);

    app.on('Idle', checkState);

    return it;

    function checkState() {
        if (it.auto.get() > 0) {
            play();
            it.auto.set(it.auto.get() - 1);
        } else {
            anime.remove([circle, arrow]);

            anime({
                targets: circle,
                rotation: 0,
                alpha: 0,
            });

            anime({
                targets: arrow,
                rotation: 0,
                alpha: 1,

                complete() {
                    isRunning = false;
                    app.user.auto = 0;
                },
            });

            anime({
                targets: view,
                alpha: 1,
                easing: 'easeOutCubic',
                duration: 1000,
            });
        }

        if (app.user.cash <= 10) {
            color.saturate(-.9);
            isBlocking = true;
        } else {
            color.saturate(0);
            isBlocking = false;
        }
    }

    async function onClick() {
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

            return;
        }

        return play();
    }

    async function play() {
        if (!isRunning) {
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
                targets: arrow,
                alpha: 0,
            });

            anime({
                targets: circle,
                alpha: 1,
            });

            anime({
                targets: [circle, arrow],
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

            isRunning = true;

            app.sound.play('spin');
        }

        app.user.cash -= app.user.betOptions[app.user.bet];

        const result = await app.service.sendOneRound({
            bet: app.user.bet,
        });

        app.emit('GameResult', result);
    }
}
