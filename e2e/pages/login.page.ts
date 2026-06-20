import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly googleButton: Locator;
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByPlaceholder('tu@email.com');
    this.submitButton = page.getByRole('button', { name: /enviar enlace mágico/i });
    this.googleButton = page.getByRole('button', { name: /continuar con google/i });
    this.heading = page.getByRole('heading', { name: /iniciar sesión/i });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.submitButton.click();
  }

  async submitWithEmail(email: string) {
    await this.fillEmail(email);
    await this.submit();
  }
}
