import Swal from 'sweetalert2/dist/sweetalert2';
import './styles/swal.scss';

const background = '#212121';

// error: User Access Tokens is empty
// error: Maintain

export function error({title}) {
    const config = {
        type: 'error',
        title,
        text: 'Something went wrong!',
        confirmButtonText: 'Go Back',
        confirmButtonColor: '#E30126',
        background,
    };

    return Swal.fire(config)
        .then(() => history.back());
}

export function loading({title}) {
    const config = {
        title,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => Swal.showLoading(),
        background,
    };
    return Swal.fire(config);
}

export function close() {
    return Swal.close();
}

export function success({title}) {
    const config = {
        type: 'success',
        title,
        showConfirmButton: false,
        timer: 2000,
        background,
    };
    return Swal.fire(config);
}

export function leave() {
    const config = {
        type: 'warning',
        title: 'Are you sure to exit?',
        confirmButtonText: 'Go Back',
        confirmButtonColor: '#d33',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        background,
    };

    return Swal.fire(config)
        .then(({value}) => (value) && history.back());
}

export default {error, leave, loading, close, success};
