export const setFocus = (ID) => {
  const element = document.getElementById(ID);
  if (element) {
    element.focus();
  }
};

export const formatExactDateTime = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

// Time Ago - Based output--> 3 hours ago
export const formatTimestamp = (dateInput) => {
  if (!dateInput) return "";

  const date = new Date(dateInput); // handles ISO string
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);

  if (diffSeconds < 10) return "just now";
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;

  // Older than 1 day → show full date & time
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};


export const extractHtmlFromMime = (raw) => {
  if (!raw) return "";

  const match = raw.match(
    /Content-Type:\s*text\/html[\s\S]*?\r\n\r\n([\s\S]*?)\r\n--/
  );

  return match ? match[1].trim() : "";
};