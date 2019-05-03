import {createElement} from '../../../utils/web/dom';

import './styles/Load.scss';

export function create() {
    const it = createElement('div');

    it.id = 'load';

    return it;
}
