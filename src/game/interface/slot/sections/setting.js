import {Openable} from './openable';
import {Button, ToggleButton, RangeSlider} from '../../components';

import {range} from 'ramda';

export function Setting(setting) {
    setting = Openable(setting);

    Slider(setting, 'volume', {
        parts: 10,
        onchange: (level) => app.sound.volume(level),
    });

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

    Toggle(setting, 'effects');
    Toggle(setting, 'ambience');

    return setting;
}

function Toggle(setting, target) {
    const ball =
        setting.getChildByName(`ball@${target}`);

    const toggle = ToggleButton(
        setting.getChildByName(`frame@${target}`),
    );

    toggle.on('Change', update);

    update(toggle.checked);

    function update(checked) {
        app.sound
            .getBy(({name}) => name.includes(target))
            .forEach(({data}) => data.mute = checked);

        if (checked) {
            return ball.x = toggle.x + (toggle.width / 2);
        }
        return ball.x = toggle.x;
    }
}

function Slider(setting, target, {parts, onchange}) {
    const frame = Button(
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

    slider.onDragMove = () => {
        if (slider.getPos) {
            const {x} = slider.getPos();

            const level = condition(x);

            slider.x = frame.x + moveRange[level];

            onchange(level);
        }
    };

    function condition(x) {
        if (x <= 0) return 0;
        const level = moveRange.findIndex((range) => range > x);
        return (
            (level === 0) ? 0 :
                (level === -1) ? parts :
                    level - 1
        );
    }

    function click({data}) {
        const {x} = data.getLocalPosition(frame);

        const level = condition(x);

        slider.x = frame.x + moveRange[level];

        onchange(level);
    }
}


