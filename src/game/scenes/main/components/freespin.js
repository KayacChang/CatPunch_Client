import anime from 'animejs';
import {degreeToRadian} from '../../../../general/utils/logic';

export function FreeSpinIcon(view) {
    return {shock, stop};

    function stop() {
        anime.remove([view, view.scale]);
        anime({
            targets: view,
            rotation: degreeToRadian(0),
            easing: 'linear',
            duration: 85,
        });
        anime({
            targets: view.scale,
            x: 1, y: 1,
            easing: 'linear',
            duration: 85,
        });
    }

    function shock() {
        anime({
            targets: view,
            rotation: [-15, 15].map(degreeToRadian),
            easing: 'linear',
            direction: 'alternate',
            duration: 85,
            loop: true,
        });
        anime({
            targets: view.scale,
            x: [1, 1.2], y: [1, 1.2],
            easing: 'linear',
            direction: 'alternate',
            duration: 500,
            loop: true,
        });
    }
}