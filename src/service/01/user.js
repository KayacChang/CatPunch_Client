const {seal} = Object;

export function User() {
    let id = undefined;
    let account = '';

    let cash = 0;
    let totalWin = 0;

    let betOptions = [1.0, 10.0, 20.0, 50.0, 100.0];
    let bet = 0;

    const speedOptions = [1, 2, 3];
    let speed = 0;

    const autoOptions = [0, 25, 100, 500, 1000];
    let auto = 0;

    return seal({
        get id() {
            return id;
        },
        set id(value) {
            id = value;
        },
        get account() {
            return account;
        },
        set account(value) {
            account = value;
        },
        get cash() {
            return cash;
        },
        set cash(value) {
            cash = value;
        },
        get totalWin() {
            return totalWin;
        },
        set totalWin(value) {
            totalWin = value;
        },

        //  Setting...
        get betOptions() {
            return betOptions;
        },
        set betOptions(options) {
            betOptions = options;
        },

        get bet() {
            return bet;
        },
        set bet(index) {
            bet = index;
        },

        get speedOptions() {
            return speedOptions;
        },
        get speed() {
            return speed;
        },
        set speed(index) {
            speed = index;
        },

        get autoOptions() {
            return autoOptions;
        },
        get auto() {
            return auto;
        },
        set auto(index) {
            auto = index;
        },
    });
}