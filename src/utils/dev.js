
/**
 * Debug Mode Logger:
 *      Set window.dev = true will open debug mode logger.
 * @param {any} msg?
 * @param {any[]} args
 */
export function log(msg, ...args) {
    if (process.env.mode !== 'development') return;

    console.log(msg, ...args);
}
