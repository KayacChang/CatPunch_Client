import {Clickable} from '../components';

import {setDropShadow} from '../../plugin/filter';
import anime from 'animejs';

const {assign} = Object;

const user = {
    bet: 1.0,
    auto: 0,
    speed: '1x',
};

export function Main(parent) {
    const it = parent.getChildByName('main');

    Status(
        it.getChildByName('status'),
    );

    SpinButton(it);

    it.openMenu = function() {
        parent.menu.open();
    };

    Options(it);
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

    const menu = OptionMenu(
        view.getChildByName('optionMenu'),
    );
    menu.originScale = {
        x: menu.scale.x,
        y: menu.scale.y,
    };

    menu.scale.set(0);
    menu.position = btn.position;
    menu.interactive = true;

    setBehaviour(btn);

    btn.on('Click', () => setOptionMenu(true));

    return btn;

    function setOptionMenu(open) {
        const originPos = {
            x: btn.position.x,
            y: btn.position.y,
        };
        const location = view.getChildByName('pos@option');
        const openPos = {
            x: location.position.x,
            y: location.position.y,
        };

        anime({
            targets: menu.position,
            ...(open ? openPos : originPos),
            duration: 360,
            easing: open ? 'easeOutCirc' : 'easeOutCubic',
        });

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
                    setFontFamily(text, 'Candal');

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
        }

        function setSpeed() {
            const counts = [
                '1x', '2x', '3x',
            ];
            setOptionItems(counts, update);

            numbers.forEach((num) => refresh(num, user.speed));

            function update(value) {
                user.speed = value;
                console.log(`Speed: ${value}`);

                numbers.forEach((num) => refresh(num, value));
            }
        }

        function setAuto() {
            const counts = [
                0, 25, 100, 500, 1000,
            ];
            setOptionItems(counts, update);

            numbers.forEach((num) => refresh(num, user.auto));

            function update(value) {
                user.auto = value;
                console.log(`Auto: ${value}`);

                numbers.forEach((num) => refresh(num, value));
            }
        }

        async function setBet() {
            const bets = [
                1.0, 10.0, 20.0, 50.0, 100.0,
            ];
            setOptionItems(bets, update);

            numbers.forEach((num) => refresh(num, user.bet));

            function update(value) {
                user.bet = value;
                console.log(`Bet: ${value}`);

                numbers.forEach((num) => refresh(num, value));
            }
        }

        function refresh(num, value) {
            const enableFrame = num.getChildByName('enable');

            setScale(num.value === value, enableFrame);
        }

        async function setOptionItems(options, func) {
            const targets =
                options.map((option, index) =>
                    numbers.find(({name}) =>
                        name.split('@')[1] === index + ''),
                );

            btnsFunc =
                targets.map((num) => {
                    const index = num.name.split('@')[1];

                    num.value = options[index];

                    num.getChildByName('content')
                        .text = `${options[index]}`;

                    const enableFrame = num.getChildByName('enable');
                    enableFrame.originScale = {x: 1, y: 1};

                    return function onClick() {
                        func(options[index]);
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

                resetFunc();
            };
        }


        async function setAudio() {
            const audioFrame = frames[3];
            const disableFrame =
                menu.getChildByName('disable');
            disableFrame.originScale = {x: 1, y: 1};

            const closeIcon =
                icons.find(({name}) => name.includes('audio_close'));
            const openIcon =
                icons.find(({name}) => name.includes('audio_open'));

            app.sound.mute(true);

            await setScale(false, audioFrame, openIcon);
            setScale(true, disableFrame, closeIcon);

            btnsFunc[3] = async function() {
                app.sound.mute(false);
                await setScale(false, disableFrame, closeIcon);
                setScale(true, audioFrame, openIcon);
                resetFunc();
            };
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
        onClick({data});
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
    const it = Clickable(
        view.getChildByName('spin'),
    );

    setBehaviour(it);

    it.on('Click', onClick);

    let flag = false;

    app.on('Idle', () => flag = false);

    return it;

    function onClick(evt) {
        if (!flag) {
            console.log('spin...');

            // flag = true;

            const bet = 10;
            app.service.getOneRound({bet})
                .then((result) => app.emit('GameResult', result));
        }
    }
}

function Status(view) {
    view.children
        .filter(({content}) => content !== undefined)
        .map((label) => setFontFamily(label, 'Candal'));
}

function setFontFamily(it, fontFamily) {
    assign(it.content.style, {fontFamily});
    return it;
}
