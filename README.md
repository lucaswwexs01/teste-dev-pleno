
[![Logo](logo.png)](www.cloudged.com.br)

<h1 style="text-align: center;">Desafio - Desenvolvedor Pl</h1>

## Introdução

Olá! Este desafio tem por objetivo avaliar a capacidade técnica de candidatos à vaga de desenvolvedor pleno da [CloudGed Consultoria Tributária](www.cloudged.com.br). Além disso, a avaliação consiste em analisar a capacidade de resolução de problemas e os conhecimentos técnicos específicos necessários para o cargo.

## Instruções

1.  Faça um fork deste repositório para a sua conta pessoal do GitHub.
2.  Siga as instruções do desafio.
3.  Após finalizar, faça um pull request para este repositório com a solução do desafio.
4.  Você tem até 4 dias a partir do recebimento deste teste para enviar a sua solução.

## O desafio
Uma empresa de revenda de combustíveis deseja apurar os impostos pagos pela compra e venda de combustíveis no período do ano de 2024 a fim de levantar possíveis créditos tributários. Para isso, solicita ao setor de TI que desenvolva uma aplicação que registre as compras e vendas realizadas no período aplicando automaticamente os impostos adequados e a correção monetária, onde os valores e tributos correspondentes ao período são detalhados nas tabelas abaixo:
</br>

Tabela de preços e tributos para **compra** de combustíveis:

|                 | jan   | fev   | mar   | abr   | mai   | jun   | jul   | ago   | set   | out   | nov   | dez   |
| --------------- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Gasolina (R$/l) | 5,92  | 5,95  | 5,9   | 5,94  | 5,93  | 5,9   | 5,89  | 5,99  | 6,04  | 6,01  | 6,03  | 6,08  |
| Etanol (R$/l)   | 3,38  | 3,53  | 3,56  | 3,63  | 3,82  | 3,81  | 4,09  | 4,06  | 4,07  | 4,03  | 4,02  | 4,10  |
| Diesel (R$/l)   | 5,87  | 5,88  | 5,84  | 5,85  | 5,86  | 5,83  | 5,93  | 5,93  | 5,91  | 5,92  | 5,96  | 6,01  |
|                 |       |       |       |       |       |       |       |       |       |       |       |       |
| Tributo (%)     | 17,20 | 19,30 | 18,10 | 19,20 | 19,70 | 20,10 | 20,60 | 21,10 | 21,60 | 22,10 | 22,60 | 23,10 |

</br>
</br>

Tabela de preços e tributos para **venda** de combustiveis:
|                 | jan   | fev   | mar   | abr   | mai   | jun   | jul   | ago   | set   | out   | nov   | dez   |
| --------------- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| Gasolina (R$/l) | 5,94  | 5,97  | 5,92  | 5,96  | 5,95  | 5,92  | 5,91  | 6,01  | 6,06  | 6,03  | 6,05  | 6,10  |
| Etanol (R$/l)   | 3,40  | 3,55  | 3,58  | 3,65  | 3,84  | 3,83  | 4,11  | 4,08  | 4,09  | 4,05  | 4,04  | 4,12  |
| Diesel (R$/l)   | 5,88  | 5,90  | 5,86  | 5,87  | 5,88  | 5,85  | 5,95  | 5,95  | 5,93  | 5,94  | 5,98  | 6,03  |
|                 |       |       |       |       |       |       |       |       |       |       |       |       |
| Tributo (%)     | 17,00 | 19,00 | 18,00 | 19,00 | 19,50 | 20,00 | 20,50 | 21,00 | 21,50 | 22,00 | 22,50 | 23,00 |

</br>

## Requisitos Funcionais
O sistema deverá conter as seguintes funcionalidades principais:
1. **Registro de Operações de Compra e Venda**

* O usuário deverá ser capaz de selecionar o tipo de operação (compra ou venda);
* Selecionar o tipo de produto (Gasolina, Etanol ou Diesel);
* Informar a data da operação;
* Informar a quantidade do produto (em litros);
* Salvar a operação no sistema.

