const pt = {
  theme: {
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
  },
  validation: {
    fields: {
      name: "nome",
      password: "senha",
    },
    common: {
      minChars: "{{field}} deve ter no mínimo {{count}} caracteres",
      maxChars: "{{field}} deve ter no máximo {{count}} caracteres",
    },
    email: {
      fill: "Digite seu email",
      format: "Email inválido",
    },
    name: {
      fill: "Digite seu nome",
    },
    password: {
      min: (n: number) => `A senha precisa ter pelo menos ${n} dígitos.`,
      required: "Senha é obrigatória",
      fill: "Digite sua senha",
    },
  },
  signUp: {
    emailPlaceholder: "E-mail",
    passwordPlaceholder: "Senha",
    namePlaceholder: "Nome",
    submitButton: "Criar conta",
    firstTime: "Já tem uma conta?",
    signUpLink: "Entrar!",
    title: "Crie sua conta",
    subtitle:
      "Cadastre-se para acessar sua carteira inteligente e começar a gerenciar seu dinheiro",
  },
  signIn: {
    emailPlaceholder: "E-mail",
    passwordPlaceholder: "Senha",
    submitButton: "Entrar",
    firstTime: "Primeira vez?",
    signUpLink: "Cadastre-se!",
    title: "Bem-vindo de volta!",
    subtitle: "Faça login para acessar a sua carteira inteligente, e gerenciar seu dinheiro",
  },
};

export default pt;
