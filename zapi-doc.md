Criando grupos
Método#
/criar-grupo #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/create-group

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável por criar um grupo com seus respectivos participantes. Infelizmente não é possivel criar o grupo com imagem, mas você pode logo após a criação utilizar-se do método Update-group-photo que esta nesta mesma sessão.

Dica
Assim como no WhatsApp Web você vai precisar adicionar ao menos um contato para conseguir criar um grupo.

aviso
Você não deve passar o número conectado ao Z-API que é responsável pela criação do grupo no array de números que vão compor o grupo.

Novo atributo
Recentemente, o WhatsApp implementou uma validação para verificar se o número de telefone conectado à API possui o contato do cliente salvo. No entanto, a Z-API desenvolveu uma solução para contornar essa validação, introduzindo um novo recurso chamado "autoInvite". Agora, quando uma solicitação é enviada para adicionar 10 clientes a um grupo e apenas 5 deles são adicionados com sucesso, a API envia convites privados para os cinco clientes que não foram adicionados. Esses convites permitem que eles entrem no grupo, mesmo que seus números de telefone não estejam salvos como contatos.

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
convite automático	booleano	true ou false (Envia link de convite do grupo no privado)
nome do grupo	corda	Nome do grupo a ser criado
telefones	sequência de caracteres de matriz	Array com os números a serem adicionados no grupo
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
Método

POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/create-group

Exemplo

{
  "autoInvite" : verdadeiro , 
  "groupName" : "Grupo Z-API" , 
  "telefones" : [ "5544999999999" , "5544888888888" ]  
}
Resposta #
200 #
Atributos	Tipo	Descrição
telefone	corda	ID/Fone do grupo
conviteLink	corda	link para entrar no grupo
Exemplo


Forma antiga -
  {
    "telefone" : "5511999999999-1623281429" , 
    "invitationLink" : "https://chat.whatsapp.com/DCaqftVlS6dHWtlvfd3hUa" 
  }

------------------------------------------------

Forma nova
  {
    "telefone" : "120363019502650977-grupo" , 
    "invitationLink" : "https://chat.whatsapp.com/GONwbGGDkLe8BifUWwLgct" 
  }

405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/create-group HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 162

{"groupName": "Meu grupo Z-API", "phones": ["5511999999999","5511888888888"], "profileImage": "https://www.z-api.io/wp-content/themes/z-api/dist/images/logo.svg"}

Atualizar nome do grupo
Método#
/nome-do-grupo-de-atualização #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-name

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável alterar o nome de um grupo já existente.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
nome do grupo	corda	Nome do grupo a ser criado
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-name

Corpo #

Forma antiga -
  {
    "groupId" : "5511999999999-1623281429" , 
    "groupName":"Mudou o nome Meu grupo no Z-API" 
  }

-----------------------------------------------

