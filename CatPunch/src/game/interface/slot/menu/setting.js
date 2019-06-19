import {Openable} from '../../components/Openable';
import {Clickable, ToggleButton, RangeSlider} from '../../components';

import anime from 'animejs';
import {rgbToHex} from '../../../../general';

export function Setting(menu) {
    const setting = Openable(
        menu.getChildByName('setting'),
    );

    setting.getChildByName('title')
        .text = translate(`common:setting.title`);

    setLabel(setting, 'audio');

    const effectSwitch =
        Toggle(setting, 'effects');

    const ambienceSwitch =
        Toggle(setting, 'ambience');

    effectSwitch.set(!app.sound.mute());
    ambienceSwitch.set(!app.sound.mute());

    const volumeRange = [
        0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
    ];
    const volume =
        Slider(setting, 'volume', {
            range: volumeRange,
            onchange: (level) => {
                app.sound.volume(volumeRange[level]);

                app.sound.mute(level === 0);
                effectSwitch.set(!app.sound.mute());
                ambienceSwitch.set(!app.sound.mute());
            },
        });

    setLabel(setting, 'spin');

    const auto =
        Slider(setting, 'auto', {
            range: app.user.autoOptions,
            onchange: (level) => app.user.auto = level,
        });

    const speed =
        Slider(setting, 'speed', {
            range: app.user.speedOptions,
            onchange: (level) => app.user.speed = level,
        });

    setLabel(setting, 'bet');

    const betLevel =
        Slider(setting, 'betLevel', {
            range: app.user.betOptions,
            onchange: (level) => app.user.bet = level,
        });

    setting.y -= 53;
    setting.open = open;
    setting.close = close;

    return setting;

    function open() {
        setting.visible = true;

        const soundLevel =
            app.sound.mute() === true ?
                0 : volumeRange.length - 1;
        volume.setLevel(soundLevel);

        speed.setLevel(app.user.speed);
        betLevel.setLevel(app.user.bet);
        auto.setLevel(app.user.auto);

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

function setLabel(setting, target) {
    setting.getChildByName(`label@${target}`)
        .text = translate(`common:setting.${target}`);
}

function Toggle(setting, target) {
    setLabel(setting, target);

    const ball =
        setting.getChildByName(`ball@${target}`);
    ball._color = '#FFFFFF';

    const toggle = ToggleButton(
        setting.getChildByName(`frame@${target}`),
    );

    toggle.on('Change', () => update(toggle.checked));

    update(toggle.checked);

    return {set};

    function set(checked) {
        toggle.checked = checked;
        update(toggle.checked);
    }

    function update(checked) {
        app.sound[target] = checked;

        const x = (checked) ?
            toggle.x + (toggle.width / 2) : toggle.x - 4;

        return anime({
            targets: ball,
            x,
            _color: (checked) ? '#FFFFFF' : '#999999',
            duration: 260,
            easing: 'easeOutQuad',
            update() {
                const [r, g, b] = ball._color.match(/\d+/g).map(Number);

                ball.tint =
                    parseInt(rgbToHex([r, g, b]).replace('#', '0x'), 16);
            },
        });
    }
}

function Slider(setting, target, {range, onchange}) {
    setLabel(setting, target);

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

    const valueBar =
        setting.getChildByName(`value@${target}`);

    const text =
        setting.getChildByName(`text@${target}`);
    text.pivot.x = text.width / 2;
    text.x = slider.x;


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
        text.x = slider.x;
        text.text = level;
        valueBar.width = moveRange[level];

        onchange(level);

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


