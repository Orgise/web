/*
	Provides the basic game mechanics, such as possible moves on a board,
	whether or not the king is in check, etc.
	
	Game.js handles the game on-screen, handling board creation, user click events,
	piece moves, etc.
	
	The computer's moves are determined using a chess engine object (see Engines.js).
*/

/*
	Picks a random array element.
*/
Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

/*
	Replaces all of the oldPhrase instances with newPhrase within a string.
*/
String.prototype.replaceAll = function(oldPhrase, newPhrase) {
	return this.replace(new RegExp(oldPhrase, "g"), newPhrase);
};

/*
	Clones an object, returning the copy.
	Can be used to avoid passing arrays by reference.
*/
function CloneObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}

/*
	Governs the basic game mechanics, such as retrieving possible moves, retrieving game status, etc.
*/
var Chess;

(function() {
	Chess = {
		// Chess piece types enumeration
		pieceTypes : {
			king : 1,
			queen : 2,
			rook : 3,
			bishop : 4,
			knight : 5,
			pawn : 6
		},
		
		/*
			Returns a two-dimensional array of all spaces' black/white attack counts.
			Each array object has the following properties:
				- whiteAttacks
				- blackAttacks
			
			The members are indexed by left/top spaces, so findAttacks()[3][5] would be for the 4th
			column, 6th space.
		*/
		findAttacks : function(board) {
			var attacks = [];
			
			// Initialize our attacks array.
			for (var left = 0; left < 8; left++) {
				attacks[left] = [];
				
				for (var top = 0; top < 8; top++) {
					attacks[left][top] = {
						whiteAttacks : 0,
						blackAttacks : 0
					};
				}
			}
			
			// Returns whether or not the space is occupied with a piece.
			function CheckIfOccupied(left, top) {
				return board.spaces[left] && board.spaces[left][top] ? true : false;
			}
			
			/*
				Checks for a piece's possible moves by iterating through the list of potential
				moves (via the offsets parameter) and adding to the moves array as long as they are still
				available. Used for line-move pieces (bishop, rook, queen).
			*/
			function ProcessPiece(piece, offsets) {
				$.each(offsets, function(index, offset) {
					var evalSpace = {
						left : piece.space.left,
						top : piece.space.top
					};
					
					var occupied;
					
					do {
						evalSpace.left += offset[0];
						evalSpace.top += offset[1];
						
						// If still a valid space, increment attack count.
						if (attacks[evalSpace.left] && attacks[evalSpace.left][evalSpace.top])
							attacks[evalSpace.left][evalSpace.top][piece.color + "Attacks"]++;
						
						// Check if the space is occupied.
						occupied = CheckIfOccupied(evalSpace.left, evalSpace.top);
					
					// Keep going until we hit an occupied space, or we move off the board.
					} while (!occupied && evalSpace.left >= 0 && evalSpace.left <= 7 &&
						evalSpace.top >= 0 && evalSpace.top <= 7);
				});
			}
			
			// Add up the attacks, piece by piece.
			$(board.pieces).each(function() {
				var piece = this,
					space = piece.space;
				
				switch (piece.type) {
					case Chess.pieceTypes.king:
						// Add attack to each adjacent square.
						for (var left = -1; left <= 1; left++) {
							for (var top = -1; top <= 1; top++) {
								if ((left !== 0 || top !== 0) && attacks[space.left + left] &&
									attacks[space.left + left][space.top + top]) {
									attacks[space.left + left][space.top + top][piece.color + "Attacks"]++;
								}
							}
						}
						break;
					
					case Chess.pieceTypes.bishop:
						ProcessPiece(piece, [[-1,-1], [1,-1], [-1,1], [1,1]]);
						break;
					
					case Chess.pieceTypes.rook:
						ProcessPiece(piece, [[-1,0], [1,0], [0,1], [0,-1]]);
						break;
					
					case Chess.pieceTypes.queen:
						ProcessPiece(piece, [[-1,0], [1,0], [0,1], [0,-1], [-1,-1], [1,-1], [-1,1], [1,1]]);
						break;
					
					case Chess.pieceTypes.knight:
						// Add attack to each jump move square.
						// Check each of the eight possible moves.
						$.each([[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]], function(index, offsets) {
							// If a valid space...
							if (attacks[space.left + offsets[0]] && attacks[space.left + offsets[0]][space.top + offsets[1]])
								attacks[space.left + offsets[0]][space.top + offsets[1]][piece.color + "Attacks"]++;
						});
						break;
					
					case Chess.pieceTypes.pawn:
						// White moves up, black down.
						var topOffset = piece.color === "white" ? -1 : 1;
						
						$.each([-1, 1], function(index, leftOffset) {
							// Check two attack squares.
							if (attacks[space.left + leftOffset] && attacks[space.left + leftOffset][space.top + topOffset])
								attacks[space.left + leftOffset][space.top + topOffset][piece.color + "Attacks"]++;
						});
						
						break;
				}
			});
			
			return attacks;
		},
		
		/*
			Finds all possible moves for a given piece on a given board.
			
			board: an object with the following properties:
				- pieces: an array of piece objects (see below)
				- lastMoved: the piece object that last moved (if any) (relevant for en passant)
			
			piece: a piece object with the following properties:
				- id (id of the associated on-screen element)
				- type (of type pieceType)
				- space {left, top}; this is taken from the top left space as (0,0)
				- color ("white", "black")
				- moved (boolean): whether or not the piece has moved (relevant for castles)
			
			includeAttacks: if true, include where pieces are attacking (but are not valid moves)
			
			ignoreChecks: if true, moves that would end up in check for the player are allowed
			
			Returns an array of moves available to the piece.
			Each array member is an object with the following properties:
				- left
				- top
				- status: either "available", "take", (move will capture an opponent piece)
						  or "attacking" (meaning the piece is attacking the square)
		*/
		getPieceMoves : function(board, piece, includeAttacks, ignoreChecks) {
			/*
				Returns one of four possible results for a space:
				* invalid: the space doesn't exist on the board (out of bound)
				* available: the space is empty; it's available for moving
				* blocked: the space is filled with a piece of the same color; no move allowed
				* take: the space is filled with an opponent piece; can move and take the piece
			*/
			function EvalSpace(left, top) {
				if (left < 0 || left > 7 || top < 0 || top > 7)
					return "invalid";
				
				var pieceInSpace = board.spaces[left][top];
				
				return pieceInSpace === false ? "available" :
					(pieceInSpace.color === piece.color ? "blocked" : "take");
			}
			
			/*
				Checks for a piece's possible moves by iterating through the list of potential
				moves (via the offsets parameter) and adding to the moves array as long as they are still
				available. Used for line-move pieces (bishop, rook, queen).
			*/
			function ProcessPieceMoves(offsets) {
				$.each(offsets, function(index, offset) {
					var space = {
						left : piece.space.left,
						top : piece.space.top
					};
					
					do {
						space.left += offset[0];
						space.top += offset[1];
						
						move = EvalSpace(space.left, space.top);
						
						if (move === "available" || move === "take") {
							moves.push({
								left : space.left,
								top : space.top,
								status : move,
								piece : piece
							});
						}
					} while (move === "available");
				});
			}
			
			var moves = [],
				pieces = $(board.pieces);
			
			// Different moves per piece type...
			switch (piece.type) {
				case Chess.pieceTypes.pawn:
					// Check for forward moves.
					for (var i = 1; i <= (piece.moved ? 1 : 2); i++) {
						var top = piece.space.top + i * (piece.color === "white" ? -1 : 1),
							move = EvalSpace(piece.space.left, top);
						
						if (move === "available") {
							moves.push({
								left : piece.space.left,
								top : top,
								status : move,
								piece : piece
							});
						}
						else
							break;
					}
					
					// Check for takes.
					var top = piece.space.top + (piece.color === "white" ? -1 : 1);
					$.each([-1, 1], function(index, leftOffset) {
						var moveStatus = EvalSpace(piece.space.left + leftOffset, top);
						
						if (moveStatus === "take" || (moveStatus === "available" && includeAttacks)) {
							moves.push({
								left : piece.space.left + leftOffset,
								top : top,
								status : moveStatus === "available" ? "attacking" : "take",
								piece : piece
							});
						}
					});
					
					break;
				
				case Chess.pieceTypes.knight:
					// Check each of the eight possible moves.
					$.each([[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]], function(index, offsets) {
						var move = EvalSpace(piece.space.left + offsets[0], piece.space.top + offsets[1]);
						if (move === "available" || move === "take") {
							moves.push({
								left : piece.space.left + offsets[0],
								top : piece.space.top + offsets[1],
								status : move,
								piece : piece
							});
						}
					});
					
					break;
				
				case Chess.pieceTypes.bishop:
					ProcessPieceMoves([[-1,-1],[1,-1],[-1,1],[1,1]]);
					break;
				
				case Chess.pieceTypes.rook:
					ProcessPieceMoves([[-1,0],[1,0],[0,1],[0,-1]]);
					break;
				
				case Chess.pieceTypes.queen:
					ProcessPieceMoves([[-1,0],[1,0],[0,1],[0,-1],[-1,-1],[1,-1],[-1,1],[1,1]]);
					break;
				
				case Chess.pieceTypes.king:
					// Current space.
					var space = {
						left : piece.space.left,
						top : piece.space.top
					};
					
					// Check each neighboring square.
					for (var leftOffset = -1; leftOffset <= 1; leftOffset++) {
						for (var topOffset = -1; topOffset <= 1; topOffset++) {
							var move = EvalSpace(space.left + leftOffset, space.top + topOffset);
							if (move === "available" || move === "take") {
								moves.push({
									left : space.left + leftOffset,
									top : space.top + topOffset,
									move : move,
									piece : piece
								});
							}
						}
					}
					
					// Look for castling.
					if (!piece.moved) {
						// Get unmoved rooks.
						var unmovedRooks = pieces.filter(function() {
							return this.type === Chess.pieceTypes.rook &&
								this.color === piece.color &&
								!this.moved;
						});
						
						var possibleMoves = [];
						
						// For each unmoved rook, note the spaces to check to ensure the castling is possible.
						unmovedRooks.each(function() {
							// Left column rook.
							if (this.space.left === 0) {
								possibleMoves.push({
									rook : this,
									kingMoveSpace : {
										left : 2,
										top : piece.space.top
									},
									rookMoveSpace : {
										left : 3,
										top : piece.space.top
									},
									emptySpaces : [1, 2, 3]
								});
							}
							
							// Right column rook.
							else {
								possibleMoves.push({
									rook : this,
									kingMoveSpace : {
										left : 6
									},
									rookMoveSpace : {
										left : 5
									},
									emptySpaces : [5, 6]
								});
							}
						});
						
						// Make sure each intermediary space is empty; if not, the castling is not possible.
						$.each(possibleMoves, function(index, possibleMove) {
							// If no blocking pieces...
							if (pieces.filter(function() {
								return this.space.top === piece.space.top &&
									possibleMove.emptySpaces.indexOf(this.space.left) >= 0;
							}).length === 0) {
								// Add the castling as a possible move.
								moves.push({
									left : possibleMove.kingMoveSpace.left,
									top : piece.space.top,
									move : "available",
									piece : piece
								});
							}
						});
					}
					
					break;
			}
			
			// Make sure the found moves do not result in a check; if so, get rid of them.
			if (!ignoreChecks) {
				moves = $(moves).filter(function() {
					var move = this,
						boardAfterMove = Chess.copyAndMove(CloneObject(board), move.piece, {left : move.left, top : move.top});
					
					return Chess.getGameStatus(boardAfterMove, piece.color, true) !== "check";
				}).toArray();
			}
			
			return moves;
		},
		
		/*
			Gets an array of all legal moves by the current player.
		*/
		getAllPossibleMoves : function(board, color, ignoreChecks) {
			var allPossibleMoves = [];
			
			// For each piece on the board...
			$(board.pieces).each(function() {
				var piece = this;
				
				// Check for this piece's moves if it is this player's turn.
				if (piece.color === color) {
					// Append this list of moves to the total possible moves.
					allPossibleMoves = allPossibleMoves.concat(Chess.getPieceMoves(board, piece, false, ignoreChecks));
				}
			});
			
			return allPossibleMoves;
		},
		
		/*
			Copies the board in memory and moves the piece.
			Returns the updated board object.
		*/
		copyAndMove : function(board, piece, space) {
			var newBoard = CloneObject(board),
				pieces = $(newBoard.pieces);
			
			// If taking an opponent's piece, remove it from the game.
			var oppPiece = board.spaces[space.left][space.top];
			if (oppPiece) {
				// Remove the piece from in-memory board.
				pieces = pieces.filter(function() {
					return this.id !== oppPiece.id;
				});
				newBoard.pieces = pieces.toArray();
			}
			
			// If castling...
			if (piece.type === Chess.pieceTypes.king && Math.abs(piece.space.left - space.left) > 1) {
				// The column of the castling rook.
				var rookLeft = space.left === 2 ? 0 : 7;
				
				// The left space to which the rook should move.
				var rookMoveLeft = space.left === 2 ? 3 : 5;
				
				// Find the rook.
				var rook = pieces.filter(function() {
					return this.type === Chess.pieceTypes.rook &&
						this.color === piece.color &&
						this.space.left === rookLeft;
				}).get(0);
				
				// Update the rook in memory.
				newBoard.spaces[rook.space.left][rook.space.top] = false;
				newBoard.spaces[rookMoveLeft][rook.space.top] = rook;
				rook.space.left = rookMoveLeft;
				rook.moved = true;
			}
			
			// Move to the new space.
			var newBoardPiece = pieces.filter(function() {
				return this.id === piece.id;
			}).get(0);
			newBoard.spaces[newBoardPiece.space.left][newBoardPiece.space.top] = false;
			newBoard.spaces[space.left][space.top] = newBoardPiece;
			newBoardPiece.space = space;
			newBoardPiece.moved = true;
			
			return newBoard;
		},
		
		/*
			Determines game status.
			Possible results: "ready", "check", "stalemate", "white wins", "black wins"
			
			board: an object with a pieces property that is an array of piece objects
			
			color: whose move it is; either "white" or "black"
		*/
		getGameStatus : function(board, color, ignoreChecks) {
			var kingPieces = {},
				kingSpaces = {},
				attacks = Chess.findAttacks(board),
				oppColor = color === "black" ? "white" : "black";
			
			// Find the spaces on the board of the two kings.
			$(board.pieces).each(function() {
				// If a king, note its position and piece object.
				if (this.type === Chess.pieceTypes.king) {
					kingSpaces[this.color] = this.space;
					kingPieces[this.color] = this;
				}
			});
			
			// If neither king is being attacked, the game is open.
			if (attacks[kingSpaces["white"].left][kingSpaces["white"].top].blackAttacks === 0 &&
				attacks[kingSpaces["black"].left][kingSpaces["black"].top].whiteAttacks === 0)
				return "ready";
			else {
				// If the current player's king is attacked then it's either they're in check or they've lost.
				if (attacks[kingSpaces[color].left][kingSpaces[color].top][oppColor + "Attacks"] > 0) {
					return Chess.getAllPossibleMoves(board, color, ignoreChecks).length === 0 ?
						(color === "white" ? "black" : "white") + " wins" : "check";
				}
				else
					return "ready";
			}
		}
	};
})();
/// <reference path="jquery dev.js" />

