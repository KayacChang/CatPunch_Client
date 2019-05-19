import {wait} from '../../../../general/utils/time';

export function Neko(scene) {
    const neko = scene.getChildByName('anim@neko');

    const appearAnim = scene.getTransition('neko_appear');
    const disappearAnim = scene.getTransition('neko_disappear');

    neko.anim.loop = false;
    neko.visible = false;

    neko.anim.on('complete', async () => {
        await wait(500);
        neko.anim.gotoAndStop(0);
        disappear();
    });

    return {appear, hit};

    function appear() {
        neko.visible = true;
        neko.anim.gotoAndStop(0);

        appearAnim.play();
        return appearAnim.finished;
    }

    function disappear() {
        disappearAnim.play();
        return disappearAnim.finished;
    }

    function hit() {
        neko.anim.play();
    }
}
