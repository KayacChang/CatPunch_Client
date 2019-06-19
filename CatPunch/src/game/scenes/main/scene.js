import {addPackage} from 'pixi_fairygui';

import * as data from './data';

import {SlotMachine} from './components/slot';
import {Neko} from './components/neko';
import {FreeSpinIcon} from './components/freespin';
import {EnergyBar} from './components/energy';

import {
    setBevel,
    setDropShadow,
    setGlow,
} from '../../plugin/filter';

import {play} from './func/play';

function initSlotMachine(scene, reelTables) {
    const slot =
        SlotMachine({
            view: scene.getChildByName('SlotMachine'),
            reelTables,
            ...data,
        });

    setBevel(slot.view, {thickness: 5});

    const title =
        slot.view.getChildByName('Title');

    setBevel(title);

    slot.reels
        .forEach((reel) =>
            setDropShadow(reel.view, {
                blur: 3.2,
                quality: 2,
                alpha: 0.58,
                distance: 8,
                rotation: [45, 90, 135][reel.reelIdx],
            }));

    const tasks =
        slot.view.children
            .map((target) => {
                if (target.name.includes('FXReel')) {
                    setGlow(target, {
                        innerStrength: 1,
                        outerStrength: 1,
                        distance: 6,
                        color: 0xFCFFA3,
                    });

                    return whenAnimComplete(target);
                } else if (target.name.includes('Effect')) {
                    return target.children.map(whenAnimComplete);
                }
                return Promise.resolve();
            })
            .flat();

    Promise.all(tasks)
        .then(() => slot.view.emit('Ready'));

    return slot;

    function whenAnimComplete(fx) {
        fx.anim.gotoAndPlay(0);

        return new Promise((resolve) =>
            fx.anim.once('complete', function onComplete() {
                fx.anim.visible = false;
                fx.anim.off('complete', onComplete);
                resolve();
            }),
        );
    }
}

export function create({normalTable, freeGameTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = initSlotMachine(scene, normalTable);

    const energy = EnergyBar(
        slot.view.getChildByName('EnergyBar'),
    );

    const freeSpinIcon = FreeSpinIcon(
        slot.view.getChildByName('Icon@freespin'),
    );

    const neko = Neko(scene);

    scene.slot = slot;
    scene.energy = energy;
    scene.neko = neko;
    scene.freeSpinIcon = freeSpinIcon;
    scene.normalTable = normalTable;
    scene.freeGameTable = freeGameTable;

    play(scene);

    slot.view.once('Ready', () => app.emit('GameReady'));

    app.alert.request({title: translate(`common:message.audio`)})
        .then(({value}) => {
            app.sound.mute(!value);

            app.sound.play('mainBGM');
        });

    return scene;
}
