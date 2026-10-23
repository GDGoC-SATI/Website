export const eventsData = [];

export const getEventById = (id) => {
  if (!id) return null;
  return (
    eventsData.find(
      (e) => e._id === id || e.id === id || e.slug === id || (e.timeline && e.timeline.some((t) => t.id === id))
    ) || null
  );
};

export const saveOrUpdateEvent = (updated) => {
  if (!updated) return;
  const idx = eventsData.findIndex(
    (e) =>
      (updated._id && e._id === updated._id) ||
      (updated.id && e.id === updated.id) ||
      (updated.slug && e.slug === updated.slug)
  );
  if (idx !== -1) {
    eventsData[idx] = { ...eventsData[idx], ...updated };
  } else {
    eventsData.push(updated);
  }
};
