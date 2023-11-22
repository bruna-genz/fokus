import ptData from './locales/pt-br.json' assert { type: 'json' }
import enData from './locales/en.json' assert { type: 'json' }

const html = document.querySelector('html')
const seletorDeIdioma = document.querySelector('#language-select')
const elementosATraduzir = document.querySelectorAll('[lng-tag]')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarIcone = document.querySelector("#start-pause img")
const tempoNaTela = document.querySelector('#timer')

const musica = new Audio('/sons/luna-rise-part-one.mp3')
const somFim = new Audio('/sons/beep.mp3')
const somInicio = new Audio('/sons/play.wav')
const somPause = new Audio('/sons/pause.mp3')

let tempoDecorridoEmSegundos = 1500
let intervaloId = null
let objTraducao = ptData

function traduzir() {
  elementosATraduzir.forEach(el => {
    let key = el.getAttribute('lng-tag')
    if (key) {
      el.innerHTML = objTraducao[key]
    }
  })
}

function atualizarObjTraducao(idioma) {  
  switch (idioma) {
    case 'pt-br':
      objTraducao = ptData
      break;
    case 'en-us':
      objTraducao = enData
      break;
    default:
      objTraducao = enData
      break;
  }

  return objTraducao
}

seletorDeIdioma.addEventListener('change', (el) => {
  let idioma = el.target.value
  atualizarObjTraducao(idioma)
  traduzir()
})

musica.loop = true
musicaFocoInput.addEventListener('change', () => {
  if (musica.paused) {
    musica.play()
  } else {
    musica.pause()
  }
})

focoBt.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 1500
  alterarContexto('foco')
  focoBt.classList.add('active')
})

curtoBt.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 300
  alterarContexto('descanso-curto')
  curtoBt.classList.add('active')
})

longoBt.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 900
  alterarContexto('descanso-longo')
  longoBt.classList.add('active')
})

function alterarContexto(contexto) {
  mostrarTempo()
  botoes.forEach(botao=> {
    botao.classList.remove('active')
  })
  html.setAttribute('data-contexto', contexto)
  banner.setAttribute('src', `/imagens/${contexto}.png`)

  switch (contexto) {
    case "foco":
      titulo.innerHTML = objTraducao['banner-foco']
      break;
    case "descanso-curto":
      titulo.innerHTML = objTraducao['banner-descanso-curto']
      break
    case "descanso-longo":
      titulo.innerHTML = objTraducao['banner-descanso-longo']
      break
    default:
      break;
  }
}

const contagemRegressiva = () => {
  if(tempoDecorridoEmSegundos <= 0) {
    somFim.play()
    alert('Tempo finalizado')
    zerar()
    return
  }
  
  tempoDecorridoEmSegundos -= 1
  mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
  if (intervaloId) {
    zerar()
    somPause.play()
    return
  }

  somInicio.play()
  intervaloId = setInterval(contagemRegressiva, 1000)
  iniciarOuPausarBt.textContent = objTraducao['botao-pausar']
  iniciarOuPausarIcone.setAttribute('src', '/imagens/pause.png')
}

function zerar() {
  clearInterval(intervaloId)
  iniciarOuPausarBt.textContent = objTraducao['botao-comecar']
  iniciarOuPausarIcone.setAttribute('src', '/imagens/play_arrow.png')
  intervaloId = null
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoEmSegundos * 1000)
  const tempoFormatado = tempo.toLocaleString('pt-Br', {minute: '2-digit', second: '2-digit'})
  tempoNaTela.innerHTML = `${tempoFormatado}`
}

traduzir()
mostrarTempo()
