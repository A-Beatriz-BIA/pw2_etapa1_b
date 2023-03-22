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
            createAccount() // Chama a função para criar a conta já criada lá embaixo    
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

//#region Criar Contas

function createAccount(){

    console.log(chalk.bgGreen.black('Bem vindo ao Contas ETEC Bank!'))
    console.log(chalk.green('Siga as orientações a seguir:'))

    buildAccount()
}

function buildAccount(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Entre com o nome da conta:'
        }
    ]).then((answer) => {
        const accountName = answer['accountName'] //sync porque a promiss é sincrona

        if(!fs.existsSync('accounts')){  //Verifica se não existe
            fs.mkdirSync('accounts')
        }
    
        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('Esta conta já existe!'))
            buildAccount(accountName) // recursividade, ou seja, chama a função dentro da própria função. Nesse caso, vai retornar pra função build
            return 
        } 
        
        // polimorfia: ato que pode modificar o metodo mandando um parametro pra ele que exista no contexto geral.
        
        // função de erro
        fs.writeFileSync(
            `accounts/${accountName}.json`,
            '{"balance":0}',
            function (err){
                console.error(err)
            }

        )
         //Informa se a opração de criar a conta deu certo

        console.info(chalk.green('Parabéns! Sua conta no ETEC Bank foi criada.'))
        operation()
    })
}

//#endregion

//#region Depositar na Conta

function deposit(){ 
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Para qual conta irá o depósito?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }
        ]).then((answer) => {  // promessa encadeada => árvore
            const amount = answer['amount']
            addAmount(accountName, amount)
            console.log(chalk.bgYellow.green('Sucesso! Seu montante foi depositado.'))

            setTimeout(() => { // espera 01 segundo e vai pro operation
                operation()
            }, 1000);

        }) 
    })

}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe.'))
        return false
    }
    return true
}

function getAccount(accountName){ //identifica a conta de adição de valor e aloca dentro do objeto e depois devolve para o servidor
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{ //usa fs para trazer a conta dentro dessa constante
        encoding: 'utf8', //padrão de linguagem que o json tá utilizando
        flag:'r' //read => só quer ler o arquivo para não ter marcação
   
    })
    return JSON.parse(accountJSON) //converte o que está dentro da constante para json para conseguir acessar  
}

function addAmount(accountName, amount){

}
//#endregion