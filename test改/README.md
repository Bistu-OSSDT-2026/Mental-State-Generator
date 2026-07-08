[TextCore.js](https://github.com/user-attachments/files/29792033/TextCore.js)
const textCore = {
  currentCategory: 'gentle',
  setCategory(category) {
    if (textData[category]) {
      this.currentCategory = category;
      return true;
    }
    return false;
  },
  getRandomText() {
    const texts = textData[this.currentCategory];
    if (!texts || texts.length === 0) return '暂无文案';
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
  },
  getAlignClass(align = 'left') {
    const alignMap = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };
    return alignMap[align] || 'text-left';
  }
};

