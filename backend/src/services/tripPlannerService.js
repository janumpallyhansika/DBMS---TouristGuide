export const organizeDestinationsByDay = (
  destinations,
  numberOfDays
) => {
  if (!destinations || destinations.length === 0) {
    return [];
  }

  const days = Array.from(
    { length: numberOfDays },
    (_, index) => ({
      day: index + 1,
      destinations: []
    })
  );

  destinations.forEach((destination, index) => {
    const dayIndex = index % numberOfDays;

    days[dayIndex].destinations.push(
      destination
    );
  });

  return days;
};