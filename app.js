// Claude Directory App
function directoryApp() {
  return {
    isDark: true,
    searchQuery: '',
    activeCategory: 'all',
    activeTag: null,
    showToast: false,
    items: [],
    filteredItems: [],
    allTags: [],
    categories: DIRECTORY_DATA.categories,
    
    init() {
      // Load theme from localStorage or system preference
      const savedTheme = localStorage.getItem('claude-directory-theme');
      if (savedTheme) {
        this.isDark = savedTheme === 'dark';
      } else {
        // Check system preference
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.applyTheme();
      
      // Load items
      this.items = DIRECTORY_DATA.items;
      
      // Extract all unique tags
      const tagSet = new Set();
      this.items.forEach(item => {
        item.tags.forEach(tag => tagSet.add(tag));
      });
      this.allTags = Array.from(tagSet).sort();
      
      // Initial filter
      this.filterItems();
      
      // Listen for URL hash changes for category deep linking
      this.handleHashChange();
      window.addEventListener('hashchange', () => this.handleHashChange());
    },
    
    handleHashChange() {
      const hash = window.location.hash.slice(1);
      if (hash && this.categories.find(c => c.id === hash)) {
        this.setCategory(hash);
      }
    },
    
    get currentCategoryName() {
      const cat = this.categories.find(c => c.id === this.activeCategory);
      return cat ? (cat.id === 'all' ? 'All Tools' : cat.name) : 'All Tools';
    },
    
    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem('claude-directory-theme', this.isDark ? 'dark' : 'light');
      this.applyTheme();
    },
    
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    setCategory(categoryId) {
      this.activeCategory = categoryId;
      // Update URL hash without scrolling
      history.replaceState(null, '', categoryId === 'all' ? '#' : `#${categoryId}`);
      this.filterItems();
    },
    
    setTag(tag) {
      this.activeTag = tag;
      this.filterItems();
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.filterItems();
    },
    
    filterItems() {
      let result = [...this.items];
      
      // Filter by category
      if (this.activeCategory !== 'all') {
        result = result.filter(item => item.category === this.activeCategory);
      }
      
      // Filter by tag
      if (this.activeTag) {
        result = result.filter(item => item.tags.includes(this.activeTag));
      }
      
      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        result = result.filter(item => {
          return (
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.author.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query))
          );
        });
      }
      
      this.filteredItems = result;
    },
    
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          this.showToast = true;
          setTimeout(() => {
            this.showToast = false;
          }, 2000);
        } catch (e) {
          console.error('Fallback copy failed:', e);
        }
        document.body.removeChild(textArea);
      });
    }
  };
}
