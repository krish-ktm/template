export interface ContactTranslations {
  title: string;
  subtitle: string;
  tagline: string;
  contactInfo: {
    title: string;
    subtitle: string;
    phone: {
      label: string;
    };
    email: {
      label: string;
    };
    address: {
      label: string;
    };
    hours: {
      label: string;
    };
  };
  form: {
    title: string;
    subtitle: string;
    name: {
      label: string;
      placeholder: string;
    };
    email: {
      label: string;
      placeholder: string;
    };
    phone: {
      label: string;
      placeholder: string;
    };
    message: {
      label: string;
      placeholder: string;
    };
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
  map: {
    title: string;
    subtitle: string;
  };
} 