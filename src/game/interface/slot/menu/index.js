import {Clickable} from '../../components/Clickable';
import {Exchange} from './exchange';
import {Setting} from './setting';
import {Openable} from '../../components/Openable';

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

        it = Clickable(it);
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
        btn = Clickable(btn);
        btn.on('pointerdown', () => menu.close());
        return btn;
    }
}


