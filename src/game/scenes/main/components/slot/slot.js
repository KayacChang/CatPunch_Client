import {divide, mod, floor} from 'mathjs';
import {nth} from 'ramda';

import {
    TextureManager,
    isReel,
    isSymbol, isResult,
} from './util';

import {Status} from './index';
import {setMotionBlur} from '../../../../plugin/filter';

export function SlotMachine(
    {
        view,
        stopPerSymbol,
        reelTables,
        symbolConfig,
        distancePerStop,
    },
) {
    const slotBaseView =
        view.getChildByName('SlotBase');

    const {getTexture} = TextureManager(symbolConfig);

    const reels =
        slotBaseView.children
            .filter(isReel)
            .map(Reel);

    return {
        view,
        reels,

        get reelTables() {
            return reelTables;
        },
        set reelTables(newTables) {
            reelTables = newTables;
        },
    };

    function Symbol(view, symbolIdx) {
        const distance =
            distancePerStop ||
            divide(Number(view.height), stopPerSymbol);

        const initPos =
            symbolIdx * stopPerSymbol;

        const anchorOffset =
            view.anchor.y * view.height;

        let icon = 0;

        return {
            get symbolIdx() {
                return symbolIdx;
            },

            get view() {
                return view;
            },

            get height() {
                return view.height;
            },

            get icon() {
                return icon;
            },
            set icon(iconId) {
                icon = iconId;

                view.texture = getTexture(iconId);
            },

            get initPos() {
                return initPos;
            },

            get visible() {
                return view.visible;
            },
            set visible(flag) {
                view.visible = flag;
            },

            get pos() {
                return divide(view.y - anchorOffset, distance);
            },
            set pos(newPos) {
                view.y = (newPos * distance) + anchorOffset;
            },

            get y() {
                return view.y;
            },
            set y(newY) {
                view.y = newY;
            },

            emit(evt, ...args) {
                view.emit(evt, ...args);
            },
            on(evt, callback) {
                view.on(evt, callback);
            },
            once(evt, callback) {
                view.once(evt, callback);
            },
            off(evt, callback) {
                view.off(evt, callback);
            },
        };
    }


    function Reel(view, reelIdx) {
        const symbols =
            view.children
                .filter(isSymbol)
                .map(Symbol);

        const results =
            view.children
                .filter(isResult)
                .map(Symbol);

        const displayLength =
            symbols.length * stopPerSymbol;

        const motionBlur = setMotionBlur(view);

        let axis = 0;

        let status = Status.Idle;

        return {
            get status() {
                return status;
            },
            set status(newStatus) {
                status = newStatus;

                if (status === Status.Idle) {
                    axis = floor(axis + 1);

                    symbols.forEach((symbol) => {
                        symbol.vy = 0;
                        updateSymbol(symbol, axis);

                        if (symbol.pos === 0) symbol.visible = true;
                    });
                }

                if (status === Status.Start) {
                    view.emit(Status.Start);
                }
            },

            get reelIdx() {
                return reelIdx;
            },

            get view() {
                return view;
            },

            get reelTable() {
                return reelTables[reelIdx];
            },

            get symbols() {
                return symbols;
            },

            get results() {
                return results;
            },

            get axis() {
                return axis;
            },
            set axis(newAxis) {
                newAxis =
                    mod(newAxis, reelTables[reelIdx].length);

                symbols
                    .forEach((symbol) => updateSymbol(symbol, newAxis));

                results
                    .forEach((result) => updateResult(result, newAxis));

                const velocity =
                    (status === Status.Stop) ? 0 : newAxis - axis;
                motionBlur.update(velocity);

                axis = newAxis;
            },

            emit(evt, ...args) {
                view.emit(evt, ...args);
            },
            on(evt, callback) {
                view.on(evt, callback);
            },
            once(evt, callback) {
                view.once(evt, callback);
            },
            off(evt, callback) {
                view.off(evt, callback);
            },
        };

        function updateSymbol(symbol, newAxis) {
            symbol.pos =
                (newAxis + symbol.initPos) % displayLength;

            if (status === Status.Start) {
                if (symbol.pos < 1 && !symbol.visible) {
                    symbol.visible = true;
                }

                if (symbol.pos >= displayLength - 1) {
                    const iconId = nth(
                        floor(newAxis), reelTables[reelIdx],
                    );

                    if (iconId !== 10) {
                        symbol.icon = iconId;
                    }
                }
            }

            if (status === Status.Stop) {
                if (symbol.pos >= displayLength - 1) {
                    symbol.visible = false;
                }
                if (symbol.pos < 1) {
                    symbol.visible = false;
                }
            }
        }

        function updateResult(result, newAxis) {
            if (status === Status.Start) {
                if (result.pos < 0) return;

                if (result.pos > displayLength - 1) {
                    result.pos = [-4, -2][result.symbolIdx];

                    result.view.filters = [];
                    result.view.scale.set(1);
                }
                if (result.pos <= displayLength - 1) {
                    const velocity = newAxis - axis;
                    result.pos += (velocity);
                }
            }
        }
    }
}

