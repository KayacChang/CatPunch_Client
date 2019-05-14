import {Button} from '../../components/common/Button';

const {assign, fromEntries} = Object;

export function Main(parent) {
    const it = parent.getChildByName('main');

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
    const it = Button(view);
    const openView = it.getChildByName('open');

    let flag = true;

    it.on('pointerdown', () => {
        flag = !flag;
        openView.visible = flag;
    });
    return it;
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
    it.on('pointerdown', () => console.log('spin...'));
    return it;
}

function Status(view) {
    view.children
        .filter(({content}) => content !== undefined)
        .map((label) => setFontFamily(label, 'Candal'));
}

function setFontFamily({content}, fontFamily) {
    assign(content.style, {
        fontFamily,
    });
}
