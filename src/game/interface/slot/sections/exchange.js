import {Button} from '../../../components/common/Button';
import {Section} from './section';

const {trunc} = Math;

export function Exchange(exchange) {
    exchange = Section(exchange);

    const pad =
        exchange.getChildByName('NumberPad');

    pad.children
        .filter(({name}) => name.includes('num'))
        .forEach(NumberButton);

    DeleteButton(
        pad.getChildByName('btn@delete'),
    );

    CleanButton(
        exchange.getChildByName('btn@cancel'),
    );

    const credit = Credit(
        exchange.getChildByName('input@credit'),
    );

    return exchange;

    function Credit({content}) {
        let credit = 0;

        set(credit);

        return {get, set, push, pop};

        function set(val) {
            credit = val;
            content.text = currency(credit);
        }

        function get() {
            return credit;
        }

        function push(num) {
            set((credit * 10) + num);
        }

        function pop() {
            set(trunc(credit / 10));
        }
    }

    function NumberButton(btn) {
        btn = Button(btn);

        const num =
            Number(btn.name.split('@')[1]);

        btn.on('pointerdown', click);

        return btn;

        function click() {
            credit.push(num);
        }
    }

    function DeleteButton(btn) {
        btn = Button(btn);
        btn.on('pointerdown', click);

        return btn;

        function click() {
            credit.pop();
        }
    }

    function CleanButton(btn) {
        btn = Button(btn);
        btn.on('pointerdown', click);

        return btn;

        function click() {
            credit.set(0);
        }
    }
}

function currency(num) {
    return new Intl.NumberFormat('en').format(num);
}
