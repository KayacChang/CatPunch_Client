import {multiply, divide, pi} from 'mathjs';

export function where(element) {
    function isIn(set) {
        return set.includes(element);
    }

    function isNotIn(set) {
        return !isIn(set);
    }

    return {isIn, isNotIn};
}

//  1° × π/180 = 0.01745rad
export function degreeToRadian(degree) {
    const unit = divide(pi, 180);
    return multiply(degree, unit);
}

export function radianToDegree(radians) {
    const unit = divide(180, pi);
    return multiply(radians, unit);
}
