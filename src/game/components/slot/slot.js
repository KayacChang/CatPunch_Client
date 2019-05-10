import {floor, divide} from 'mathjs';
import {
    MotionBlurFilter,
    DropShadowFilter,
} from '../plugin/filter';

import {
    TextureManager,
    isReel,
    isSymbol,
    toReelPos,
} from './util';

export function SlotMachine(
    {
        view,
        stopPerSymbol,
        reelTables,
        symbolConfig,
        distancePerStop,
        spin,
    },
) {
    const slotBaseView =
        view.getChildByName('SlotBase');

    const {getTexture} = TextureManager(symbolConfig);

    const reels =
        slotBaseView.children
            .filter(isReel)
            .map(Reel);

    return {view, reels, spin};

    function Symbol(view, symbolIdx) {
        let displayPos = 0;

        let icon = 0;

        let readyToChange = false;

        const defaultDistance =
            divide(Number(view.height), stopPerSymbol);

        return {
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

                view.emit('displayPosChange', displayPos);
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

        const symbols =
            view.children
                .filter(isSymbol)
                .map(Symbol);

        const motionBlurFilter = MotionBlurFilter(view);

        DropShadowFilter(view, {
            blur: 3.2,
            quality: 3,
            alpha: 0.58,
            distance: 15,
            rotation: [45, 90, 135][reelIdx],
        });

        return {
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
            get displayLength() {
                return symbols.length * stopPerSymbol;
            },
            get reelPos() {
                return toReelPos(this, axis);
            },
            get axis() {
                return axis;
            },
            set axis(newAxis) {
                axis = newAxis % (reelTable.length);

                motionBlurFilter.update(axis);

                update(this, axis);
            },
        };
    }
}

function update(reel, axis) {
    reel.symbols
        .forEach((symbol) => {
            updatePos(symbol);
            updateIcon(symbol);
        });

    function updatePos(symbol) {
        const initialPos = symbol.symbolIdx * symbol.stopPerSymbol;

        symbol.displayPos = (axis + initialPos) % reel.displayLength;

        if (symbol.displayPos >= reel.displayLength - 1) {
            symbol.readyToChange = true;
        }
    }

    function updateIcon(symbol) {
        if (symbol.readyToChange && symbol.displayPos < 1) {
            symbol.icon = reel.reelTable[reel.reelPos];
            symbol.readyToChange = false;
        }
    }
}

