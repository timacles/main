//import { Chess } from '../node_modules/chess'

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

//var board = Chessboard('board', config)

//var board = null
var board = Chessboard('board', config)
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')


function sendMove() {
    $.get(
        '/move', 
        { 'from': game.fen()}, 
        function(r) {
            console.log('resp: ', r);
            console.log('game.fen: ', game.fen());
            board.position(r)
        }
    );     
} 

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}
// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
  sendMove()
}

 // snapback black pieces when they are dropped
function onDrop (source, target, piece, newPos, oldPos, orientation) {
    if (piece.search(/b/) !== -1) {
        return 'snapback'
    }

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'

}

$('#startBtn').on('click', board.start)
$('#clearBtn').on('click', board.clear)
$('#SendMsg').on('click', sendMove)