Forma nova -
  {
    "groupId" : "120363019502650977-grupo" , 
    "groupName":"Mudou o nome Meu grupo no Z-API" 
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-name HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 61

{"groupName": "Novo nonme Z-API", "groupId": "5511999999999"}

Atualizar imagem do grupo
Método#
/atualizar-foto-de-grupo #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-photo

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Esse método é responsável alterar a imagem de um grupo já existente.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
foto de grupo	corda	Url ou Base64 da imagem
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
Método

POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-photo

Corpo #
{
  "groupId" : "string" , 
  "groupPhoto" : "https://www.z-api.io/wp-content/themes/z-api/dist/images/logo.svg" 
}
Enviar imagem Base64
Se você tem duvidas em como enviar uma imagem Base64 acesse o tópico mensagens "Enviar Imagem", lá você vai encontrar tudo que precisa saber sobre envio neste formato.

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-photo HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 65

{"groupID": "ID do Grupo", "groupPhoto": "Url ou Base64 da foto"}

Adicionar Participantes
Método#
/adicionar-participante #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/add-participant

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é reponsável por adicionar novos participantes ao grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Novo atributo
Recentemente, o WhatsApp implementou uma validação para verificar se o número de telefone conectado à API possui o contato do cliente salvo. No entanto, a Z-API desenvolveu uma solução para contornar essa validação, introduzindo um novo recurso chamado "autoInvite". Agora, quando uma solicitação é enviada para adicionar 10 clientes a um grupo e apenas 5 deles são adicionados com sucesso, a API envia convites privados para os cinco clientes que não foram adicionados. Esses convites permitem que eles entrem no grupo, mesmo que seus números de telefone não estejam salvos como contatos.

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
convite automático	booleano	Envia link de convite do grupo no privado
ID do grupo	corda	ID/Fone do grupo
telefones	sequência de caracteres de matriz	Array com os número(s) do(s) participante(s) a serem adicionados
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/add-participant

Corpo #

Forma antiga -
  {
    "autoInvite" : verdadeiro , 
    "groupId" : "5511999999999-1623281429" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

  -------------------------------------------------

Forma nova -
  {
  "autoInvite" : verdadeiro , 
  "groupId" : "120363019502650977-grupo" , 
  "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/add-participant HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 68

{"groupId": "5511999999999-1623281429", "phones": ["5511999999999"]}

Remover Participantes
Método#
/remover-participante #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/remove-participant

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é reponsável por remover participantes do grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
telefones	sequência de caracteres de matriz	Array com os número(s) do(s) participante(s) a serem removidos
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/remove-participant

Corpo #

Forma antiga -
  {
    "groupId" : "5511999999999-1623281429" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

  -------------------------------------------------

Forma nova -
  {
    "groupId" : "120363019502650977-grupo" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/remove-participant HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 68

{"groupId": "5511999999999-1623281429", "phones": ["5511999999999"]}

Aprovar Participantes
Método#
/aprovar-participante #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/approve-participant

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é reponsável por aceitar a entrada de participantes no grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
telefones	sequência de caracteres de matriz	Array com os número(s) do(s) participante(s) a serem aceitos
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/approve-participant

Corpo #

Forma antiga -
  {
    "groupId" : "5511999999999-1623281429" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

  -------------------------------------------------

Forma nova -
  {
    "groupId" : "120363019502650977-grupo" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/approve-participant HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 68

{"groupId": "5511999999999-1623281429", "phones": ["5511999999999"]}

Rejeitar Participantes
Método#
/rejeitar-participante #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/reject-participant

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é reponsável por rejeitar a entrada de participantes no grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
telefones	sequência de caracteres de matriz	Array com os número(s) do(s) participante(s) a serem rejeitados
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/reject-participant

Corpo #

Forma antiga -
  {
    "groupId" : "5511999999999-1623281429" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

  -------------------------------------------------

Forma nova -
  {
    "groupId" : "120363019502650977-grupo" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/reject-participant HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 68

{"groupId": "5511999999999-1623281429", "phones": ["5511999999999"]}

Mencionar membro
Método#
/enviar-texto #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Esse método é responsável por fazer a menção dos participantes em um grupo.

imagem

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefone	corda	ID do grupo onde os participantes serão mencionados
mensagem	corda	Texto a ser enviado. Deve conter o @ com o número
mencionado	variedade	números a serem mencionados
Opcionais#
Atributos	Tipo	Descrição
mensagem de atraso	número	Nesse atributo um delay é adicionado na mensagem. Você pode decidir entre um range de 1~15 sec, significa quantos segundos ele vai esperar para enviar a próxima mensagem. (Ex "delayMessage": 5, ). O delay default caso não seja informado é de 1~3 sec
Corpo da solicitação #
{
  "telefone" : "55119999999999-grupo" , 
  "message" : "Bem-vindo ao *grupo Z-API* @número" , 
  "mentioned": [número]
}
Marcar todos no grupo #
Este método permite mencionar vários membros de um grupo no WhatsApp sem a necessidade de incluir explicitamente o "@" antes dos números. Isso é útil para marcar vários membros de uma só vez.

{
  "telefone" : "55119999999999-grupo" , 
  "message" : "Bem-vindo ao *grupo Z-API*" , 
  "mencionado" : [ número , número , número , número , número , número ] 
}
Resposta #
200 #
Atributos	Tipo	Descrição
zaapId	corda	id sem z-api
ID da mensagem	corda	não tenho identidade no whatsapp
eu ia	corda	Adicionado para compatibilidade com zapier, ele tem o mesmo valor do messageId
Exemplo

{
  "zaapId" : "3999984263738042930CD6ECDE9VDWSA" , 
  "mensagemId" : "D241XXXX732339502B68" , 
  "id" : "D241XXXX732339502B68" 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 59

{"phone": "5511999998888", "message": "Welcome to *Z-API*"}

Grupo de menção
Método#
/enviar-texto #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável por fazer a menção de grupos relacionados a uma comunidade. As menções só podem ser feitas em grupos dentro de uma comunidade, e os grupos mencionados devem pertencer à mesma comunidade.

imagem

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefone	corda	ID do grupo onde os grupos serão mencionados
mensagem	corda	Texto a ser enviado. Deve conter o @ com o id do grupo
grupoMencionado	GrupoMencionado[]	List de objetos com os dados do grupo a ser mencionado
GrupoMencionado #
Atributos	Tipo	Descrição
telefone	corda	ID do grupo que será mencioando
assunto	corda	Nome do grupo
Opcionais#
Atributos	Tipo	Descrição
mensagem de atraso	número	Nesse atributo um delay é adicionado na mensagem. Você pode decidir entre um range de 1~15 sec, significa quantos segundos ele vai esperar para enviar a próxima mensagem. (Ex "delayMessage": 5, ). O delay default caso não seja informado é de 1~3 sec
Corpo da solicitação #
{
  "telefone" : "55119999999999-grupo" , 
  "message" : "Bem-vindo ao *grupo Z-API* @1203634230225498-group" , 
  "grupoMencionado" : [ 
    {
      "telefone" : "1203634230225498-grupo" , 
      "assunto" : "subgrupo Z-API" 
    }
  ]
}
dica
Também é possível mencionar participantes na mensagem juntamente com a menção dos grupos

Resposta #
200 #
Atributos	Tipo	Descrição
zaapId	corda	id sem z-api
ID da mensagem	corda	não tenho identidade no whatsapp
eu ia	corda	Adicionado para compatibilidade com zapier, ele tem o mesmo valor do messageId
Exemplo

{
  "zaapId" : "3999984263738042930CD6ECDE9VDWSA" , 
  "mensagemId" : "D241XXXX732339502B68" , 
  "id" : "D241XXXX732339502B68" 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/send-text HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 59

{"phone": "5511999998888", "message": "Welcome to *Z-API*"}

Promover admin do grupo
Método#
/adicionar-admin #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/add-admin

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável por promover participamentes do grupo à administradores, você pode provomover um ou mais participamente à administrador.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
telefones	sequência de caracteres de matriz	Array com os número(s) do(s) participante(s) a serem promovidos
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/add-admin

Corpo #

Forma antiga -
  {
    "groupId" : "5511999999999-1623281429" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

  -------------------------------------------------

Forma nova -
  {
    "groupId" : "120363019502650977-grupo" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/add-admin HTTP/1.1
Host: api.z-api.io
Content-Length: 68

{"groupId": "5511999999999-1623281429", "phones": ["5511999999999"]}

Remover admin do grupo
Método#
/remover-admin #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/remove-admin

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável remover um ou mais admistradores de um grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	id/fone do grupo
telefones	sequência de caracteres de matriz	Array com os número(s) a ser(em) removido(s) da administração do grupo
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/remove-admin

Corpo #

Forma antiga -
  {
    "groupId" : "5511999999999-1623281429" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }

  -------------------------------------------------

Forma nova -
  {
    "groupId" : "120363019502650977-grupo" , 
    "telefones" : [ "5544999999999" , "5544888888888" ]  
  }


---

## Resposta

### 200

| Atributos | Tipo    | Descrição                                           |
| :------- | :------ | :-------------------------------------------------- |
| value     | boolean | true caso tenha dado certo e false em caso de falha |

**Exemplo**

```json
{
  "valor": verdadeiro
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/remove-admin HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 68

{"groupId": "5511999999999-1623281429", "phones": ["5511999999999"]}

Sair do grupo
Método#
/sair-do-grupo #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/leave-group

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método permite você sair de um grupo ao qual participa.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/leave-group

Corpo #

Forma antiga -
  {
    "groupId" : "5511999999999-1623281429" 
  }

-----------------------------------------

Forma nova -
  {
    "groupId" : "120363019502650977-grupo" 
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/leave-group HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 39

{"groupId": "5511999999999-1623281429"}

Configurações do grupo
Método#
/atualizar-configurações-do-grupo #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-settings

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método permite você alterar as preferências do grupo.

Atenção
Atenção somente administradores podem alterar as preferências do grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
telefone	corda	ID/Fone do grupo
adminOnlyMessage	booleano	Somente administradores podem enviar mensagens no grupo
Configurações somente de administrador	booleano	Atributo para permitir que apenas os admins façam edições no grupo
requer aprovação do administrador	booleano	Define se vai ser necessário a aprovação de algum admin para entrar no grupo
adminSomenteAdicionarMembro	booleano	Somente administradores podem adicionar pessoas no grupo
Corpo da solicitação #

Forma antiga -
  {
    "telefone" : "5511999999999-1623281429" , 
    "adminOnlyMessage" : verdadeiro , 
    "adminOnlySettings" : verdadeiro , 
    "requireAdminApproval" : falso , 
    "adminOnlyAddMember" : verdadeiro 
  }

----------------------------------------

Forma nova -
  {
    "telefone" : "120363019502650977-grupo" , 
    "adminOnlyMessage" : verdadeiro , 
    "adminOnlySettings" : verdadeiro , 
    "requireAdminApproval" : falso , 
    "adminOnlyAddMember" : verdadeiro 
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-settings HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 64

{"groupId": "5511999999999-1623281429","adminOnlyMessage": true}

Alterar descrição
Método#
/update-group-description #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-description

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método permite você alterar a descrição do grupo.

Atenção
Atenção somente administradores podem alterar as preferências do grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
Descrição do grupo	corda	Atributo para alterar a descrição do grupo
Corpo #

Forma antiga -
  {
    "groupId" : "5511999999999-1623281429" , 
    "groupDescription": "descrição do grupo"
  }

----------------------------------------

Forma nova -
  {
    "groupId" : "120363019502650977-grupo" , 
    "groupDescription":"descrição do grupo" 
  }

Resposta #
200 #
Atributos	Tipo	Descrição
valor	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/update-group-description HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io
Content-Length: 80

{"groupId": "5511999999999-1623281429","groupDescription": "descrição do grupo"}

Redefinir link de convite do grupo
Método#
/redefinir-link-de-convite/{groupId} #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/redefine-invitation-link/{groupId}

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método permite que você redefina o link de convite de um grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
URL da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/redefine-invitation-link/120363019502650977-group

Resposta #
200 #
Atributos	Tipo	Descrição
conviteLink	corda	Novo link de convite
Exemplo

{
  "invitationLink" : "https://chat.whatsapp.com/C1adgkdEGki7554BWDdMkd" 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #


POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/redefine-invitation-link/120363019502650977-group HTTP/1.1
Content-Type: application/json
Client-Token: {{security-token}}
Host: api.z-api.io

Obter link de convite do grupo
Método#
/link-convite-de-grupo/{groupId} #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/group-invitation-link/{groupId}

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método permite que você obtenha o link de convite de um grupo.

Atenção
No dia 4 de novembro de 2021 o whatsapp alterou a formato da criação de novos grupos, antes: "phone": "5511999999999-1623281429" agora: "phone": "120363019502650977-group"

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
ID do grupo	corda	ID/Fone do grupo
URL da solicitação #
URL #
POST https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/group-invitation-link/120363019502650977-group

Resposta #
200 #
Atributos	Tipo	Descrição
conviteLink	corda	Novo link de convite
Exemplo

{
  "telefone" : "120363019502650977-grupo" , 
  "invitationLink" : "https://chat.whatsapp.com/C1adgkdEGki7554BWDdMkd" 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber)

Webhook

Código #

POST /instances/SUA_INSTANCIA/token/SEU_TOKEN/group-invitation-link/120363019502650977-group HTTP/1.1
Content-Type: application/json
Client-Token: {{security-token}}
Host: api.z-api.io

Aceitar convite do grupo
Método#
/accept-invite-group?url={{URL_DE_CONVITE}} #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/accept-invite-group?url={{URL_DE_CONVITE}}

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é reponsável por aceitar um convite que você recebeu para participar de um grupo.

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
URL	corda	Url recebida de convite do grupo. Pode ser obtida nesse webhook
URL #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/accept-invite-group?url=https://chat.whatsapp.com/bh8XyNrIUj84YZoy5xcaa112

Resposta #
200 #
Atributos	Tipo	Descrição
sucesso	booleano	true caso tenha dado certo e false em caso de falha
Exemplo

{
  "sucesso" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta do Webhook #
Link para a response do webhook (ao receber) mensagem de convite

Webhook

Código #

GET /instances/SUA_INSTANCIA/token/SEU_TOKEN/accept-invite-group?url=%7B%7BGROUP_INVITE_URL%7D%7D HTTP/1.1
Content-Type: application/json
Client-Token: {{security-token}}
Host: api.z-api.io