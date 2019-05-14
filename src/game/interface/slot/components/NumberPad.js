import {Button} from '../../../components/common/Button';

export function NumberPad(exchange) {
    const pad =
        exchange.getChildByName('NumberPad');

    const number =
        exchange.getChildByName('input@credit')
            .content;

    pad.children
        .filter(({name}) => name.includes('num'))
        .forEach(NumberButton);

    DeleteButton(
        pad.getChildByName('btn@delete'),
    );

    number.text = '';

    return pad;

    function NumberButton(btn) {
        btn = Button(btn);
        btn.on('pointerdown', click);

        return btn;

        function click() {
            const [, numStr] = btn.name.split('@');
            const currentNum =
                number.text.replace(/,/g, '');

            const result =
                Number(currentNum) * 10 + Number(numStr);

            number.text = currencyFormat(result);
        }
    }

    function DeleteButton(btn) {
        btn = Button(btn);
        btn.on('pointerdown', click);

        return btn;

        function click() {
            number.text = backspace(number.text);
        }
    }

    function currencyFormat(num) {
        return new Intl.NumberFormat('en').format(num);
    }

    function backspace(str) {
        return str.slice(0, -1);
    }
}
