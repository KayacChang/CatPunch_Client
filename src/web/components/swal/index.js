import Swal from 'sweetalert2/dist/sweetalert2';
import './styles/swal.scss';


const defaultStyle = {
    background: '#212121',
};


// error: User Access Tokens is empty
// error: Maintain

export function error({title}) {
    const config = {
        ...defaultStyle,

        type: 'error',
        title,
        text: 'Something went wrong!',
        confirmButtonText: 'Go Back',
        confirmButtonColor: '#E30126',
    };

    return Swal.fire(config)
        .then(() => history.back());
}

export function loading({title}) {
    const config = {
        ...defaultStyle,

        title,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => Swal.showLoading(),
    };
    return Swal.fire(config);
}

export function close() {
    return Swal.close();
}

export function success({title}) {
    const config = {
        ...defaultStyle,

        type: 'success',
        title,
        showConfirmButton: false,
        timer: 2000,
    };
    return Swal.fire(config);
}

export function leave() {
    const config = {
        ...defaultStyle,

        type: 'warning',
        title: 'Are you sure to exit?',
        confirmButtonText: 'Go Back',
        confirmButtonColor: '#d33',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
    };

    return Swal.fire(config)
        .then(({value}) => (value) && history.back());
}

export function checkoutList({gold, gift, etc, bonus}) {
    const config = {
        ...defaultStyle,

        title: 'Check Out',
        html: `
        <ul id="list">
        </ul>
        `,
        cancelButtonColor: '#3085d6',
        onBeforeOpen,
    };

    return Swal.fire(config);

    function onBeforeOpen() {
        Swal.showLoading();

        const content = Swal.getContent();

        const list = content.querySelector('#list');

        const host = 'http://dev01.ulg168.com/front/img/icon/usercoin/';

        const tasks = [
            {url: 'user_bg_gold_01', money: gold},
            {url: 'user_bg_ulg_01', money: etc},
            {url: 'user_bg_bonus_01', money: bonus},
            {url: 'user_bg_gift_01', money: gift},
        ].map(({url, money}) => {
            const image = new Image();
            image.src = host + url + '.png';

            const text =
                document.createElement('div');

            text.textContent = money;

            const container =
                document.createElement('div');

            container.append(image, text);
            container.classList.add('text-center', 'number-font');

            const item =
                document.createElement('li');

            item.append(container);

            return new Promise((resolve) => {
                image.onload = () => resolve(item);
            });
        });

        Promise.all(tasks)
            .then((items) => {
                items.forEach((item) => {
                    list.appendChild(item);
                });
            })
            .then(() => Swal.hideLoading());
    }
}

export default {
    error, leave, loading, close,
    success, checkoutList,
};
