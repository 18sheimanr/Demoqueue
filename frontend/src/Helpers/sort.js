export default function sortAndReturnNumerically (queue) {
    return queue.sort((a, b) => {
        return b.votes - a.votes;
    });
}

export function sortAndReturnAlphabetically (queue) {
    return queue.sort((a, b) => {
        if( a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if( a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });
}