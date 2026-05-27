import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly googleButton: Locator;
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByPlaceholder('tu@email.com');
    this.termsCheckbox = page.locator('#acceptedTerms');
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

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }

  async submitWithEmail(email: string) {
    await this.fillEmail(email);
    await this.acceptTerms();
    await this.submit();
  }
}
