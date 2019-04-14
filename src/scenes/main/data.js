import SYMBOL_SEVEN_URL from './assets/symbols/7.png';
import SYMBOL_BAR_URL from './assets/symbols/bar.png';
import SYMBOL_BLUE_URL from './assets/symbols/blue.png';
import SYMBOL_GREEN_URL from './assets/symbols/green.png';
import SYMBOL_PURPLE_URL from './assets/symbols/purple.png';
import SYMBOL_RED_URL from './assets/symbols/red.png';
import SYMBOL_YELLOW_URL from './assets/symbols/yellow.png';
import SYMBOL_STAR_URL from './assets/symbols/star.png';

import reelTable from './assets/reelTable';

const symbolConfig = [
    {id: 0, name: 'seven', url: SYMBOL_SEVEN_URL},
    {id: 1, name: 'bar', url: SYMBOL_BAR_URL},
    {id: 2, name: 'blue', url: SYMBOL_BLUE_URL},
    {id: 3, name: 'green', url: SYMBOL_GREEN_URL},
    {id: 4, name: 'purple', url: SYMBOL_PURPLE_URL},
    {id: 5, name: 'red', url: SYMBOL_RED_URL},
    {id: 6, name: 'yellow', url: SYMBOL_YELLOW_URL},
    {id: 7, name: 'star', url: SYMBOL_STAR_URL},
];

export const config = {
    symbolConfig,

    reelTable,
};