/*
	Handles the game on-screen, handling board creation, user click events,
	piece moves, etc.
	
	The rules of chess are defined in the Chess object (see Chess.js),
	and the computer's moves are determined using a chess engine object (see Engines.js).
*/

/*
	Contains the game's state information, and provides functions to instruct the on-screen game
	to make changes in game state.
*/
var game = {
	// Piece objects array
	pieces : null,
	
	// ".space" board game elements on screen
	spaceElements : null,
	
	// Basic game state.
	curPiece : null,			// The piece the user has clickd on, to potentially move.
	turn : null,				// Whose turn it is (either "white" or "black").
	moves : null,				// An array of moves made throughout the game.
	moveShownIndex : null,		/*	
									Which move is currently visible; null if viewing the "live" game.
									Decrements as we view previous moves (via the mouse wheel).
								*/
	
	// Player types (computer, human).
	players : {
		white : null,
		black : null
	},
	
	// Player help options.
	options : {
		showAttackValues : false
	},
	
	/*
		Starts a new game.
	*/
	start : function() {
		// Remove the board, if existent.
		$(".board").remove();
		
		// Determine player types.
		game.players.white = $("#ddWhite").val();
		game.players.black = $("#ddBlack").val();
		
		// Assign engine objects to the players, if computer engines are playing.
		if (game.players.white !== "Human")
			game.players.white = engines[game.players.white];
		if (game.players.black !== "Human")
			game.players.black = engines[game.players.black];
		
		// Add game board to the page.
		var board = $("<div>", {
			id : "board",
			"class" : "board"
		}).appendTo(document.body);
		
		// Establish game elements.
		game.pieces = [];
		game.spaces = [];			// Holds pieces in a 2d array. game.spaces[2][6] would be space c2.
		game.moves = [];
		game.turn = "white";
		game.moveShownIndex = null;
		
		// Draw the game board spaces.
		for (var row = 1; row <= 8; row++) {
			var curRow = $("<div>", {
				"class" : row % 2 === 1 ? "row" : "altrow"
			}).appendTo(board);
			
			for (var col = 1; col <= 8; col++) {
				var space = $("<div>", {
					"class" : "space"
				}).appendTo(curRow).get(0);
				
				space.row = row - 1;
				space.col = col - 1;
			}
			
			// Initialize game spaces array.
			game.spaces[row - 1] = [false, false, false, false, false, false, false, false];
		}
		
		// Initialize space data.
		game.spaceElements = board.find(".space");
		
		// Initialize scoresheet and score.
		$("#Scoresheet").html("<thead><tr><th></th><th>White</th><th>Black</th></tr></thead><tbody></tbody>");
		$("#Score").html("");
		
		// Adds a piece to the game.
		function AddPiece(type, space, color) {
			// On-screen game element.
			var element = game.createPiece(type, color).appendTo(board);
			
			// Piece object.
			var piece = {
				// Onboard game piece element id
				id : element.attr("id"),
				
				// Left / top object describing the element's onboard position.
				space : space,
				
				// "white" or "black"
				color : color,
				
				// Game pieceTypes enum member value.
				type : type
			};
			
			// Place the piece on the right spot on the board.
			element.css({
				left : space.left * 100,
				top : space.top * 100
			});
			
			// Add to the pieces collection.
			game.pieces.push(piece);
			
			// Add to the games spaces.
			game.spaces[space.left][space.top] = piece;
		}
		
		// Add the back (R,Kn,B,K,Q,B,Kn,R) rows.
		var basePieces = [Chess.pieceTypes.rook, Chess.pieceTypes.knight, Chess.pieceTypes.bishop, Chess.pieceTypes.queen,
				Chess.pieceTypes.king, Chess.pieceTypes.bishop, Chess.pieceTypes.knight, Chess.pieceTypes.rook];
		$.each(basePieces, function(index, type) {
			AddPiece(type, {left : index, top : 7}, "white");
			AddPiece(type, {left : index, top : 0}, "black");
		});
		
		// Add the pawn rows.
		for (var i = 0; i < 8; i++) {
			AddPiece(Chess.pieceTypes.pawn, {left : i, top : 1}, "black");
			AddPiece(Chess.pieceTypes.pawn, {left : i, top : 6}, "white");
		}
		
		// Click event for moving pieces.
		$(".piece").click(function() {
			// Get the piece object associated with this space.
			var piece = this,
				pieceObj = $(game.pieces).filter(function() {
						return this.id === piece.id;
					}).get(0);
			
			// Check if the user is clicking a space to move.
			// This check is needed when the user clicks on an opponent's piece to take it.
			var space = game.spaceElements.eq(pieceObj.space.left + pieceObj.space.top * 8);
			if (space.hasClass("availableSpace") || space.hasClass("availableTake")) {
				game.movePiece(space.get(0));
				return;
			}
			
			// If the user clicked on the other player's piece, just exit.
			if (pieceObj.color !== game.turn)
				return;
			
			// Note the current game piece.
			game.curPiece = pieceObj;
			
			// Clear any current available space colors.
			$(".availableSpace").removeClass("availableSpace");
			$(".availableTake").removeClass("availableTake");
			
			// Note the available spaces.
			$.each(Chess.getPieceMoves({pieces : game.pieces, spaces : game.spaces}, pieceObj), function(index, move) {
				// Color available spaces for the user so they know where they can move.
				game.spaceElements.eq(move.left + move.top * 8).addClass(
					move.status === "available" ? "availableSpace" : "availableTake");
			});
		});
		
		// If the white player is the computer, start the game with the first move.
		if (game.players.white !== "Human")
			game.computerMove();
		
		$("#board").css("margin-left", function() {
			return ($(window).width() - $(this).width()) / 2 - 100;
		});
	},
	
	/*
		Creates a chess piece DOM element and returns it.
	*/
	createPiece : function(type, color) {
		// Generate random, unused, id.
		var id;
		while (!id || document.getElementById(id))
			id = ("piece" + Math.random()).replace(".", "");
		
		// Find image for this chess piece.
		var image;
		for (var prop in Chess.pieceTypes) {
			if (Chess.pieceTypes[prop] === type)
				image = prop;
		}
		
		// Add and return the chess piece DOM element.
		return $("<div>", {
			id : id,
			"class" : "piece " + image + "-" + color + " " + color + (type === Chess.pieceTypes.pawn ? " pawn" : ""),
			title : image
		});
	},
	
	/*
		Moves a piece on the screen.
		
		destination: the DOM element of the space to which the piece should be moved.
	*/
	movePiece : function(destination) {
		// Clear any current available space colors.
		$(".availableSpace").removeClass("availableSpace");
		$(".availableTake").removeClass("availableTake");
		
		// If the evaluations list is on screen, remove it.
		$("#Evaluations").remove();
		
		// The left / top coordinates of the destination space.
		var spaceIndex = $(".space").index(destination),
			space = {
				left : spaceIndex % 8,
				top : Math.floor(spaceIndex / 8)
			};
		
		// If taking an opponent's piece, remove it from the game.
		var oppPiece = $(game.pieces).filter(function() {
			return this.space.left === space.left && this.space.top === space.top;
		}).get(0);
		if (oppPiece) {
			// Remove the piece element from the page.
			$("#" + oppPiece.id).remove();
			
			// Remove the piece from game memory.
			game.pieces.splice(game.pieces.indexOf(oppPiece), 1);
		}
		
		// If castling...
		if (game.curPiece.type === Chess.pieceTypes.king && Math.abs(game.curPiece.space.left - space.left) > 1) {
			// The column of the castling rook.
			var rookLeft = space.left === 2 ? 0 : 7;
			
			// The left space to which the rook should move.
			var rookMoveLeft = space.left === 2 ? 3 : 5;
			
			// Find the rook.
			var rook = $(game.pieces).filter(function() {
				return this.type === Chess.pieceTypes.rook &&
					this.color === game.curPiece.color &&
					this.space.left === rookLeft;
			}).get(0);
			
			// Update the rook in memory.
			game.spaces[rook.space.left][rook.space.top] = false;
			game.spaces[rookMoveLeft][rook.space.top] = rook;
			rook.space.left = rookMoveLeft;
			rook.moved = true;
			
			// Move the rook on screen.
			$("#" + rook.id).animate({
				left : rookMoveLeft * 100
			});
		}
		
		// Move to the new space (in memory).
		game.spaces[game.curPiece.space.left][game.curPiece.space.top] = false;
		game.spaces[space.left][space.top] = game.curPiece;
		game.curPiece.space = {
			left : space.left,
			top : space.top
		};
		
		// If a pawn that has moved to the back row, upgrade it.
		if (game.curPiece.type === Chess.pieceTypes.pawn &&
			((game.turn === "white" && space.top === 0) ||
			 (game.turn === "black" && space.top === 7))) {
			
			game.curPiece.type = Chess.pieceTypes.queen;
			$("#" + game.curPiece.id)
				.attr("title", "queen")
				.css("background-image", "url('" + game.curPiece.color + " queen.png')");
		}
		
		// Add this move to the game moves array.
		game.moves.push($("#board").html());
		
		// Switch whose turn it is.
		game.turn = game.turn === "white" ? "black" : "white";
		
		// Determine if the opponent's king is in check.
		var gameStatus = Chess.getGameStatus({pieces : game.pieces, spaces : game.spaces}, game.turn);
		
		// Record that the piece has been moved.
		game.curPiece.moved = true;
		
		// Update the game engine's score evaluation.
		var score,
			evalEngine;
		if (game.players[game.turn].getScore)
			evalEngine = game.players[game.turn];
		else if (game.players[game.turn === "white" ? "black" : "white"].getScore)
			evalEngine = game.players[game.turn === "white" ? "black" : "white"];
		else
			evalEngine = EasyEngine;
		score = evalEngine.getScore({pieces : game.pieces, spaces : game.spaces}, game.turn);
		$("#Score").html("Score: " + (Math.round(score * 100) / 100));
		
		// Add move to the scoresheet.
		var moveText;
		if (rookLeft !== undefined)
			moveText = space.left === 2 ? "0-0-0" : "0-0";
		else
			moveText = String.fromCharCode(space.left + 97) + (8 - space.top);
		if (game.turn === "white")
			$("td", "#Scoresheet").last().html(moveText);
		else {
			$("tbody", "#Scoresheet").append("<tr><td>" + Math.ceil(game.moves.length / 2) +
				"</td><td>" + moveText + "</td><td></td></tr>");
		}
		
		// Move the piece on-screen.
		setTimeout(function() {
			$("#" + game.curPiece.id).animate({
				left : space.left * 100,
				top : space.top * 100
			}, function() {
				// If it's now the computer's turn and the game's still active, move.
				if (game.players[game.turn] !== "Human" && (gameStatus === "ready" || gameStatus === "check"))
					game.computerMove();
				
				// If the game's over, let the user know.
				if (gameStatus !== "ready" && gameStatus !== "check") {
					alert(gameStatus);
				}
			});
		}, 0);
		
		// If the other player is a human, flip the board to their perspective.
		if (game.players[game.turn] === "Human") {
			$("#board").attr("class", "board" + (game.turn === "black" ? " flipped" : "")).animate({
				transform : "rotate(" + (game.turn === "white" ? "0" : "180") + ")"
			}, 0);
		}
		
		// If the user wants to see the # of attacks on the board.
		if (game.options.showAttackValues)
			game.updateAttacks();
	},
	
	/*
		Updates the display of the # of attacks for each side for each square.
	*/
	updateAttacks : function() {
		var attacks = Chess.findAttacks({pieces : game.pieces, spaces : game.spaces});
		
		$(".space").html(function(index) {
			var attack = attacks[index % 8][Math.floor(index / 8)];
			
			return attack.whiteAttacks + " / " + attack.blackAttacks;
		});
	},
	
	/*
		Makes a computer move.
	*/
	computerMove : function() {
		// Request the computer move from the game engine.
		var move = game.players[game.turn].getMove({
			pieces : game.pieces,
			lastMoved : game.curPiece,
			spaces : game.spaces
		}, game.turn);
		
		// If no move found, exit.
		if (move) {
			game.curPiece = move.piece;
			game.movePiece($(".space").get(move.left + move.top * 8));
		}
	},
	
	/*
		Gets the piece name, given its enumerated piece type.
	*/
	getPieceName : function(pieceType) {
		for (var prop in Chess.pieceTypes) {
			if (pieceType === Chess.pieceTypes[prop]) {
				return prop;
			}
		}
	}
};

