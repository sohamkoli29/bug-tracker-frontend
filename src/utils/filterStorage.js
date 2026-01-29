const FILTER_STORAGE_KEY = 'bugtracker_saved_filters';

export const saveFilterPreset = (name, filters, projectId = null) => {
  const savedFilters = getSavedFilters();
  const preset = {
    id: Date.now().toString(),
    name,
    filters,
    projectId,
    createdAt: new Date().toISOString(),
  };

  savedFilters.push(preset);
  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(savedFilters));
  return preset;
};

export const getSavedFilters = (projectId = null) => {
  try {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    const filters = saved ? JSON.parse(saved) : [];
    
    if (projectId) {
      return filters.filter((f) => f.projectId === projectId || !f.projectId);
    }
    
    return filters;
  } catch (error) {
    console.error('Error loading saved filters:', error);
    return [];
  }
};

export const deleteFilterPreset = (id) => {
  const savedFilters = getSavedFilters();
  const updated = savedFilters.filter((f) => f.id !== id);
  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(updated));
};

export const getRecentSearches = () => {
  try {
    const saved = localStorage.getItem('bugtracker_recent_searches');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

export const saveRecentSearch = (searchTerm) => {
  if (!searchTerm.trim()) return;
  
  const recent = getRecentSearches();
  const updated = [
    searchTerm,
    ...recent.filter((s) => s !== searchTerm),
  ].slice(0, 5);
  
  localStorage.setItem('bugtracker_recent_searches', JSON.stringify(updated));
};