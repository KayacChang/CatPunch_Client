import {Clickable, defaultFont} from '../../components';
import {setDropShadow} from '../../../plugin/filter';
import {setBehaviour} from './button';
import anime from 'animejs';

function setScale(open, ...targets) {
    const tasks =
        targets.map((it) => {
            const state =
                open ? it.originScale : {x: 0, y: 0};

            return anime({
                targets: it.scale,
                ...(state),
                duration: 260,
                easing: 'easeOutExpo',
            }).finished;
        });

    return Promise.all(tasks);
}

export function Options(view) {
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
    setDropShadow(btnFrame, {
        distance: 6,
        alpha: 0.5,
        rotation: 90,
    });

    const menu = OptionMenu(
        view.getChildByName('optionMenu'),
    );
    menu.originScale = {
        x: menu.scale.x,
        y: menu.scale.y,
    };

    menu.scale.set(0);
    menu.interactive = true;

    setBehaviour(btn);

    btn.on('Click', () => setOptionMenu(true));

    menu.setOptionMenu = setOptionMenu;

    return {menu, btn};

    function setOptionMenu(open) {
        app.sound.play('option');

        setScale(open, menu);
        setScale(!open, btnIcon);
        setScale(!open, btnFrame);

        view.block.interactive = open;

        menu.checkState();

        view.updateStatus();
    }

    function OptionMenu(menu) {
        const btns =
            getChildren('btn')
                .map((it) => {
                    it = Clickable(it);
                    it = setBehaviour(it);
                    return it;
                });

        menu.btns = btns;

        let btnsFunc = [
            setSpeed,
            setAuto,
            setBet,
            setAudio,
            setExchange,
        ];

        let backFunc = setBack;

        const backBtn = Clickable(
            menu.getChildByName('back'),
        );

        setBehaviour(backBtn)
            .on('Click', () => backFunc());

        btns.forEach((btn) => {
            const index = btn.name.split('@')[1];
            btn.on('Click', () => btnsFunc[index]());
        });

        const numbers =
            getChildren('num')
                .map((num) => {
                    const text = num.getChildByName('content');
                    defaultFont(text.content, {fontFamily: 'Candal'});

                    num.originScale = {x: 1, y: 1};

                    return num;
                });

        const icons =
            getChildren('img')
                .filter(({name}) => !name.includes('back'))
                .map((icon) => {
                    const {x, y} = icon.scale;
                    icon.originScale = {x, y};

                    if (icon.name.includes('audio')) {
                        icon.originScale = {
                            x: icon.scale.x,
                            y: icon.scale.y,
                        };
                        if (icon.name.includes('close')) {
                            icon.scale.set(0);
                        }
                    }

                    return icon;
                });

        const frames =
            getChildren('frame')
                .map((frame) => {
                    const {x, y} = frame.scale;
                    frame.originScale = {x, y};

                    return frame;
                });

        menu.checkState = checkState;

        const hotKeys = app.user.betOptionsHotKey;
        const options = hotKeys.map((key) => app.user.betOptions[key]);

        let isItemsOpen = false;

        let currentOpen = undefined;

        return menu;

        function checkState() {
            btns.forEach((btn) => {
                const index = btn.name.split('@')[1];

                frames[index].alpha = btn.enable ? 1 : 0.3;

                icons[index].tint = btn.enable ? 0xFFFFFF : 0x7B7B7B;

                const num = numbers[index];

                if (currentOpen === 'bet') {
                    const flag = options[index] <= app.user.cash;

                    btn.enable = flag;

                    num.alpha = flag ? 1 : 0.3;
                } else if (currentOpen === undefined) {
                    num.alpha = 1;
                } else {
                    btn.enable = true;

                    num.alpha = 1;
                }
            });

            if (!isItemsOpen) setAudio(app.sound.mute());
        }

        function resetFunc() {
            btnsFunc = [
                setSpeed,
                setAuto,
                setBet,
                setAudio,
                setExchange,
            ];

            backFunc = setBack;

            setAudio(app.sound.mute());
        }

        function setSpeed() {
            currentOpen = 'speed';
            setOptionItems(
                app.user.speedOptions
                    .map((level) => (level) + 'x'),
                update,
            );

            refresh(app.user.speed);

            function update(index) {
                app.user.speed = index;

                refresh(app.user.speed);
            }
        }

        function setAuto() {
            currentOpen = 'auto';
            setOptionItems(
                app.user.autoOptions,
                update,
            );

            refresh(app.user.auto);

            function update(index) {
                app.user.auto = index;

                view.spinButton.auto
                    .set(app.user.autoOptions[index]);

                refresh(app.user.auto);
            }
        }

        async function setBet() {
            currentOpen = 'bet';

            setOptionItems(
                options, update,
            );

            refresh(hotKeys.indexOf(app.user.bet));

            function update(index) {
                app.user.bet = hotKeys[index];

                refresh(index);
            }
        }

        function refresh(index) {
            numbers.forEach((num) => {
                const enableFrame = num.getChildByName('enable');

                setScale(num.index === index, enableFrame);
            });
        }

        async function setOptionItems(options, func) {
            isItemsOpen = true;

            const btnState = btns.map(({enable}) => enable);
            btns.forEach((btn, index) => {
                const num = numbers[index];

                if (currentOpen === 'bet') {
                    const flag = options[index] <= app.user.cash;

                    btn.enable = flag;

                    num.alpha = flag ? 1 : 0.3;
                } else if (currentOpen === undefined) {
                    num.alpha = 1;
                } else {
                    btn.enable = true;

                    num.alpha = 1;
                }
            });

            const targets =
                options
                    .map((option, index) =>
                        numbers.find(({name}) =>
                            name.split('@')[1] === index + ''))
                    .filter(Boolean);

            btnsFunc =
                targets.map((num) => {
                    const index = Number(
                        num.name.split('@')[1],
                    );

                    num.index = index;

                    num.getChildByName('content')
                        .text = `${options[index]}`;

                    const enableFrame = num.getChildByName('enable');
                    enableFrame.originScale = {x: 1, y: 1};

                    return function onClick() {
                        func(index);

                        app.sound.play('click');
                    };
                });

            app.sound.play('option');

            await setIcons(false);
            setScale(true, ...targets);

            targets.forEach(({name}) => {
                const btn = btns[name.split('@')[1]];
                btn.scale.set(1);
            });

            backFunc = async function() {
                app.sound.play('option');
                await setScale(false, ...targets);
                setIcons(true);

                btns.forEach((btn, index) => {
                    btn.scale.set(1);
                    btn.enable = btnState[index];
                });

                resetFunc();
            };
        }


        function setAudio(isMute) {
            const audioFrame = frames[3];
            const disableFrame =
                frames.find(({name}) => name.includes('disable'));
            disableFrame.originScale = {x: 1, y: 1};

            const closeIcon =
                icons.find(({name}) => name.includes('audio_close'));
            const openIcon =
                icons.find(({name}) => name.includes('audio_open'));

            if (isMute !== undefined) {
                return (isMute) ? close() : open();
            }

            if (app.sound.mute()) {
                app.sound.mute(false);
                return open();
            } else {
                app.sound.mute(true);
                return close();
            }

            async function open() {
                await setScale(false, disableFrame, closeIcon);
                setScale(true, audioFrame, openIcon);
            }

            async function close() {
                await setScale(false, audioFrame, openIcon);
                setScale(true, disableFrame, closeIcon);
            }
        }


        function setBack() {
            currentOpen = undefined;
            isItemsOpen = false;
            setOptionMenu(false);
        }

        function setExchange() {
            view.openMenu('exchange');
            setOptionMenu(false);
        }

        function getChildren(keyword) {
            return menu.children
                .filter(({name}) => name.includes(keyword));
        }

        function setIcons(open) {
            return Promise.all([
                setScale(open, ...icons),
                setScale(open, ...frames),
                setScale(open, ...btns),
            ]);
        }
    }
}