/*
	Page load event handler; sets up the game control panel at upper-right and starts a new game by default.
*/
$(function() {
	// Game control panel.
	var controlPanel = $("<div>", {
		id : "ControlPanel"
	}).appendTo(document.body);
	
	// Player type dropdowns.
	$.each(["White", "Black"], function(index, color) {
		$("<label>", {
			"for" : "dd" + color,
			html : color
		}).appendTo(controlPanel);
		
		var dd = $("<select>", {
			id : "dd" + color,
			html : "<option value='Human'>Human</option>",
			val : color === "White" ? "Human" : "Computer"
		}).appendTo(controlPanel);
		
		for (var engine in engines) {
			$("<option>", {
				val : engine,
				html : engine
			}).appendTo(dd);
		}
		
		if (color === "Black")
			dd.val("Easy");
		
		$("<br>").appendTo(controlPanel);
	});
	
	// Options checkboxes.
	$.each(["Show Attack Values"], function(index, cbLabel) {
		var id = "cb" + cbLabel.replaceAll(" ", "");
		
		$("<input>", {
			type : "checkbox",
			id : id,
			val : "Yes"
		}).appendTo(controlPanel);
		
		$("<label>", {
			"for" : id,
			html : cbLabel
		}).appendTo(controlPanel);
		
		$("<br>").appendTo(controlPanel);
	});
	
	// Game score.
	$("<label>", {
		id : "Score",
		css : {
			display : "block"
		}
	}).appendTo(controlPanel);
	
	// New game button.
	$("<input>", {
		type : "button",
		val : "New Game",
		click : game.start
	}).appendTo(controlPanel);
	
	// Hint button.
	$("<input>", {
		type : "button",
		val : "Hint",
		click : function() {
			var moves = game.players[game.turn === "white" ? "black" : "white"].evaluateAllmoves({
				pieces : game.pieces,
				lastMoved : game.curPiece,
				spaces : game.spaces
			}, game.turn).moveEvaluations;
			
			var table = $("<table>", {
				id : "Evaluations"
			}).appendTo(document.body);
			
			$.each(moves, function(index, move) {
				$("<tr>", {
					html : "<td>" + move.move + "</td><td>" + move.score + "</td>"
				}).appendTo(table);
			});
		}
	}).appendTo(controlPanel);
	
	// Add the scoresheet.
	$("<table>", {
		id : "Scoresheet"
	}).appendTo(document.body).wrap("<div id='ScoresheetBox'></div>");
	
	// Start a new game.
	game.start();
	
	// Whenever a user clicks on an available space (which are created when the user picks a piece),
	// move the piece on screen.
	$(document.body).on("click", ".availableSpace, .availableTake", function() {
		game.movePiece(this);
	});
	
	// "Show Attack Values" checkbox change event.
	$("#cbShowAttackValues").change(function() {
		game.options.showAttackValues = this.checked;
		
		if (game.options.showAttackValues)
			game.updateAttacks();
		else
			$(".space").html("");
	});
	
	// Show moves when the user uses the mouse wheel over the board.
	$(document.body).on("mousewheel", ".board", function(event) {
		// Mouse wheel up or down?
		// Up moves forward through the moves; down backwards.
		var up = event.originalEvent.wheelDelta > 0 ? true : false;
		
		// We're showing the last move, if not yet adjusted.
		if (game.moveShownIndex === null)
			game.moveShownIndex = game.moves.length - 1;
		
		// If a valid move index.
		if ((game.moveShownIndex + (up ? 1 : -1)) >= 0 &&
			(game.moveShownIndex + (up ? 1 : -1)) <= game.moves.length) {
			
			$(".activeMove").removeClass("activeMove");
			$(".pastMove").remove();
			
			if ((game.moveShownIndex + (up ? 1 : -1)) == game.moves.length) {
				game.moveShownIndex = null;
				$("#board").show();
				return;
			}
			
			// Show the move.
			var moveBoardHtml = game.moves[game.moveShownIndex];
			$("#board").hide();
			$("<div>", {
				"class" : "board pastMove",
				html : moveBoardHtml
			}).appendTo(document.body);
			$("td:not(:first-child)", "#Scoresheet").eq(game.moveShownIndex - 1).addClass("activeMove");
			
			// Adjust the game move index.
			game.moveShownIndex += up ? 1 : -1;
		}
	});
});

