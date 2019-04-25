// Get Navigation Timing entries:
const pageNav =
    performance.getEntriesByType('navigation')[0];

// Get Resource Timing entries:
performance.getEntriesByType('resource');

export function getDNSLookupTime() {
    const {domainLookupStart, domainLookupEnd} = pageNav;
    return (domainLookupEnd - domainLookupStart);
}
