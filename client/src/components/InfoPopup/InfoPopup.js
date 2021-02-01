
export default {
  name: 'InfoPopup',
  computed: {
    text: function() { return this.$store.state.popup.text; },
    timeout: function() { return this.$store.state.popup.timeout; },
    isError: function() { return this.$store.state.popup.isError; },
  },
  mounted () {
    setTimeout(() => {
      this.$store.commit('closeInfoPopup');
    }, this.timeout);
  },
  data () {
    return {
    };
  }
};
