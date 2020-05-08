import {wait} from '@kayac/utils';
import {setOutline} from '../../../plugin/filter';

export function Neko(scene) {
    const neko = scene.getChildByName('anim@neko');

    setOutline(neko, {
        thickness: 3,
        quality: 1,
    });

    const appearAnim = scene.transition['neko_appear'];
    const disappearAnim = scene.transition['neko_disappear'];

    neko.anim.loop = false;
    neko.visible = false;

    neko.anim.on('complete', async () => {
        await wait(500);
        neko.anim.gotoAndStop(0);
        disappear();
    });

    return {
        appear,
        disappear,
        hit,
    };

    function appear() {
        neko.visible = true;
        neko.anim.gotoAndStop(0);

        appearAnim.play();
        app.sound.play('catAppear');
        return appearAnim.finished;
    }

    function disappear() {
        disappearAnim.play();
        return disappearAnim.finished;
    }

    function hit() {
        neko.anim.play();
        app.sound.play('catHit1');

        let soundFlag = false;

        neko.anim.on('change', (current) => {
            if (current > 10 && !soundFlag) {
                app.sound.play('catHit2');
                soundFlag = true;
            }
        });
    }
}
