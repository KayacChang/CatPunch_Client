import {LoaderResource} from 'pixi.js';
import {where} from '../../general/utils/logic';
import {Howl} from 'howler';

export function Resource({loader}) {
    //  For Sound Loading
    loader.pre(HowlerLoader);

    //  For Loading Progress
    loader.on('progress', (...args) => {
        app.emit('loading', ...args);
    });

    return {get, load, reset};

    function get(name) {
        return loader.resources[name];
    }

    function load(...scenes) {
        scenes
            .map(({reserve}) => reserve())
            .forEach((task) => loader.add(task));

        return new Promise((resolve) => loader.load(resolve));
    }

    function reset() {
        loader.reset();
    }
}

function HowlerLoader(resource, next) {
    if (check()) return next();

    const {LOADING} = LoaderResource.STATUS_FLAGS;
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
