const templateString = `
<div
    id="context-menu"
    class="context-menu dropdown-menu position-fixed"
    data-hj-whitelist
    :class="{ show: isActive }"
    :style="{ transform: 'translate(' + x + 'px,' + y + 'px)' }"
    >
    <slot></slot>
</div>
`;

Vue.component('context-menu', {
  template: templateString,
  data() {
    return {
      width: 0,
      height: 0,
    };
  },
  props: {
    isActive: Boolean,
    x: Number,
    y: Number,
  },
  watch: {
    x() {
      const outsideScreen = window.innerWidth - 18 - (this.x + this.width);
      if (outsideScreen < 0) {
        this.$emit('outside-x', outsideScreen);
      }
    },
    y() {
      const outsideScreen = window.innerHeight - 18 - (this.y + this.height);
      if (outsideScreen < 0) {
        this.$emit('outside-y', outsideScreen);
      }
    },
  },
  mounted() {
    this.onSizeChange();
    this.onScroll();
  },
  methods: {
    onSizeChange() {
      const menu = document.querySelector('#context-menu');

      const observer = new MutationObserver((_mutations) => {
        if (menu.offsetWidth > this.width) {
          this.width = menu.offsetWidth;
        }
        if (menu.offsetHeight > this.height) {
          this.height = menu.offsetHeight;
        }
      });

      observer.observe(menu, {
        attributes: true,
      });
    },
    onScroll() {
      window.addEventListener('scroll', () => {
        this.$emit('close-context');
      });
    },
  },
});
