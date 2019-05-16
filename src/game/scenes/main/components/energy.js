import {setAdvancedBloom} from '../../../plugin/filter';

import anime from 'animejs';

export function EnergyBar(view) {
    let scale = 0;

    const energyBarView = view.getChildByName('view').anim;

    setAdvancedBloom(energyBarView, {
        threshold: 0.5,
        bloomScale: 0.7,
        brightness: 0.9,
        blur: 8,
        quality: 4,
        kernels: undefined,
        pixelSize: 1,
    });

    const maskWidth = [
        905,
        800,
        710,
        625,
        540,
        450,
        365,
        280,
        190,
        100,
        0,
    ];

    update(scale);

    return {
        get scale() {
            return scale;
        },
        set scale(newScale) {
            update(newScale);
            scale = newScale;
        },
    };

    function update(newScale) {
        const target = {
            width: maskWidth[scale],
        };
        anime({
            targets: target,
            width: maskWidth[newScale],
            duration: 1000,
            easing: 'easeOutQuad',
            update: function() {
                view.updateMask({
                    width: target.width,
                });
            },
        });
    }
}
