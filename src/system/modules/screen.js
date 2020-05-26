import {throttle, abs, select, isMobile} from '@kayac/utils';

import screenfull from 'screenfull';

export function isLandScape() {
    return matchMedia('all and (orientation:landscape)').matches;
}

export function enableFullScreenMask() {
    const icon = select('#icon');
    const mask = select('#mask');

    if (!isMobile.apple.device) {
        select('#screen-scroll').classList.add('hidden');

        const func = (el, className) =>
            isLandScape()
                ? el.classList.add(className)
                : el.classList.remove(className);

        func(icon, 'hidden');

        scrollTo(0, 0);

        window.addEventListener('orientationchange', () => {
            const func = (el, className) =>
                !isLandScape()
                    ? el.classList.add(className)
                    : el.classList.remove(className);

            func(icon, 'hidden');

            scrollTo(0, 0);
        });

        app.view.addEventListener('touchend', () => {
            if (screenfull.enabled) {
                screenfull.request();
            }
        });

        return;
    }

    icon.classList.remove('hidden');
    mask.classList.remove('hidden');

    window.addEventListener('resize', handle());
    window.addEventListener('orientationchange', handle());

    function handle() {
        return throttle(() => {
            const isMinimal = forApple();

            const func = (el, className) =>
                isMinimal && isLandScape()
                    ? el.classList.add(className)
                    : el.classList.remove(className);

            func(icon, 'hidden');
            func(mask, 'hidden');

            scrollTo(0, 0);
        }, 500);
    }

    function forApple() {
        const maxHeight = Math.max(
            document.documentElement.clientHeight,
            outerHeight,
        );
        return abs(maxHeight - innerHeight) <= 50;
    }
}

export function resize(app) {
    const size = {
        width: window.innerHeight * (16 / 9),
        height: window.innerHeight,
    };

    app.renderer.resize(size.width, size.height);

    app.stage.children.forEach((scene) => {
        const expect = {width: 1920, height: 1080};

        scene.scale.x = size.width / expect.width;
        scene.scale.y = size.height / expect.height;
    });
}
