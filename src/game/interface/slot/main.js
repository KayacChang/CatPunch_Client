import {Button, ToggleButton} from '../components';

import {throttle} from 'lodash';

import {setDropShadow} from '../../plugin/filter';

const {assign, fromEntries} = Object;

export function Main(parent) {
    const it = parent.getChildByName('main');

    setDropShadow(it);

    Status(
        it.getChildByName('status'),
    );

    SpinButton(
        it.getChildByName('spin'),
    );

    FunctionMenu(
        it.getChildByName('function'),
    );

    AudioButton(
        it.getChildByName('audio'),
    );

    MenuButton(
        it.getChildByName('menu'),
        parent.getChildByName('menu'),
    );
}

function MenuButton(view, menu) {
    const it = Button(view);
    it.on('pointerdown', () => {
        menu.open();
        menu.visible = true;
    });
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

function FunctionMenu(view) {
    const positions =
        fromEntries(
            view.children
                .map(({name, position}) => {
                    const {x, y} = position;
                    return [name, {x, y}];
                }),
        );

    const buttons =
        view.children
            .map((child) => {
                const func = {
                    'back': BackButton,
                    'speed': SpeedButton,
                    'bet': BetButton,
                    'auto': AutoButton,
                    'function': FunctionButton,
                }[child.name];

                const btn = func && func(child);

                btn.position = positions['function'];

                return btn;
            });

    function BackButton(view) {
        const it = Button(view);
        it.on('pointerdown', () => {
            buttons.forEach((btn) => {
                btn.position = positions['function'];

                if (btn.name === 'function') {
                    btn.visible = true;
                }
            });
        });
        return it;
    }

    function SpeedButton(view) {
        const it = Button(view);
        it.on('pointerdown', () => console.log('speed'));
        return it;
    }

    function BetButton(view) {
        const it = Button(view);
        it.on('pointerdown', () => console.log('bet'));
        return it;
    }

    function AutoButton(view) {
        const it = Button(view);
        it.on('pointerdown', () => console.log('auto'));
        return it;
    }

    function FunctionButton(view) {
        const it = Button(view);
        it.on('pointerdown', () => {
            buttons.forEach((btn) => {
                const {x, y} = positions[btn.name];
                btn.position.set(x, y);
            });

            it.visible = false;
        });

        return it;
    }
}

function SpinButton(view) {
    const it = Button(view);

    let flag = false;

    it.on('pointerdown',
        throttle(
            onClick,
            100 * 4,
            {leading: true, trailing: false},
        ),
    );

    app.on('Idle', () => flag = false);

    return it;

    function onClick() {
        if (!flag) {
            console.log('spin...');

            flag = true;

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
