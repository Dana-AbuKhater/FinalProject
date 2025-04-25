import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { enUS } from 'date-fns/locale'; // English locale
import './Calendar.css'; // CSS file for styling
const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // توليد أيام الشهر
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // التنقل بين الأشهر
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // تحديد تاريخ
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{format(currentDate, 'MMMM yyyy', { locale: enUS })}</h2> {/* English date */}
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      
      <div className="days-grid">
        {/* عناوين الأيام بالإنجليزية */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        
        {/* أيام التقويم */}
        {days.map((date, index) => {
          const isCurrent = isSameMonth(date, currentDate);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          
          return (
            <div
              key={index}
              className={`day ${isCurrent ? 'current' : 'other'} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {format(date, 'd')} {/* Day number */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;