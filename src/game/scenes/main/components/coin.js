import {AnimatedSprite} from 'pixi.js'
import anime from 'animejs'
import Easing from 'easing-functions'

import {randomInt} from '@kayac/utils'

export function Coin () {
    const spriteSheet = app.resource.get('coin').spritesheet

    const it = new AnimatedSprite(spriteSheet.animations['coin'])

    const startFrom = randomInt(it.totalFrames)

    it.animationSpeed = 0.6

    it.gotoAndPlay(startFrom)

    return it
}

export async function playCoin (scene, {x, y}, coins) {
    scene.addChild(...coins)

    coins.forEach(({position}) => position.set(x, y))

    anime({
        targets: coins.map(({scale}) => scale),
        x: [0.1, 0.25],
        y: [0.1, 0.25],
        duration: 500,
    })

    const targetsX = coins.map((coin) => coin.x + randomInt(-300, 300))

    anime.timeline({targets: coins}).add({
        x: (el, i) => targetsX[i],
        duration: 1200,
        easing: 'linear',
    })

    const targetsY1 = coins.map((coin) => coin.y - randomInt(300, 500))
    const targetsY2 = coins.map((coin) => coin.y + randomInt(250, 400))

    setTimeout(() => app.sound.play('coinDrop'), 850)

    await anime
        .timeline({targets: coins})
        .add({
            y: (el, i) => targetsY1[i],
            duration: 350,
            easing: 'easeOutQuart',
        })
        .add({
            y: (el, i) => targetsY2[i],
            duration: 850,
            easing: () => Easing.Bounce.Out,
        }).finished

    anime.timeline({targets: coins}).add({
        x: scene._width / 2,
        y: 1300,
        delay: anime.stagger(60, {easing: 'easeInCubic'}),
        duration: 500,
        easing: 'easeInExpo',
        complete () {
            scene.removeChild(...coins)
        },
    })
}
