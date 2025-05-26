describe('Meu Primeiro Teste', () => {  
    it('Deve visitar a página de exemplo', () => {  
        cy.visit('https://ti360.notion.site/Case-Final-b92ac9617a7f4282a3feda646f606032'); 
        cy.contains('Example Domain'); 
    });  
});  
