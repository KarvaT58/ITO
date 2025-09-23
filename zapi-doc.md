Leitura automática
Conceituação#
Esse método ativa a leitura automática de todas as mensagens recebidas pela API.

Método#
/atualizar-mensagem-de-leitura-automática #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-auto-read-message

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "valor" : verdadeiro ou falso 
}
Painel Administrativo#
imagem

Resposta #
200 #
{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Leitura automática de status
Conceituação#
Esse método ativa a leitura automática de todas as publicações de status recebidas pela API.

Atenção
Para que funcione você deve ter a Leitura automática habilitada.

Método#
/atualização-auto-leitura-status #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-auto-read-status

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "valor" : verdadeiro ou falso 
}
Painel Administrativo#
imagem

Resposta #
200 #
{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Atualizar imagem de perfil
Conceituação#
Este método é responsável por alterar a sua imagem de perfil no WhatsApp

Método#
/foto-do-perfil #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/profile-picture

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
valor	corda	URL da imagem
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
{
  "value":"URL da imagem" 
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
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Atualizar nome do perfil
Método#
/nome-do-perfil #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/profile-name

Conceituação#
Este método é responsável por alterar o seu nome de perfil no WhatsApp

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
valor	corda	Nome do perfil
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
Corpo #
{
  "value": "Nome do perfil"
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
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Atualizar descrição do perfil
Método#
/descrição-do-perfil #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/profile-description

Conceituação#
Este método é responsável por alterar a sua descrição de perfil no WhatsApp

Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
valor	corda	Descrição do perfil
Opcionais#
Atributos	Tipo	Descrição
Corpo da solicitação #
Corpo #
{
  "value": "Descrição do perfil"
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
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Rejeitar chamadas
Conceituação#
Esse método ativa a opção de Rejeitar chamadas automático na sua API, com ela ativa todas as chamadas de voz recebidas pelo número conectado a API serão rejeitadas de forma automática.

Método#
/atualizar-chamada-rejeitar-automático #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-call-reject-auto

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
"valor" : verdadeiro ou falso 
}
Painel Administrativo#
imagem

Resposta #
200 #
{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Mensagem de ligação
Conceituação#
Através desse método você define a mensagem que será enviada após rejeitar a chamada de voz recebida pela API.

Importante
Para a mensagem ser enviada o método anterior (Rejeitar chamadas) precisa estar ativo!

Método#
/atualizar-chamada-rejeitar-mensagem #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-call-reject-message

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "value": "Mensagem de resposta"
}
Painel Administrativo#
imagem

Resposta #
200 #
{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Pegar QRCode
Conceituação#
Sim! Como no WhatsApp Web você vai precisar ler um QRCode ou usar um número de telefone para conectar-se ao Z-API.

Existem 2 formas que você pode utilizar para realizar esta conexão. São elas:

Se você se conectar através do nosso painel de administrador ou
Disponibilizar a experiência dentro da sua própria aplicação através dos métodos descritos nesta sessão.
Você pode optar por um dos métodos disponíveis para ler o QRCode do WhatsApp, conforme exemplo abaixo:

Métodos#
/código qr #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/qr-code

Pegando QRCode - bytes

Este método retorna os bytes do QRCode. Você poderá renderizar em um componente do tipo QRCode compatível com sua linguagem de programação.

/código-qr/imagem #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/qr-code/image

Pegando QRCode - Imagem

Este método retorna uma imagem do tipo base64. Você poderá renderizar em um componente do tipo imagem compatível com sua linguagem de programação.

/código-telefone/{telefone} #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/phone-code/{telefone}

Pegando QRCode - Telefone

Este método retorna um código para que seja possível conectar o número a API sem a necessidade de leitura de qr-code, apenas inserindo o código gerado.

Você pode inserir o código gerado através da API diretamente no whatsapp, na mesma aba onde é feita a leitura do qr-code, clicando em "Conectar com número de telefone".

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Código #
observação
Se você optou por implementar a leitura do QRCode em sua aplicação, você precisa saber que o WhatsApp invalida o QRCode a cada 20 segundos.

Caso você chame o método e já esteja conectado ele não permitirá que você conecte novamente.

Uma vez conectado você já pode começar a utilizar os métodos Z-API para manipular seu WhatsApp.

importante
Recomendações:

Crie um método com intervalos entre 10 e 20 segundos para chamar a API e pegar o novo QRCode.
Caso o usuário não leia o QRCode após 3 chamadas, interrompa o fluxo e adicione um botão solicitando interação do mesmo para evitar chamadas desnecessárias para a API do WhatsApp.

Reiniciar instância
Conceituação#
Se você como todo bom Dev pulou a introdução e ainda não tem bem claro o conceito de instância, sugiro fortemente que você dê um passo atrás e leia a introdução deste tópico.

Pronto, agora que você já sabe o que é uma instância fica bem mais fácil de explicar :)

Este método basicamente é o botão "Reiniciar" do seu sistema operacional ou seja, como todo usuário expert, em casos onde tudo parece dar errado tente control+alt+del ou reinicia!

Método#
/reiniciar #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/restart

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Resposta #
200 #
{
  "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou GET conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
observação
Não! Você não precisa ler o QRCode se reiniciar a sua instância.

Desconectar
Conceituação#
Este método desconecta seu número do Z-API.

Mas não se preocupe, para conectar novamente bastar ler o QRCode :)

Método#
/desconectar #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/disconnect

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Código #
Não se esqueça!
Uma vez desconectado todos os metodos da API ficam indisponíveis e os webhooks deixam de ser enviados.

Status da instância
Conceituação#
Este método te permite descobrir se sua instância está ou não conectada a uma conta de WhatsApp.

Método#
/Status #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/status

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Atributos#
Atributos	Tipo	Descrição
conectado	booleano	Indica se seu número está conectado ao Z-API
erro	corda	Informa detalhes caso algum dos atributos não esteja true - 'You are already connected.' - 'You need to restore the session.' - 'You are not connected.'
smartphoneConectado	booleano	Indica se o celular está conectado à internet
Código #

GET /instances/SUA_INSTANCIA/token/SEU_TOKEN/status HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io

Dados do celular
Método#
/dispositivo #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/device

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Conceituação#
Este método é responsável por retornar informações sobre o device/celular conectado

Atributos#
{
    "telefone" : "" , 
    "imgUrl" : "" , 
    "nome" : "" , 
    "dispositivo" : { 
        "sessionName" : "Z-API" , 
        "modelo_de_dispositivo" : "Z-API" 
    } ,
    "originalDevice" : "iphone" , "smbi" , "android" , "smba" ,     
    "sessionId" : 175 , 
    "isBusiness" : falso 
}
Código #
GET /instances/SUA_INSTANCIA/token/SEU_TOKEN/device HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io

Renomear instância
Conceituação#
Método utilizado para renomear uma instância.

Método#
/nome-da-atualização #
PUT https://api.z-api.io/instances/ID_INSTANCE/token/TOKEN_INSTANCE/update-name

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Atributos#
Obrigatórios#
Atributos	Tipo	Descrição
valor	corda	Novo nome para a instância
Corpo da solicitação #
{
  "value": "novo nome"
}
Resposta #
200 #
Retornar
{
    "valor" : verdadeiro 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Código #
PUT /instances HTTP/1.1
Authorization: Bearer SEU-TOKEN-AQUI
Host: api.z-api.io
Content-Length: 17

{"value": "Name"}

Dados da instância
Conceituação#
Este método te permite obter os dados da sua instância.

Método#
/meu #
GET https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/me

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Resposta #
200 #
Atributos	Tipo	Descrição
eu ia	corda	Id da instância
símbolo	corda	Token da instância
nome	corda	Nome da instância
devido	número	Timestamp com a data de vencimento da instância (unix timestamp)
conectado	booleano	Define se a instância está conectada
status do pagamento	corda	Define o status de pagamento da instância
criado	Data	Data de criação da instância
URL de retorno de chamada conectado	corda	Url do webhook de conexão
URL de retorno de chamada de entrega	corda	Url do webhook de envio de mensagem
URL de retorno de chamada desconectada	corda	Url do webhook de desconexão
mensagemStatusCallbackUrl	corda	Url do webhook de status da mensagem
presençaChatCallbackUrl	corda	Url do webhook de presença do chat
URL de retorno de chamada recebida	corda	Url do webhook de recebimento
receberCallbackSentByMe	booleano	Define se irá receber webhook das mensagens enviadas pela própria instância
chamarRejeitarAutomático	booleano	Define se irá rejeitar uma chamada recebida automaticamente
chamarRejeitarMensagem	corda	Mensagem a ser enviada quando rejeitar uma chamada
autoReadMessage	booleano	Define se irá marcar as mensagens recebidas como lidas automaticamente
URL de retorno de chamada de dados inicial	corda	Url do webhook de dados iniciais após conexão
Código #
GET /instances/SUA_INSTANCIA/token/SEU_TOKEN/me HTTP/1.1
Client-Token: {{security-token}}
Host: api.z-api.io

Ao enviar
Conceituação#
Esse é o webhook de retorno de mensagens enviadas

Atenção
O Z-API não aceita webhooks que não sejam HTTPS

Atualizando Webhook#
Para atualizar a rota do webhook é possível fazer isso pela API ou pelo painel administrativo.

Dica
É possível alterar todos os webhooks de uma vez para a mesma URL. Ver endpoint.

API #
/atualização-webhook-entrega #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-webhook-delivery

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "valor" : "https://endereco-do-seu-sistema.com.br/instancia/SUA_INSTANCIA/delivery" 
}
Painel Administrativo#
imagem

Retorna dois webhooks #
Os possíveis retornos do webhook on-message-send estão cadastrado logo abaixo:

Resposta #
Atributos	Tipo	Descrição
telefone	corda	Número de telefone de destino da mensagem.
zaapId	corda	Identificador da mensagem na conversa.
tipo	corda	Tipo do evento da instância, nesse caso será "DeliveryCallback".
200 #
{
  "telefone" : "554499999999" , 
  "zaapId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "tipo" : "DeliveryCallback" , 
  "instanceId" : "instance.id" 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Ao receber
Conceituação#
Esse é o webhook de retorno de mensagens recebidas, também é executada quando a sua instância está configurada para notificar também mensagens enviadas por você mesmo.

Qual o prazo de validade dos arquivos do z-api?
Todos os arquivos de midia recebidos do z-api através do seu webhook tem o prazo de expiração de 30 dias. Após esse período todos os arquivos, seja audio, pdf, imagem, etc, serão excluídos do storage.

Atenção
O Z-API não aceita webhooks que não sejam HTTPS

Atualizando Webhook#
Para atualizar a rota do webhook é possível fazer isso pela API ou pelo painel administrativo.

Dica
É possível alterar todos os webhooks de uma vez para a mesma URL. Ver endpoint.

API #
/atualização-webhook-recebida #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-webhook-received

Ou#
Também é possível atualizar a rota com a opção "enviadas por mim" habilitada.

/update-webhook-recebido-entrega #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-webhook-received-delivery

imagem

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "valor" : "https://endereco-do-seu-sistema.com.br/instancia/SUA_INSTANCIA/receive" 
}
Painel Administrativo#
imagem

Retorna dois webhooks #
Os possíveis retornos do webhook on-message-received estão cadastrado logo abaixo:

Resposta #
Atributos	Tipo	Descrição
isStatusReply	booleano	Identifica se a mensagem recebida é uma resposta de status
tampa do remetente	corda	ID do contato no whatsapp
telefone conectado	corda	Número de telefone conectado à API
mensagem de espera	booleano	Identifica se a sua mensagem está com status de "Aguardando a mensagem"
éEditar	booleano	Identifica se a mensagem recebida foi editada
éGrupo	booleano	Indica se o chat é um grupo
éNewsletter	booleano	Indica se o chat é um canal
telefone	corda	Número de telefone, ou do grupo que enviou a mensagem.
de mim	booleano	Indica se a mensagem enviada partiu do número conectado a API
participanteTelefone	corda	Número de telefone do membro do grupo que enviou a mensagem.
participanteLid	corda	ID do contado no whatsapp, do participante que enviou a mensagem dentro de um grupo
ID da mensagem	corda	Idetificador da mensagem na conversa.
status	corda	Status que a mensagem se encontra no momento do envio (PENDING, SENT, RECEIVED, READ ou PLAYED).
referênciaMessageId	corda	Referência a mensagem que foi respondida para o caso da mensagem recebida ser uma resposta a uma mensagem da conversa.
momento	inteiro	Momento em que a mensagem foi recebida ou do erro.
mensagemExpiraçãoSegundos	inteiro	Tempo das mensagens temporárias
método de solicitação	corda	Identificador do método de solicitação de entrada (invite_link ou non_admin_add)
tipo	corda	Tipo do evento da instância, nesse caso será "ReceivedCallBack".
foto	corda	Url da foto do usuário que enviou a mensagem.
mensagem de texto	corda	Texto da mensagem.
imagem.legenda	corda	Link da foto.
imagem.imageUrl	corda	URL da foto.
imagem.thumbnailUrl	corda	URL da miniatura da foto.
imagem.mimeType	corda	MimeType da imagem.
áudio.mimeType	corda	MimeType do áudio.
áudio.audioUrl	corda	Url do áudio.
legenda do vídeo	corda	Legenda do vídeo.
vídeo.videoUrl	corda	Url do vídeo.
vídeo.mimeType	corda	MimeType do vídeo.
contato.displayName	corda	Nome do contato.
contato.vCard	corda	VCard contendo as informações do contato.
documento.mimeType	corda	MimeType do documento.
documento.nomedoarquivo	corda	Nome do documento.
documento.título	corda	Título do documento.
documento.pageCount	corda	Número de páginas do documento.
documento.thumbnailUrl	corda	Url da thumbnail do documento.
documento.documentUrl	corda	Url do documento.
localização.thumbnailUrl	corda	Url da thumbnail da localização.
localização.longitude	flutuador	Longitude da localização.
localização.latitude	flutuador	Latitude da localização.
localização.url	corda	Url da localização.
localização.nome	corda	Nome da localização.
localização.endereço	corda	Endereço da localização.
adesivo.mimeType	corda	MimeType do adesivo.
adesivo.stickerUrl	corda	URL do adesivo.
200 #
Exemplo de retorno de texto#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228638000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "texto" : { 
    "mensagem" : "teste" , 
    "descritpion": "(opcional) em caso da mensagem possuir uma descrição inserida pelo WhatsApp",
    "title": "(opcional) em caso da mensagem possuir um título inserido pelo WhatsApp",
    "url": "(opcional) caso a mensagem possua um link ligado a ela. Exemplo: mensagem de catálogo possui um botão 'Ver catálogo'",
    "thumbnailUrl": "(opcional) caso a mensagem possua uma imagem de thumbnail ligada a ela. Exemplo: mensagem de convite de grupo possui a imagem do grupo"
  }
}
Exemplo de retorno de template de texto#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "702CC5F7E0A6BF4421" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1708457193876 , 
  "status" : "RECEBIDO" , 
  "chatName" : "Número do teste" , 
  "senderPhoto" : nulo , 
  "senderName" : "5544999999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "hydratedTemplate" : { 
    "cabeçalho" : { } , 
    "message": "texto da mensagem",
    "footer": "rodapé da mensagem",
    "title": "título da mensagem",
    "templateId" : "790118069824606" , 
    "Botõeshidratados" : [ ] 
  }
}
Exemplo de retorno de reação#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228955000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "reação" : { 
    "valor" : "❤️" , 
    "tempo" : 1651878681150 , 
    "reactionBy" : "554499999999" , 
    "MensagemReferenciada" : { 
      "mensagemId" : "3EB0796DC6B777C0C7CD" , 
      "fromMe" : verdadeiro , 
      "telefone" : "5544999999999" , 
      "participante" : nulo 
    }
  }
}
Exemplo de retorno de texto (Lista de Botão)#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1634645380000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "Nome" , 
  "senderPhoto" : "https://" , 
  "senderName": "Nome",
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "referenceMessageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "buttonsResponseMessage" : { 
    "buttonId" : "1" , 
    "message": "Ótimo"
  }
}
Exemplo de retorno de template de botão OTP#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "9D968A5FA2880508C4" , 
  "telefone" : "554499999999" , 
  "fromMe" : falso , 
  "momento" : 1708455444850 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "554499999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "hydratedTemplate" : { 
    "cabeçalho" : { } , 
    "message": "texto da mensagem",
    "rodapé" : "" , 
    "título" : "" , 
    "modeloId" : "" , 
    "Botõeshidratados" : [ 
      {
        "urlButton" : { 
          "displayText": "Copiar código",
          "url" : "https://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code=otp123" 
        } ,
        "índice" : 0 
      }
    ]
  }
}
Exemplo de retorno de botão de chave pix#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "9D968A5FA2880508C4" , 
  "telefone" : "554499999999" , 
  "fromMe" : falso , 
  "momento" : 1708455444850 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "554499999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "pixKeyMessage" : { 
    "moeda" : "BRL" , 
    "referenceId" : "4PXRAHSIRDA" , 
    "chave" : "pixkey" , 
    "keyType" : "EVP" , 
    "nome do comerciante" : "Pix" 
  }
}
Exemplo de retorno de botão com imagem#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "9D968A5FA2880508C4" , 
  "telefone" : "554499999999" , 
  "fromMe" : falso , 
  "momento" : 1708455444850 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "554499999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "botõesMensagem" : { 
    "imageUrl": "URL da imagem",
    "videoUrl" : nulo , 
    "message": "Texto da mensagem",
    "botões" : [ 
      {
        "buttonId" : "1" , 
        "tipo" : 1 , 
        "textodobotão" : { 
          "displayText": "Texto do botão 1"
        }
      } ,
      {
        "buttonId" : "2" , 
        "tipo" : 1 , 
        "textodobotão" : { 
          "displayText": "Texto do botão 2"
        }
      }
    ]
  }
}
Exemplo de retorno de botão com video#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "9D968A5FA2880508C4" , 
  "telefone" : "554499999999" , 
  "fromMe" : falso , 
  "momento" : 1708455444850 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "554499999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "botõesMensagem" : { 
    "imageUrl" : nulo , 
    "videoUrl" : "URL do vídeo" , 
    "message":"Texto da mensagem", 
    "botões" : [ 
      {
        "buttonId" : "1" , 
        "tipo" : 1 , 
        "textodobotão" : { 
          "displayText":"Texto do botão 1" 
        }
      } ,
      {
        "buttonId" : "2" , 
        "tipo" : 1 , 
        "textodobotão" : { 
          "displayText":"Texto do botão 2" 
        }
      }
    ]
  }
}
Exemplo de retorno de texto (Lista de Opcão)#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1634645683000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "Nome" , 
  "senderPhoto" : "https://" , 
  "senderName": "Nome",
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "referenceMessageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "listarMensagemDeResposta" : { 
    "message": "Z-API Asas para sua imaginação",
    "título" : "Z-API" , 
    "selectedRowId" : "1" 
  }
}
Exemplo de retorno de carrosel#
{
  "isStatusReply" : falso , 
  "chatLid" : nulo , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "554499999999" , 
  "fromMe" : verdadeiro , 
  "momento" : 1739368022130 , 
  "status" : "ENVIADO" , 
  "chatName" : "Nome" , 
  "senderPhoto" : nulo , 
  "senderName":"Nome", 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : verdadeiro , 
  "carouselMessage" : { 
    "text": "Texto da mensagem",
    "cartões" : [ 
      {
        "cabeçalho" : { 
          "imagem" : { 
            "imageUrl" : "https://" , 
            "thumbnailUrl" : "https://" , 
            "legenda" : "" , 
            "mimeType" : "imagem/jpeg" , 
            "viewOnce" : falso , 
            "largura" : 0 , 
            "altura" : 0 
          }
        } ,
        "message": "Mensagem do cartão do carrosel",
        "rodapé" : "" , 
        "título" : "" , 
        "Botõeshidratados" : [ 
          {
            "índice" : 0 , 
            "urlButton" : { 
              "displayText": "Texto do botão",
              "url" : "https://" 
            }
          } ,
          {
            "índice" : 1 , 
            "quickReplyButton": { "displayText": "Texto do botão", "id": "2" }
          }
        ]
      } ,
      {
        "cabeçalho" : { 
          "imagem" : { 
            "imageUrl" : "https://" , 
            "thumbnailUrl" : "https://" , 
            "legenda" : "" , 
            "mimeType" : "imagem/jpeg" , 
            "viewOnce" : falso , 
            "largura" : 0 , 
            "altura" : 0 
          }
        } ,
        "message":"Mensagem do cartão do carrosel", 
        "rodapé" : "" , 
        "título" : "" , 
        "Botõeshidratados" : [ 
          {
            "índice" : 0 , 
            "urlButton" : { 
              "displayText":"Texto do botão", 
              "url" : "https://" 
            }
          } ,
          {
            "índice" : 1 , 
            "quickReplyButton":{"displayText":"Texto do botão","id":"2"}      
          }
        ]
      }
    ]
  }
}
Exemplo de retorno de texto vindos de anúncio#
{
    "isStatusReply" : falso , 
    "senderLid" : "81896604192873@lid" , 
    "connectedPhone" : "554499999999" , 
    "waitingMessage" : falso , 
    "isGroup" : falso , 
    "isEdit" : falso , 
    "isNewsletter" : falso , 
    "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
    "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
    "telefone" : "5544999999999" , 
    "fromMe" : falso , 
    "momento" : NumberLong( 1657209752000 ) ,
    "status" : "RECEBIDO" , 
    "chatName" : "nome" , 
    "senderPhoto" : nulo , 
    "senderName" : "nome" , 
    "foto" : nula , 
    "transmitir" : falso , 
    "externalAdReply" : { 
        "título" : "Título" , 
        "body": "texto do anuncio",
        "mediaType" : NumberInt( 1 ) ,
        "thumbnailUrl" : "https://" , 
        "sourceType" : "anúncio" , 
        "sourceId" : "23722824350495506" , 
        "ctwaClid" : "Aff-niaAw7V94N8LGd79Vjr43TlJD4UnoBdpZJQ3LzABitbbG6wgKBSVOth4EN0IDr9glsKWjm2LBaFrJG3Nb0ILxP49ZtossVBNzlS8cFXBvv2ow7gNw" , 
        "sourceUrl" : "https://" , 
        "containsAutoReply" : falso , 
        "renderLargerThumbnail" : verdadeiro , 
        "showAdAttribution" : verdadeiro 
    } ,
    "messageExpirationSeconds" : NúmeroInt( 0 ) ,
    "encaminhado" : falso , 
    "tipo" : "Retorno de chamada recebido" , 
    "texto" : { 
        "message": "mensagem recebida",
        "description": "texto do anuncio",
        "título" : "título" , 
        "url" : "https://" , 
        "thumbnailUrl" : "https://" 
    }
}
Exemplo de retorno de imagem#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228828000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "imagem" : { 
    "mimeType" : "imagem/jpeg" , 
    "imageUrl" : "https://" , 
    "thumbnailUrl" : "https://" , 
    "legenda" : "" , 
    "thumbnailUrl" : "https://" , 
    "largura" : 600 , 
    "altura" : 315 , 
    "viewOnce" : verdadeiro 
  }
}
Exemplo de retorno de template de imagem#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "885FF934BF100D579E" , 
  "telefone" : "554499999999" , 
  "fromMe" : falso , 
  "momento" : 1708454725028 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "554499999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "hydratedTemplate" : { 
    "cabeçalho" : { 
      "imagem" : { 
        "imageUrl" : "https://example.jpeg" , 
        "thumbnailUrl" : "https://example.jpeg" , 
        "legenda" : "" , 
        "mimeType" : "imagem/jpeg" , 
        "viewOnce" : falso , 
        "largura" : 1600 , 
        "altura" : 926 
      }
    } ,
    "message": "texto da mensagem",
    "footer": "rodapé da mensagem",
    "title": "título da mensagem",
    "templateId" : "674504507982622" , 
    "Botõeshidratados" : [ ] 
  }
}
Exemplo de retorno de áudio#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228849000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "áudio" : { 
    "ptt" : verdadeiro , 
    "segundos" : 10 , 
    "audioUrl" : "https://" , 
    "mimeType" : "áudio/ogg; codecs=opus" , 
    "viewOnce" : verdadeiro 
  }
}
Exemplo de retorno de vídeo#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228889000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "vídeo" : { 
    "videoUrl" : "https://" , 
    "legenda" : "" , 
    "mimeType" : "vídeo/mp4" , 
    "segundos" : 13 , 
    "viewOnce" : verdadeiro 
  }
}
Exemplo de retorno de template de vídeo#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "0E4AD761B62E3D5EF9" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1708456287181 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "5544999999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "hydratedTemplate" : { 
    "cabeçalho" : { 
      "vídeo" : { 
        "videoUrl" : "https://exemplo.mp4" , 
        "legenda" : "" , 
        "mimeType" : "vídeo/mp4" , 
        "largura" : 0 , 
        "altura" : 0 , 
        "segundos" : 0 , 
        "viewOnce" : falso 
      }
    } ,
    "message": "texto da mensagem",
    "footer": "rodapé da mensagem",
    "title": "título da mensagem",
    "templateId" : "938481574354947" , 
    "Botõeshidratados" : [ ] 
  }
}
Exemplo de retorno de PTV#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : verdadeiro , 
  "momento" : 1688496074000 , 
  "status" : "RECEBIDO" , 
  "chatName": "eu",
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "participantPhone" : "5544999999999" , 
  "messageExpirationSeconds" : 0 , 
  "encaminhado" : verdadeiro , 
  "tipo" : "Retorno de chamada recebido" , 
  "vídeo" : { 
    "videoUrl" : "https://" , 
    "legenda" : "" , 
    "mimeType" : "vídeo/mp4" 
  }
}
Exemplo de retorno de contato#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228925000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "contato" : { 
    "displayName" : "Cesar Baleco" , 
    "vCard" : "INÍCIO:VCARD\nVERSÃO:3.0\nN:;nome;;;\nFN:nome\nTEL;tipo=CELULAR;tipo=VOZ;waid=5544999999999:+55 44 9999-9999\nFIM:VCARD" , 
    "telefones" : [ "5544999999999" ] 
  }
}
Exemplo de retorno de documento#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228955000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "documento" : { 
    "documentUrl" : "https://" , 
    "mimeType" : "aplicativo/pdf" , 
    "title": "nome",
    "contagem de páginas" : 1 , 
    "fileName" : "nome.pdf" 
  }
}
Exemplo de retorno de template de documento#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "9D968A5FA2880508C4" , 
  "telefone" : "554499999999" , 
  "fromMe" : falso , 
  "momento" : 1708455444850 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "554499999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "hydratedTemplate" : { 
    "cabeçalho" : { 
      "documento" : { 
        "legenda" : nula , 
        "documentUrl" : "https://example.pdf" , 
        "mimeType" : "aplicativo/pdf" , 
        "título" : "" , 
        "pageCount" : 0 , 
        "nomedoarquivo" : "" 
      }
    } ,
    "message": "texto da mensagem",
    "footer": "rodapé da mensagem",
    "title": "título da mensagem",
    "templateId" : "811492407484976" , 
    "Botõeshidratados" : [ ] 
  }
}
Exemplo de retorno de localização#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228970000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "localização" : { 
    "longitude" : -99,9999999999999999 , 
    "latitude" : -99,9999999999999999 , 
    "endereço" : "" , 
    "url" : "" 
  }
}
Exemplo de retorno de template de localização#
{
  "isStatusReply" : falso , 
  "chatLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "3C67AB641C8AA0412F6A2242B4E23AC7" , 
  "mensagemId" : "27BBF23E0185D363D9" , 
  "telefone" : "554499999999" , 
  "fromMe" : falso , 
  "momento" : 1708456969808 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "554499999999" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "fromApi" : falso , 
  "hydratedTemplate" : { 
    "cabeçalho" : { 
      "localização" : { 
        "longitude" : -46,6388 , 
        "latitude" : -23,5489 , 
        "name": "nome do lugar",
        "address": "nome do enderço",
        "url" : "" 
      }
    } ,
    "message": "texto da mensagem",
    "footer": "rodapé da mensagem",
    "title": "título da mensagem",
    "templateId" : "1143940003434066" , 
    "Botõeshidratados" : [ ] 
  }
}
Exemplo de retorno de sticker#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228982000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "adesivo" : { 
    "stickerUrl" : "https://" , 
    "mimeType" : "imagem/webp" 
  }
}
Exemplo de retorno de GIF#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228889000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "vídeo" : { 
    "videoUrl" : "https://" , 
    "legenda" : "" , 
    "mimeType" : "vídeo/mp4" 
  }
}
Exemplo de retorno de pagamento feito#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632229683000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "solicitarPagamento" : { 
    "valor" : 1 , 
    "currencyCode" : "BRL" , 
    "expiração" : 1632834482000 , 
    "requestPhone" : "5544999999999" , 
    "paymentInfo" : { 
      "receptorPhone" : "5544999999999" , 
      "valor" : 1 , 
      "currencyCode" : "BRL" , 
      "status" : "AGUARDANDO" , 
      "transactionStatus" : "COLETA_SUCESSO" 
    }
  }
}
Exemplo de retorno de pedido de pagamento#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : verdadeiro , 
  "momento" : 1632230332000 , 
  "status" : "MENSAGEM_RECEBIDA" , 
  "chatName" : "nome" , 
  "senderName" : "nome" , 
  "participantPhone" : "5544999999999" , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "SOLICITAÇÃO_DE_PAGAMENTO_RECUSADA" , 
  "parâmetrosdenotificação" : [ "5544999999999" , "BRL" , "1000" ]   
}
Exemplo de retorno de recebimento de pagamento#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632230512000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "enviarPagamento" : { 
    "paymentInfo" : { 
      "receptorPhone" : "5544999999999" , 
      "valor" : 1 , 
      "currencyCode" : "BRL" , 
      "status" : "COMPLETO" , 
      "transactionStatus" : "SUCESSO" 
    }
  }
}
Exemplo de retorno de ligação recebida#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "isEdit" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "mensagemId" : "1679655074-84" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1679661190000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "CALL_VOICE" , 
  "parâmetros de notificação" : [ ] , 
  "callId" : "F44E0E2011E7C784BB9A4AC11749C436" 
}
Exemplo de retorno de ligação perdida#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "mensagemId" : "1679655074-103" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1679661194000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "nomeDoRemetente" : "" , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "CHAMADA_DE_VOZ_PERDIDA" , 
  "parâmetros de notificação" : [ ] , 
  "callId" : "F44E0E2011E7C784BB9A4AC11749C436" 
}
Exemplo de solicitação de entrada em grupo através de um link de convite#
{
  "isGroup" : verdadeiro , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999-grupo" , 
  "connectedPhone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1682017970000 , 
  "expiresAt" : nulo , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantPhone" : "5544999999999" , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "SOLICITAR_APROVAÇÃO_DE_MEMBRO" , 
  "parâmetros de notificação" : [ 
      "5544999999999"
  ] ,
  "callId" : nulo , 
  "código" : nulo , 
  "requestMethod" : "link_de_convite" 
}
Exemplo de solicitação de entrada em grupo revogada pelo usuário#
{
  "isGroup" : verdadeiro , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999-grupo" , 
  "connectedPhone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1682017970000 , 
  "expiresAt" : nulo , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantPhone" : "5544999999999" , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "PEDIDOS_DE_ASSOCIAÇÃO_REVOGADOS" , 
  "parâmetros de notificação" : [ 
      "5544999999999"
  ] ,
  "callId" : nulo , 
  "código" : nulo 
}
Exemplo de solicitação de entrada em grupo adicionado por um participante#
{
  "isGroup" : verdadeiro , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999-grupo" , 
  "connectedPhone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1682017970000 , 
  "expiresAt" : nulo , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantPhone" : "5544999999999" , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "SOLICITAR_APROVAÇÃO_DE_MEMBRO" , 
  "parâmetros de notificação" : [ 
      "55449999999999" ,
      "5544888888888"
  ] ,
  "callId" : nulo , 
  "código" : nulo , 
  "requestMethod" : "não_admin_add" 
}
Exemplo de admin promovido a um canal#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "mensagemId" : "464201093" , 
  "telefone" : "55449999999999@newsletter" , 
  "fromMe" : falso , 
  "momento" : 1682017970000 , 
  "status" : "RECEBIDO" , 
  "chatName": "nome do canal",
  "senderPhoto" : nulo , 
  "nomeDoRemetente" : "" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantPhone" : "5544999999999" , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "NEWSLETTER_ADMIN_PROMOTE" , 
  "parâmetros de notificação" : [ "5544999999999" , "ADMIN" ] ,  
  "callId" : nulo 
}
Exemplo de admin removido de um canal#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "mensagemId" : "464201093" , 
  "telefone" : "55449999999999@newsletter" , 
  "fromMe" : falso , 
  "momento" : 1682017970000 , 
  "status" : "RECEBIDO" , 
  "chatName":"nome do canal", 
  "senderPhoto" : nulo , 
  "nomeDoRemetente" : "" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantPhone" : "5544999999999" , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "NEWSLETTER_ADMIN_DEMOTE" , 
  "notificationParameters" : [ "5544999999999" , "ASSINANTE" ] ,  
  "callId" : nulo 
}
Exemplo de retorno de produto#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632233527000 , 
  "status" : "RECEBIDO" , 
  "senderPhoto" : "https://" , 
  "senderName" : "5544999999999" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "produto" : { 
    "productImage" : "https://" , 
    "businessOwnerJid" : "5544999999999" , 
    "currencyCode" : "BRL" , 
    "productId" : "9999999999999999999999" , 
    "descrição" : "" , 
    "productImageCount" : 1 , 
    "preço" : 1 , 
    "url" : "" , 
    "retailerId" : "" , 
    "primeiraImagemId" : "" , 
    "título" : "nome" 
  }
}
Exemplo de retorno de carrinho#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632233527000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : nulo , 
  "senderName" : "nome" , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "ordem" : { 
    "itemCount" : 1 , 
    "orderId" : "422508169684569" , 
    "mensagem" : "" , 
    "orderTitle" : "nome" , 
    "ID do vendedor" : "5544999999999" , 
    "thumbnailUrl" : "https://" , 
    "token" : "AR5d4yUr+DmSzeCR2kUtPEeMfS+eG0O+S/T/17B+oY1mfA==" , 
    "moeda" : "BRL" , 
    "total" : 2000 , 
    "subTotal" : 2000 , 
    "produtos" : [ 
      {
        "quantidade" : 1 , 
        "nome" : "nomeProduto" , 
        "ID do produto" : "5338924696127051" , 
        "retailerId" : "1242" , 
        "preço" : 2000 , 
        "currencyCode" : "BRL" 
      }
    ]
  }
}
Exemplo de retorno de enquete#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228638000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "enquete" : { 
    "question": "Qual a melhor API de WhatsApp?",
    "pollMaxOptions" : 0 , 
    "opções" : [ 
      {
        "nome" : "Z-API" 
      } ,
      {
        "name": "Outras"
      }
    ]
  }
}
Exemplo de retorno de resposta de enquete#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228638000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone": "se for grupo esse será o participante que respondeu",
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "votação na enquete" : { 
    "pollMessageId": "ID da mensagem de enquete que foi respondida",
    "opções" : [ 
      {
        "nome" : "Z-API" 
      }
    ]
  }
}
Exemplo de retorno de envio de pedido#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228925000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "reviewAndPay" : { 
    "tipo" : "bens físicos" , 
    "moeda" : "BRL" , 
    "referenceId" : "4N9AVI38VOB" , 
    "orderRequestId" : "4N9AVI38VYZ" , 
    "orderStatus" : "pendente" , 
    "paymentStatus" : "pendente" , 
    "total" : 605 , 
    "subTotal" : 600 , 
    "desconto" : 10 , 
    "envio" : 5 , 
    "imposto" : 10 , 
    "produtos" : [ 
      {
        "nome" : "pedido 1" , 
        "quantidade" : 2 , 
        "isCustomItem" : verdadeiro , 
        "productId" : "item personalizado-4N9AVI38WI1" , 
        "valor" : 150 
      } ,
      {
        "nome" : "ordem 2" , 
        "quantidade" : 2 , 
        "isCustomItem" : falso , 
        "ID do produto" : "23940797548900636" , 
        "valor" : 150 
      }
    ]
  }
}
Exemplo de retorno de atualização de pedido#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228925000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "reviewOrder" : { 
    "moeda" : "BRL" , 
    "referenceId" : "4N9AVI38VOB" , 
    "orderRequestId" : "4N9AVI38VYZ" , 
    "orderStatus" : "processando" , 
    "paymentStatus" : "pendente" , 
    "total" : 605 , 
    "subTotal" : 600 , 
    "desconto" : 10 , 
    "envio" : 5 , 
    "imposto" : 10 , 
    "produtos" : [ 
      {
        "nome" : "pedido 1" , 
        "quantidade" : 2 , 
        "isCustomItem" : verdadeiro , 
        "productId" : "item personalizado-4N9AVI38WI1" , 
        "valor" : 150 
      } ,
      {
        "nome" : "ordem 2" , 
        "quantidade" : 2 , 
        "isCustomItem" : falso , 
        "ID do produto" : "23940797548900636" , 
        "valor" : 150 
      }
    ]
  }
}
Exemplo de retorno de convite admin de canal#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : falso , 
  "momento" : 1632228925000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "newsletterAdminInvite" : { 
    "newsletterId" : "120363166555745933@newsletter" , 
    "newsletterName" : "Teste" , 
    "text": "Quero convidar vocÃª para ser admin do meu canal no WhatsApp.",
    "conviteExpiração" : 1706809668 
  }
}
Exemplo de retorno de fixar mensagem#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "fromMe" : verdadeiro , 
  "momento" : 1632228955000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "pinMessage" : { 
    "ação" : "fixar" , 
    "pinDurationInSecs" : 604800 , 
    "MensagemReferenciada" : { 
      "mensagemId" : "3EB0796DC6B777C0C7CD" , 
      "fromMe" : verdadeiro , 
      "telefone" : "554499999999" , 
      "participante" : nulo 
    }
  }
}
Exemplo de retorno de evento#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : verdadeiro , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "120363019502650977-grupo" , 
  "fromMe" : falso , 
  "momento" : 1632228638000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "evento" : { 
    "name": "Nome do evento",
    "description": "Descrição do evento",
    "cancelado" : falso , 
    "joinLink" : "https://call.whatsapp.com/video/v9123XNFG50L6iO79NddXNvKQr6bb3" , 
    "scheduleTime" : 1716915653 , 
    "localização" : { } 
  }
}
Exemplo de retorno de resposta de evento#
{
  "isStatusReply" : falso , 
  "senderLid" : "81896604192873@lid" , 
  "connectedPhone" : "554499999999" , 
  "waitingMessage" : falso , 
  "isEdit" : falso , 
  "isGroup" : verdadeiro , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "120363019502650977-grupo" , 
  "fromMe" : falso , 
  "momento" : 1632228638000 , 
  "status" : "RECEBIDO" , 
  "chatName" : "nome" , 
  "senderPhoto" : "https://" , 
  "senderName" : "nome" , 
  "participantPhone" : nulo , 
  "participantLid" : nulo , 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "eventoResponse" : { 
    "resposta" : "INCLUINDO" , 
    "respostaDe" : "554499999999" , 
    "tempo" : 1714423417000 , 
    "MensagemReferenciada" : { 
      "messageId" : "D2D612289D9E8F62307D72409A8D9DC3" , 
      "fromMe" : falso , 
      "telefone" : "120363239161320697-grupo" , 
      "participante" : "554499999988" 
    }
  }
}
Exemplo de retorno de "aguardando mensagem"#
{
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "messageId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "momento" : 1736797729000 , 
  "status" : "RECEBIDO" , 
  "fromMe" : verdadeiro , 
  "telefone" : "5544999999999" , 
  "chatName" : "bate-papo" , 
  "senderName" : "nome" , 
  "senderPhoto" : nulo , 
  "foto" : nula , 
  "transmitir" : falso , 
  "participantLid" : nulo , 
  "tipo" : "Retorno de chamada recebido" , 
  "waitingMessage" : verdadeiro , 
  "viewOnce" : verdadeiro 
}
Exemplo de retorno de alteração do Nome do Whatsapp conectado#
{
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "connectedPhone" : "5544999999999" , 
  "fromMe" : verdadeiro , 
  "momento" : 1736797729000 , 
  "expiresAt" : nulo , 
  "status" : "RECEBIDO" , 
  "chatName" : nulo , 
  "senderPhoto" : "https://" , 
  "senderName": "nome",
  "foto" : "https://" , 
  "transmitir" : falso , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "NOME_DO_PERFIL_ATUALIZADO" , 
  "callId" : nulo , 
  "código" : nulo , 
  "profileName": "nome atualizado"
}
Exemplo de retorno de alteração da foto do Whatsapp conectado#
{
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "connectedPhone" : "5544999999999" , 
  "fromMe" : verdadeiro , 
  "momento" : 1736797729000 , 
  "expiresAt" : nulo , 
  "status" : "RECEBIDO" , 
  "chatName" : nulo , 
  "senderPhoto" : "https://" , 
  "senderName":"nome", 
  "foto" : "https://" , 
  "transmitir" : falso , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "FOTO_DO_PERFIL_ATUALIZADA" , 
  "callId" : nulo , 
  "código" : nulo , 
  "fotoatualizada" : "https://" 
}
Exemplo de retorno de alteração de etiquetas de um chat#
{
  "isGroup" : falso , 
  "isNewsletter" : falso , 
  "instanceId" : "A20DA9C0183A2D35A260F53F5D2B9244" , 
  "telefone" : "5544999999999" , 
  "connectedPhone" : "5544999999999" , 
  "fromMe" : verdadeiro , 
  "momento" : 1736797729000 , 
  "expiresAt" : nulo , 
  "status" : "RECEBIDO" , 
  "chatName" : nulo , 
  "senderPhoto" : nulo , 
  "senderName" : "nome" , 
  "foto" : nula , 
  "transmitir" : falso , 
  "referenceMessageId" : nulo , 
  "externalAdReply" : nulo , 
  "encaminhado" : falso , 
  "tipo" : "Retorno de chamada recebido" , 
  "notificação" : "CHAT_LABEL_ASSOCIATION" , 
  "parâmetros de notificação" : [ 
    {
      "telefone" : "5544977777777" , 
      "rótulo" : "1" , 
      "atribuído" : verdadeiro 
    } ,
    {
      "telefone" : "5544988888888" , 
      "rótulo" : "2" , 
      "atribuído" : falso 
    }
  ] ,
  "callId" : nulo , 
  "código" : nulo 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Resposta de notificação #
Conceituação#
As notificações são mensagens de WhatsApp que se baseiam em modelos de mensagens prévias do WhatsApp.

Posto dessa forma, aqui estão documentadas as notificações que recebemos, caso não queira receber essas notificações é necessário ignorar a mensagem quando ela chegar com o atributo notification.

Exemplos#
caso 'PEDIDO_DE_APROVAÇÃO_DE_MEMBRO' :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Participante " + valor2.notificationparameters + " solicitou participar do grupo<br><br></span>" + campohora + "</div></div>"
quebrar;
caso 'SAÍDA_DO_PARTICIPANTE_DO_GRUPO' :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Participante " + valor2.notificationparameters + " saiu do grupo!<br><br></span>" + campohora + "</div></div>"
quebrar;
caso 'E2E_ENCRYPTED' :
// bloco de código
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>As mensagens são protegidas com a criptografia<br><br></span>" + campohora + "</div></div>"
quebrar;
caso 'GROUP_CREATE' :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Criou o grupo \'" + valor2.notificationparameters + "\'<br><br></span>" + campohora + "</div></div>"
quebrar;
caso 'GROUP_PARTICIPANT_ADD' :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Participante " + valor2.notificationparameters + " adicionado.<br><br></span>" + campohora + "</div></div>"
quebrar;
caso "CHAMADA_VOZ_PERDIDA" :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Chamada de voz perdida!<br><br></span>" + campohora + "</div></div>"
quebrar
caso "CHAMADA_VÍDEO_PERDIDA" :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Chamada de vídeo perdida!<br><br></span>" + campohora + "</div></div>"
quebrar;
caso 'GROUP_PARTICIPANT_REMOVE' :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Participante " + valor2.notificationparameters + " foi removido.<br><br></span>" + campohora + "</div></div>"
quebrar;
caso "TEXTO CIFRADO" :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>As mensagens são protegidas com a criptografia de ponta.<br><br></span>" + campohora + "</div></div>"
quebrar;
caso "BLUE_MSG_SELF_PREMISE_UNVERIFIED" :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Você está conversando com uma conta comercial, mas ainda não foi confirmada pelo WhatsApp.<br><br></span>" + campohora + "</div></div>"
quebrar;
caso "BLUE_MSG_SELF_PREMISE_VERIFIED" :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Você está conversando com uma conta comercial verificada pelo WhatsApp.<br><br></span>" + campohora + "</div></div>"
quebrar;
caso "BIZ_MOVE_TO_CONSUMER_APP" :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Esta conta comercial agora está registrada como uma conta pessoal e pode não mais pertencer a uma empresa.<br><br></span>" + campohora + "</div></div>"
quebrar;
caso "REVOKE" :
campo_html = "<div align='center'><div class='alert alert-primary' role='alert'><span>Apagou uma mensagem.<br><br></span>" + campohora + "</div></div>"
quebrar;

Ao desconectar

Conceituação#
Esse é o webhook de resposta de desconexão

Atenção
O Z-API não aceita webhooks que não sejam HTTPS

Atualizando Webhook#
Para atualizar a rota do webhook é possível fazer isso pela API ou pelo painel administrativo.

Dica
É possível alterar todos os webhooks de uma vez para a mesma URL. Ver endpoint.

API #
/atualização-webhook-desconectado #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-webhook-disconnected

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "valor" : "https://endereco-do-seu-sistema.com.br/instancia/SUA_INSTANCIA/desconectado" 
}
Painel Administrativo#
imagem

Retorna dois webhooks #
Os possíveis retornos do webhook on-whatsapp-disconnected estão cadastrado logo abaixo:

Resposta #
Atributos	Tipo	Descrição
momento	inteiro	Momento em que a instância foi desconectada do número.
erro	corda	Descrição do erro.
desconectado	booleano	Indicação se a instância está conectada com o número ou não.
tipo	corda	Tipo do evento da instância, nesse caso será "DisconnectedCallback".
200 #
{
  "momento" : 1580163342 , 
  "erro" : "O dispositivo foi desconectado" , 
  "desconectado" : verdadeiro , 
  "tipo" : "DisconnectedCallback" , 
  "instanceId" : "instance.id" 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Status da mensagem

Conceituação#
Esse é o webhook de retorno do status da mensagem

Atenção
O Z-API não aceita webhooks que não sejam HTTPS

Atualizando Webhook#
Para atualizar a rota do webhook é possível fazer isso pela API ou pelo painel administrativo.

Dica
É possível alterar todos os webhooks de uma vez para a mesma URL. Ver endpoint.

API #
/atualizar-status-do-webhook #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-webhook-message-status

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "valor" : "https://endereco-do-seu-sistema.com.br/instancia/SUA_INSTANCIA/status" 
}
Painel Administrativo#
imagem

