/**
 *  wait ms milliseconds
 *  @param {number} ms
 *  @return {Promise}
 */
export function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
}


