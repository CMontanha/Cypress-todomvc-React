describe('todomvc React app test', () => {

    let task1 = 'todo task 1'
    let task2 = 'todo task 2'
    let task3 = 'todo task 3'


    before(() => {
        
    })

    beforeEach(() => {
        cy.viewport(1920,1080)
        cy.visit('https://todomvc.com/examples/react/#/')
    })

    it('Layout look without todos', () => {

        //When opening page it focus on the todo insertion list
        cy.focused().should('have.class', 'new-todo')

        //Logo should be visible
        cy.get('.header h1').should('contain', 'todo')


        //Placeholder exists
        cy.get('.new-todo').invoke('attr', 'placeholder').should('contain', 'What needs to be done?')

        //Main should not exist until adding todo
        cy.get('.main').should('not.exist')

        //Footer should not exist until adding todo
        cy.get('.footer').should('not.exist')
    })

    it('Can add todo jobs', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')

        cy.get('.todo-list li')
            .eq(0)
            .find('label')
            .should('contain', task1)
        cy.get('.todo-list li')
            .eq(1)
            .find('label')
            .should('contain', task2)
    })


    it('Page has the right elements shown when adding todos', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')

            cy.get('.main').should('be.visible')
            cy.get('.footer').should('be.visible')
            cy.get('.todo-count').should('be.visible')

            //in this specific case todo-count should be 2
            cy.get('.todo-count').should('contain', '2 items left')

            //Filters exist

            cy.get('.filters')
                .contains('All')

            cy.get('.filters')
                .contains('Active')

            cy.get('.filters')
                .contains('Completed')

            //All filter should be selected by default
            cy.get('.filters').within(() => {
                cy.contains('All').should('have.class', 'selected')
            })

            //All other filters should not be selected by default
            cy.get('.filters').within(() => {
                cy.contains('Active').should('not.have.class', 'selected')
                cy.contains('Completed').should('not.have.class', 'selected')
            })
    })

    it('Selecting filters should hightlight selected and show correct info', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')
            
        cy.get('.filters').within(() => {
            cy.contains('Active').click()
            cy.contains('Active').should('have.class', 'selected')
        })
         //the other unactive filters should not appear selected
         cy.contains('All').should('not.have.class', 'selected')
         cy.contains('Completed').should('not.have.class', 'selected')

         //Active items appear when Active filter is selected
        cy.get('.todo-list li')
            .eq(0)
            .find('label')
            .should('contain', task1)        
 
        cy.get('.todo-list li')
            .eq(1)
            .find('label')
            .should('contain', task2) 

        cy.get('.filters').within(() => {
            cy.contains('Completed').click()
            cy.contains('Completed').should('have.class', 'selected')
        })

        //the other unactive filters should not appear selected
        cy.contains('All').should('not.have.class', 'selected')
        cy.contains('Active').should('not.have.class', 'selected')

        cy.get('.todo-list li').should('have.length', 0)
    })

    it('Toggling items from the todo list', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')

            //toggle
        cy.get('.todo-list li')
            .eq(0)
            .find('.toggle')
            .check()

            //untoggle
        cy.get('.todo-list li')
            .eq(0)
            .find('.toggle')
            .uncheck()   
     })

     it('Filters work currently with toggled items', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')
            .type(task3).type('{enter}')

        cy.get('.todo-list li')
            .eq(0)
            .find('.toggle')
            .check()

        cy.get('.todo-list li')
            .eq(0)
            .should('have.class', 'completed')

        //Active filter should contain 2 elements
        cy.get('.filters')
            .contains('Active')
            .click()
        cy.get('.todo-list li')
            .should('have.length', 2)

        //Completed filter should contain 1 element
        cy.get('.filters')
            .contains('Completed')
            .click()
        cy.get('.todo-list li')
            .should('have.length', 1)

        //All filter should contain 3 elements
        cy.get('.filters').contains('All').click()
        cy.get('.todo-list li').should('have.length', 3)    
     })

     it('Toggle all', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')
            .type(task3).type('{enter}')
        
        //toggle all todos
        cy.get('.toggle-all').check({force: true})

        //checking if all todos are toggled
        cy.get('.todo-list li')
            .eq(0)
            .should('have.class', 'completed')
        cy.get('.todo-list li')
            .eq(1)
            .should('have.class', 'completed')
        cy.get('.todo-list li')
            .eq(2)
            .should('have.class', 'completed')

        //untoggle all
        cy.get('.toggle-all').uncheck({force: true})

        //checking if all todos are untoggled
        cy.get('.todo-list li')
            .eq(0)
            .should('not.have.class', 'completed')
        cy.get('.todo-list li')
            .eq(1)
            .should('not.have.class', 'completed')
        cy.get('.todo-list li')
            .eq(2)
            .should('not.have.class', 'completed')
     })

    it('Delete element using the destroy button and then add it again to the end of the list', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')
            .type(task3).type('{enter}')


        //deleting the first element of the todo list 
        cy.get('.todo-list li')
            .eq(0)
            .find('.destroy')
            //button element is not visible so we need to force click it
            .click({force: true})

        //first element of the todo list should now be the second element from before
        cy.get('.todo-list li')
            .eq(0)
            .should('not.contain', task1).and('contain', task2)

        //adding a new element should place it on the end of the list
        cy.get('.new-todo')
            .type(task1).type('{enter}')

        cy.get('.todo-list li')
            .eq(2)
            .should('contain', task1)
    })

    it('Hovering over an element of the todo list should enable visibility on the destroy button', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')

        //checking the button is not visible when not hovered
        cy.get('.todo-list li')
            .eq(0)
            .find('.destroy')
            .should('be.hidden')

        //destroy button is visible when hovered (using invoke to show the hidden element)
        cy.get('.todo-list li')
            .eq(0)
            .find('.destroy')
            .invoke('show')
            .should('be.visible')
            //and clickable
            .click()
    })

    it('Double click to edit an item of the todo list', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')
            .type(task3).type('{enter}')

        cy.get('.todo-list li')
            .eq(0)
            .dblclick()
            .type('a')
            .type('{enter}')
            .should('contain', task1 + 'a')
    })

    it('Clear completed function', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')
            .type(task2).type('{enter}')
            .type(task3).type('{enter}')

        //todo list has 3 elements
        cy.get('.todo-list li')
            .should('have.length', 3)

        cy.get('.todo-list li')
            .eq(0)
            .find('.toggle')
            .check()

        cy.get('.clear-completed')
            .click()

        //todo list now needs to have only 2 elements
        cy.get('.todo-list li')
            .should('have.length', 2)

        //the missing element should be the first one, task1
        cy.get('.todo-list li')
            .find('label')
            .should('not.contain', task1)        
    })

    it('Escape on editing cancel changes', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')

        cy.get('.todo-list li')
            .eq(0)
            .dblclick()
            .type('a')
            .type('{esc}')

        cy.get('.todo-list li')
            .eq(0)
            .find('label')
            //check if the todo wasn't altered
            .should('not.contain', task1 + 'a')
            //check if the todo has it's original form
            .and('contain', task1) 
    })

    it('Entering an empty string does not add a new todo', () => {
        cy.get('.new-todo')
            .type('{enter}')

        cy.get('.todo-list li')
            .should('have.length', 0)
    })

    it('Editing a todo to a blank should delete the todo', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')

        cy.get('.todo-list li')
            .eq(0)
            .dblclick()
            .clear()
            .type('{enter}')

        cy.get('.todo-list li')
            .should('have.length', 0)
    })

    it.only('When editing a todo item, single toggle and destroy button should not be visible', () => {
        cy.get('.new-todo')
            .type(task1).type('{enter}')

        cy.get('.todo-list li')
            .eq(0)
            .dblclick()

        cy.get('.todo-list li')
            .eq(0)
            .find('.toggle')
            .should('not.be.visible')

        cy.get('.todo-list li')
            .eq(0)
            .find('.destroy')
            .should('not.be.visible')
    })

    })

