import {defaultFont} from '../../components';
import {currencyFormat} from '../../../../general/utils';
import {SpinButton} from './spinButton';
import {Options} from './option';

export function Main(parent) {
    const it = parent.getChildByName('main');

    const status = Status(
        it.getChildByName('status'),
    );

    it.spinButton = SpinButton(it);

    it.openMenu = function() {
        parent.menu.open();
    };

    Options(it);

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

function Status(view) {
    view.children
        .filter(({content}) => content !== undefined)
        .forEach((field) => {
            const [type, name] = field.name.split('@');

            if (type === 'label') {
                defaultFont(field.content, {fontFamily: 'Basic'});
            } else if (type === 'output') {
                defaultFont(field.content, {fontFamily: 'Candal'});

                field.content.text =
                    (name === 'bet') ?
                        app.user.betOptions[app.user.bet] :
                        currencyFormat(app.user[name]);
            }
        });

    return view;
}
