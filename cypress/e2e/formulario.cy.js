describe('Teste Rápido do Formulário de Cadastro de Candidatos', () => {
  beforeEach(() => {
    // Reduz o tempo de espera para comandos
    Cypress.config('defaultCommandTimeout', 3000);

    // Visita a página e remove animações antes de carregar
    cy.visit('http://127.0.0.1:5500/cypress/public/formulario.html', {
      onBeforeLoad(win) {
        Object.defineProperty(win, 'requestAnimationFrame', { value: cb => cb() });
      }
    });
  });

  it('Preenche e envia o formulário com sucesso', () => {
    // Preenche nome e sobrenome
    cy.get('input[name="nome"]').type("Ailton");
    cy.get('input[name="sobrenome"]').should('exist').type("Silva");

    // Seleciona a senioridade no <select>
    cy.get('select[name="senioridade"]').should('exist').select("Júnior");

    // Preenche o email
    cy.get('input[name="email"]').should('exist').type("aiton240625@gmail.com");

    // Marca o stack como Front-end
    cy.get('input[type="radio"][value="Front-end"]').should('exist').check();

    // Marca as tecnologias
    cy.get('input[type="checkbox"][value="JavaScript"]').should('exist').check();

    // Preenche a experiência
    cy.get('textarea[name="experiencia"]').should('exist').type("Tenho experiência com projetos de automação de testes académico.");

    // Captura o alerta de sucesso
    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Cadastro enviado com sucesso!');
    });

    // Envia o formulário
  // Verifica se a mensagem de sucesso aparece
cy.get('button[type="submit"]').click();
cy.get('#mensagem-sucesso').should('be.visible');
  });
});

