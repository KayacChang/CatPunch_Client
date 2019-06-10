import anime from 'animejs';
import {degreeToRadian} from '../../../../general/utils';
import {setBevel, setColorMatrix, setOutline} from '../../../plugin/filter';

export function FreeSpinIcon(view) {
    let sound = undefined;

    const color = setColorMatrix(view);

    setBevel(view);
    setOutline(view);

    return {shock, stop};

    function stop() {
        sound.stop();

        color.brightness(1);

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
        sound = app.sound.play('freeSpinAlert');

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
            update(anim) {
                const value = 1 + (anim.progress / 100);
                color.brightness(value);
            },
        });
    }
}
