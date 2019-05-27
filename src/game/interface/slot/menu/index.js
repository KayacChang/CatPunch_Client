import {Clickable} from '../../components/Clickable';
import {Exchange} from './exchange';
import {Setting} from './setting';
import {Openable} from '../../components/Openable';
import anime from 'animejs';
import {Information} from './information';
import {leave} from '../../../../web/components/swal';

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

    const exchange = Exchange(menu);
    const setting = Setting(menu);
    const information = Information(menu);

    const sections =
        new Map(entries({
            exchange, setting, information,
        }));
    sections.forEach((section) => section.alpha = 0);

    const nav = Nav(menu, sections);
    nav.originPos = {
        x: nav.position.x,
        y: nav.position.y,
    };
    nav.y = 0;
    nav.alpha = 0;

    menu.section = setting;
    menu.open = open;
    menu.close = close;

    app.on('Idle', onIdle);

    return menu;

    function onIdle() {
        if (app.user.cash > 10) return;

        open('exchange');
    }

    async function open(name = 'setting') {
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

        if (name) menu.section = sections.get(name);
        await nav.updateState();
        menu.section.open();

        anime({
            targets: hr.scale,
            x: 1,
            duration: 300,
            easing: 'easeOutQuad',
        });
    }

    function close() {
        parent.main.updateStatus();
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

    nav.updateState = updateState;

    return nav;

    function updateState() {
        const target = menu.section.name;
        let targetBtn = undefined;

        navBtns.forEach((btn) => {
            const [, name] = btn.name.split('@');

            if (name === target) {
                btn.icon.alpha = 0.9;
                targetBtn = btn;
            } else {
                btn.icon.alpha = 0.5;
            }
        });

        return anime({
            targets: tab,
            y: targetBtn.y,
            duration: 300,
            easing: 'easeOutQuart',
        }).finished;
    }

    function NavButton(it) {
        const [, name] = it.name.split('@');

        it.icon =
            nav.getChildByName(`img@${name}`);

        it = Clickable(it);
        it.on('pointerdown', click);

        return it;

        async function click() {
            if (sections.has(name)) {
                const target = sections.get(name);
                if (menu.section === target) return;

                await menu.section.close();

                menu.section = target;

                if (name === 'exchange') {
                    if (app.user.cash > 0) await app.service.checkout();
                    await app.service.refresh();
                }

                updateState();
                return target.open();
            }

            if (name === 'home') {
                return leave();
            }
        }
    }

    function BackButton(btn, menu) {
        btn = Clickable(btn);
        btn.on('pointerdown', () => menu.close());
        return btn;
    }
}


