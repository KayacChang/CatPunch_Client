export function load(...scenes) {
    const it = app.loader;

    const tasks = scenes
        .map(({reserve}) => reserve())
        .flat();

    it.add(tasks);

    return new Promise((resolve) => it.load(resolve));
}
