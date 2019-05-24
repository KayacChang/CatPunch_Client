import {Openable} from '../../components/Openable';
import {Clickable, ToggleButton, RangeSlider} from '../../components';

import {range} from 'lodash';
import anime from 'animejs';

import {divide, round} from 'mathjs';
import {setColorMatrix} from '../../../plugin/filter';

export function Setting(setting) {
    setting = Openable(setting);

    const volume =
        Slider(setting, 'volume', {
            range: range(0, 1, 0.1),
            onchange: (level) => app.sound.volume(level),
        });

    const soundLevel =
        app.sound.mute() === true ?
            0 : app.sound.volume();

    volume.setLevel(soundLevel);

    Slider(setting, 'auto', {
        range: [0, 25, 100, 500, 1000],
        onchange: (level) => console.log(level),
    });

    Slider(setting, 'speed', {
        range: range(0, 3),
        onchange: (level) => console.log(level),
    });

    Slider(setting, 'betLevel', {
        range: [1.0, 10.0, 20.0, 50.0, 100.0],
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

function Slider(setting, target, {range, onchange}) {
    const frame = Clickable(
        setting.getChildByName(`frame@${target}`),
    );

    const parts = range.length - 1;
    const base = (frame.width / parts);
    const moveRange =
        range.map((level, index) => base * index);

    frame.on('pointerdown', click);

    const slider = RangeSlider(
        setting.getChildByName(`slider@${target}`),
        frame,
    );

    if (range) {
        const minLabel =
            setting
                .getChildByName(`label@${target}_min`);
        const maxLabel =
            setting
                .getChildByName(`label@${target}_max`);

        if (minLabel) minLabel.content.text = range[0];

        if (maxLabel) maxLabel.content.text = range[range.length - 1];
    }

    let level = 0;

    slider.onDragMove = () => {
        if (slider.getPos) {
            const {x} = slider.getPos();

            setLevel(condition(x));
        }
    };

    return {setLevel};

    function click({data}) {
        const {x} = data.getLocalPosition(frame);

        setLevel(condition(x));
    }

    function setLevel(value) {
        level = value;

        slider.x = frame.x + moveRange[level];

        onchange(range[level]);

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


