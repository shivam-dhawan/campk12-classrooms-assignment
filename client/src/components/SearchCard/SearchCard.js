
export default {
  name: 'SearchCard',
  props: {
    onSuccess: Function
  },
  data () {
    return {
      roomId: '',
      error: ''
    };
  },
  methods: {
    async joinRoom (event) {
      event.preventDefault();
      try {
        const result = await this.$store.dispatch('JOINROOM', {
          roomId: this.roomId
        });
        this.error = '';
        this.onSuccess(result.data);
      } catch (err) {
        if(typeof err === 'object') err = err.message;
        this.error = err;
      }
    },
    navigateTo (routeName) {
      this.$router.push({ name: routeName });
    }
  }
};
