
import {addPackage} from 'pixi_fairygui';

import {SlotMachine} from '../../components/slot';

import * as data from './data';
import {spin} from './func/spin';

import {Neko} from './neko';
import {EnergyBar} from './energy';

import {setBevel, setDropShadow} from '../../plugin/filter';

function initSlotMachine(scene, reelTables) {
    const slot =
        SlotMachine({
            view: scene.getChildByName('SlotMachine'),
            reelTables,
            ...data,
        });

    setBevel(slot.view, {thickness: 5});

    slot.reels
        .forEach((reel) =>
            setDropShadow(reel.view, {
                blur: 3.2,
                quality: 3,
                alpha: 0.58,
                distance: 15,
                rotation: [45, 90, 135][reel.reelIdx],
            }));

    EnergyBar(slot.view.getChildByName('EnergyBar'));

    slot.view.children
        .filter(({name}) => name.includes('FXReel'))
        .forEach((fx) => {
            fx.anim.gotoAndPlay(0);
            fx.anim.once('complete', function onComplete() {
                fx.anim.visible = false;
                fx.anim.off('complete', onComplete);
            });
        });

    slot.view.children
        .filter(({name}) => name.includes('Effect'))
        .forEach((effect) => {
            effect.children
                .forEach((it) => {
                    it.anim.gotoAndPlay(0);
                    it.anim.once('complete', function onComplete() {
                        it.anim.visible = false;
                        it.anim.off('complete', onComplete);
                    });
                });
        });

    return slot;
}

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    app.stage.addChild(scene);

    const reelTables = app.resource.get('reelTable.json').data;

    const slot = initSlotMachine(scene, reelTables);

    const neko = Neko(scene);

    window.play = function(res) {
        const result = {
            'indexOfEachWheel': res,
            'enum_SymboTableForTable':
                res.map((pos, index) => reelTables[index][pos]),
        };

        spin(slot, result);
    };

    window.appear = function() {
        neko.appear();
    };
    window.disappear = function() {
        neko.disappear();
    };
    window.hit = function() {
        neko.hit();
    };
}
