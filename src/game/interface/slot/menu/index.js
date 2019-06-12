import {Clickable, Openable} from '../../components';
import {Exchange} from './exchange';
import {Setting} from './setting';
import anime from 'animejs';
import {Information} from './information';

const {entries} = Object;

export function Menu(parent) {
    const menu = Openable(
        parent.getChildByName('menu'),
    );
    menu.interactive = true;

    const background =
        menu.getChildByName('background');
    background.scale.set(0);

    const hr =
        menu.getChildByName('hr');
    hr.scale.x = 0;

    const navBackground =
        menu.getChildByName('nav@background');

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

    menu.open = openNav;
    menu.close = close;

    app.on('Idle', onIdle);

    return menu;

    function onIdle() {
        if (app.user.cash > 10) return;

        openNav('exchange');
    }

    async function openNav(section) {
        menu.visible = true;
        menu.alpha = 1;

        menu.section = undefined;
        nav.tab.alpha = 0;
        nav.btns.forEach((btn) => btn.icon.alpha = 0.5);

        await anime.timeline()
            .add({
                targets: navBackground,
                x: '-=' + navBackground.width,
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

        if (section) nav.open(sections.get(section));
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

        anime({
            targets: navBackground,
            x: '+=' + navBackground.width,
            duration: 500,
            easing: 'easeInOutExpo',
        });

        anime
            .timeline()
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

    const background =
        menu.getChildByName('background');

    const hr =
        menu.getChildByName('hr');

    BackButton(
        nav.getChildByName('back'),
        menu,
    );

    const tab = nav.getChildByName('tab');

    nav.tab = tab;

    const navBtns =
        nav.children
            .filter(({name}) => name.includes('btn'))
            .map(NavButton);
    nav.btns = navBtns;

    nav.updateState = updateState;

    nav.open = open;

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
            alpha: 0.9,
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
                if (menu.section) await menu.section.close();

                const target = sections.get(name);
                if (menu.section === target) return;

                return open(target);
            }

            if (name === 'home') {
                if (app.user.cash > 0) {
                    const {value} =
                        await app.alert.request(
                            {title: translate(`common:message.checkout`)},
                        );

                    if (!value) return;

                    const data = await app.service.checkout();

                    await app.alert.checkoutList(data);
                }
                return app.alert.leave();
            }
        }
    }

    async function open(section) {
        menu.section = section;
        updateState();

        if (background.scale.x < 1) {
            await anime.timeline()
                .add({
                    targets: background.scale,
                    x: 1, y: 1,
                    duration: 500,
                    easing: 'easeInOutExpo',
                })
                .add({
                    targets: hr.scale,
                    x: 1,
                    duration: 300,
                    easing: 'easeOutQuad',
                });
        }

        return section.open();
    }

    function BackButton(btn, menu) {
        btn = Clickable(btn);
        btn.on('pointerdown', () => menu.close());
        return btn;
    }
}


