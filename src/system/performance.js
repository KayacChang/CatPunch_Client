// Get Navigation Timing entries:
const pageNav =
    performance.getEntriesByType('navigation')[0];

// Get Resource Timing entries:
performance.getEntriesByType('resource');

export function getDNSLookupTime() {
    const {domainLookupStart, domainLookupEnd} = pageNav;
    return (domainLookupEnd - domainLookupStart);
}

function getConnectionTime() {
    const {connectStart, secureConnectionStart, connectEnd} = pageNav;

    const connectionTime = (connectEnd - connectStart);

    if (secureConnectionStart <= 0) return {connectionTime};

    const tlsTime = (connectEnd - secureConnectionStart);

    return {connectionTime, tlsTime};
}
