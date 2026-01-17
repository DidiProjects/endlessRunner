# Pixel Runner 🎮

Um jogo **Endless Runner** estilo retrô construído com **Phaser 3** e **TypeScript**.

![Retro Style](https://img.shields.io/badge/Style-Retro%20Pixel%20Art-e94560)
![Phaser 3](https://img.shields.io/badge/Phaser-3.70-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🎯 Características

- **Estilo Visual Retrô**: Gráficos pixel art gerados proceduralmente
- **Física Arcade**: Sistema de física do Phaser para movimento suave
- **Double Jump**: Sistema de pulo duplo para maior controle
- **Parallax Scrolling**: Múltiplas camadas de fundo com efeito parallax
- **Power-ups**: Escudo, magnetismo e velocidade
- **Sistema de Pontuação**: High score salvo localmente
- **Efeitos de Partículas**: Poeira, faíscas e rastros visuais
- **Responsivo**: Escala automaticamente para diferentes tamanhos de tela

## 🏗️ Arquitetura do Projeto

```
src/
├── main.ts                 # Entry point - Configuração do Phaser
├── config/
│   ├── GameConfig.ts       # Constantes e configurações do jogo
│   ├── Events.ts           # Eventos globais do jogo
│   └── index.ts
├── scenes/
│   ├── BootScene.ts        # Inicialização básica
│   ├── PreloadScene.ts     # Carregamento de assets
│   ├── MenuScene.ts        # Menu principal
│   ├── GameScene.ts        # Gameplay principal
│   └── index.ts
├── entities/
│   ├── Player.ts           # Entidade do jogador
│   ├── Obstacle.ts         # Entidade de obstáculos
│   ├── Collectible.ts      # Moedas e power-ups
│   └── index.ts
└── systems/
    ├── ObstacleManager.ts  # Gerenciamento de obstáculos
    ├── CollectibleManager.ts # Gerenciamento de coletáveis
    ├── BackgroundManager.ts # Parallax e background
    ├── CollisionSystem.ts  # Sistema de colisões
    ├── ScoreManager.ts     # Pontuação e high scores
    ├── UIManager.ts        # Interface do usuário
    ├── ParticleManager.ts  # Efeitos de partículas
    └── index.ts
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O jogo estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## 🎮 Controles

| Ação | Teclado | Mobile |
|------|---------|--------|
| Pular | `SPACE`, `W`, `↑` | Toque na tela |
| Pausar | `ESC`, `P` | - |
| Reiniciar | `SPACE`, `ENTER` | Toque na tela |

## 🎨 Design System

### Paleta de Cores Retrô

| Cor | Hex | Uso |
|-----|-----|-----|
| Primary | `#e94560` | Destaques, botões |
| Secondary | `#0f3460` | Elementos de fundo |
| Background | `#1a1a2e` | Fundo principal |
| Accent | `#16213e` | Detalhes |
| Neon Cyan | `#00fff5` | Player, efeitos |
| Neon Green | `#39ff14` | Power-ups, obstáculos |
| Gold | `#ffd700` | Moedas, pontuação |

### Técnicas Visuais Modernas

- **Pixel Art Procedural**: Todos os sprites são gerados via código
- **Efeito CRT**: Overlay com linhas de scan
- **Neon Glow**: Sombras coloridas nos elementos
- **Parallax Multi-camada**: 3+ camadas de profundidade
- **Partículas Dinâmicas**: Feedback visual imediato

## 📁 Arquitetura Detalhada

### Scenes (Cenas)

- **BootScene**: Inicializa configurações básicas e prepara o preloader
- **PreloadScene**: Carrega/gera todos os assets com barra de progresso
- **MenuScene**: Menu principal com animações e high score
- **GameScene**: Loop principal do jogo com todas as mecânicas

### Entities (Entidades)

- **Player**: Controle de movimento, pulo duplo, shield, estados
- **Obstacle**: Tipos variados (cactus, rock, bird, spike)
- **Collectible**: Moedas animadas e power-ups com efeitos

### Systems (Sistemas)

- **ObstacleManager**: Spawn procedural com dificuldade progressiva
- **CollectibleManager**: Padrões de moedas (linha, arco, zigzag)
- **BackgroundManager**: Parallax com múltiplas velocidades
- **CollisionSystem**: Detecção precisa com hitbox ajustável
- **ScoreManager**: Pontuação, milestones, persistência
- **UIManager**: HUD, menus, notificações
- **ParticleManager**: Efeitos visuais de partículas

## 🔧 Configuração

Edite `src/config/GameConfig.ts` para ajustar:

```typescript
export const GAME_CONFIG = {
  WIDTH: 800,           // Largura do canvas
  HEIGHT: 400,          // Altura do canvas
  GRAVITY: 1200,        // Força da gravidade
  
  PLAYER: {
    JUMP_VELOCITY: -500,      // Força do pulo
    DOUBLE_JUMP_VELOCITY: -400,
    MAX_JUMPS: 2,
  },
  
  SPEED: {
    INITIAL: 300,       // Velocidade inicial
    INCREMENT: 0.5,     // Aceleração por segundo
    MAX: 600,           // Velocidade máxima
  },
  // ...
};
```

## 🔮 Próximos Passos

- [ ] Adicionar efeitos sonoros e música
- [ ] Implementar sistema de skins/personagens
- [ ] Adicionar mais tipos de obstáculos
- [ ] Implementar leaderboard online
- [ ] Adicionar achievements
- [ ] Mobile touch controls aprimorados

## 📄 Licença

MIT License - sinta-se livre para usar e modificar!

---

Feito com ❤️ e Phaser 3