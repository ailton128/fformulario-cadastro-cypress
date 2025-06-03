describe('Teste Rápido do Formulário de Cadastro de Candidatos', () => {
  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 1500);
    cy.visit('http://127.0.0.1:5500/cypress/public/formulario.html', {
      onBeforeLoad(win) {
        Object.defineProperty(win, 'requestAnimationFrame', { value: cb => cb() });
      }
    });
  });

  it('Preenche e envia o formulário com sucesso', () => {
    cy.get('input[name="nome"]').type('Ailton');
    cy.get('input[name="sobrenome"]').type('Silva');
    cy.get('select[name="senioridade"]').select('Júnior');
    cy.get('input[name="email"]').type('ailton240625@gmail.com');
    cy.get('input[type="radio"][value="Front-end"]').check();
    cy.get('input[type="checkbox"][value="JavaScript"]').check();
    // cy.get('input[type="checkbox"][value="Cypress"]').check(); 
    // ↓ removido, pois não existe no seu HTML
    cy.get('textarea[name="experiencia"]').type('Tenho experiência com automação.');

    cy.on('window:alert', (msg) => {
      expect(msg).to.equal('Cadastro enviado com sucesso!');
    });
    cy.get('button[type="submit"]').click();

    // verifica que agora o elemento aparece
    cy.get('#mensagem-sucesso').should('be.visible');
  });

  it('Não envia sem preencher o campo "Nome" (campo obrigatório)', () => {
    // omite “nome”
    cy.get('input[name="sobrenome"]').type('Silva');
    cy.get('select[name="senioridade"]').select('Sênior');
    cy.get('input[name="email"]').type('teste@example.com');
    cy.get('input[type="radio"][value="Back-end"]').check();
    cy.get('input[type="checkbox"][value="JavaScript"]').check();
    cy.get('textarea[name="experiencia"]').type('Teste sem nome.');

    cy.get('button[type="submit"]').click();
    // agora usamos “not.be.visible”, pois #mensagem-sucesso já existe no HTML
    cy.get('#mensagem-sucesso').should('not.be.visible');

    cy.get('input[name="nome"]').should('have.attr', 'required');
  });

  it('Não envia sem preencher o campo "E-mail" (campo obrigatório)', () => {
    cy.get('input[name="nome"]').type('Ailton');
    cy.get('input[name="sobrenome"]').type('Silva');
    cy.get('select[name="senioridade"]').select('Pleno');
    // omite e-mail
    cy.get('input[type="radio"][value="Front-end"]').check();
    cy.get('input[type="checkbox"][value="JavaScript"]').check();
    cy.get('textarea[name="experiencia"]').type('Teste sem e-mail.');

    cy.get('button[type="submit"]').click();
    cy.get('#mensagem-sucesso').should('not.be.visible');

    cy.get('input[name="email"]').should('have.attr', 'required');
  });

  it('Não envia com e-mail em formato inválido', () => {
    cy.get('input[name="nome"]').type('Ailton');
    cy.get('input[name="sobrenome"]').type('Silva');
    cy.get('select[name="senioridade"]').select('Júnior');
    cy.get('input[name="email"]').type('email-invalido');
    cy.get('input[type="radio"][value="Front-end"]').check();
    cy.get('input[type="checkbox"][value="JavaScript"]').check();
    cy.get('textarea[name="experiencia"]').type('Teste com e-mail inválido.');

    cy.get('button[type="submit"]').click();
    cy.get('#mensagem-sucesso').should('not.be.visible');

    cy.get('input[name="email"]').then($input => {
      expect($input[0].checkValidity()).to.be.false;
    });
  });

  it('Seleciona "Back-end" e múltiplas tecnologias, sem enviar (antes de .click())', () => {
    cy.get('input[name="nome"]').type('Ailton');
    cy.get('input[name="sobrenome"]').type('Silva');
    cy.get('select[name="senioridade"]').select('Pleno');
    cy.get('input[name="email"]').type('ailton240625@gmail.com');

    cy.get('input[type="radio"][value="Back-end"]').check().should('be.checked');
    cy.get('input[type="checkbox"][value="JavaScript"]').check().should('be.checked');
    cy.get('input[type="checkbox"][value="Java"]').check().should('be.checked');
    cy.get('input[type="checkbox"][value="C#"]').check().should('be.checked');

    cy.get('textarea[name="experiencia"]').type('Teste com tecnologias múltiplas.');
    // sem clicar em “submit” aqui, só validamos seleção dos inputs
    cy.get('input[type="radio"][value="Back-end"]').should('be.checked');
    cy.get('input[type="checkbox"][value="JavaScript"]').should('be.checked');
    cy.get('input[type="checkbox"][value="Java"]').should('be.checked');
    cy.get('input[type="checkbox"][value="C#"]').should('be.checked');
  });

  it('Limpa o formulário após preenchimento (verifica se os campos são resetados)', () => {
    cy.get('input[name="nome"]').type('Ailton');
    cy.get('input[name="sobrenome"]').type('Silva');
    cy.get('select[name="senioridade"]').select('Sênior');
    cy.get('input[name="email"]').type('ailton@example.com');
    cy.get('input[type="radio"][value="Front-end"]').check();
    cy.get('input[type="checkbox"][value="JavaScript"]').check();
    cy.get('textarea[name="experiencia"]').type('Teste de limpeza do form.');

    // reseta o form
    cy.get('form').then($form => {
      $form[0].reset();
    });

    cy.get('input[name="nome"]').should('have.value', '');
    cy.get('input[name="sobrenome"]').should('have.value', '');
    // se seu <select> tiver <option value=""> como primeira opção, isso passará:
   cy.get('select[name="senioridade"]')
  .find('option:selected')
  .should('have.value', '');

    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[type="radio"]').should('not.be.checked');
    cy.get('input[type="checkbox"]').should('not.be.checked');
    cy.get('textarea[name="experiencia"]')
    .type('Experiência com teste de automação académico ');
  });
});


