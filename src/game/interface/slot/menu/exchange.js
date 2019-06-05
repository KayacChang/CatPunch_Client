import anime from 'animejs';

import {ToggleButton, Clickable, Openable} from '../../components';
import alert, {checkoutList} from '../../../../web/components/swal';

import {capitalize, currencyFormat} from '../../../../general/utils';

const {log10, trunc} = Math;

export function Exchange(menu) {
    const exchange = Openable(
        menu.getChildByName('exchange'),
    );

    const pad =
        exchange.getChildByName('NumberPad');

    pad.children
        .filter(({name}) => name.includes('num'))
        .forEach(NumberButton);

    const currency = Currency(
        exchange.getChildByName('output@currency'),
    );

    const dropdown = DropDown(
        exchange.getChildByName('dropdown@currency'),
    );

    DropDownButton(
        exchange.getChildByName('btn@dropdown'),
    );

    DeleteButton(
        pad.getChildByName('btn@delete'),
    );

    CleanButton(
        exchange.getChildByName('btn@cancel'),
    );

    RefreshButton(
        exchange.getChildByName('btn@refresh'),
    );

    ConfirmButton(
        exchange.getChildByName('btn@confirm'),
    );

    const amount = Amount(
        exchange.getChildByName('output@amount'),
    );

    exchange.y -= 53;
    exchange.open = open;
    exchange.close = close;

    return exchange;

    async function open() {
        if (app.user.cash > 0) {
            const data = await app.service.checkout();

            checkoutList(data);
        }
        await app.service.refresh();

        refresh(app.service.accountBalance);

        exchange.visible = true;
        return anime({
            targets: exchange,
            alpha: 1, y: 0,
            duration: 300,
            easing: 'easeOutQuad',
        }).finished;
    }

    function close() {
        return anime({
            targets: exchange,
            alpha: 0, y: '-=' + 53,
            duration: 300,
            easing: 'easeOutQuad',
            complete() {
                exchange.visible = false;
            },
        }).finished;
    }

    function refresh(accountBalance) {
        exchange.children
            .filter(({name}) => name.includes('balance'))
            .forEach(({name, content}) => {
                const [, currency] = name.split('@');

                content.text =
                    currencyFormat(accountBalance[currency]);
            });

        exchange.getChildByName('output@cash')
            .content.text = currencyFormat(app.user.cash);
    }

    function Currency({content}) {
        const currencies = app.service.currencies;

        let selected = '1';

        return {get, set};

        function get() {
            return selected;
        }

        function set(value) {
            if (value === selected) return;

            amount.set(0);

            selected = value;
            content.text = capitalize(
                currencies.get(selected).name,
            );
        }
    }

    function DropDownButton(view) {
        view = ToggleButton(view);

        view.on('Change', ({checked}) =>
            checked ? dropdown.open() : dropdown.close(),
        );

        return view;
    }

    function DropDown(view) {
        const currencies =
            [...app.service.currencies.values()];

        view.children
            .filter(({name}) => name.includes('item'))
            .map(({content}, index) => {
                content.text =
                    capitalize(currencies[index].name);
            });

        const btns =
            view.children
                .filter(({name}) => name.includes('btn'))
                .map(SelectButton);

        view.open = open;
        view.close = close;

        return view;

        function open() {
            view.visible = true;

            const index = currencies
                .findIndex(({type}) => currency.get() === type);

            btns.forEach((btn) => btn.setSelected(false));
            btns[index].setSelected(true);
        }

        function close() {
            view.visible = false;
        }

        function SelectButton(it, index) {
            it = Clickable(it);

            it.on('pointerover', hover);
            it.on('pointerup', hover);
            it.on('pointerout', normal);

            it.on('Click', click);

            let selected = false;

            it.setSelected = setSelected;

            return it;

            function setSelected(flag) {
                selected = flag;

                if (selected) {
                    it.alpha = 0.3;
                    it.off('pointerout', normal);
                } else {
                    it.alpha = 0;
                    it.on('pointerout', normal);
                }
            }

            function hover() {
                it.alpha = 0.3;
            }

            function normal() {
                it.alpha = 0;
            }

            function click() {
                it.alpha = 0.5;

                currency.set(currencies[index].type);

                close();
            }
        }
    }

    function Amount({content}) {
        let amount = 0;

        const cashField =
            exchange.getChildByName('output@cash').content;

        set(amount);

        return {get, set, push, pop};

        function set(val) {
            amount = val;
            content.text = currencyFormat(amount);

            const selected = currency.get();
            const {rate} = app.service.currencies.get(selected);

            cashField.text =
                currencyFormat(amount * rate);
        }

        function get() {
            return amount;
        }

        function push(num) {
            if (log10(amount) + 1 >= 10) return;
            set((amount * 10) + num);
        }

        function pop() {
            set(trunc(amount / 10));
        }
    }

    function ConfirmButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);

        return btn;

        function click() {
            if (amount.get() <= 0) return;

            alert.loading({title: 'Wait...'});

            app.service
                .exchange({
                    currency: currency.get(),
                    amount: amount.get(),
                })
                .then(({accountBalance}) => {
                    amount.set(0);
                    refresh(accountBalance);

                    alert.close();
                })
                .then(() => alert.success({
                    title: `Cash Received: ${app.user.cash}`,
                }))
                .then(() => menu.close());
        }
    }

    function RefreshButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);
        return btn;

        function click() {
            app.service.refresh()
                .then(refresh);
        }
    }

    function NumberButton(btn) {
        btn = Clickable(btn);

        const num =
            Number(btn.name.split('@')[1]);

        btn.on('pointerdown', click);

        return btn;

        function click() {
            amount.push(num);
        }
    }

    function DeleteButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);

        return btn;

        function click() {
            amount.pop();
        }
    }

    function CleanButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);

        return btn;

        function click() {
            amount.set(0);
        }
    }
}


