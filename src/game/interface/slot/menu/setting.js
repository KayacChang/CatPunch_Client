import {Openable} from '../../components/Openable';
import {Clickable, ToggleButton, RangeSlider} from '../../components';

import {range} from 'ramda';
import anime from 'animejs';

import {divide, multiply, round} from 'mathjs';
import {setColorMatrix} from '../../../plugin/filter';

export function Setting(setting) {
    setting = Openable(setting);

    const volume =
        Slider(setting, 'volume', {
            parts: 10,
            onchange: (level) => app.sound.volume(divide(level, 10)),
        });

    const soundLevel =
        app.sound.mute() === true ?
            0 : multiply(app.sound.volume(), 10);

    volume.setLevel(soundLevel);

    Slider(setting, 'auto', {
        parts: 10,
        onchange: (level) => console.log(level),
    });

    Slider(setting, 'speed', {
        parts: 10,
        onchange: (level) => console.log(level),
    });

    Slider(setting, 'betLevel', {
        parts: 10,
        onchange: (level) => console.log(level),
    });

    const effectSwitch =
        Toggle(setting, 'effects');
    effectSwitch.set(app.sound.mute());

    const ambienceSwitch =
        Toggle(setting, 'ambience');
    ambienceSwitch.set(app.sound.mute());


    setting.y -= 53;
    setting.open = open;
    setting.close = close;

    return setting;

    function open() {
        setting.visible = true;
        return anime({
            targets: setting,
            alpha: 1, y: 0,
            duration: 300,
            easing: 'easeOutQuad',
        }).finished;
    }

    function close() {
        return anime({
            targets: setting,
            alpha: 0, y: '-=' + 53,
            duration: 300,
            easing: 'easeOutQuad',
            complete() {
                setting.visible = false;
            },
        }).finished;
    }
}

function Toggle(setting, target) {
    const ball =
        setting.getChildByName(`ball@${target}`);

    const color = setColorMatrix(ball);
    color.saturate(-1);

    const toggle = ToggleButton(
        setting.getChildByName(`frame@${target}`),
    );

    toggle.on('Change', update);

    update(toggle.checked);

    return {set};

    function set(checked) {
        toggle.checked = checked;
        update(toggle.checked);
    }

    function update({checked}) {
        app.sound
            .getBy(({name}) => name.includes(target))
            .forEach(({data}) => data.mute = checked);

        const x = (checked) ?
            toggle.x + (toggle.width / 2) : toggle.x - 4;

        return anime({
            targets: ball,
            x,
            duration: 300,
            easing: 'easeOutQuad',
            update(anim) {
                const progress = divide(round(anim.progress), 100);
                const rate = (checked) ?
                    1 - progress : 0 - progress;
                color.saturate(rate);
            },
        });
    }
}

function Slider(setting, target, {parts, onchange}) {
    const frame = Clickable(
        setting.getChildByName(`frame@${target}`),
    );

    const base = (frame.width / parts);
    const moveRange =
        range(0, parts + 1).map((level) => base * level);

    frame.on('pointerdown', click);

    const slider = RangeSlider(
        setting.getChildByName(`slider@${target}`),
        frame,
    );

    let level = 0;

    slider.onDragMove = () => {
        if (slider.getPos) {
            const {x} = slider.getPos();

            setLevel(condition(x));

            onchange(level);
        }
    };

    return {setLevel};

    function click({data}) {
        const {x} = data.getLocalPosition(frame);

        setLevel(condition(x));

        onchange(level);
    }

    function setLevel(value) {
        level = value;

        slider.x = frame.x + moveRange[level];

        return level;
    }

    function condition(x) {
        if (x <= 0) return 0;
        const level = moveRange.findIndex((range) => range > x);
        return (
            (level === 0) ? 0 :
                (level === -1) ? parts :
                    level - 1
        );
    }
}


