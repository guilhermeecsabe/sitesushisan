// ================= TEMA CLARO / ESCURO =================
function atualizarBotaoTema() {
  var botao = document.getElementById('btnTema');
  if (botao) {
    if (document.body.classList.contains('claro')) {
      botao.textContent = '🌙';
    } else {
      botao.textContent = '☀️';
    }
  }
}

function trocarTema() {
  document.body.classList.toggle('claro');
  if (document.body.classList.contains('claro')) {
    localStorage.setItem('tema', 'claro');
  } else {
    localStorage.setItem('tema', 'escuro');
  }
  atualizarBotaoTema();
}

// ================= MENU DO CELULAR =================
function abrirMenu() {
  document.getElementById('menu').classList.toggle('aberto');
}

// ================= FUNÇÕES AUXILIARES =================
function dinheiro(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// ================= MÁSCARAS E LIMITES =================
function somenteNumeros(campo) {
  campo.value = campo.value.replace(/\D/g, '');
}

function somenteLetras(campo) {
  campo.value = campo.value.replace(/[0-9]/g, '');
}

function mascara(campo, tipo) {
  var v = campo.value.replace(/\D/g, '');

  if (tipo === 'cpf') {
    v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  if (tipo === 'telefone') {
    v = v.substring(0, 11);
    v = v.replace(/(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
  }
  if (tipo === 'cep') {
    v = v.substring(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
  }
  campo.value = v;
}

// ================= LOGIN / CADASTRO =================
function mostrarLogin() {
  document.getElementById('formLogin').style.display = 'block';
  document.getElementById('formCadastro').style.display = 'none';
  document.getElementById('abaLogin').classList.add('ativo');
  document.getElementById('abaCadastro').classList.remove('ativo');
}

function mostrarCadastro() {
  document.getElementById('formLogin').style.display = 'none';
  document.getElementById('formCadastro').style.display = 'block';
  document.getElementById('abaLogin').classList.remove('ativo');
  document.getElementById('abaCadastro').classList.add('ativo');
}

// CREATE: salva o usuário
function cadastrar() {
  var usuario = {
    nome: document.getElementById('cadNome').value,
    email: document.getElementById('cadEmail').value,
    cpf: document.getElementById('cadCpf').value,
    telefone: document.getElementById('cadTelefone').value,
    cep: document.getElementById('cadCep').value,
    endereco: document.getElementById('cadEndereco').value,
    numero: document.getElementById('cadNumero').value,
    senha: document.getElementById('cadSenha').value
  };

  if (usuario.cpf.length < 14) {
    alert('Digite o CPF completo!');
    return false;
  }
  if (usuario.telefone.length < 14) {
    alert('Digite o telefone completo!');
    return false;
  }
  if (usuario.cep.length < 9) {
    alert('Digite o CEP completo!');
    return false;
  }

  localStorage.setItem('usuario', JSON.stringify(usuario));
  alert('Cadastro realizado! Agora faça o login.');
  mostrarLogin();
  return false;
}

function entrar() {
  var guardado = localStorage.getItem('usuario');
  if (guardado == null) {
    alert('Nenhum usuário cadastrado. Faça seu cadastro primeiro!');
    return false;
  }
  var usuario = JSON.parse(guardado);
  var email = document.getElementById('logEmail').value;
  var senha = document.getElementById('logSenha').value;

  if (email === usuario.email && senha === usuario.senha) {
    localStorage.setItem('logado', 'sim');
    window.location.href = 'perfil.html';
  } else {
    alert('E-mail ou senha incorretos!');
  }
  return false;
}

function sair() {
  localStorage.removeItem('logado');
  window.location.href = 'index.html';
}

function verificarLogin() {
  var area = document.getElementById('areaLogin');
  if (area && localStorage.getItem('logado') === 'sim') {
    var usuario = JSON.parse(localStorage.getItem('usuario'));
    var primeiroNome = usuario.nome.split(' ')[0];
    area.innerHTML = '<span>Olá, ' + primeiroNome + '</span> <a class="btn-mini" href="#" onclick="sair()">Sair</a>';
  }
}

// ================= PERFIL (READ / UPDATE / DELETE) =================
function mostrarPerfil() {
  if (localStorage.getItem('logado') !== 'sim') {
    alert('Faça login para ver seu perfil.');
    window.location.href = 'login.html';
    return;
  }
  var u = JSON.parse(localStorage.getItem('usuario'));
  document.getElementById('perNome').value = u.nome;
  document.getElementById('perEmail').value = u.email;
  document.getElementById('perCpf').value = u.cpf;
  document.getElementById('perTelefone').value = u.telefone;
  document.getElementById('perCep').value = u.cep;
  document.getElementById('perEndereco').value = u.endereco;
  document.getElementById('perNumero').value = u.numero;
}

function salvarPerfil() {
  var u = JSON.parse(localStorage.getItem('usuario'));
  u.nome = document.getElementById('perNome').value;
  u.telefone = document.getElementById('perTelefone').value;
  u.cep = document.getElementById('perCep').value;
  u.endereco = document.getElementById('perEndereco').value;
  u.numero = document.getElementById('perNumero').value;
  localStorage.setItem('usuario', JSON.stringify(u));
  alert('Dados atualizados!');
  return false;
}

function excluirConta() {
  if (confirm('Tem certeza que deseja excluir sua conta?')) {
    localStorage.removeItem('usuario');
    localStorage.removeItem('logado');
    localStorage.removeItem('pedidos');
    localStorage.removeItem('carrinho');
    window.location.href = 'index.html';
  }
}

// ================= PRODUTOS: BUSCA E FILTRO =================
var categoriaAtual = 'todos';

function filtrarProdutos() {
  var texto = document.getElementById('busca').value.toLowerCase();
  var cards = document.getElementsByClassName('produto');

  for (var i = 0; i < cards.length; i++) {
    var nome = cards[i].getAttribute('data-nome').toLowerCase();
    var cat = cards[i].getAttribute('data-cat');
    var achouTexto = nome.indexOf(texto) > -1;
    var achouCategoria = (categoriaAtual === 'todos' || categoriaAtual === cat);

    if (achouTexto && achouCategoria) {
      cards[i].style.display = 'flex';
    } else {
      cards[i].style.display = 'none';
    }
  }
}

function escolherCategoria(categoria, botao) {
  categoriaAtual = categoria;
  var botoes = document.getElementsByClassName('filtro');
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove('ativo');
  }
  botao.classList.add('ativo');
  filtrarProdutos();
}

function buscaDaUrl() {
  var campo = document.getElementById('busca');
  if (campo) {
    var params = new URLSearchParams(window.location.search);
    var termo = params.get('busca');
    if (termo) {
      campo.value = termo;
      filtrarProdutos();
    }
  }
}

// ================= CARRINHO =================
function pegarCarrinho() {
  var dados = localStorage.getItem('carrinho');
  if (dados == null) {
    return [];
  }
  return JSON.parse(dados);
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContador();
}

function atualizarContador() {
  var carrinho = pegarCarrinho();
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].qtd;
  }
  var contadores = document.getElementsByClassName('contador');
  for (var j = 0; j < contadores.length; j++) {
    contadores[j].textContent = total;
  }
}

function adicionar(nome, preco, emoji) {
  var carrinho = pegarCarrinho();
  var achou = false;
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      carrinho[i].qtd = carrinho[i].qtd + 1;
      achou = true;
    }
  }
  if (!achou) {
    carrinho.push({ nome: nome, preco: preco, emoji: emoji, qtd: 1 });
  }
  salvarCarrinho(carrinho);
  alert(nome + ' foi adicionado ao carrinho!');
}

