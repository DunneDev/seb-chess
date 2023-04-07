window.addEventListener("DOMContentLoaded", () => {
    // make the chess board
    const container = document.getElementById("chessboard");

    for (let i = 0; i < 8; i++) {
        const row = document.createElement("div");
        row.classList.add("board-row");

        for (let j = 0; j < 8; j++) {
            const square = document.createElement("div");
            square.classList.add("square");
            row.appendChild(square);
        }

        container.appendChild(row);
    }
});
