// Get Navigation Timing entries:
const pageNav =
    performance.getEntriesByType('navigation')[0];

// Get Resource Timing entries:
performance.getEntriesByType('resource');

export function getDNSLookupTime() {
    return pageNav.domainLookupEnd - pageNav.domainLookupStart;
}

function getConnectionTime() {
    return pageNav.connectEnd - pageNav.connectStart;
}

function getTLSTime() {
    if (pageNav.secureConnectionStart <= 0) {
        return pageNav.secureConnectionStart;
    }

    return pageNav.connectEnd - pageNav.secureConnectionStart;
}

function getFetchTime() {
    return pageNav.responseEnd - pageNav.fetchStart;
}

function getWorkerTime() {
    if (pageNav.workerStart <= 0) return pageNav.workerStart;

    return pageNav.responseEnd - pageNav.workerStart;
}

function getTotalRequestResponseTime() {
    return pageNav.responseEnd - pageNav.requestStart;
}

function getResponseTime() {
    return pageNav.responseEnd - pageNav.responseStart;
}

function getTTFB() {
    return pageNav.responseStart - pageNav.requestStart;
}
