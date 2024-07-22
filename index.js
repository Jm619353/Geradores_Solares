// Módulo utilizado para manipular arquivos
const fs = require('fs');

// Produtos disponíveis em depósito
const produtos = [
  {
    "Categoria": "Painel Solar",
    "Id": 1001,
    "Potencia_em_W": 500,
    "Nome": "Painel Solar 500 W Marca A"
  },
  {
    "Categoria": "Painel Solar",
    "Id": 1002,
    "Potencia_em_W": 500,
    "Nome": "Painel Solar 500 W Marca B"
  },
  {
    "Categoria": "Painel Solar",
    "Id": 1003,
    "Potencia_em_W": 500,
    "Nome": "Painel Solar 500 W Marca C"
  },
  {
    "Categoria": "Controlador de carga",
    "Id": 2001,
    "Potencia_em_W": 500,
    "Nome": "Controlador de Carga 30A Marca E"
  },
  {
    "Categoria": "Controlador de carga",
    "Id": 2002,
    "Potencia_em_W": 750,
    "Nome": "Controlador de Carga 50A Marca E"
  },
  {
    "Categoria": "Controlador de carga",
    "Id": 2003,
    "Potencia_em_W": 1000,
    "Nome": "Controlador de Carga 40A Marca D"
  },
  {
    "Categoria": "Inversor",
    "Id": 3001,
    "Potencia_em_W": 500,
    "Nome": "Inversor 500W Marca D"
  },
  {
    "Categoria": "Inversor",
    "Id": 3002,
    "Potencia_em_W": 1000,
    "Nome": "Inversor 1000W Marca D"
  }
];

// Função para gerar um ID único de 5 dígitos para os geradores
const geradorDeId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Função para encontrar produtos compatíveis e criar geradores
const criarGeradores = (produtos) => {
  const geradores = [];

  // Filtragem dos componentes
  const paineis = produtos.filter(produto => produto.Categoria === 'Painel Solar');
  const controladores = produtos.filter(produto => produto.Categoria === 'Controlador de carga');
  const inversores = produtos.filter(produto => produto.Categoria === 'Inversor');

  // Iteração para selecionar as possíveis combinações para os geradores
  for (let inversor of inversores) {
    for (let controlador of controladores) {
      for (let painel of paineis) {
        let potenciaTotalPainel = 0;
        let numPaineis = 0;

        // Contadores para armazenar IDs e nomes únicos dos produtos
        let produtosIds = new Set();
        let produtosNomes = new Set();

        // Cálculo de soma de potência para atingir a potência do inversor 
        while (potenciaTotalPainel < inversor.Potencia_em_W) {
          potenciaTotalPainel += painel.Potencia_em_W;
          numPaineis++;
          produtosIds.add(painel.Id);
          produtosNomes.add(painel.Nome);
        }

        // Verificação de compatibilidade
        if (potenciaTotalPainel === inversor.Potencia_em_W && potenciaTotalPainel === controlador.Potencia_em_W) {
          produtosIds.add(controlador.Id);
          produtosNomes.add(controlador.Nome);
          produtosIds.add(inversor.Id);
          produtosNomes.add(inversor.Nome);

          // Criação do objeto 'Gerador'
          const gerador = {
            id: geradorDeId(),
            potencia: potenciaTotalPainel,
            produtosIds: Array.from(produtosIds),
            produtosNomes: Array.from(produtosNomes),
            quantidades: {
              [painel.Id]: numPaineis,
              [controlador.Id]: 1,
              [inversor.Id]: 1
            }
          };
          // Insere o 'gerador' na lista
          geradores.push(gerador);
        }
      }
    }
  }
  return geradores;
};

const geradores = criarGeradores(produtos);

if (geradores.length === 0) {
  console.log('Nenhum gerador foi criado.');
} else {
  // Preparar dados para CSV manualmente

  // Criar o cabeçalho do CSV
  const cabecalho = 'ID Gerador,Potencia,Produtos IDs,Produtos Nomes,Quantidades\n';

  // Mapear os geradores para uma string CSV com formatação JSON
  const linhas = geradores.map(gerador => {
    // Formatando cada campo como JSON
    const produtosIdsJson = JSON.stringify(gerador.produtosIds);
    const produtosNomesJson = JSON.stringify(gerador.produtosNomes);
    const quantidadesJson = JSON.stringify(gerador.quantidades);

    return [
      gerador.id,
      gerador.potencia,
      produtosIdsJson,
      produtosNomesJson,
      quantidadesJson
    ].join(',');
  }).join('\n');

  // Criar o conteúdo do arquivo CSV
  const conteudoCSV = cabecalho + linhas;

  // Grava as informações dos geradores no arquivo JSON
  fs.writeFileSync('geradores.json', JSON.stringify(geradores, null, 2)); 

  // Grava as informações dos geradores no arquivo CSV
  fs.writeFileSync('geradores.csv', conteudoCSV); 
  console.log(`Número total de geradores criados: ${geradores.length}`);
}
