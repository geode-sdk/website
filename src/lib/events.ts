var events: HTMLAnchorElement;

function startEvents(document: Document) {
    if(!events) { events = document.createElement("a"); }
}

export {events, startEvents}