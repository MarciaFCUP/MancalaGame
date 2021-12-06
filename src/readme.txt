BOARD
representacao do tabuleiro com:
-sides: obj com 2 prop cujos nomes sao os nicks dos 2 players
-turn: string que indica o jogador com a vez de jogador


para cada nick(propriedade) um objeto:
-store: numero- sementes no seu armazem
-pits: array com numero sementes de cada cavidade


{
    "sides" : {
       "zp"     : {
           "store": 0,
           "pits": [ 4, 4, 4, 4, 4, 4 ]
           }
       "jpleal" : {
           "store": 0,
           "pits": [ 4, 4, 4, 4, 4, 4 ]
           }
    },
    "turn": "zp"
}


ERROR
todas as funcoes produzem erro sempre que a respota diferente de 200

GAME
id gerado quando um jogador pede para ser emparelhado(join)

RANKING
tabela classificativa, cada linha:
nick - nº vitorias - nº jogos que particidou para as mesmas dimensoes do board


WINNER
nik que venceu, pode ser null se terminar sem vencedor
não esquercer de fechar server sent event do jogo