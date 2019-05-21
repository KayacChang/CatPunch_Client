import {Clickable, ToggleButton} from '../components';

import {setDropShadow} from '../../plugin/filter';
import anime from 'animejs';

const {assign} = Object;

export function Main(parent) {
    const it = parent.getChildByName('main');

    Status(
        it.getChildByName('status'),
    );

    it.funcBtn = FunctionButton(it);

    SpinButton(it);

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
    const hoverMaskView = it.getChildByName('hover');
    const downMaskView = it.getChildByName('down');

    const shadow = setDropShadow(it, {
        distance: 6,
        alpha: 0.5,
        rotation: 90,
    });

    const anim = {
        duration: 350,
        easing: 'easeOutCubic',
    };
    const normal = {
        shadow: {
            distance: 6,
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
            distance: 6,
            alpha: 0.3,
        },
        hoverMask: {
            alpha: 0.1,
        },
        downMask: {
            alpha: 0,
        },
    };

    it.on('Hover', onHover);

    it.on('Normal', onNormal);

    it.on('Click', ({data}) => {
        onClick({data});
        it.emit('click');
    });

    it.on('Change', ({data, checked}) => {
        onClick({data});
        it.emit('change', {checked});
    });

    return it;

    function onNormal() {
        anime({
            targets: shadow,
            easing: 'easeInOutSine',
            duration: 100,
            ...(normal.shadow),
        });
        anime({
            targets: hoverMaskView,
            ...(anim),
            ...(normal.hoverMask),
        });
        anime({
            targets: downMaskView,
            alpha: 0,
            duration: 160,
            easing: 'easeOutSine',
        });
    }

    function onHover() {
        anime({
            targets: shadow,
            easing: 'easeInOutSine',
            duration: 100,
            ...(hover.shadow),
        });
        anime({
            targets: hoverMaskView,
            ...(anim),
            ...(hover.hoverMask),
        });
        anime({
            targets: downMaskView,
            alpha: 0,
            duration: 160,
            easing: 'easeOutSine',
        });
    }

    function onClick({data}) {
        const {x, y} = data.getLocalPosition(it);
        downMaskView.position.set(x, y);
        downMaskView.alpha = 0.3;
        anime({
            targets: downMaskView.scale,
            x: [0, 1.8],
            y: [0, 1.8],
            duration: 300,
            easing: 'easeOutQuad',
        });
        anime({
            targets: shadow,
            distance: 6,
            alpha: 0.5,
            duration: 100,
            easing: 'easeInOutSine',
        });
    }
}

function FunctionButton(view) {
    const it = ToggleButton(view.getChildByName('function'));

    setBehaviour(it);

    const btns =
        ['speed', 'bet', 'auto'].map(OptionButton);

    const settingIcon = it.getChildByName('img@setting');
    settingIcon.scale.set(0.4);

    const backIcon = it.getChildByName('img@back');
    backIcon.scale.set(0);

    it.on('change', onChange);

    return it;

    function openBtns(open) {
        btns
            .forEach((targets) => {
                const scale =
                    open ? {x: 1, y: 1} : {x: 0, y: 0};

                anime({
                    targets: targets.scale,
                    ...(scale),
                    easing: 'easeInQuart',
                    duration: 300,
                });
            });
    }

    function onChange({checked}) {
        openBtns(checked);

        anime({
            targets: backIcon.scale,
            ...(
                checked ? {x: 0.6, y: 0.6} : {x: 0, y: 0}
            ),
            easing: 'easeInQuart',
            duration: 300,
        });

        anime({
            targets: settingIcon.scale,
            ...(
                !checked ? {x: 0.4, y: 0.4} : {x: 0, y: 0}
            ),
            easing: 'easeInQuart',
            duration: 300,
        });
    }

    function OptionButton(key) {
        const btn =
            Clickable(view.getChildByName(key));

        setBehaviour(btn);

        const options =
            view.children
                .filter(({name}) => name.includes(`${key}@`))
                .map((it) => {
                    Clickable(it);
                    setBehaviour(it);
                    return it;
                });

        btn.scale.set(0);

        btn.on('click', onOptionOpen(open));

        return btn;

        function open(flag) {
            options
                .forEach((targets) => {
                    const scale =
                        flag ? {x: 1, y: 1} : {x: 0, y: 0};

                    anime({
                        targets: targets.scale,
                        ...(scale),
                        easing: 'easeInQuart',
                        duration: 300,
                    });
                });
        }
    }

    function onOptionOpen(func) {
        return function() {
            it.off('change', onChange);
            it.on('change', function _onChange() {
                func(false);
                openBtns(true);

                it.checked = true;
                it.off('change', _onChange);
                it.on('change', onChange);
            });

            func(true);

            openBtns(false);
        };
    }
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
    const it = Clickable(
        view.getChildByName('spin'),
    );

    setBehaviour(it);

    it.on('Click', onClick);

    let flag = false;

    app.on('Idle', () => flag = false);

    return it;

    function closeFuncBtn() {
        view.funcBtn.emit('change', {checked: false});
        view.funcBtn.emit('change', {checked: false});
        view.funcBtn.checked = false;
    }

    function onClick(evt) {
        if (!flag) {
            console.log('spin...');

            closeFuncBtn();

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