var desconto = 0;

function mostrarCarrinho() {
  var carrinho = pegarCarrinho();
  var lista = document.getElementById('listaCarrinho');
  var html = '';
  var subtotal = 0;

  if (carrinho.length === 0) {
    html = '<p class="vazio">Seu carrinho está vazio 🍣<br><a class="btn" href="produtos.html">Ver produtos</a></p>';
  }

  for (var i = 0; i < carrinho.length; i++) {
    var item = carrinho[i];
    subtotal = subtotal + item.preco * item.qtd;
    html = html + '<div class="item-carrinho">' +
      '<div class="mini">' + item.emoji + '</div>' +
      '<div class="info"><strong>' + item.nome + '</strong><br>' + dinheiro(item.preco) + '</div>' +
      '<div class="qtd"><button onclick="mudarQtd(' + i + ', -1)">-</button> ' + item.qtd + ' <button onclick="mudarQtd(' + i + ', 1)">+</button></div>' +
      '<button class="remover" onclick="removerItem(' + i + ')">🗑️</button>' +
      '</div>';
  }
  lista.innerHTML = html;

  var frete = 0;
  if (carrinho.length > 0) {
    frete = 8;
  }
  var valorDesconto = subtotal * desconto;
  document.getElementById('subtotal').textContent = dinheiro(subtotal);
  document.getElementById('frete').textContent = dinheiro(frete);
  document.getElementById('desc').textContent = '- ' + dinheiro(valorDesconto);
  document.getElementById('total').textContent = dinheiro(subtotal - valorDesconto + frete);
}

