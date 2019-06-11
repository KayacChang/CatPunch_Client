import anime from 'animejs';

import {ToggleButton, Clickable, Openable} from '../../components';

import {
    currencyFormat, log10,
} from '../../../../general';

export function Exchange(menu) {
    const exchange = Openable(
        menu.getChildByName('exchange'),
    );

    exchange.getChildByName('title').content.text =
        translate('common:exchange.title');

    const pad =
        exchange.getChildByName('NumberPad');

    pad.children
        .filter(({name}) => name.includes('num'))
        .forEach(NumberButton);

    const currency = Currency(exchange);

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

    const amount = Amount(exchange);

    exchange.y -= 53;
    exchange.open = open;
    exchange.close = close;

    return exchange;

    async function open() {
        if (app.user.cash > 0) {
            const {value} =
                await app.alert.request({title: 'Are You Sure To Checkout?'});

            if (!value) return;

            const data = await app.service.checkout();

            app.alert.checkoutList(data);
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

    function Currency(view) {
        const tag = 'currency';

        setLabel(tag);

        const output =
            view.getChildByName(`output@${tag}`).content;

        const currencies = app.service.currencies;

        let selected = '1';

        update();

        return {get, set};

        function get() {
            return selected;
        }

        function set(value) {
            if (value === selected) return;

            amount.set(0);

            selected = value;

            update();
        }

        function update() {
            output.text =
                translate(`common:currency.${currencies.get(selected).name}`);
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
                    translate(`common:currency.${currencies[index].name}`);
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

    function setLabel(tag) {
        exchange
            .getChildByName(`label@${tag}`).content
            .text = translate(`common:exchange.${tag}`);
    }

    function Amount(view) {
        const amountTag = 'amount';
        let amount = 0;

        setLabel(amountTag);

        const amountField =
            view.getChildByName(`output@${amountTag}`).content;

        const cashTag = 'cash';

        setLabel(cashTag);

        const cashField =
            view.getChildByName(`output@${cashTag}`).content;

        set(amount);

        return {get, set, push, pop};

        function set(val) {
            amount = val;
            amountField.text = currencyFormat(amount);

            const selected = currency.get();
            const {rate} = app.service.currencies.get(selected);

            cashField.text = currencyFormat(amount * rate);
        }

        function get() {
            return amount;
        }

        function push(num) {
            if (log10(amount) + 1 >= 10) return;
            set((amount * 10) + num);
        }

        function pop() {
            set(Math.trunc(amount / 10));
        }
    }

    function ConfirmButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);

        const [, name] = btn.name.split('@');

        exchange
            .getChildByName(`label@${name}`)
            .text = translate(`common:button.${name}`);

        return btn;

        function click() {
            if (amount.get() <= 0) return;

            app.alert.loading({title: 'Wait...'});

            app.service
                .exchange({
                    currency: currency.get(),
                    amount: amount.get(),
                })
                .then(({accountBalance}) => {
                    amount.set(0);
                    refresh(accountBalance);

                    app.alert.close();
                })
                .then(() => app.alert.success({
                    title: `Cash Received: ${app.user.cash}`,
                }))
                .then(() => menu.close());
        }
    }

    function RefreshButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);

        const [, name] = btn.name.split('@');

        exchange
            .getChildByName(`label@${name}`)
            .text = translate(`common:button.${name}`);

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

        btn.on('pointerup', reset);

        const text =
            pad.getChildByName(`text@${num}`).content;

        reset();

        return btn;

        function click() {
            amount.push(num);

            text.style.fill = '#FFB300';
        }

        function reset() {
            text.style.fill = '#FAFAFA';
        }
    }

    function DeleteButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);

        const [, name] = btn.name.split('@');

        pad
            .getChildByName(`label@${name}`)
            .text = translate(`common:button.${name}`);

        return btn;

        function click() {
            amount.pop();
        }
    }

    function CleanButton(btn) {
        btn = Clickable(btn);
        btn.on('pointerdown', click);

        const [, name] = btn.name.split('@');

        exchange
            .getChildByName(`label@${name}`)
            .text = translate(`common:button.${name}`);

        return btn;

        function click() {
            amount.set(0);
        }
    }
}


