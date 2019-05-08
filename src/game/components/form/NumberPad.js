import {Button} from '../common/Button';

export function NumberPad(it) {
    let value = '';
    Object.defineProperty(it, 'value', {
        get() {
            return value;
        },
        set(newValue) {
            value = newValue;

            it.emit('input', {value});
        },
    });

    it.children
        .map((child) => {
            const name = child.name;

            return (
                (name.includes('num')) ? NumberButton :
                    (name === 'clean') ? CleanButton :
                        (name === 'back') ? BackButton :
                            () => undefined
            )(child);
        });

    return it;

    function NumberButton(btn) {
        btn = Button(btn);

        const number = Number(btn.name.replace('num_', ''));

        btn.on('pointerdown',
            () => it.value += number);

        return btn;
    }

    function CleanButton(btn) {
        btn = Button(btn);

        btn.on('pointerdown',
            () => it.value = '');

        return btn;
    }

    function BackButton(btn) {
        btn = Button(btn);

        btn.on('pointerdown',
            () => it.value = backspace(it.value));

        return btn;
    }

    function backspace(str) {
        return str.slice(0, -1);
    }
}
