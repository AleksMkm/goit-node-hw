const config = require('../../config/email.json');

class EmailService {
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = config.dev;
        break;
      case 'stage':
        this.link = config.stage;
        break;
      case 'production':
        this.link = config.prod;
        break;
      default:
        this.link = config.dev;
        break;
    }
  }

  async sendVerificationEmail(verificationToken, email, name) {}
}

module.exports = EmailService;
