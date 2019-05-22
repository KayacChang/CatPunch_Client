import {Clickable} from '../components';

import {setDropShadow} from '../../plugin/filter';
import anime from 'animejs';

const {assign} = Object;

export function Main(parent) {
    const it = parent.getChildByName('main');

    Status(
        it.getChildByName('status'),
    );

    SpinButton(it);

    Options(it);
}

function Options(view) {
    const btn = Clickable(
        view.getChildByName('btn@option'),
    );
    const btnIcon = view.getChildByName('img@option');
    btnIcon.originScale = {
        x: btnIcon.scale.x,
        y: btnIcon.scale.y,
    };
    const btnFrame = view.getChildByName('frame@option');
    btnFrame.originScale = {
        x: btnFrame.scale.x,
        y: btnFrame.scale.y,
    };

    const menu = OptionMenu(
        view.getChildByName('optionMenu'),
    );
    menu.interactive = true;

    setBehaviour(btn);

    btn.on('click', () => setMenu(true));

    return btn;

    function setMenu(open) {
        const originPos = btn.position;
        const openPos =
            view.getChildByName('pos@option').position;

        const {x, y} = open ? openPos : originPos;

        const easing = open ? 'easeOutExpo' : 'easeOutCubic';

        anime({
            targets: menu.position,
            x, y,
            duration: 360,
            easing,
        });

        setScale(
            open ? {x: 0, y: 0} : btnIcon.originScale,
            btnIcon,
        );
        setScale(
            open ? {x: 0, y: 0} : btnFrame.originScale,
            btnFrame,
        );
        setScale(
            open ? {x: 1, y: 1} : {x: 0, y: 0},
            menu,
        );
    }

    function setScale({x, y}, ...targets) {
        anime({
            targets: targets.map(({scale}) => scale),
            x, y,
            duration: 360,
            easing: 'easeOutQuart',
        });
    }

    function OptionMenu(menu) {
        const btns = {};
        menu.children
            .filter(({name}) => name.includes('btn'))
            .forEach((it) => {
                Clickable(it);
                setBehaviour(it);

                const name = it.name.split('@')[1];
                btns[name] = it;
            });

        const numbers =
            menu.children
                .filter(({name}) => name.includes('num'));

        console.log(numbers);

        const icons =
            menu.children
                .filter(({name}) =>
                    name.includes('img') && !name.includes('back'));

        btns['back'].on('click', () => setMenu(false));

        btns['bet'].on('click', setBet);

        return menu;

        function setBet() {
            const bets = [
                1.0, 10.0, 20.0, 50.0, 100.0,
            ];

            numbers.forEach((num) => {
                const index = num.name.split('@')[1];

                console.log(index);
                num.text = bets[index];
            });

            setScale(
                {x: 1, y: 1}, ...numbers,
            );
            setScale(
                {x: 0, y: 0}, ...icons,
            );
        }
    }
}


// function MenuButton(view, menu) {
//     const it = Clickable(view);
//     it.on('pointerdown', () => {
//         menu.open();
//         menu.visible = true;
//     });
//     return it;
// }

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

// function AudioButton(view) {
//     const it = ToggleButton(view);
//     const openView = it.getChildByName('open');
//
//     it.on('Change', onChange);
//
//     onChange(it.checked);
//
//     return it;
//
//     function onChange(checked) {
//         openView.visible = checked;
//     }
// }

function SpinButton(view) {
    const it = Clickable(
        view.getChildByName('spin'),
    );

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
