const {seal} = Object;

export function User() {
    let id = undefined;
    let account = '';
    let cash = 0;
    let totalWin = 0;
    let bet = 0;

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
        get bet() {
            return bet;
        },
        set bet(value) {
            bet = value;
        },
    });
}
