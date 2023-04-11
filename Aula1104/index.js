const contas = require('./serviceContas/contas')

contas.operation()//chama o método

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
    const accountData = getAccount(accountName)//armazena os dados que o get trouxe

    if (!amount){ //ver se tem o valor

        console.log(chalk.bgRed.black('O montante não é válido')) //ainda é recursividade pois retorna o amount que está no método depositar
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) //accountData é uma instancia

    fs.writeFileSync(`accounts/${accountName}.json`, //escreve no arquivo
    JSON.stringify(accountData),
    function(err){
        console.log(err)
    })

    console.log(chalk.green(`Depositamos: R$ ${amount} na conta ${accountName}.`))
}
//#endregion

//#region Consultar Saldo

function accountBalance(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual conta deseja o saldo?'
    }

    ]).then((answer) =>{
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return accountBalance()
        }

        const accountData = getAccount(accountName)

        if(accountData.balance>0){
            console.log(chalk.green(`Saldo: ${accountData.balance}`))
        }

        else{
            console.log(chalk.red(`Saldo: ${accountData.balance}`))
        }

        setTimeout(() => {
            operation()
        }, 10000);
    })
}

//#endregion

//#region Sacar do Saldo
function withdraw(){
    inquirer.prompt([
        {
           name:'accountName',
           message:'De qual conta deseja sacar?' 
        }
    ]).then((answer) => {
        const accountName = answer['accountName']

        if(!checkAccount(accountName)){
            return withdraw()
        }

        inquirer.prompt([
            {
                name:'amount',
                message:'Quanto deseja sacar?'
            }
        ]).then((answer) => {
            const amount = answer['amount']

           if( removeAmount(accountName, amount)){
            console.log(chalk.bgRed.black(`Foi sacado R$ ${amount} da conta: ${accountName}`))
            setTimeout(() => {
                operation()
            }, 3000);

           }
  
        } )

    })
}
function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black('Não há valor a sacar.'))
        return withdraw()

    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black('Você irá entrar no cheque especial!'))
    }

    if((accountData.balance + accountData.limit) < amount){
        console.log(chalk.red('Você não tem limite especial.'))
        return
    }
    
    else{
        accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err){
            console.log(err)
        }
    )

    console.log(chalk.blue(`Você sacou: ${amount} da conta ${accountName}.`))
    console.log(chalk.bgWhite.blue(`Seu saldo ficou: ${accountData.balance}`))

    }

}
//#endregion
