export default function convertLinksToClickable(target: string) {
    const linkRegex =
        /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/g;
    return target.replace(linkRegex, (url: string) => {
        const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
        return `<a onmouseover="this.style.textDecoration='underline'"  onmouseout="this.style.textDecoration='none'"  style="all: unset;color: #0052CC ; cursor: pointer !important" href="${formattedUrl}" target="_blank">${url}</a>`;
    });
}