Retorna dois webhooks #
Os possíveis retornos do webhook on-whatsapp-message-status-changes estão cadastrado logo abaixo:

Resposta #
Atributos	Tipo	Descrição
status	corda	Status da mensagem (SENT - se foi enviada, RECEIVED - se foi recebida, READ - se foi lida, READ_BY_ME - se foi lida por você (número conectado na sua instância), PLAYED - se foi ouvida )
eu ia	corda	Identificador(es) da(s) mensagem(ns).
momento	inteiro	Momento em que a instância foi desconectada do número.
telefoneDispositivo	inteiro	Indica o dispositivo que ocorreu o evento (0 - Celular)
telefone	corda	Número de telefone de destino da mensagem.
tipo	corda	Tipo do evento da instância, nesse caso será "MessageStatusCallback".
éGrupo	booleano	Indica se o chat é um grupo
200 #
{
  "instanceId" : "instance.id" , 
  "status" : "ENVIADO" , 
  "ids" : [ "99999999999999999999999" ] , 
  "momento" : 1632234645000 , 
  "dispositivo de telefone" : 0 , 
  "telefone" : "5544999999999" , 
  "tipo" : "MessageStatusCallback" , 
  "isGroup" : falso 
}
{
  "instanceId" : "instance.id" , 
  "status" : "RECEBIDO" , 
  "ids" : [ "99999999999999999999999" ] , 
  "momento" : 1632234645000 , 
  "dispositivo de telefone" : 0 , 
  "telefone" : "5544999999999" , 
  "tipo" : "MessageStatusCallback" , 
  "isGroup" : falso 
}
{
  "instanceId" : "instance.id" , 
  "status" : "LIGADO" , 
  "ids" : [ "99999999999999999999999" ] , 
  "momento" : 1632234645000 , 
  "dispositivo de telefone" : 0 , 
  "telefone" : "5544999999999" , 
  "tipo" : "MessageStatusCallback" , 
  "isGroup" : falso 
}
{
  "instanceId" : "instance.id" , 
  "status" : "LIDO_POR_MIM" , 
  "ids" : [ "99999999999999999999999" ] , 
  "momento" : 1632234645000 , 
  "dispositivo de telefone" : 0 , 
  "telefone" : "5544999999999" , 
  "tipo" : "MessageStatusCallback" , 
  "isGroup" : falso 
}
{
  "instanceId" : "instance.id" , 
  "status" : "JOGADO" , 
  "ids" : [ "99999999999999999999999" ] , 
  "momento" : 1632234645000 , 
  "dispositivo de telefone" : 0 , 
  "telefone" : "5544999999999" , 
  "tipo" : "MessageStatusCallback" , 
  "isGroup" : falso 
}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Status do chat

