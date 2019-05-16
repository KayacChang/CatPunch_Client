import {loaders} from 'pixi.js';
import {where} from '../../general/utils/logic';
import {Howl} from 'howler';

import {load as loadFont} from 'webfontloader';

export function Resource({loader}) {
    loader
    //  For Sound Loading
        .pre(HowlerLoader)
        //  For Font Loading
        .pre(WebFontLoader);

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
    if (check(resource)) return next();

    const {LOADING} = loaders.Resource.STATUS_FLAGS;
    resource._setFlag(LOADING, true);

    const sound = new Howl({
        ...resource.metadata,
        src: [resource.url],
        onload,
        onloaderror,
    });

    resource.type = loaders.Resource.TYPE.AUDIO;

    resource.data = sound;

    function check(resource) {
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

function WebFontLoader(resource, next) {
    if (check()) return next();

    loadFont({
        ...(resource.metadata),
        active,
        inactive,
    });

    function check() {
        return (
            !resource || resource.name !== 'font'
        );
    }

    function active() {
        resource.complete();
        next();
    }

    function inactive() {
        console.error(resource);
        resource.abort(message);
        next();
    }
}

