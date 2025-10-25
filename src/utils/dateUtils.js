import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  isToday,
  isSameDay,
  parseISO,
} from 'date-fns'

export function getWeekDays(date = new Date(), weekStartsOn = 0) {
  const start = startOfWeek(date, { weekStartsOn })
  const end = endOfWeek(date, { weekStartsOn })
  return eachDayOfInterval({ start, end })
}

export function formatDate(date, formatStr = 'yyyy-MM-dd') {
  return format(date, formatStr)
}

export function formatDayHeader(date) {
  return {
    dayName: format(date, 'EEE'),
    dayNumber: format(date, 'd'),
    monthAbbr: format(date, 'MMM'),
    fullDate: formatDate(date),
    isToday: isToday(date),
  }
}

export function navigateWeek(currentDate, direction) {
  return direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1)
}

export function parseDate(dateString) {
  return parseISO(dateString)
}

export { isToday, isSameDay }
