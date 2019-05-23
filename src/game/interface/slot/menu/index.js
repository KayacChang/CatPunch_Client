import {Clickable} from '../../components/Clickable';
import {Exchange} from './exchange';
import {Setting} from './setting';
import {Openable} from '../../components/Openable';
import anime from 'animejs';

const {entries} = Object;

export function Menu(parent) {
    const menu = Openable(
        parent.getChildByName('menu'),
    );
    const background =
        menu.getChildByName('background');
    background.scale.set(0);

    const hr =
        menu.getChildByName('hr');
    hr.scale.x = 0;

    const exchange = Exchange(
        menu.getChildByName('exchange'),
    );

    const setting = Setting(
        menu.getChildByName('setting'),
    );

    const sections =
        new Map(entries({exchange, setting}));
    sections.forEach((section) => section.alpha = 0);

    const nav = Nav(menu, sections);
    nav.originPos = {
        x: nav.position.x,
        y: nav.position.y,
    };
    nav.y = 0;
    nav.alpha = 0;

    menu.section = exchange;
    menu.open = open;
    menu.close = close;

    return menu;

    async function open() {
        menu.visible = true;
        menu.alpha = 1;

        await anime.timeline()
            .add({
                targets: background.scale,
                x: 1, y: 1,
                duration: 500,
                easing: 'easeInOutExpo',
            })
            .add({
                targets: nav,
                alpha: 1,
                y: nav.originPos.y,
                duration: 320,
                easing: 'easeOutQuad',
            }).finished;

        menu.section.open();

        anime({
            targets: hr.scale,
            x: 1,
            duration: 300,
            easing: 'easeOutQuad',
        });
    }

    function close() {
        menu.section.close();

        anime({
            targets: hr.scale,
            x: 0,
            duration: 300,
            easing: 'easeOutQuart',
        });

        anime.timeline()
            .add({
                targets: nav,
                alpha: 0,
                y: 0,
                duration: 300,
                easing: 'easeOutQuart',
            })
            .add({
                targets: background.scale,
                x: 0, y: 0,
                duration: 500,
                easing: 'easeInOutExpo',
                complete() {
                    menu.visible = false;
                    menu.alpha = 0;
                },
            });
    }
}

function Nav(menu, sections) {
    const nav = menu.getChildByName('nav');

    BackButton(
        nav.getChildByName('back'),
        menu,
    );

    const tab = nav.getChildByName('tab');

    const navBtns =
        nav.children
            .filter(({name}) => name.includes('btn'))
            .map(NavButton);

    return nav;

    function NavButton(it) {
        const [, name] = it.name.split('@');

        it.icon =
            nav.getChildByName(`img@${name}`);

        it = Clickable(it);
        it.on('pointerdown', click);

        return it;

        async function click() {
            navBtns.forEach((btn) =>
                btn.icon.alpha =
                    (btn.name === it.name) ?
                        0.9 : 0.5,
            );

            anime({
                targets: tab,
                y: it.y,
                duration: 300,
                easing: 'easeOutQuart',
            });

            if (sections.has(name)) {
                const target = sections.get(name);
                if (menu.section === target) return;

                await menu.section.close();

                menu.section = target;
                target.open();
            }
        }
    }

    function BackButton(btn, menu) {
        btn = Clickable(btn);
        btn.on('pointerdown', () => menu.close());
        return btn;
    }
}


