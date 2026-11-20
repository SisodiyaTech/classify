export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0 mins';
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours > 0 && remaining > 0) return `${hours} hr ${remaining} mins`;
  if (hours > 0) return `${hours} hr`;
  return `${remaining} mins`;
};