function mudarQtd(posicao, valor) {
  var carrinho = pegarCarrinho();
  carrinho[posicao].qtd = carrinho[posicao].qtd + valor;
  if (carrinho[posicao].qtd <= 0) {
    carrinho.splice(posicao, 1);
  }
  salvarCarrinho(carrinho);
  mostrarCarrinho();
}

function removerItem(posicao) {
  var carrinho = pegarCarrinho();
  carrinho.splice(posicao, 1);
  salvarCarrinho(carrinho);
  mostrarCarrinho();
}

function aplicarCupom() {
  var cupom = document.getElementById('cupom').value.toUpperCase();
  if (cupom === 'SUSHI10') {
    desconto = 0.1;
    alert('Cupom aplicado: 10% de desconto!');
  } else {
    desconto = 0;
    alert('Cupom inválido.');
  }
  mostrarCarrinho();
}

// ================= PEDIDOS =================
function finalizarPedido() {
  var carrinho = pegarCarrinho();
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  if (localStorage.getItem('logado') !== 'sim') {
    alert('Faça login para finalizar o pedido.');
    window.location.href = 'login.html';
    return;
  }

  var subtotal = 0;
  var nomes = [];
  for (var i = 0; i < carrinho.length; i++) {
    subtotal = subtotal + carrinho[i].preco * carrinho[i].qtd;
    nomes.push(carrinho[i].qtd + 'x ' + carrinho[i].nome);
  }
  var total = subtotal - subtotal * desconto + 8;

  var pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  pedidos.push({
    numero: pedidos.length + 1,
    itens: nomes.join(', '),
    total: total,
    hora: new Date().getTime(),
    cancelado: false
  });
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  localStorage.removeItem('carrinho');
  alert('Pedido realizado com sucesso!');
  window.location.href = 'pedidos.html';
}

// status muda sozinho conforme os minutos que passaram (simulação)
function pegarStatus(pedido) {
  if (pedido.cancelado) {
    return 'Cancelado';
  }
  var minutos = (new Date().getTime() - pedido.hora) / 60000;
  if (minutos < 1) { return 'Recebido'; }
  if (minutos < 2) { return 'Preparando'; }
  if (minutos < 3) { return 'A caminho'; }
  return 'Entregue';
}

function mostrarPedidos() {
  var pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  var atual = document.getElementById('pedidoAtual');
  var anteriores = document.getElementById('pedidosAnteriores');

  if (pedidos.length === 0) {
    atual.innerHTML = '<p class="vazio">Você ainda não fez nenhum pedido.</p>';
    anteriores.innerHTML = '<p class="vazio">Nada por aqui ainda.</p>';
    return;
  }

  // pedido mais recente com acompanhamento
  var ultimo = pedidos[pedidos.length - 1];
  var status = pegarStatus(ultimo);
  var etapas = ['Recebido', 'Preparando', 'A caminho', 'Entregue'];
  var posicao = etapas.indexOf(status);
  var html = '<p><strong>Pedido #' + ultimo.numero + '</strong> - ' + ultimo.itens + '</p>';

  if (status === 'Cancelado') {
    html = html + '<p class="vazio">Este pedido foi cancelado.</p>';
  } else {
    html = html + '<div class="etapas">';
    for (var i = 0; i < etapas.length; i++) {
      var classe = 'etapa';
      if (i <= posicao) { classe = 'etapa feita'; }
      html = html + '<div class="' + classe + '"><div class="bolinha"></div>' + etapas[i] + '</div>';
    }
    html = html + '</div>';
    if (status === 'Recebido') {
      html = html + '<button class="btn contorno" onclick="cancelarPedido(' + (pedidos.length - 1) + ')">Cancelar pedido</button>';
    }
  }
  atual.innerHTML = html;

  // lista completa
  var lista = '';
  for (var j = pedidos.length - 1; j >= 0; j--) {
    var p = pedidos[j];
    lista = lista + '<div class="pedido-linha">' +
      '<div><strong>Pedido #' + p.numero + '</strong><br><small>' + p.itens + '</small></div>' +
      '<div>' + dinheiro(p.total) + '</div>' +
      '<span class="status">' + pegarStatus(p) + '</span>' +
      '</div>';
  }
  anteriores.innerHTML = lista;
}

function cancelarPedido(posicao) {
  var pedidos = JSON.parse(localStorage.getItem('pedidos'));
  pedidos[posicao].cancelado = true;
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  mostrarPedidos();
}

// ================= AO ABRIR QUALQUER PÁGINA =================
if (localStorage.getItem('tema') === 'claro') {
  document.body.classList.add('claro');
}
atualizarBotaoTema();
atualizarContador();
verificarLogin();
