
export function load(...scenes) {
    const tasks = scenes
        .map(({reserve}) => reserve());

    tasks.forEach(delegate);

    const taskOfPixi = new Promise(
        (resolve) => app.loader.load(resolve));

    const taskOfHowler = new Promise(
        (resolve) => app.sound.load(resolve));

    return Promise.all([
        taskOfPixi, taskOfHowler,
    ]);
}

function delegate(task) {
    for (const type in task) {
        if (type === 'pixi') {
            loadByPixi(task[type]);
        } else if (type === 'howler') {
            loadByHowler(task[type]);
        }
    }
}

function loadByPixi(task) {
    app.loader.add(task);
}

function loadByHowler(task) {
    app.sound.add(task);
}
