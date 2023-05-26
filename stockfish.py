#!/usr/bin/python3

import asyncio
import chess
import chess.engine

async def run() -> None:
    transport, engine = await chess.engine.popen_uci(r"/mnt/c/Users/Tim/Desktop/var/stockfish_15.1_linux_x64_bmi2/stockfish_15.1_x64_bmi2")

    board = chess.Board("r1bqkbnr/p1pp1ppp/1pn5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4")
    print(board)
    while not board.is_game_over():
        result = await engine.play(board, chess.engine.Limit(time=0.1))
        print(result.move)
        board.push(result.move)
        print(board)

    await engine.quit()


async def play(board) -> None:
    transport, engine = await chess.engine.popen_uci(r"/mnt/c/Users/Tim/Desktop/var/stockfish_15.1_linux_x64_bmi2/stockfish_15.1_x64_bmi2")

    print(board)
    while not board.is_game_over():
        result = await engine.play(board, chess.engine.Limit(time=0.1))
        print(result.move)
        board.push(result.move)
        print(board)

    await engine.quit()


if __name__=="__main__":
    board = chess.Board("r1bqkbnr/p1pp1ppp/1pn5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 2 4")
    asyncio.set_event_loop_policy(chess.engine.EventLoopPolicy())
    asyncio.run(play(board))
