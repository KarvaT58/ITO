Adicionar Contatos
Método#
/contatos/adicionar #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/add

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é reponsavel por salvar os contatos do Whatsapp em sua lista de contatos no celular.

Sobre Esse recurso
O método para adicionar contatos à lista do WhatsApp só funcionará para contas que já receberam a atualização necessária. Certifique-se de que sua conta do Whatsapp tenha recebido a atualização antes de utilizar este recurso. Caso contrário, a operação não será concluída com sucesso.

Além disso, é necessário permitir que o WhatsApp adicione contatos diretamente no celular. Para isso, vá até as configurações de privacidade do seu aplicativo e ajuste as permissões de forma que o WhatsApp possa acessar e modificar seus contatos.

Veja o exemplo nas imagens abaixo:

Clique aqui para exibir as imagens
Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
primeiro nome	corda	Nome do contato que vai ser adicionado na agenda
telefone	corda	Número do contato que vai ser adicionado na agenda
Opcionais#
Atributos	Tipo	Descrição
sobrenome	corda	Sobrenome do contato que vai ser adicionado na agenda
Corpo da solicitação #
[
  {
    "firstName": "Contato 1",
    "lastName": "Sobrenome 1",
    "telefone" : "554499999999" 
  } ,
  {
    "firstName": "Contato 2",
    "lastName": "Sobrenome 2",
    "telefone" : "554499998888" 
  }
]
Resposta #
200 #
Atributos	Tipo	Descrição
sucesso	booleano	
erros	variedade	
Exemplo