/// <reference path="jquery dev.js" />

/*
	Available chess engines.
*/

/*
	A chess engine that randomly selects its move.
*/
var RandomEngine = {
	/*
		Gets the computer's move, given the board and the computer's color (white or black).
	*/
	getMove : function(board, color) {
		var allPossibleMoves = Chess.getAllPossibleMoves(board, color);
		
		// If there are moves possible...
		if (allPossibleMoves.length > 0)
			return allPossibleMoves.random();
	},
	
	/*
		Gets the game score.
	*/
	getScore : function(board, color) {
		// Always even...
		return 0;
	}
};

var EasyEngine = {
	/*
		Evaluates all moves, returning a list of all possible moves, sorted by order of
		preference (best first), with the resulting game scores.
	*/
	evaluateAllmoves : function(board, color) {
		var allPossibleMoves = Chess.getAllPossibleMoves(board, color),
			moveEvaluations,
			bestMoves = [],
			bestScore = color === "white" ? -50 : 50;
		
		// For each legal move...
		$.each(allPossibleMoves, function(index, possibleMove) {
			// Make the move in memory, and grab the opponent's possible moves.
			var postMoveBoard = Chess.copyAndMove(board, possibleMove.piece, {top : possibleMove.top, left : possibleMove.left}),
				oppMoves = Chess.getAllPossibleMoves(postMoveBoard, color === "white" ? "black" : "white"),
				bestOppScore = color === "white" ? 50 : -50;
			
			// For each of the opponent's possible moves...
			$.each(oppMoves, function(index, move) {
				// Make the opponent's move in memory and evaluate the board.
				var afterBoard = Chess.copyAndMove(postMoveBoard, move.piece, {top : move.top, left : move.left}),
					score = EasyEngine.getScore(afterBoard, color);
				
				// If this is the best possible move for the opponent so far, note the fact.
				if ((color === "white" && score < bestOppScore) ||
					(color === "black" && score > bestOppScore)) {
					bestOppScore = score;
				}
			});
			
			// Note the potential move's oppenent's best response score.
			possibleMove.bestOppScore = bestOppScore;
			
			// If this move is the best move so far, note the fact.
			if ((color === "white" && bestOppScore >= bestScore) ||
				(color === "black" && bestOppScore <= bestScore)) {
				if (bestOppScore === bestScore)
					bestMoves.push(possibleMove);
				else {
					bestScore = bestOppScore;
					bestMoves = [possibleMove];
				}
			}
		});
		
		// Sort possible moves in preferential order (best first).
		allPossibleMoves.sort(function(a, b) {
			if (a.bestOppScore === b.bestOppScore)
				return 0;
			else
				return (a.bestOppScore < b.bestOppScore ? -1 : 1) * (color === "white" ? -1 : 1);
		});
		
		// Note all moves' evaluation scores.
		moveEvaluations = $(allPossibleMoves).map(function() {
			var moveText = String.fromCharCode(this.left + 97) + (8 - this.top);
			
			return {
				move : game.getPieceName(this.piece.type) + " to " + moveText,
				score : (Math.floor(this.bestOppScore * 100) / 100)
			};
		}).toArray();
		
		return {
			bestMoves : bestMoves,
			allPossibleMoves : allPossibleMoves,
			moveEvaluations : moveEvaluations
		};
	},
	
	/*
		Gets the computer's move, given the board and the computer's color (white or black).
	*/
	getMove : function(board, color) {
		return EasyEngine.evaluateAllmoves(board, color).bestMoves.random();
		
		// Return the optimum move (randomly picking one if there is multiple moves are of equal value).
		// return EasyEngine.evaluateAllmoves(board, color).bestMoves.random();
	},
	
	/*
		Gets the game score.
	*/
	getScore : function(board, color) {
		var score = {
			white : {
				material : 0,
				space : 0
			},
			black : {
				material : 0,
				space : 0
			}
		};
		
		// Evaluate each piece...
		$.each(board.pieces, function(index, piece) {
			// Add material score.
			switch (piece.type) {
				case Chess.pieceTypes.pawn:
					score[piece.color].material++; break;
				
				case Chess.pieceTypes.bishop:
				case Chess.pieceTypes.knight:
					score[piece.color].material += 3; break;
				
				case Chess.pieceTypes.rook:
					score[piece.color].material += 5; break;
				
				case Chess.pieceTypes.queen:
					score[piece.color].material += 9; break;
			}
		});
		
		// Get all board spaces' attack counts.
		var attacks = Chess.findAttacks(board);
		
		// Add up the space scores.
		for (var left = 0; left < 8; left++) {
			for (var top = 0; top < 8; top++) {
				var spaceAttack = attacks[left][top],
					spaceValue = 8 - Math.floor(Math.abs(left - 3.5)) - Math.floor(Math.abs(top - 3.5));
				
				if (spaceAttack.whiteAttacks > spaceAttack.blackAttacks)
					score.white.space += spaceValue * (spaceAttack.blackAttacks === 0 ? 3 : 1);
				else if (spaceAttack.blackAttacks > spaceAttack.whiteAttacks)
					score.black.space += spaceValue * (spaceAttack.whiteAttacks === 0 ? 3 : 1);
			}
		}
		
		// Return calculated game score.
		return 10 * (score.white.material / score.black.material - 1) +
					(score.white.space / score.black.space - 1);
	}
};

