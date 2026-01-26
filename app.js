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
    displayedItems: [],
    allTags: [],
    categories: DIRECTORY_DATA.categories,
    itemsPerPage: 50,
    currentPage: 1,
    loading: false,
    
    init() {
      // Load theme from localStorage or system preference
      const savedTheme = localStorage.getItem('claude-directory-theme');
      if (savedTheme) {
        this.isDark = savedTheme === 'dark';
      } else {
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      this.applyTheme();
      
      // Load items
      this.items = DIRECTORY_DATA.items;
      
      // Extract all unique tags (limit to top 50 for performance)
      const tagCounts = {};
      this.items.forEach(item => {
        item.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      this.allTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([tag]) => tag)
        .sort();
      
      // Initial filter
      this.filterItems();
      
      // Listen for URL hash changes for category deep linking
      this.handleHashChange();
      window.addEventListener('hashchange', () => this.handleHashChange());
      
      // Infinite scroll
      window.addEventListener('scroll', () => this.handleScroll());
    },
    
    handleScroll() {
      if (this.loading) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      if (scrollY + windowHeight >= docHeight - 500) {
        this.loadMore();
      }
    },
    
    loadMore() {
      if (this.displayedItems.length >= this.filteredItems.length) return;
      
      this.loading = true;
      const start = this.displayedItems.length;
      const end = Math.min(start + this.itemsPerPage, this.filteredItems.length);
      
      // Use setTimeout to prevent UI freeze
      setTimeout(() => {
        this.displayedItems = this.filteredItems.slice(0, end);
        this.loading = false;
      }, 10);
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
    
    get totalCount() {
      return this.filteredItems.length;
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
      this.currentPage = 1;
      history.replaceState(null, '', categoryId === 'all' ? '#' : `#${categoryId}`);
      this.filterItems();
    },
    
    setTag(tag) {
      this.activeTag = this.activeTag === tag ? null : tag;
      this.currentPage = 1;
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
      // Only display first batch
      this.displayedItems = result.slice(0, this.itemsPerPage);
    },
    
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
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
