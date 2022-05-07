/*******************************************************************************
  The MIT License (MIT)

  Copyright (c) 2014 Marcel Joachim Kloubert

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
********************************************************************************/
  
(function($) {
    $.fn.chessBoard = function(opts) {
        var pluginSelector = this;
    
        var rowNames = '87654321';
        var colNames = 'ABCDEFGH';
              
        var _createFieldObject = function(field, fieldName, x, y) {
            var fieldObj = {
                'disacknowledge': function() {
                    this.field.removeClass('cbFieldHighlighted');
                    
                    if (opts.onDisacknowledgeField) {
                        opts.onDisacknowledgeField(this);
                    }

                    return this;
                },
                'highlight': function() {
                    this.field.addClass('cbFieldHighlighted');
                    
                    if (opts.onHighlightField) {
                        opts.onHighlightField(this);
                    }
                    
                    return this;
                },
                'name': fieldName,
                'pos': {
                    'x': x,
                    'y': y,
                },
                'toggleHighlight': function() {
                    if (this.isHighlighted) {
                        this.disacknowledge();
                    }
                    else {
                        this.highlight();
                    }
                    
                    return this;
                },
            };
            
            var _getField = field;
            if (typeof(_getField) != "function") {
                _getField = function() {
                    return field;
                };
            }
            
            Object.defineProperty(fieldObj, 'field', {
                get: _getField,
            });
            
            Object.defineProperty(fieldObj, 'isHighlighted', {
                get: function () {
                    return this.field
                               .hasClass('cbFieldHighlighted');
                },
            });
            
            return fieldObj;
        };
        
        var _getFieldBgColor = function(x, y) {
            var bg = opts.darkColor;
            if (y % 2 == 1) {
                if (x % 2 == 1) {
                    bg = opts.lightColor;
                }
            }
            else {
                if (x % 2 == 0) {
                    bg = opts.lightColor;
                }
            }
            
            return bg;
        };
        
        opts = $.extend({
            'darkColor' : '#d18b47',
            'fieldWidth': '64px',
            'highlightColor': '#4cff4c',
            'lightColor': '#ffce9e',
            'onDisacknowledgeField': function(ctx) {
                ctx.field
                   .css('backgroundColor',
                        _getFieldBgColor(ctx.pos.x, ctx.pos.y));
            },
            'onHighlightField': function(ctx) {
                ctx.field
                   .css('backgroundColor',
                        opts.highlightColor);
            },
            'onPaintField': function(ctx) {
                var bg = _getFieldBgColor(ctx.pos.x,
                                          ctx.pos.y);
                
                ctx.field.css('backgroundColor', bg);
                ctx.field.css('width'          , opts.fieldWidth);
                ctx.field.css('overflow'       , 'hidden');
                ctx.field.css('padding'        , '0px');
                
                if (opts.fieldCss) {
                    ctx.field.css(opts.fieldCss);
                }
                
                var _onResizeFunc = function(e) {
                    if (opts.onResizeField) {
                        opts.onResizeField(ctx);
                    }
                };
                
                _onResizeFunc();
                ctx.field.resize(_onResizeFunc);
            },
            'onPaintNotationField': function(ctx) {
                ctx.field.css('overflow'      , 'hidden');
                ctx.field.css('padding'       , '8px');
                ctx.field.css('text-align'    , 'center');
                ctx.field.css('vertical-align', 'middle');
            },
            'onPaintPiece': function(ctx) {
                ctx.piece.css('display'       , 'block');
                ctx.piece.css('font-size'     , opts.pieceSize);
                ctx.piece.css('text-align'    , 'center');
                ctx.piece.css('vertical-align', 'middle');
            },
            'onResizeField': function(ctx) {
                if (!opts.fieldHeight) {
                    ctx.field.css('height',
                                  ctx.field.outerWidth());
                }
                else {
                    ctx.field.css('height', opts.fieldHeight);
                }
            },
            'pieceSize': '48px',
            'setStartPosition': false,
            'showBottomNotation': true,
            'showLeftNotation': true,
            'showRightNotation': false,
            'showTopNotation': false,
        }, opts);
        
        opts.pieces = $.extend({
            'none': '',
        }, opts.pieces);
        
        opts.pieces.black = $.extend({
            'bishop': '&#9821;',
            'king'  : '&#9818;',
            'knight': '&#9822;',
            'pawn'  : '&#9823;',
            'queen' : '&#9819;',
            'rock'  : '&#9820;',
        }, opts.pieces.black);
        
        opts.pieces.white = $.extend({
            'bishop': '&#9815;',
            'king'  : '&#9812;',
            'knight': '&#9816;',
            'pawn'  : '&#9817;',
            'queen' : '&#9813;',
            'rock'  : '&#9814;',
        }, opts.pieces.white);
        
        this.each(function() {
            var tbl = $('<table class="chessBoard"></table>');
            
            var _createFieldClickFunc = function(fieldObj) {
                return function(e) {
                    if (opts.onClick) {
                        opts.onClick(fieldObj);
                    }
                };
            };
            
            var _addNotationRow = function(nrType) {
                var newNotationRow = $('<tr></tr>');
                newNotationRow.addClass('cbNotationRow');
                newNotationRow.addClass('cbNotationRow' + nrType);
                
                for (var x = -1; x < 8; x++) {
                    var cn = colNames.charAt(x);
                    
                    var newNotationField = $('<td></td>');
                    newNotationField.addClass('cbNotationField');
                    newNotationField.addClass('cbNotationField' + cn);
                    newNotationField.addClass('cbNotationField' + cn + nrType);
                    newNotationField.addClass('cbNotationField' + nrType);

                    if (x > -1) {
                        newNotationField.text(cn);
                    }
                    
                    if (opts.onPaintNotationField) {
                        opts.onPaintNotationField({
                            field: newNotationField,
                            pos: x,
                            type: nrType.toUpperCase(),
                        });
                    }
                    
                    newNotationRow.append(newNotationField);
                }
                
                tbl.append(newNotationRow);
            };
            
            if (opts.showTopNotation) {
                _addNotationRow('Top');
            } 
            
            for (var y = 0; y < 8; y++) {
                var newRow = $('<tr></tr>');
                newRow.addClass('cbRow');
                newRow.addClass('cbRow' + (y % 2 == 0 ? 'Odd' : 'Even'));
                newRow.addClass('cbRow' + rowNames.charAt(y));
                
                var _addNotationField = function(nrType) {
                    var rn = rowNames.charAt(y);
                
                    var newNotationField = $('<td></td>');
                    newNotationField.addClass('cbNotationField');
                    newNotationField.addClass('cbNotationField' + rn);
                    newNotationField.addClass('cbNotationField' + rn + nrType);
                    newNotationField.addClass('cbNotationField' + nrType);
                    newNotationField.text(rn);
                    
                    if (opts.onPaintNotationField) {
                        opts.onPaintNotationField({
                            field: newNotationField,
                            pos: y,
                            type: nrType,
                        });
                    }
                    
                    newRow.append(newNotationField);
                };
                
                if (opts.showLeftNotation) {
                    _addNotationField('Left');
                } 

                for (var x = 0; x < 8; x++) {
                    var fieldName = colNames.charAt(x) + rowNames.charAt(y);
                    
                    var newField = $('<td></td>');
                    
                    var fieldObj = _createFieldObject(newField, fieldName, x, y);
                    newField.chessField = fieldObj;
                    
                    newField.addClass('cbField');
                    newField.addClass('cbField' + (x % 2 == 0 ? 'Odd' : 'Even'));
                    newField.addClass('cbField' + colNames.charAt(x));
                    newField.addClass('cbField' + fieldName);

                    newField.click(_createFieldClickFunc(fieldObj));
                    
                    if (opts.onPaintField) {
                        opts.onPaintField(fieldObj);
                    }
                    
                    newField.appendTo(newRow);
                }
                
                if (opts.showRightNotation) {
                    _addNotationField('Right');
                }
                
                tbl.append(newRow);
            }
            
            if (opts.showBottomNotation) {
                _addNotationRow('Bottom');
            } 
            
            if (opts.css) {
                tbl.css(opts.css);
            }
            
            $(this).append(tbl);
        });
        
        var _createSpecificPieceOpts = function(funcArgs, ifBlack, ifWhite) {
            var o;
            if (funcArgs.length > 1) {
                o = {
                    'color': funcArgs[1],
                    'field': funcArgs[0],
                };
            }
            else if (funcArgs.length == 1) {
                o = $.extend({
                }, funcArgs[0]);
            }
            
            var pType;
            switch ($.trim(o.color).toUpperCase()) {
                case 'B':
                case 'BLACK':
                    pType = ifBlack;
                    break;
                    
                case 'W':
                case 'WHITE':
                    pType = ifWhite;
                    break;
            }
            
            return {
                'field': o.field,
                'type' : pType,
            };
        };
        
        var result = {
            'clear': function() {              
                for (var y = 0; y < 8; y++) {
                    for (var x = 0; x < 8; x++) {
                        this.removePiece(colNames[x] + rowNames[y]);
                    }
                }
                
                return this;
            },
            'getField': function(field) {
                field = $.trim(field).toUpperCase();
            
                var fieldObj = {
                    'disacknowledge': function() {
                        this._C2B52D8B72994977B33B4C47ED0AE379.disacknowledge();
                        return this;
                    },
                    'getPiece': function() {
                        var p = {};
                        
                        var fieldSelector = this.selector;
                        Object.defineProperty(p, 'selector', {
                            get: function () {
                                return fieldSelector.find('.cbPiece');
                            },
                        });
                        
                        var clsName = p.selector.attr('class');
                        
                        if (clsName) {
                            if (clsName.indexOf('cbPieceBlack') > -1) {
                                p.color = 'B';
                            }
                            else if (clsName.indexOf('cbPieceWhite') > -1) {
                                p.color = 'W';
                            }
                            
                            if (clsName.indexOf('cbPieceBishop') > -1) {
                                p.type = 'BISHOP';
                            }
                            else if (clsName.indexOf('cbPieceKing') > -1) {
                                p.type = 'KING';
                            }
                            else if (clsName.indexOf('cbPieceKnight') > -1) {
                                p.type = 'KNIGHT';
                            }
                            else if (clsName.indexOf('cbPiecePawn') > -1) {
                                p.type = 'PAWN';
                            }
                            else if (clsName.indexOf('cbPieceQueen') > -1) {
                                p.type = 'QUEEN';
                            }
                            else if (clsName.indexOf('cbPieceRock') > -1) {
                                p.type = 'ROCK';
                            }
                        }
                        
                        return (p.color && p.type) ? p : null;
                    },
                    'highlight': function() {
                        this._C2B52D8B72994977B33B4C47ED0AE379.highlight();
                        return this;
                    },
                    'name': field,
                    'pos': {
                        'x': colNames.indexOf(field[0]),
                        'y': rowNames.indexOf(8 - field[1]),
                    },
                    'removePiece': function() {
                        this.selector.html('');
                        return;
                    },
                    'toggleHighlight': function() {
                        this._C2B52D8B72994977B33B4C47ED0AE379.toggleHighlight();
                        return this;
                    },
                };
                
                var _getFieldObjSelector = function() {
                    return pluginSelector.find('.cbField' + field);
                };
                
                Object.defineProperty(fieldObj, 'selector', {
                    get: _getFieldObjSelector,
                });
                
                fieldObj._C2B52D8B72994977B33B4C47ED0AE379 = _createFieldObject(_getFieldObjSelector, fieldObj.name,
                                                                                fieldObj.pos.x, fieldObj.pos.y);
                
                return fieldObj;
            },
            'getHighlighted': function() {
                return this.selector
                           .find('.cbFieldHighlighted');
            },
            'hide': function() {
                this.selector.hide();
                return this;
            },
            'removePiece': function(field) {
                this.getField().removePiece();
                return this;
            },
            'setBishop': function() {
                return this.setPiece(_createSpecificPieceOpts(arguments,
                                                              'BLACK_BISHOP', 'WHITE_BISHOP'));
            },
            'setKing': function() {
                return this.setPiece(_createSpecificPieceOpts(arguments,
                                                              'BLACK_KING', 'WHITE_KING'));
            },
            'setKnight': function() {
                return this.setPiece(_createSpecificPieceOpts(arguments,
                                                              'BLACK_KNIGHT', 'WHITE_KNIGHT'));
            },
            'setPawn': function() {
                return this.setPiece(_createSpecificPieceOpts(arguments,
                                                              'BLACK_PAWN', 'WHITE_PAWN'));
            },
            'setQueen': function() {
                return this.setPiece(_createSpecificPieceOpts(arguments,
                                                              'BLACK_QUEEN', 'WHITE_QUEEN'));
            },
            'setRock': function() {
                return this.setPiece(_createSpecificPieceOpts(arguments,
                                                              'BLACK_ROCK', 'WHITE_ROCK'));
            },
            'setPiece': function() {
                var spOpts;
                if (arguments.length > 1) {
                    spOpts = {
                        'field': arguments[0],
                        'type' : arguments[1],
                    };
                }
                else if (arguments.length == 1) {
                    spOpts = arguments[0];
                }
                
                spOpts = $.extend({
                    'type': '',
                }, spOpts);
                
                if (Object.prototype.toString.call(spOpts.field) !== '[object Array]' ) {
                    spOpts.field = [spOpts.field];
                }
                
                var htmlCode;
                var pieceClasses;
                var pType;
                switch ($.trim(spOpts.type).toUpperCase()) {
                    case 'B_BISHOP':
                    case 'BLACK_BISHOP':
                    case 'BB':
                        htmlCode = opts.pieces.black.bishop;
                        pieceClasses = ['cbPieceBlack', 'cbPieceBishop', 'cbPieceBlackBishop'];
                        pType = {
                            'class': 'BISHOP',
                            'color': 'B',
                        };
                        break;
                    
                    case 'B_KING':
                    case 'BLACK_KING':
                    case 'BK':
                        htmlCode = opts.pieces.black.king;
                        pieceClasses = ['cbPieceBlack', 'cbPieceKing', 'cbPieceBlackKing'];
                        pType = {
                            'class': 'KING',
                            'color': 'B',
                        };
                        break;
                    
                    case 'B_KNIGHT':
                    case 'BLACK_KNIGHT':
                    case 'BKN':
                        htmlCode = opts.pieces.black.knight;
                        pieceClasses = ['cbPieceBlack', 'cbPieceKnight', 'cbPieceBlackKnight'];
                        pType = {
                            'class': 'KNIGHT',
                            'color': 'B',
                        };
                        break;
                        
                    case 'B_PAWN':
                    case 'BLACK_PAWN':
                    case 'BP':
                        htmlCode = opts.pieces.black.pawn;
                        pieceClasses = ['cbPieceBlack', 'cbPiecePawn', 'cbPieceBlackPawn'];
                        pType = {
                            'class': 'PAWN',
                            'color': 'B',
                        };
                        break;
                        
                    case 'B_QUEEN':
                    case 'BLACK_QUEEN':
                    case 'BQ':
                        htmlCode = opts.pieces.black.queen;
                        pieceClasses = ['cbPieceBlack', 'cbPieceQueen', 'cbPieceBlackQueen'];
                        pType = {
                            'class': 'QUEEN',
                            'color': 'B',
                        };
                        break;
                        
                    case 'B_ROCK':
                    case 'BLACK_ROCK':
                    case 'BR':
                        htmlCode = opts.pieces.black.rock;
                        pieceClasses = ['cbPieceBlack', 'cbPieceRock', 'cbPieceBlackRock'];
                        pType = {
                            'class': 'ROCK',
                            'color': 'B',
                        };
                        break;
                        
                    case 'W_BISHOP':
                    case 'WHITE_BISHOP':
                    case 'WB':
                        htmlCode = opts.pieces.white.bishop;
                        pieceClasses = ['cbPieceWhite', 'cbPieceBishop', 'cbPieceWhiteBishop'];
                        pType = {
                            'class': 'BISHOP',
                            'color': 'W',
                        };
                        break;
                        
                    case 'W_KING':
                    case 'WHITE_KING':
                    case 'WK':
                        htmlCode = opts.pieces.white.king;
                        pieceClasses = ['cbPieceWhite', 'cbPieceKing', 'cbPieceWhiteKing'];
                        pType = {
                            'class': 'KING',
                            'color': 'W',
                        };
                        break;
                    
                    case 'W_KNIGHT':
                    case 'WHITE_KNIGHT':
                    case 'WKN':
                        htmlCode = opts.pieces.white.knight;
                        pieceClasses = ['cbPieceWhite', 'cbPieceKnight', 'cbPieceWhiteKnight'];
                        pType = {
                            'class': 'KNIGHT',
                            'color': 'W',
                        };
                        break;
                        
                    case 'W_PAWN':
                    case 'WHITE_PAWN':
                    case 'WP':
                        htmlCode = opts.pieces.white.pawn;
                        pieceClasses = ['cbPieceWhite', 'cbPiecePawn', 'cbPieceWhitePawn'];
                        pType = {
                            'class': 'PAWN',
                            'color': 'W',
                        };
                        break;
                        
                    case 'W_QUEEN':
                    case 'WHITE_QUEEN':
                    case 'WQ':
                        htmlCode = opts.pieces.white.queen;
                        pieceClasses = ['cbPieceWhite', 'cbPieceQueen', 'cbPieceWhiteQueen'];
                        pType = {
                            'class': 'QUEEN',
                            'color': 'W',
                        };
                        break;
                        
                    case 'W_ROCK':
                    case 'WHITE_ROCK':
                    case 'WR':
                        htmlCode = opts.pieces.white.rock;
                        pieceClasses = ['cbPieceWhite', 'cbPieceRock', 'cbPieceWhiteRock'];
                        pType = {
                            'class': 'ROCK',
                            'color': 'W',
                        };
                        break;
                        
                    case '':
                        htmlCode = opts.pieces.none;
                        pieceClasses = ['cbPieceNone'];
                        pType = null;
                        break;
                }
                
                var pieceElement = $('<span></span>');
                pieceElement.addClass('cbPiece');
                if (typeof(htmlCode) == "function") {
                    pieceElement.html(htmlCode({
                        'piece': pieceElement,
                        'type': pType,
                    }));
                }
                else {
                    pieceElement.html(htmlCode);
                }
                
                if (pieceClasses) {
                    for (var i = 0; i < pieceClasses.length; i++) {
                        pieceElement.addClass(pieceClasses[i]);
                    }
                }
                
                if (opts.onPaintPiece) {
                    opts.onPaintPiece({
                        'piece': pieceElement,
                        'type': pType,
                    });
                }
                
                if (spOpts.field) {
                    for (var i = 0; i < spOpts.field.length; i++) {
                        var f = spOpts.field[i];
                    
                        this.selector
                            .find('.cbField' + $.trim(f).toUpperCase())
                            .html($('<span></span>').append(pieceElement)
                                                    .html());
                    }
                }

                return this;
            },
            'show': function() {
                this.selector.show();
                return this;
            },
            'startPosition': function(spOpts) {
                spOpts = $.extend({
                }, spOpts);
                
                // clear                
                this.clear();
                
                this.setRock(['a1', 'h1'], 'white')
                    .setKnight(['b1', 'g1'], 'white')
                    .setBishop(['c1', 'f1'], 'white')
                    .setQueen('d1', 'white')
                    .setKing('e1', 'white')
                    .setRock(['a8', 'h8'], 'black')
                    .setKnight(['b8', 'g8'], 'black')
                    .setBishop(['c8', 'f8'], 'black')
                    .setQueen('d8', 'black')
                    .setKing('e8', 'black');
                
                // pawns                
                for (var i = 0; i < 8; i++) {
                    this.setPawn(colNames[i] + '7', 'black')
                        .setPawn(colNames[i] + '2', 'white');
                }
            
                return this;
            },
        };
        
        Object.defineProperty(result, 'selector', {
            get: function () {
                return pluginSelector.find('.chessBoard');
            },
        });
        
        if (opts.setStartPosition) {
            result.startPosition();
        }
        
        return result;
    };
})(jQuery);
