import {loaders} from 'pixi.js';
import {where} from '../utils/logic';
import {Howl} from 'howler';
// import {getElement} from '../utils/dom';

export function Resource({loader}) {
    function get(name) {
        return loader.resources[name];
    }

    function load(...scenes) {
        scenes
            .map(({reserve}) => reserve())
            .forEach((task) => loader.add(task));

        loader.pre(HowlerLoader);

        loader.on('progress', onLoading);

        return new Promise((resolve) => loader.load(resolve));
    }

    // const progressBar = getElement('.progress');
    function onLoading({progress}) {
        // progressBar.style.width = progress + '%';
    }

    return {get, load};
}

function HowlerLoader(resource, next) {
    if (check()) return next();

    // onLoading...
    const {LOADING} = loaders.Resource.STATUS_FLAGS;
    resource._setFlag(LOADING, true);

    resource.data = new Howl({
        ...resource.metadata,
        src: [resource.url],
        onload,
        onloaderror,
    });

    function check() {
        return (
            !resource ||
            where(resource.extension)
                .isNotIn(['wav', 'ogg', 'mp3', 'mpeg'])
        );
    }

    function onload() {
        resource.complete();
        next();
    }

    function onloaderror(id, message) {
        console.error(resource);
        resource.abort(message);
        next();
    }
}
