const textStore = {
  STORAGE_KEY: 'favorite_texts',
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('加载收藏失败:', e);
      }
    }
    return [];
  },
  addFavorite(text) {
    const favorites = this.init();
    if (!favorites.includes(text)) {
      favorites.push(text);
      this.saveFavorites(favorites);
      return true;
    }
    return false;
  },
  removeFavorite(text) {
    let favorites = this.init();
    const beforeLength = favorites.length;
    favorites = favorites.filter(item => item !== text);
    if (favorites.length < beforeLength) {
      this.saveFavorites(favorites);
      return true;
    }
    return false;
  },
  saveFavorites(favorites) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  },
  getFavorites() {
    return this.init();
  },
  isFavorite(text) {
    const favorites = this.init();
    return favorites.includes(text);
  }
};

