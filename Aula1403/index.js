//#region Módulos Externos
const chalk = require('chalk')
const inquirer = require('inquirer')
//#endregion

//#region Módulos Internos
const fs = require('fs')
//#endregion

operation()//chama o método

//#region Ações iniciais

function operation()
{
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que deseja fazer?',
            choices: [ //escolhas
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair',
            ]
        }
    ]).then((answer) => {
        const action = answer['action']

        if(action ==='Criar Conta'){
            console.log('Criando a conta...')     
        }

        else if(action === 'Consultar Saldo'){
            console.log('Consultando seu saldo...')
        }

        else if(action === 'Depositar'){
            console.log('Depositando em sua conta...')
        }

        else if(action === 'Sacar'){
            console.log('Sacando de sua conta...')
        }

        else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('SAINDO DA APLICAÇÃO CONTAS ETEC'))

            setTimeout(() => {
                process.exit()
            }, 1500);
        }
    })
}

//#endregion

