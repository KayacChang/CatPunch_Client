const {seal} = Object;

export function User() {
    let id = undefined;
    let account = '';

    let cash = 0;
    let totalWin = 0;

    let bet = 1;
    let speed = 0;
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
        get bet() {
            return bet;
        },
        set bet(value) {
            bet = value;
            console.log(`Bet: ${bet}`);
        },
        get speed() {
            return speed;
        },
        set speed(value) {
            speed = value;
            console.log(`Speed: ${speed}`);
        },
        get auto() {
            return auto;
        },
        set auto(value) {
            auto = value;
            console.log(`Auto: ${auto}`);
        },
    });
}
