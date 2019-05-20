import {Clickable, ToggleButton} from '../components';

import {throttle} from 'lodash';

import {setDropShadow} from '../../plugin/filter';
import anime from 'animejs';

const {assign} = Object;

export function Main(parent) {
    const it = parent.getChildByName('main');

    Status(
        it.getChildByName('status'),
    );

    SpinButton(it);

    FunctionButton(it);

    AudioButton(
        it.getChildByName('audio'),
    );

    MenuButton(
        it.getChildByName('menu'),
        parent.getChildByName('menu'),
    );
}

function MenuButton(view, menu) {
    const it = Clickable(view);
    it.on('pointerdown', () => {
        menu.open();
        menu.visible = true;
    });
    return it;
}

function setBehaviour(it) {
    const anim = {
        duration: 350,
        easing: 'easeOutCubic',
    };
    const normal = {
        shadow: {
            distance: 12,
            alpha: 0.5,
        },
        hoverMask: {
            alpha: 0,
        },
        downMask: {
            alpha: 0,
        },
    };
    const hover = {
        shadow: {
            distance: 16,
            alpha: 0.3,
        },
        hoverMask: {
            alpha: 0.1,
        },
        downMask: {
            alpha: 0,
        },
    };

    const down = {
        downMask: {
            alpha: 0.3,
        },
    };

    const hoverMaskView = it.getChildByName('hover');
    const downMaskView = it.getChildByName('down');

    const shadow = setDropShadow(it, normal.shadow);

    it.on('pointerover', throttleFunc(onHover));

    it.on('pointerout', throttleFunc(onNormal));

    it.on('pointerdown', throttleFunc(onDown));

    it.on('pointerup', throttleFunc(onHover));

    return it;

    function throttleFunc(func) {
        return throttle(
            func, 350,
            {leading: true, trailing: false},
        );
    }

    function onNormal() {
        anime({
            targets: shadow,
            ...(anim),
            ...(normal.shadow),
        });
        anime({
            targets: hoverMaskView,
            ...(anim),
            ...(normal.hoverMask),
        });
        anime({
            targets: downMaskView,
            ...(anim),
            ...(normal.downMask),
        });
    }

    function onHover() {
        anime({
            targets: shadow,
            ...(anim),
            ...(hover.shadow),
        });
        anime({
            targets: hoverMaskView,
            ...(anim),
            ...(hover.hoverMask),
        });
        anime({
            targets: downMaskView,
            ...(anim),
            ...(hover.downMask),
        });
    }

    function onDown() {
        anime({
            targets: downMaskView,
            ...(anim),
            ...(down.downMask),
        });
        anime({
            targets: downMaskView.scale,
            x: [0.2, 1],
            y: [0.2, 1],
            ...(anim),
        });

        it.emit('Click');
    }
}

function FunctionButton(view) {
    const it = ToggleButton(view.getChildByName('function'));

    setBehaviour(it);

    return it;
}

function AudioButton(view) {
    const it = ToggleButton(view);
    const openView = it.getChildByName('open');

    it.on('Change', onChange);

    onChange(it.checked);

    return it;

    function onChange(checked) {
        openView.visible = checked;
    }
}

function SpinButton(view) {
    const it = Clickable(view.getChildByName('spin'));

    setBehaviour(it);

    it.on('Click', onClick);

    let flag = false;

    app.on('Idle', () => flag = false);

    return it;

    function onClick(evt) {
        if (!flag) {
            console.log('spin...');

            // flag = true;

            const bet = 10;
            app.service.getOneRound({bet})
                .then((result) => app.emit('GameResult', result));
        }
    }
}

function Status(view) {
    view.children
        .filter(({content}) => content !== undefined)
        .map((label) => setFontFamily(label, 'Candal'));
}

function setFontFamily({content}, fontFamily) {
    assign(content.style, {fontFamily});
}