var SmarterEngine = {
	/*
		Gets the computer's move, given the board and the computer's color (white or black).
	*/
	getMove : function(board, color) {
		var allPossibleMoves = Chess.getAllPossibleMoves(board, color),
			bestMoves = [],
			bestScore = color === "white" ? -50 : 50;
		
		// For each legal move...
		$.each(allPossibleMoves, function(index, possibleMove) {
			// Make the move in memory, and grab the opponent's possible moves.
			var postMoveBoard = Chess.copyAndMove(board, possibleMove.piece, {top : possibleMove.top, left : possibleMove.left}),
				oppMoves = Chess.getAllPossibleMoves(postMoveBoard, color === "white" ? "black" : "white"),
				bestOppScore = color === "white" ? 50 : -50;
			
			// For each of the opponent's possible moves...
			$.each(oppMoves, function(index, move) {
				// Make the opponent's move in memory and evaluate the board.
				var afterBoard = Chess.copyAndMove(postMoveBoard, move.piece, {top : move.top, left : move.left}),
					score = SmarterEngine.getScore(afterBoard, color);
				
				// If this is the best possible move for the opponent so far, note the fact.
				if ((color === "white" && score < bestOppScore) ||
					(color === "black" && score > bestOppScore)) {
					bestOppScore = score;
				}
			});
			
			// Note the potential move's oppenent's best response score.
			possibleMove.bestOppScore = bestOppScore;
			
			// If this move is the best move so far, note the fact.
			if ((color === "white" && bestOppScore >= bestScore) ||
				(color === "black" && bestOppScore <= bestScore)) {
				if (bestOppScore === bestScore)
					bestMoves.push(possibleMove);
				else {
					bestScore = bestOppScore;
					bestMoves = [possibleMove];
				}
			}
		});
		
		// Return the optimum move (randomly picking one if there is multiple moves are of equal value).
		return bestMoves.random();
	},
	
	/*
		Gets the game score.
	*/
	getScore : function(board, color) {
		var score = {
			white : {
				material : 0,
				space : 0,
				development : 0
			},
			black : {
				material : 0,
				space : 0,
				development : 0
			}
		};
		
		// Evaluate each piece...
		$.each(board.pieces, function(index, piece) {
			// Add material score.
			switch (piece.type) {
				case Chess.pieceTypes.pawn:
					score[piece.color].material++;
					break;
				
				case Chess.pieceTypes.bishop:
				case Chess.pieceTypes.knight:
					score[piece.color].material += 3;
					if (piece.moved)
						score[piece.color].development += 3;
					break;
				
				case Chess.pieceTypes.rook:
					score[piece.color].material += 5;
					break;
				
				case Chess.pieceTypes.queen:
					score[piece.color].material += 9;
					if (piece.moved)
						score[piece.color].development += .5;
					break;
			}
		});
		
		// Get all board spaces' attack counts.
		var attacks = Chess.findAttacks(board);
		
		// Add up the space scores.
		for (var left = 0; left < 8; left++) {
			for (var top = 0; top < 8; top++) {
				var spaceAttack = attacks[left][top],
					spaceValue = 8 - Math.floor(Math.abs(left - 3.5)) - Math.floor(Math.abs(top - 3.5));
				
				if (spaceAttack.whiteAttacks > spaceAttack.blackAttacks)
					score.white.space += spaceValue * (spaceAttack.blackAttacks === 0 ? 3 : 1);
				else if (spaceAttack.blackAttacks > spaceAttack.whiteAttacks)
					score.black.space += spaceValue * (spaceAttack.whiteAttacks === 0 ? 3 : 1);
			}
		}
		
		// Return calculated game score.
		return 10 * (score.white.material / score.black.material - 1) +
					(score.white.space / score.black.space - 1) +
					(score.white.development / score.black.development - 1);
	}
};