{
    "sucesso" : verdadeiro , 
    "erros" : [ ] 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/add HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 160

[{"firstName": "Contato 1", "lastName": "Sobrenome 1", "phone": "554499999999"}, {"firstName": "Contato 2", "lastName": "Sobrenome 2", "phone": "554499998888"}]

Remover Contatos
Método#
/contatos/remover #
DELETE https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/remove

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é reponsavel por remover os contatos do Whatsapp da sua lista de contatos no celular.

Sobre Esse recurso
O método para remover contatos da lista do WhatsApp só funcionará para contas que já receberam a atualização necessária. Certifique-se de que sua conta do Whatsapp tenha recebido a atualização antes de utilizar este recurso. Caso contrário, a operação não será concluída com sucesso.

Corpo da solicitação #
[
  "554499999999" ,
  "554499998888"
]
Resposta #
200 #
Atributos	Tipo	Descrição
sucesso	booleano	
erros	variedade	
Exemplo

{
    "sucesso" : verdadeiro , 
    "erros" : [ ] 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #

DELETE /instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/remove HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 31

["554499999999","554499998888"]

Pegar metadata do contato
Método#
/contatos/{telefone} #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/{telefone}

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável por retornar as informações do metadata do contato.

Dica sobre imagem do contato
Se você pretente armazenar a imagem do seu contato observe que sempre retornamos no get-contacts o atribucom imgUrl com ela para você, porém é importante lembrar que esta fica disponivel por apenas 48 horas, após este periodo o link da imagem é excluido pelo próprio WhatsApp. Sugerimos que caso precise atualizar a imagem do seu contato você utilize o proximo método desta documentação, o get-profile-picture.

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefone	corda	Telefone do destinatário no formato DDI DDD NÚMERO Ex: 551199999999. IMPORTANTE Envie somente números, sem formatação ou máscara
Opcionais#
Atributos	Tipo	Descrição
Parâmetros de solicitação #
URL exemplo#
Método

GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/5511999999999

Resposta #
200 #
Atributos	Tipo	Descrição
telefone	corda	Phone do contato
nome	corda	Nome e sobrenome do contato, só vai retornar preenchido caso você tenha o número em seus contatos
curto	corda	Nome do contato, só vai retornar preenchido caso você tenha o número em seus contatos
inflamar	corda	Nome do Vcard do contato, caso ele tenha
notificar	corda	Nome informado nas configurações de nome do WhatsApp
imgUrl	corda	URL da foto do contato o WhatsApp apaga após 48h
Exemplo

{
  "name": "Nome e sobrenome do contato",
  "telefone" : "551199999999" , 
  "notify": "Nome do contado no WhatsApp",
  "short": "Nome do contato",
  "imgUrl": "url da foto do contato "
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
GET /instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/5511999999999 HTTP/1.1
Content-Type: application/json
Client-Token: {{security-token}}
Host: api.z-api.io

Pegar imagem do contato
Método#
/foto-do-perfil #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/profile-picture

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável por retornar a url com a imagem do contato atualizada.

Como já dito no tópico anterior Lembre-se

Se você pretente armazenar a imagem do seu contato observe que sempre retornamos no get-contacts o atribucom imgUrl com ela para você, porém é importante lembrar que esta fica disponivel por apenas 48 horas, após este periodo o link da imagem é excluido pelo próprio WhatsApp. Sugerimos que caso precise atualizar a imagem do seu contato você utilize o proximo método desta documentação, o profile-picture.

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefone	corda	Telefone do destinatário no formato DDI DDD NÚMERO Ex: 551199999999. IMPORTANTE Envie somente números, sem formatação ou máscara
Opcionais#
Atributos	Tipo	Descrição
Parâmetros de solicitação #
URL exemplo#
Método

GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/profile-picture?phone=551199999999

Resposta #
200 #
Atributos	Tipo	Descrição
link	corda	Url com a foto do contato
Exemplo

[
  {
    "link": "Url com a foto do contato"
  }
]
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
GET /instances/SUA_INSTANCIA/token/SEU_TOKEN/profile-picture?phone=5511999999999&Client-Token=%7B%7Bsecurity-token%7D%7D HTTP/1.1
Host: api.z-api.io

Número com WhatsApp ?
Método#
/telefone-existe #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/phone-exists

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método retorna se o número tem ou não WhatsApp.

Importante
Utilize essa API sempre que quiser verificar se um número possui WhatsApp, geralmente para validação de formulários. Não utilize essa API caso queira fazer uma verificação antes de enviar uma mensagem, pois o Z-API já valida a existência do número a cada mensagem enviada. A utilização desse método para esse fim, pode gerar problemas, visto que a verificação ficaria duplicada. Z-API não foi desenvolvido para dissiminação de spam para contatos que você não conhece, utilize com sabedoria!

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefone	corda	Telefone do destinatário no formato DDI DDD NÚMERO Ex: 551199999999. IMPORTANTE Envie somente números, sem formatação ou máscara
Opcionais#
Atributos	Tipo	Descrição
Parâmetros de solicitação #
URL exemplo#
Método

GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/phone-exists/5511999999999

Resposta #
200 #
Atributos	Tipo	Descrição
existe	booleano	true para caso exista e false para casos onde o número não tenha WhatsApp
Exemplo

[
  {
    "exists": "true ou false"
  }
]
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
GET /instances/SUA_INSTANCIA/token/SEU_TOKEN/phone-exists/5511999999999 HTTP/1.1
Content-Type: application/json
Client-Token: {{security-token}}
Host: api.z-api.io

Validar números em lote
Método#
/telefone-existe-lote #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/phone-exists-batch

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Diferente do método anterior que valida individualmente se um número possui WhatsApp através de uma requisição GET, essa API oferece uma verificação em lote.

Atenção
Limite por Requisição: O número máximo de validações em lote por requisição é de 50 mil números.

Importante
Este método continua a ser a escolha ideal quando você precisa verificar se um número possui WhatsApp, especialmente útil para a validação de formulários. No entanto, é crucial observar que não é recomendado utilizar esta API para verificar a existência do número antes de enviar uma mensagem. O Z-API já realiza essa validação automaticamente a cada mensagem enviada, e o uso duplicado deste método pode resultar em problemas.

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefones	variedade	Números de telefone a ser validados, formato DDI DDD NÚMERO Ex: 551199999999. IMPORTANTE Envie somente números, sem formatação ou máscara
Parâmetros de solicitação #
URL exemplo#
Método

POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/phone-exists-batch

{
  "telefones" : [ "554499999999" , "554488888888" ] 
}
Resposta #
200 #
Atributos	Tipo	Descrição
existe	booleano	true para caso exista e false para casos onde o número não tenha WhatsApp
entradaTelefone	corda	Número enviado na requisição, podendo conter ou não o nono dígito.
saídaTelefone	corda	Número formatado de acordo com a resposta do WhatsApp, refletindo o cadastro no WhatsApp e incluindo o nono dígito, se houver.
Exemplo

[
    {
        "existe" : verdadeiro , 
        "inputPhone" : "554499999999" , 
        "outputPhone" : "554499999999" 
    } ,
    {
        "existe" : falso , 
        "inputPhone" : "554488888888" , 
        "outputPhone" : "554488888888" 
    }
]
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/phone-exists-batch HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 46

{"phones": ["5511999999999", "554499999999"]}}

Bloquear contato
Método#
/contatos/modificar-bloqueado #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/modify-blocked

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável por bloquear ou desbloquear um contato.

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefone	inteiro	Número de telefone que você deseja alterar no SEU chat
Ação	corda	Atributo para bloquear ou desbloquear o contato (block ou unblock)
Corpo da solicitação #
Exemplo

{
  "telefone" : "5544999999999" , 
  "ação" : "bloquear" ou "desbloquear" 
}
Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	Atributo de confirmação da ação
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/modify-blocked HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 55

{"phone": "5544999999999", "action": "block / unblock"}

Denunciar contato
Método#
/contatos/{{telefone}}/relatório #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/{{phone}}/report

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável por denunciar um contato.

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefone	corda	Número de telefone que você deseja denunciar
Parâmetros de solicitação #
URL exemplo#
Método

POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/5544999999999/report

Resposta #
200 #
Atributos	Tipo	Descrição
sucesso	booleano	Atributo de confirmação da ação (true, false)
erro	corda	Mensagem de erro, caso ocorra
Exemplo

{
  "sucesso" : verdadeiro 
}
400 #
{
    "erro" : "Telefone inválido" 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts/5544999999999/report HTTP/1.1
Content-Type: application/json
Client-Token: {{security-token}}
Host: api.z-api.io


tamanho da página	inteiro	Especifica o tamanho do retorno de contatos por pagina
Opcionais#
Atributos	Tipo	Descrição
Parâmetros de solicitação #
URL exemplo#
Método

GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts?page=1&pageSize=20

Resposta #
200 #
Atributos	Tipo	Descrição
telefone	corda	Phone do contato
nome	corda	Nome e sobrenome do contato, só vai retornar preenchido caso você tenha o número em seus contatos
curto	corda	Nome do contato, só vai retornar preenchido caso você tenha o número em seus contatos
inflamar	corda	Nome do contato caso você tenha ele como contato
notificar	corda	Nome informado nas configurações de nome do WhatsApp
Exemplo

[
  {
    "name": "Nome e sobrenome do contato 1",
    "short": "Nome do contato 1",
    "notify": "Nome no WhatsApp 1",
    "vname" : "Nome sem vcard" , 
    "telefone" : "559999999999" 
  }
]
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
GET /instances/SUA_INSTANCIA/token/SEU_TOKEN/contacts?page=1&pageSize=100 HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