2. **Cálculo do Valor Unitário Atualizado**

    O sistema registra a operação atualizando o valor com base na fórmula abaixo:

	$$\text{Valor Unitário Atualizado} = \text{Quantidade} \times \text{Preço} \times \text{Tributo} \times \text{Selic}
$$

    Onde:  
    - **Quantidade**: volume do produto em litros informado pelo usuário;  
    - **Preço**: valor tabelado do produto por litro;  
    - **Tributo**: percentual do tributo correspondente ao tipo de produto, conforme tabela definida;  
    - **Selic**: fator de correção monetária baseado na taxa Selic acumulada no período, fixada em **11,5%** para fins de cálculo.  

3. **Apresentação da Diferença entre Compras e Vendas**

    Após o registro das operações de compra e venda, o sistema deverá exibir o resultado da diferença total entre o valor de compra e o valor de venda, considerando os tributos aplicados e a correção monetária.

4. **Autenticação e Autorização** 

    O sistema deverá implementar um mecanismo de autenticação e autorização utilizando JWT (JSON Web Token), garantindo o acesso seguro às funcionalidades apenas para usuários autenticados.


5. **Cadastro de Usuários** 

    Cada usuário deverá possuir os seguintes atributos obrigatórios:
    * Nome completo;
    * Endereço de e-mail (único);
    * Senha de acesso (com critérios de segurança definidos).

## Requisitos Não Funcionais
1. **API RESTful**  
    O backend deverá ser implementado como uma API RESTful, contemplando todas as funcionalidades solicitadas nos requisitos funcionais.


2. **Persistência de Dados**  
    O sistema deverá utilizar um banco de dados relacional, sendo MySQL ou PostgreSQL, para armazenamento persistente das informações.


3. **ORM (Object-Relational Mapping)**  
    A aplicação deverá utilizar uma ORM para abstração e manipulação do banco de dados, facilitando o desenvolvimento e manutenção.


4. **Tecnologia do Backend**  
    O backend deverá ser desenvolvido em JavaScript, TypeScript ou Python, utilizando um framework adequado como Express, NestJS (Node.js), FastAPI (Python) ou similar.


5. **Tecnologia do Frontend**  
    O frontend deverá ser construído utilizando o framework React, com foco em experiência do usuário.


6. **Versionamento com Git**  
    O projeto deverá ser versionado utilizando Git, adotando as melhores práticas de convenção de commits (ex: Conventional Commits) para manter um histórico claro e organizado.

## Desafios adicionais
1. **Testes Unitários**  
    Escreva testes unitários para verificar o funcionamento correto das funcionalidades da API, garantindo a confiabilidade do backend durante o desenvolvimento e futuras alterações.


2. **Estilização com Framework de Componentes**  
    Estilize o frontend utilizando um framework de componentes para React de sua preferência, como PrimeReact, Bootstrap, Material UI, entre outros;

3. **Documentação da API com OpenAPI (Swagger)**  
    Documente a API seguindo a especificação OpenAPI (Swagger), facilitando a compreensão, consumo e testes das rotas disponíveis;


4. **Containerização com Docker**  
    Crie um Dockerfile e um arquivo docker-compose.yaml para facilitar a configuração e execução do ambiente de desenvolvimento, garantindo que o projeto seja executado de forma consistente em diferentes máquinas.

## Critérios de avaliação

-   Entendimento do problema proposto;
-   Organização do código;
-   Qualidade do código;
-   Documentação do código;
-   Cumprimento dos requisitos;
-   Boas práticas de programação;
-   Utilização de boas práticas de versionamento de código;
-   Utilização de boas práticas de desenvolvimento de APIs RESTful;
-   Utilização de boas práticas de desenvolvimento de interfaces com o usuário;
-   Utilização de boas práticas de segurança.


## Conclusão

Não se preocupe se você não conseguir finalizar todos os itens do desafio. O importante é que você consiga demonstrar suas habilidades técnicas e conhecimentos adquiridos até o momento.   
Foque em entregar um código bem organizado e documentado, e que atenda aos requisitos propostos.

Boa sorte! :rocket: