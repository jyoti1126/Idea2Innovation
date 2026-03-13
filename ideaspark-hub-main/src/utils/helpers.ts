export const getInitials = (name: string): string => {
  if (!name) return '';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const getDayLabel = (dateString: string): string => {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return days[new Date(dateString).getDay()];
};

export const getLast7Days = (): { date: string; label: string }[] => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: getDayLabel(d.toISOString()),
    });
  }
  return days;
};

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const truncate = (text: string, maxLength = 100): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
};
