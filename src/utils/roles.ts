export function getRedirectPathByRole(role: string): string {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  }
  
  export function getWelcomeMessageByRole(role: string): string {
    switch (role) {
      case 'student':
        return 'Bienvenue étudiant 👨‍🎓';
      case 'teacher':
        return 'Bienvenue enseignant 👩‍🏫';
      case 'admin':
        return 'Bienvenue administrateur 🛠';
      default:
        return 'Bienvenue !';
    }
  }