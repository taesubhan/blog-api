function convertDate(dateString) {
    const date = new Date(dateString);

    // Format to Pacific Time
    const options = {
    timeZone: "America/Los_Angeles",
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
    };

    const pacificTimeString = date.toLocaleString("en-US", options);
    return pacificTimeString; 
}

export default convertDate;