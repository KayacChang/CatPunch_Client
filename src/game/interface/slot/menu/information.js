import {Clickable, Openable} from '../../components';
import anime from 'animejs';

import {abs, sign} from '../../../../general/utils';

export function Information(menu) {
    const information = Openable(
        menu.getChildByName('information'),
    );

    const pageTab = Pages([0, 1, 2, 3, 4, 5]);

    const tabs =
        information.children
            .filter(({name}) => name.includes('tab'))
            .map(Tab);

    information.children
        .filter(({name}) => name.includes('arrow'))
        .map(Arrow);

    const carousel = Carousel(
        information.getChildByName('carousel'),
    );

    update();

    information.open = open;
    information.close = close;

    return information;

    function open() {
        information.visible = true;
        return anime({
            targets: information,
            alpha: 1, y: 0,
            duration: 300,
            easing: 'easeOutQuad',
        }).finished;
    }

    function close() {
        return anime({
            targets: information,
            alpha: 0, y: '-=' + 53,
            duration: 300,
            easing: 'easeOutQuad',
            complete() {
                information.visible = false;
            },
        }).finished;
    }

    function fade(view, options) {
        return anime({
            targets: view,
            alpha: 1,
            duration: 150,
            easing: 'easeOutQuad',

            ...options,
        });
    }

    function Carousel(it) {
        const {width} = it.getChildByName('mask');

        const pages =
            it.children
                .filter(({name}) => name.includes('page'));

        const pagesPos =
            pages.map(({x, y}) => ({x, y}));

        it.interactive = true;

        it.buttonMode = true;

        let isBlock = false;
        let getScrollDistance = undefined;
        let px = 0;

        setControl(true);

        window.movePage = movePage;

        return {movePage};

        function setControl(flag) {
            if (flag) {
                it
                    .on('pointerdown', onScrollStart)
                    .on('pointerup', onScrollEnd)
                    .on('pointerupoutside', onScrollEnd)
                    .on('pointermove', onScrollMove);
            } else {
                it
                    .off('pointerdown', onScrollStart)
                    .off('pointerup', onScrollEnd)
                    .off('pointerupoutside', onScrollEnd)
                    .off('pointermove', onScrollMove);
            }
        }

        function round3(num) {
            return Math.round(num, 5);
        }

        function onScrollStart(event) {
            if (isBlock) return;

            const originPos = getPos(event);

            getScrollDistance = (event) => {
                const newPos = getPos(event);
                return {
                    x: round3(newPos.x - originPos.x),
                    y: round3(newPos.y - originPos.y),
                };
            };
        }

        function getPos(event) {
            return event.index.getLocalPosition(it);
        }

        async function onScrollEnd() {
            isBlock = true;

            setControl(false);

            await movePage(sign(px) * -1);

            pageTab.current += sign(px) * -1;
            update();

            getScrollDistance = undefined;
            px = 0;
            isBlock = false;

            setControl(true);
        }

        function onScrollMove(event) {
            if (!getScrollDistance || isBlock) return;

            const {x} = getPos(event);

            if (x < 0 || x > width) return;

            const diff = getScrollDistance(event);

            move(diff);
        }

        function move({x}) {
            if (abs(x) > width / 4) {
                isBlock = true;
                setControl(false);
                requestAnimationFrame(onScrollEnd);
            }

            const dx = x - px;

            pages.forEach((page) => page.x += dx);

            return px = x;
        }

        function movePage(movement, duration = 300) {
            const tasks =
                pagesPos.map((pos, index) => {
                    let pageIndex = index + movement;

                    if (pageIndex < 0) {
                        pageIndex = pagesPos.length + pageIndex;
                        return pages[pageIndex].x = pos.x;
                    } else if (pageIndex >= pagesPos.length) {
                        pageIndex = pageIndex % pagesPos.length;
                        return pages[pageIndex].x = pos.x;
                    }
                    return anime({
                        targets: pages[pageIndex],
                        x: pos.x,
                        duration,
                        easing: 'easeOutCubic',
                    }).finished;
                });

            return Promise.all(tasks).then(() => {
                pages.sort((pageA, pageB) => pageA.x - pageB.x);
            });
        }
    }

    function Pages(pages) {
        let current = 0;

        return {
            get current() {
                return current;
            },
            set current(value) {
                current =
                    (value < 0) ?
                        pages.length + value :
                        value % pages.length;
            },
        };
    }

    function Arrow(view) {
        view = Clickable(view);

        const [, func] = view.name.split('@');

        view.on('Click', Click);

        return view;

        function Click() {
            if (func === 'next') {
                pageTab.current += 1;
                carousel.movePage(1);
            } else if (func === 'prev') {
                pageTab.current -= 1;
                carousel.movePage(-1);
            }

            update();

            return fade(view, {direction: 'alternate'});
        }
    }

    function update() {
        tabs.forEach((tab, index) => {
            if (index === pageTab.current) {
                return fade(tab);
            }
            return fade(tab, {alpha: 0});
        });
    }

    function Tab(it, index) {
        it = Clickable(it);

        it.on('Click', Click);

        return it;

        async function move() {
            const movement = pageTab.current - index;

            for (let i = 0; i < abs(movement); i++) {
                const duration = 300 / Math.sqrt(abs(movement));

                await carousel.movePage(
                    sign(movement) * -1, duration,
                );
            }
        }

        async function Click() {
            move();

            pageTab.current = index;

            update();
        }
    }
}