/*
	Analyzes four plys to determine its move.
	Not in use since it's slow.
*/
var TwoMoves = {
	getMove : function(board, color) {
		var allPossibleMoves = Chess.getAllPossibleMoves(board, color),
			bestMove,
			bestScore = color === "white" ? -50 : 50,
			oppColor = color === "white" ? "black" : "white";
		
		// For each legal move...
		$.each(allPossibleMoves, function(index, possibleMove) {
			// Make the move in memory, and grab the opponent's possible moves.
			var postMoveBoard = Chess.copyAndMove(board, possibleMove.piece, {top : possibleMove.top, left : possibleMove.left}),
				oppMoves = Chess.getAllPossibleMoves(postMoveBoard, oppColor),
				bestOppScore = color === "white" ? 50 : -50;
			
			$.each(oppMoves, function(index, oppMove) {
				// Make opponent move in memory and evaluate board score.
				oppMove.boardAfterMove = Chess.copyAndMove(postMoveBoard, oppMove.piece, {top : oppMove.top, left : oppMove.left});
				oppMove.score = TwoMoves.getScore(oppMove.boardAfterMove, color);
			});
			
			// Sort potential opponent moves by score (ascending order).
			oppMoves.sort(function(a, b) {
				return a.score === b.score ? 0 :
					a.score < b.score ? -1 : 1;
			});
			
			// Cut off half the options to just those best for the computer's color.
			if (color === "black")
				oppMoves.splice(oppMoves.length * 0.2);
			else
				oppMoves = oppMoves.splice(oppMoves.length * 0.2);
			
			// For each of the opponent's possible moves...
			$.each(oppMoves, function(index, oppMove) {
				// Make the user's next move in memory.
				var afterBoard = oppMove.boardAfterMove,
					myMoves = Chess.getAllPossibleMoves(afterBoard, color);
				
				$.each(myMoves, function(index, myMove) {
					var afterMyNextMove = Chess.copyAndMove(afterBoard, myMove.piece, {top : myMove.top, left : myMove.left}),
						oppMoves = Chess.getAllPossibleMoves(afterMyNextMove, oppColor);
					
					$.each(oppMoves, function(index, oppMove) {
						// Make the opponent's move in memory and evaluate the board.
						var afterOpp2ndMove = Chess.copyAndMove(afterMyNextMove, oppMove.piece, {top : oppMove.top, left : oppMove.left}),
							score = SmarterEngine.getScore(afterOpp2ndMove, color);
						
						// If this is the best possible move for the opponent so far, note the fact.
						if ((color === "white" && score < bestOppScore) ||
							(color === "black" && score > bestOppScore)) {
							bestOppScore = score;
						}
					});
				});
			});
			
			// Note the potential move's oppenent's best response score.
			possibleMove.bestOppScore = bestOppScore;
			
			// If this move is the best move so far, note the fact.
			if ((color === "white" && bestOppScore > bestScore) ||
				(color === "black" && bestOppScore < bestScore)) {
				bestScore = bestOppScore;
				bestMove = possibleMove;
			}
		});
		
		// Return the optimum move.
		return bestMove;
	},
	
	getScore : EasyEngine.getScore
};

var engines = {
	Easy : EasyEngine,
	Random : RandomEngine,
	Smarter : SmarterEngine,
	TwoMoves : TwoMoves
};