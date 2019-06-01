import {Clickable, defaultFont} from '../../components';

import {
    setDropShadow,
    setBlur,
} from '../../../plugin/filter';
import anime from 'animejs';
import {currencyFormat} from '../../../../general/utils';
import {SpinButton} from './spinButton';
import {setBehaviour} from './button';

export function Main(parent) {
    const it = parent.getChildByName('main');

    const status = Status(
        it.getChildByName('status'),
    );

    it.spinButton = SpinButton(it);

    it.openMenu = function() {
        parent.menu.open();
    };

    Options(it);

    it.updateStatus = updateStatus;

    return it;

    function updateStatus() {
        status.children
            .filter(({name}) => name.includes('output'))
            .forEach((field) => {
                const [, name] = field.name.split('@');

                field.content.text =
                    (name === 'bet') ?
                        app.user.betOptions[app.user.bet] :
                        currencyFormat(app.user[name]);
            });

        it.spinButton.checkState();
    }
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

    const block =
        view.getChildByName('block');

    block.on('pointerdown', () => setOptionMenu(false));

    return btn;

    function setOptionMenu(open) {
        setScale(open, menu);
        setScale(!open, btnIcon);
        setScale(!open, btnFrame);

        block.interactive = open;
    }

    function setScale(open, ...targets) {
        const tasks =
            targets.map((it) => {
                const state =
                    open ? it.originScale : {x: 0, y: 0};

                return anime({
                    targets: it.scale,
                    ...(state),
                    duration: 360,
                    easing: 'easeOutExpo',
                }).finished;
            });

        return Promise.all(tasks);
    }

    function OptionMenu(menu) {
        const btns =
            getChildren('btn')
                .map((it) => {
                    Clickable(it);
                    setBehaviour(it);
                    return it;
                });

        let btnsFunc = [
            setSpeed,
            setAuto,
            setBet,
            setAudio,
            setMenu,
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

        setBlur(
            menu.getChildByName('blur'),
            {strength: 12, quality: 8, kernelSize: 15},
        );

        setAudio(app.sound.mute());

        return menu;

        function resetFunc() {
            btnsFunc = [
                setSpeed,
                setAuto,
                setBet,
                setAudio,
                setMenu,
            ];

            backFunc = setBack;

            setAudio(app.sound.mute());
        }

        function setSpeed() {
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
            setOptionItems(
                app.user.betOptions,
                update,
            );

            refresh(app.user.bet);

            function update(index) {
                app.user.bet = index;

                refresh(app.user.bet);
            }
        }

        function refresh(index) {
            numbers.forEach((num) => {
                const enableFrame = num.getChildByName('enable');

                setScale(num.index === index, enableFrame);
            });
        }

        async function setOptionItems(options, func) {
            const targets =
                options.map((option, index) =>
                    numbers.find(({name}) =>
                        name.split('@')[1] === index + ''),
                );

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
                    };
                });

            await setIcons(false);
            setScale(true, ...targets);

            targets.forEach(({name}) => {
                const btn = btns[name.split('@')[1]];
                btn.scale.set(1);
            });

            backFunc = async function() {
                await setScale(false, ...targets);
                setIcons(true);

                btns.forEach((btn) => btn.scale.set(1));

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
            setOptionMenu(false);
        }

        function setMenu() {
            view.openMenu();
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

function Status(view) {
    view.children
        .filter(({content}) => content !== undefined)
        .forEach((field) => {
            const [type, name] = field.name.split('@');

            if (type === 'label') {
                defaultFont(field.content, {fontFamily: 'Basic'});
            } else if (type === 'output') {
                defaultFont(field.content, {fontFamily: 'Candal'});

                field.content.text =
                    currencyFormat(app.user[name]);
            }
        });

    return view;
}
