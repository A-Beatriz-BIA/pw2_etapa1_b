const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs')

module.exports = {
    operation() {
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

            if (action === 'Criar Conta') {
                console.log('Criando a conta...')
                this.createAccount() // this = pega o proprio metodo createAccount    
            }

            else if (action === 'Consultar Saldo') {
                console.log('Consultando seu saldo...')
                accountBalance()
            }

            else if (action === 'Depositar') {
                console.log('Depositando em sua conta...')
                deposit()
            }

            else if (action === 'Sacar') {
                console.log('Sacando de sua conta...')
                withdraw()
            }

            else if (action === 'Sair') {
                console.log(chalk.bgBlue.black('SAINDO DA APLICAÇÃO CONTAS ETEC'))

                setTimeout(() => {
                    process.exit()
                }, 1500);
            }
        })
    },
    createAccount() {

        console.log(chalk.bgGreen.black('Bem vindo ao Contas ETEC Bank!'))
        console.log(chalk.green('Siga as orientações a seguir:'))

        this.buildAccount()
    },
    buildAccount() {

        inquirer.prompt([
            {
                name: 'accountName',
                message: 'Entre com o nome da conta:'


            }
        ]).then((answer) => {
            const accountName = answer['accountName'] //sync porque a promiss é sincrona


            if (!fs.existsSync('accounts')) {  //Verifica se não existe
                fs.mkdirSync('accounts')
            }


            if (fs.existsSync(`accounts/${accountName}.json`)) {
                console.log(chalk.bgRed.black('Esta conta já existe!'))
                this.buildAccount(accountName) // recursividade, ou seja, chama a função dentro da própria função. Nesse caso, vai retornar pra função build
                return
            }

            // polimorfia: ato que pode modificar o metodo mandando um parametro pra ele que exista no contexto geral.

            // função de erro
            fs.writeFileSync(
                `accounts/${accountName}.json`,
                '{"balance":0, "limit": 1000}',
                function (err) {
                    console.error(err)
                }

            )
            //Informa se a opração de criar a conta deu certo

            console.info(chalk.green('Parabéns! Sua conta no ETEC Bank foi criada.'))
            this.operation()
            //this = auto referência
        })
    }
}
