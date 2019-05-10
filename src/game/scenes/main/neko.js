import {wait} from '../../../general/utils/time';
import anime from 'animejs';


export function Neko(scene) {
    const neko = scene.getChildByName('anim@neko');

    const appearAnim = scene.getTransition('neko_appear');
    const disappearAnim = scene.getTransition('neko_disappear');

    neko.anim.loop = false;
    neko.visible = false;

    neko.anim.onComplete = async function() {
        await wait(500);
        neko.gotoAndStop(0);
    };

    return {appear, disappear, hit};

    function appear() {
        neko.visible = true;
        neko.gotoAndStop(0);

        appearAnim.play();
        return appearAnim.finished;
    }

    function disappear() {
        disappearAnim.play();
        return disappearAnim.finished;
    }

    function hit() {
        neko.play();

        neko.on('frameChange', (frameIdx) => {
            if (frameIdx !== 10) return;

            scene.y = 2;
            anime({
                targets: scene,
                y: 0,
                easing: 'easeOutElastic(10, .1)',
                duration: 750,
            });
            neko.emit('hitComplete');
        });

        return new Promise((resolve) =>
            neko.on('hitComplete', resolve));
    }
}
