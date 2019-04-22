import {Howl, Howler} from 'howler';

export function Sound() {
    const resources = {};
    let tasks = [];

    function add(_tasks) {
        _tasks.forEach(({name, ...data}) => {
            const task = new Howl(data);
            resources[name] = task;
            tasks.push(task);
        });
    }

    function load(callback) {
        const loadTasks =
            tasks.map((task) =>
                new Promise((resolve) => task.once('load', resolve)));

        return Promise.all(loadTasks)
            .then(() => tasks = [])
            .then(callback);
    }

    /**
     * Handle muting and unmute globally.
     * @param  {Boolean} muted Is muted or not.
     * @return {Howler}
     */
    function mute(muted) {
        return Howler.mute(muted);
    }

    return {
        add, load, resources,
        mute,
    };
}
