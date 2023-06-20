import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez ajouter du code supplémentaire ici pour journaliser l'erreur
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Personnalisez le message d'erreur ici
      return <h1>Une erreur s'est produite. Veuillez réessayer plus tard.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
