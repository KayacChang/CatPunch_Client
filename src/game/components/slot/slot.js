import {floor, divide} from 'mathjs';
import {setMotionBlur} from '../../plugin/filter';

import {
    TextureManager,
    isReel,
    isSymbol,
    toReelPos,
} from './util';

export function SlotMachine({
    view,
    stopPerSymbol,
    reelTables,
    symbolConfig,
    distancePerStop,
}) {
    const slotBaseView =
        view.getChildByName('SlotBase');

    const {getTexture} = TextureManager(symbolConfig);

    const reels =
        slotBaseView.children
            .filter(isReel)
            .map(Reel);

    return {view, reels};

    function Symbol(view, symbolIdx, reel) {
        let displayPos = 0;

        let icon = 0;

        let readyToChange = false;

        const defaultDistance =
            divide(Number(view.height), stopPerSymbol);

        return {
            get reel() {
                return reel;
            },
            set reel(newReel) {
                reel = newReel;
            },
            get readyToChange() {
                return readyToChange;
            },
            set readyToChange(flag) {
                readyToChange = flag;
            },

            get symbolIdx() {
                return symbolIdx;
            },

            get stopPerSymbol() {
                return stopPerSymbol;
            },

            get distancePerStop() {
                return distancePerStop || defaultDistance;
            },

            get displayPos() {
                return displayPos;
            },
            set displayPos(newPos) {
                view.y = (newPos * distancePerStop);

                displayPos = floor(newPos);
            },

            get view() {
                return view;
            },
            get x() {
                return Number(view.x);
            },
            get y() {
                return Number(view.y);
            },
            get icon() {
                return icon;
            },
            set icon(iconId) {
                view.texture = getTexture(iconId);
                icon = iconId;
            },
        };
    }

    function Reel(view, reelIdx) {
        let axis = 0;

        let reelTable = reelTables[reelIdx];

        const motionBlur = setMotionBlur(view);

        let symbols = [];

        const it = {
            get reelIdx() {
                return reelIdx;
            },
            get reelTable() {
                return reelTable;
            },
            set reelTable(newTable) {
                reelTable = newTable;
            },

            get symbols() {
                return symbols;
            },
            set symbols(newSymbols) {
                symbols = newSymbols;
            },
            get displayLength() {
                return it.symbols.length * stopPerSymbol;
            },
            get reelPos() {
                return toReelPos(it, axis);
            },
            get axis() {
                return axis;
            },
            set axis(newAxis) {
                axis = newAxis % (reelTable.length);

                motionBlur.update(axis);

                update(it, axis);
            },
        };

        it.symbols =
            view.children
                .filter(isSymbol)
                .map((view, index) => Symbol(view, index, it));

        return it;
    }
}

function isOutSideOfTheViewPort(symbol) {
    return symbol.displayPos >= symbol.reel.displayLength - 1;
}

function update(reel, axis) {
    reel.symbols
        .forEach((symbol) => {
            updatePos(symbol, axis);
            updateIcon(symbol);
        });
}

function updatePos(symbol, axis) {
    const initialPos = symbol.symbolIdx * symbol.stopPerSymbol;

    symbol.displayPos =
        (axis + initialPos) % symbol.reel.displayLength;

    if (isOutSideOfTheViewPort(symbol)) {
        symbol.readyToChange = true;

        symbol.view.emit('outside');
    }
}

function updateIcon(symbol) {
    if (!(symbol.readyToChange && symbol.displayPos < 1)) return;

    const reel = symbol.reel;

    symbol.icon = reel.reelTable[reel.reelPos];
    symbol.readyToChange = false;
}