Conceituação#
Esse é o webhook de retorno status do chat

Atenção
O Z-API não aceita webhooks que não sejam HTTPS

Atualizando Webhook#
Para atualizar a rota do webhook é possível fazer isso pela API ou pelo painel administrativo.

Dica
É possível alterar todos os webhooks de uma vez para a mesma URL. Ver endpoint.

API #
/atualizar-webhook-chat-presença #
PUT https://api.z-api.io/instances/SUA_INSTANCIA/token/SEU_TOKEN/update-webhook-chat-presence

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "valor" : "https://endereco-do-seu-sistema.com.br/instancia/SUA_INSTANCIA/presença" 
}
Painel Administrativo#
imagem

Retorna dois webhooks #
Os possíveis retornos do webhook on-chat-presence estão cadastrado logo abaixo:

Resposta #
Atributos	Tipo	Descrição
tipo	corda	Tipo do evento da instância, nesse caso será "PresenceChatCallback".
telefone	corda	Número de telefone de destino da mensagem.
status	corda	Identificador do status do chat ex: (Digitando...) status pode conter ( UNAVAILABLE, AVAILABLE, COMPOSIING, RECORDING)
visto pela última vez	carimbo de data/hora	Identificador da ultima vez presente do usuário.
200 #
Fora do chat#
{
  "tipo" : "PresenceChatCallback" , 
  "telefone" : "5544999999999" , 
  "status" : "INDISPONÍVEL" , 
  "lastSeen" : nulo , 
  "instanceId" : "instance.id" 
}
Dentro do chat#
{
  "tipo" : "PresenceChatCallback" , 
  "telefone" : "5544999999999" , 
  "status" : "DISPONÍVEL" , 
  "lastSeen" : nulo , 
  "instanceId" : "instance.id" 
}
Digitando no chat #
{
  "tipo" : "PresenceChatCallback" , 
  "telefone" : "5544999999999" , 
  "status" : "COMPOSIÇÃO" , 
  "lastSeen" : nulo , 
  "instanceId" : "instance.id" 
}
Parou de digitar ou apagou o que estava digitando#
{
  "tipo" : "PresenceChatCallback" , 
  "telefone" : "5544999999999" , 
  "status" : "PAUSADO" , 
  "lastSeen" : nulo , 
  "instanceId" : "instance.id" 
}
Aviso
Observação:

