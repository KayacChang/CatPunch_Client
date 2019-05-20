import {Clickable} from '../../components/Clickable';
import {Openable} from '../../components/Openable';

const {trunc} = Math;

export function Exchange(exchange) {
    exchange = Openable(exchange);

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

    Currencies(exchange);

    RefreshButton(
        exchange.getChildByName('btn@refresh'),
    );

    return exchange;

    function Currencies(exchange) {
        const typeOfCurrencies = [
            'Gold', 'Entertain',
            'Bonus', 'Gift',
        ];

        const {content} = exchange.getChildByName('input@currencies');
        content.text = typeOfCurrencies[0];

        const list =
            DropDown(exchange.getChildByName('ul@dropdown'));

        DropDownButton(exchange.getChildByName('btn@dropdown'));

        return {get};

        function get() {
            return content.text;
        }

        function DropDown(it) {
            it = Openable(it);

            it.children
                .filter(({name}) => name.includes('btn'))
                .forEach(Item);

            it.children
                .filter(({name}) => name.includes('text'))
                .forEach(setText);

            return it;

            function Item(it) {
                it = Clickable(it);

                const [, id] = it.name.split('@');
                it.on('pointerdown', () => {
                    content.text = typeOfCurrencies[id];
                    list.close();
                });
            }

            function setText({name, content}) {
                const [, id] = name.split('@');
                content.text = typeOfCurrencies[id];
            }
        }

        function DropDownButton(btn) {
            btn = Clickable(btn);

            btn.on('pointerdown', click);
            return btn;

            function click() {
                list.visible ?
                    list.close() : list.open();
            }
        }
    }


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

    function RefreshButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);
        return btn;

        function click() {
            console.log('Send Refresh...');
            // @TODO Send Refresh to server and sync result to coin groups
        }
    }

    function NumberButton(btn) {
        btn = Clickable(btn);

        const num =
            Number(btn.name.split('@')[1]);

        btn.on('pointerdown', click);

        return btn;

        function click() {
            credit.push(num);
        }
    }

    function DeleteButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);

        return btn;

        function click() {
            credit.pop();
        }
    }

    function CleanButton(btn) {
        btn = Clickable(btn);
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
