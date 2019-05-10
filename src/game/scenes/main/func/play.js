import anime from 'animejs';

export async function play() {
    const userBet = {
        enumBetBaseType: 0,
        enumBetMultiply: 0,
    };
    const response =
        await app.service.sendOneRound(userBet);

    const gameResult = JSON.parse(response['jsonGameResult']);

    response.gameResult = gameResult;

    await slot.spin(gameResult.baseGame);

    if (gameResult.hasReSpin) {
        await slot.spin(gameResult.reSpinGame);
    }

    if (gameResult.hasFreeGame) {
        await slot.spin(gameResult.freeGame);
    }

    return response;
}

anime({
    targets: displaySymbol.view.scale,
    x: [{value: 1.1, duration: 1000}],
    y: [{value: 1.1, duration: 1000, delay: 120}],
    easing: 'easeOutElastic(5, .2)',
});

anime({
    targets: displaySymbol.view.scale,
    x: [{value: 1.1, duration: 360}],
    y: [{value: 1.1, duration: 500, delay: 250}],
    easing: 'spring(1, 80, 1, 30)',
});
