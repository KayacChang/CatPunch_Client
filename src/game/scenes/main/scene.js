import {addPackage} from 'pixi_fairygui';

import {SlotMachine} from '../../components/slot';

import {symbolConfig, stopPerSymbol, reelTables, distancePerStop} from './data';
import {spin} from './func/spin';

import {Neko} from './neko';
import {EnergyBar} from './energy';

import {BevelFilter} from 'pixi-filters';

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    app.stage.addChild(scene);

    const neko = Neko(scene);

    const slotMachineView = scene.getChildByName('SlotMachine');

    const bevel = new BevelFilter({
        thickness: 5,
    });
    slotMachineView.filters = [bevel];

    const slot =
        SlotMachine({
            view: slotMachineView,
            stopPerSymbol,
            reelTables,
            symbolConfig,
            distancePerStop,
            spin,
        });

    const energyBar =
        EnergyBar(
            slotMachineView.getChildByName('EnergyBar'),
        );

    window.reelTables = reelTables;

    window.energy = energyBar;

    window.play = function(result) {
        slot.spin({
            'indexOfEachWheel': result,
            'enum_SymboTableForTable':
                result.map((pos, index) => reelTables[index][pos]),
        });
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
