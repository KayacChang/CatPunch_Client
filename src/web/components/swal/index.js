import Swal from 'sweetalert2/dist/sweetalert2';
import './styles/swal.scss';

const background = '#212121';

// error: User Access Tokens is empty
// error: Maintain

export function error({title}) {
    const type = 'error';
    const text = 'Something went wrong!';
    const confirmButtonText = 'Go Back';
    const confirmButtonColor = '#E30126';

    return Swal
        .fire({
            type, title, background, text,
            confirmButtonText, confirmButtonColor,
        })
        .then(() => history.back());
}

export default {error};
