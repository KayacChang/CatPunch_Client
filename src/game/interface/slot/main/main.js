import {Clickable} from '../../components';

import {
    setDropShadow,
    setBlur, setColorMatrix,
} from '../../../plugin/filter';
import anime from 'animejs';
import {currencyFormat} from '../../../../general/utils';

import {Text, Container} from 'pixi.js';
import {pi} from 'mathjs';

const {assign} = Object;

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

    return btn;

    function setOptionMenu(open) {
        setScale(open, menu);
        setScale(!open, btnIcon);
        setScale(!open, btnFrame);
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

                view.spinButton
                    .auto.set(app.user.autoOptions[index]);

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

function setBehaviour(it) {
    const hoverMaskView = it.getChildByName('hover');
    const downMaskView = it.getChildByName('down');

    const shadow = setDropShadow(it, {
        distance: 6,
        alpha: 0.5,
        rotation: 90,
    });

    const anim = {
        duration: 350,
        easing: 'easeOutCubic',
    };
    const normal = {
        shadow: {
            distance: 6,
            alpha: 0.5,
        },
        hoverMask: {
            alpha: 0,
        },
        downMask: {
            alpha: 0,
        },
    };
    const hover = {
        shadow: {
            distance: 6,
            alpha: 0.3,
        },
        hoverMask: {
            alpha: 0.1,
        },
        downMask: {
            alpha: 0,
        },
    };

    it.on('Hover', onHover);

    it.on('Normal', onNormal);

    it.on('Click', ({data}) => {
        onClick({data});
    });

    it.on('Change', ({data, checked}) => {
        onClick({data, checked});
    });

    return it;

    function onNormal() {
        anime({
            targets: shadow,
            easing: 'easeInOutSine',
            duration: 100,
            ...(normal.shadow),
        });
        anime({
            targets: hoverMaskView,
            ...(anim),
            ...(normal.hoverMask),
        });
        anime({
            targets: downMaskView,
            alpha: 0,
            duration: 160,
            easing: 'easeOutSine',
        });
    }

    function onHover() {
        anime({
            targets: shadow,
            easing: 'easeInOutSine',
            duration: 100,
            ...(hover.shadow),
        });
        anime({
            targets: hoverMaskView,
            ...(anim),
            ...(hover.hoverMask),
        });
        anime({
            targets: downMaskView,
            alpha: 0,
            duration: 160,
            easing: 'easeOutSine',
        });
    }

    function onClick({data}) {
        const {x, y} = data.getLocalPosition(it);
        downMaskView.position.set(x, y);
        downMaskView.alpha = 0.3;
        anime({
            targets: downMaskView.scale,
            x: [0, 1.8],
            y: [0, 1.8],
            duration: 300,
            easing: 'easeOutQuad',
        });
        anime({
            targets: shadow,
            distance: 6,
            alpha: 0.5,
            duration: 100,
            easing: 'easeInOutSine',
        });
    }
}

function SpinButton(view) {
    let it = Clickable(
        view.getChildByName('spin'),
    );

    const block =
        view.getChildByName('block');

    const msg = defaultFont(
        new Text('insufficient funds to spin...'.toUpperCase()),
        {
            fontFamily: 'Candal',
            fontSize: 34,
            fill: '#ffc105',
            stroke: '#121212',
            strokeThickness: 5,
        },
    );

    const comp = new Container();
    comp.addChild(msg);
    comp.position.set(view.width / 2, view.height / 2 - msg.height);
    msg.alpha = 0;
    msg.pivot.set(comp.width / 2, comp.height / 2);
    view.addChild(comp);

    const color = setColorMatrix(it);

    setBehaviour(it);

    let isBlocking = false;
    let whenAnim = false;
    let count = 0;

    const countField =
        defaultFont(new Text(), {
            fontFamily: 'Candal',
            fontSize: 34,
            fill: '#FAFAFA',
            dropShadow: false,
        });
    it.addChildAt(
        countField,
        it.getChildIndex(
            it.getChildByName('hover'),
        ),
    );
    countField.anchor
        .set(0.5);
    countField.position
        .set(it._width / 2, it._height / 2);

    const auto = {
        get() {
            return count;
        },
        set(newCount) {
            count = newCount;
            countField.text = newCount;
        },
    };

    it = assign(it, {
        auto,
        checkState,
    });

    const img = it.getChildByName('normal');
    img.originScale = {
        x: img.scale.x,
        y: img.scale.y,
    };

    it.on('Click', onClick);

    app.on('Idle', checkState);

    return it;

    function checkState() {
        isBlocking = false;
        anime.remove(img);

        if (it.auto.get() > 0) {
            onClick();
            it.auto.set(it.auto.get() - 1);
        } else {
            countField.text = '';
            anime({
                targets: img,
                rotation: 0,
            });

            app.user.auto = 0;
        }

        if (app.user.cash <= 10) {
            color.saturate(-.9);
            isBlocking = true;
        } else {
            color.saturate(0);
        }
    }

    async function onClick() {
        if (isBlocking) {
            if (whenAnim) return;

            whenAnim = true;
            anime({
                targets: msg,
                alpha: 1,
                duration: 500,
                direction: 'alternate',
                easing: 'easeOutExpo',
            });

            anime({
                targets: block,
                alpha: 0.5,
                duration: 500,
                direction: 'alternate',
                easing: 'easeOutExpo',
                complete() {
                    whenAnim = false;
                },
            });

            return;
        }

        isBlocking = true;

        return play();
    }

    async function play() {
        img.scale.x -= 0.1;
        img.scale.y -= 0.1;
        anime({
            targets: img.scale,
            ...(img.originScale),
            easing: 'easeOutElastic(1, .5)',
            duration: 300,
        });

        anime({
            targets: img,
            rotation: '-=' + 2 * pi,
            loop: true,
            easing: 'linear',
            duration: 1000,
        });

        const result = await app.service.sendOneRound({
            bet: app.user.betOptions[app.user.bet],
        });

        app.emit('GameResult', result);
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

function defaultFont(text, config) {
    assign(text.style, {
        fontFamily: 'Arial',
        align: 'center',

        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,

        ...config,
    });

    return text;
}
