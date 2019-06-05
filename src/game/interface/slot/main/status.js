import {defaultFont} from '../../components';
import {currencyFormat} from '../../../../general/utils';

export function Status(view) {
    setFont(view);

    Cash(
        view.getChildByName('field@cash'),
    );

    Bet(
        view.getChildByName('field@bet'),
    );

    Win(
        view.getChildByName('field@win'),
    );

    return view;
}

function setFont(view) {
    view.children
        .filter(({content}) => content !== undefined)
        .forEach((field) => {
            const [type] = field.name.split('@');

            if (type === 'label') {
                defaultFont(field.content, {fontFamily: 'Basic'});
            } else if (type === 'field') {
                defaultFont(field.content, {fontFamily: 'Candal'});
            }
        });
}

function Cash(it) {
    update(app.user.cash);

    app.on('UserCashChange', update);

    return it;

    function update(cash) {
        it.content.text = currencyFormat(cash);
    }
}

function Bet(it) {
    update(app.user.bet);

    app.on('UserBetChange', update);

    return it;

    function update(index) {
        it.content.text = currencyFormat(
            app.user.betOptions[index],
        );
    }
}

function Win(it) {
    update(app.user.lastWin);

    app.on('UserLastWinChange', update);

    return it;

    function update(scores) {
        it.content.text = currencyFormat(scores);
    }
}