Após receber um composing ou um recording, um PAUSED será retornado quando o evento parar

O stauts PAUSED apenas é retornado se estiver usando o beta multi-devices

Gravando áudio no chat#
{
  "tipo" : "PresenceChatCallback" , 
  "telefone" : "5544999999999" , 
  "status" : "GRAVAÇÃO" , 
  "lastSeen" : nulo , 
  "instanceId" : "instance.id" 
}
Aviso
O stauts RECORDING apenas é retornado se estiver usando o beta multi-devices

405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Ao conectar
Conceituação#
Esse é o webhook de retorno de conexão do Celular com o Z-api

Esse é webhook é disparado quando o Z-API se conectada ao WhatsApp, isso pode acontecer quando le o qr-code, quando reiniciar a instancia e etc

Atenção
O Z-API não aceita webhooks que não sejam HTTPS

Atualizando Webhook#
Para atualizar a rota do webhook é possível fazer isso pela API ou pelo painel administrativo.

Dica
É possível alterar todos os webhooks de uma vez para a mesma URL. Ver endpoint.

API #
/atualização-webhook-conectado #
PUT https://api.z-api.io/instances/{id}/token/{token}/update-webhook-connected

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
{
  "valor" : "https://endereco-do-seu-sistema.com.br/instancia/SUA_INSTANCIA/status" 
}
Retorna dois webhooks #
Os possíveis retornos do webhook on-webhook-connected estão cadastrado logo abaixo:

