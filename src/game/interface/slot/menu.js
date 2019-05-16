import {Button} from '../components/Button';
import {Exchange} from './sections/exchange';
import {Setting} from './sections/setting';
import {Openable} from './sections/openable';

const {entries} = Object;

export function Menu(parent) {
    const menu = Openable(
        parent.getChildByName('menu'),
    );

    const exchange = Exchange(
        menu.getChildByName('exchange'),
    );

    const setting = Setting(
        menu.getChildByName('setting'),
    );

    const sections =
        new Map(entries({exchange, setting}));

    Nav(menu, sections);

    return menu;
}

function Nav(menu, sections) {
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
            sections.forEach((section) => section.close());
            if (sections.has(name)) sections.get(name).open();

            navBtns.forEach((btn) =>
                btn.icon.alpha =
                    (btn.name === it.name) ?
                        0.9 : 0.5,
            );
        }
    }

    function BackButton(btn, menu) {
        btn = Button(btn);
        btn.on('pointerdown', () => menu.close());
        return btn;
    }
}


