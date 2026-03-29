const en = {
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  validation: {
    fields: {
      name: "name",
      password: "password",
    },
    common: {
      minChars: "{{field}} must be at least {{count}} characters",
      maxChars: "{{field}} must be at most {{count}} characters",
    },
    email: {
      fill: "Type your email",
      format: "Invalid email",
    },
    name: {
      fill: "Type your name",
    },
    password: {
      min: (n: number) => `Password needs to be at least ${n} digits long`,
      required: "Password is required",
      fill: "Type your password",
    },
  },
  signUp: {
    emailPlaceholder: "E-mail",
    passwordPlaceholder: "Password",
    namePlaceholder: "Name",
    submitButton: "Sign up",
    firstTime: "Already has an account?",
    signUpLink: "Sign in!",
    title: "Create your account",
    subtitle: "Sign up to access your smart wallet and start managing your money",
  },
  signIn: {
    emailPlaceholder: "E-mail",
    passwordPlaceholder: "Password",
    submitButton: "Sign in",
    firstTime: "First time?",
    signUpLink: "Sign up!",
    title: "Welcome back",
    subtitle: "Sign in to access your smart wallet, and manage your money",
  },
};

export default en;
