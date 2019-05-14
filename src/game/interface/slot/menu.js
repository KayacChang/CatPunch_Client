import {Button} from '../../components/common/Button';
import {NumberPad} from './components/NumberPad';

export function Menu(parent) {
    const menu = parent.getChildByName('menu');

    menu.exchange = Exchange(
        menu.getChildByName('exchange'),
    );

    Nav(menu);

    menu.open = open;
    menu.close = close(menu);

    return menu;

    function open() {
        menu.visible = true;
        menu.exchange.open();
    }
}

function Nav(menu) {
    const nav = menu.getChildByName('nav');

    BackButton(
        nav.getChildByName('back'),
        menu,
    );

    const navBtns =
        nav.children
            .filter(({name}) => name.includes('btn'))
            .map(NavButton);

    function NavButton(it) {
        const [, name] = it.name.split('@');

        it.icon =
            nav.getChildByName(`img@${name}`);

        it = Button(it);
        it.on('pointerdown', click);

        return it;

        function click() {
            // menu[name].open();
            navBtns.forEach((btn) =>
                (btn.name === it.name) ?
                    light(btn) : dark(btn),
            );
        }
    }

    function light(btn) {
        btn.alpha = 1;
        btn.icon.alpha = 1;
    }

    function dark(btn) {
        btn.alpha = 0.7;
        btn.icon.alpha = 0.7;
    }
}

function BackButton(btn, menu) {
    btn = Button(btn);
    btn.on('pointerdown', close(menu));
    return btn;
}

function close(it) {
    return () => {
        it.visible = false;
    };
}

function Section(it) {
    it.open = open;
    return it;

    function open() {
        it.visible = true;
    }
}

function Exchange(it) {
    it = Section(it);

    NumberPad(it);

    return it;
}
