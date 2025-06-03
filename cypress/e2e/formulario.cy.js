describe('Teste Rápido do Formulário de Cadastro de Candidatos', () => {
  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 1500);

    cy.visit('http://127.0.0.1:5500/cypress/public/formulario.html', {
  onBeforeLoad(win) {
    Object.defineProperty(win, 'requestAnimationFrame', { value: cb => cb() });
      }
    });
  });

  it.only('Preenche e envia o formulário com sucesso', () => {
    cy.get('input[name="nome"]').type("Ailton");
    cy.get('input[name="sobrenome"]').type("Silva");
    cy.get('select[name="senioridade"]').select("Júnior");
    cy.get('input[name="email"]').type("aiton240625@gmail.com");
    cy.get('input[type="radio"][value="Front-end"]').check();
    cy.get('input[type="checkbox"][value="JavaScript"]').check();
    cy.get('textarea[name="experiencia"]').type("Tenho experiência com projetos de automação de testes acadêmico.");

    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Cadastro enviado com sucesso!');
    });

    cy.get('button[type="submit"]').click();
    cy.get('#mensagem-sucesso').should('be.visible');
  });
});

