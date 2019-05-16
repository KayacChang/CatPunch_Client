const url = new URL(location);

export function getSearchParams(key) {
    return url.searchParams.get(key);
}