Resposta #
Atributos	Tipo	Descrição
conectado	booleano	status da instância.
telefone	corda	Número conectado.
momento	corda	Momento em que a instância foi desconectada do número.
tipo	corda	Tipo do evento da instância, nesse caso será "ConnectedCallback" .
200 #
{

  "tipo" : 'ConnectedCallback' ,
  "conectado" : verdadeiro , 
  "momento" : 26151515154 , 
  "instanceId" : instância.id ,
  "phone": "número",,
  "instanceId" : "instance.id" 

}
405 #
Neste caso certifique que esteja enviando o corretamente a especificação do método, ou seja verifique se você enviou o POST ou PUT conforme especificado no inicio deste tópico.

415 #
Caso você receba um erro 415, certifique de adicionar na headers da requisição o "Content-Type" do objeto que você está enviando, em sua grande maioria "application/json"

Atualizar todos webhooks
Conceituação#
Esse endpoint serve para você que deseja alterar todos os webhooks para a mesma URL de uma só vez.

Atenção
O Z-API não aceita webhooks que não sejam HTTPS

Atualizando Webhooks#
API #
/atualizar-todos-webhooks #
PUT https://api.z-api.io/instances/{id}/token/{token}/atualizar-todos-webhooks

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
Obrigatórios#
Atributos	Tipo	Descrição
valor	corda	Ponto final do webhook
Opcionais#
Atributos	Tipo	Descrição
notificarEnviadoPorMe	booleano	Ativar webhook de mensagens recebidas e enviadas por mim
{
  "valor" : "https://endereco-do-seu-sistema.com.br/instancia/SUA_INSTANCIA/status" , 
  "notifySentByMe" : verdadeiro 
}
Retorno do endpoint#
200 #
{
  "valor" : booleano
}

Atualizar notificar enviadas por mim
Conceituação#
Esse endpoint serve para você habilitar a opção de receber mensagens enviadas por você através do webhook.

Atenção
Para que funcione você deve ter configurado um webhook para o evento Ao receber.

Atualizando o Wehbook#
API #
/atualização-notificação-enviada-por-mim #
PUT https://api.z-api.io/instances/{id}/token/{token}/update-notify-sent-by-me

Cabeçalho #
Chave	Valor
Token do cliente	TOKEN DE SEGURANÇA DA CONTA
Corpo da solicitação #
Obrigatórios#
Atributos	Tipo	Descrição
notificarEnviadoPorMe	booleano	Ativar webhook de mensagens recebidas e enviadas por mim
{
  "notifySentByMe" : verdadeiro 
}
Retorno do endpoint#
200 #
{
    "valor" : booleano
}