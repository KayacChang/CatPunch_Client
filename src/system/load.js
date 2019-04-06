import background from '../../assets/background.jpeg';

export function load() {
    app.loader
        .add('background', background);

    return new Promise((resolve) => app.loader.load(resolve));
}

export function getResource(name) {
    return app.loader.resources[name];
}
