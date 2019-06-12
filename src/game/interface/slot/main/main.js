import {currencyFormat} from '../../../../general';
import {SpinButton} from './spinButton';
import {Options} from './option';
import {Status} from './status';
import {Clickable} from '../../components';

export function Main(parent) {
    const it = parent.getChildByName('main');

    const status = Status(
        it.getChildByName('status'),
    );

    it.spinButton = SpinButton(it);

    it.openMenu = function(section) {
        parent.menu.open(section);
    };

    MenuButton(it);

    it.optionMenu = Options(it);

    it.block =
        it.getChildByName('block');

    it.block.on('pointerdown', () => {
        it.optionMenu.setOptionMenu(false);
    });

    it.updateStatus = updateStatus;

    return it;

    function updateStatus() {
        status.children
            .filter(({name}) => name.includes('output'))
            .forEach((field) => {
                const [, name] = field.name.split('@');

                field.content.text =
                    (name === 'bet') ?
                        app.user.betOptions[app.user.bet] :
                        currencyFormat(app.user[name]);
            });

        it.spinButton.checkState();
    }
}

function MenuButton(view) {
    const it = Clickable(
        view.getChildByName('btn@menu'),
    );

    it.on('Click', () => view.openMenu());
}


