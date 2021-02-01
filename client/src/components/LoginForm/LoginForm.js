
export default {
  name: 'LoginForm',
  props: {
    userType: Number
  },
  data () {
    return {
      email: '',
      error: ''
    };
  },
  methods: {
    async submitForm (event) {
      event.preventDefault();
      try {
        const result = await this.$store.dispatch('LOGINUSER', {
          user: { email: this.email },
          userType: this.userType,
        });
        this.error = '';
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
