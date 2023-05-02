const express = require("express");           // importa o módulo express
const https = require("https");               // importa o módulo https
const bodyParser = require("body-parser");    // importa o módulo body-parser

const app = express();                             // cria uma instância do objeto express
app.use(bodyParser.urlencoded({extended: true}));  // usa o body-parser para analisar dados do formulário HTML

app.get("/", function(req, res){            // define uma rota padrão para a página inicial
  res.sendFile(__dirname + "/index.html");  // envia o arquivo index.html para o navegador
});

app.post("/", function(req, res){                                                                           // define uma rota para o envio do formulário
  const query = req.body.cityName                                                                           // obtém o nome da cidade do formulário enviado
  const appKey = "0f82549c84d219002a4ddfd0220e4f1c"                                                         // chave de API do OpenWeatherMap
  const unit = "metric"                                                                                     // define a unidade de medida da temperatura
  const url ="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+appKey+"&units="+unit+""; // URL da API para obter dados do clima

  https.get(url, function(response){     // faz uma solicitação GET para a API do OpenWeatherMap
    console.log(response.statusCode);    // exibe o código de status da resposta no console

    response.on("data", function(data){                                         // quando os dados são recebidos da API
      const weatherData = JSON.parse(data);                                     // converte os dados JSON em um objeto JavaScript
      const temp = weatherData.main.temp                                        // obtém a temperatura atual da cidade
      const weatherDescription = weatherData.weather[0].description             // obtém a descrição do clima atual da cidade
      const icon = weatherData.weather[0].icon                                  // obtém o ícone do clima atual da cidade
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"; // URL da imagem do ícone do clima

      res.write("<h1>The temperature in "+ query +" is "+ temp + " degrees Celsius.</h1>"); // envia uma mensagem de temperatura para o navegador
      res.write("<h3>The weather is currently " + weatherDescription + "</h3>");            // envia a descrição do clima para o navegador
      res.write("<img src=" + imageURL + ">")                                               // envia a imagem do ícone do clima para o navegador
      res.send();                                                                           // finaliza a resposta
    })
  })
});

app.listen(3000, function(){                   // faz o servidor escutar na porta 3000
  console.log("Server running on port 3000."); // exibe uma mensagem no console
});
