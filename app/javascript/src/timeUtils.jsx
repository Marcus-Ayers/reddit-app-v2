export function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60)); // Divide by milliseconds in an hour
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24)); // Divide by milliseconds in a day

  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}