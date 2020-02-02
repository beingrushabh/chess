export const asking = (req, res) => {
    const { socket: socketId, type } = req.body;
    const socketToKeyMap = req.app.get('socketToKey');
    const key = socketToKeyMap.get(socketId);
    const gameMap = req.app.get('game');

    if(!gameMap.has(key)) {
        console.dir(`There's no available Game #${key}`);
        return res.status(403).send({ error: `There's no available Game #${key}` });
    }

    const game = gameMap.get(key);
    if(!game.start) {
        console.dir(`The game is not running now`);
        return res.status(403).send({ error: `The game is not running now` });
    }

    const player = game._black === req.sessionID ? 'black': (game._white === req.sessionID ? 'white' : 'spectator');
    if(player === 'spectator') {
        console.dir(`You're just a spectator`);
        return res.status(403).send({ error: `You're just a spectator` });
    }

    if(game._record.blocked) {
        console.dir(`Modal is already Open`);
        return res.status(403).send({ error: `Modal is already Open` });
    }

    const enemy = player === 'white' ? 'black' : 'white';

    game._record._modalOpen({
        sender: player,
        receiver: enemy,
        genre: type,
    })

    clearTimeout(game._record._setTimeRequestRef[type]);
    game._record._setTimeRequestRef[type] = setTimeout(() => {
        game._record._modalMessage({
            sender: enemy,
            receiver: player,
            genre: type,
            message: 'rejected',
        });
        setTimeout(() => {
            game._record._modalClose({
                sender: player,
                receiver: enemy,
            });
        }, 3000);
    }, 5000);

    return res.status(202).end();
};

export const answering = (req, res) => {
    const { socket: socketId, type, response } = req.body;
    const socketToKeyMap = req.app.get('socketToKey');
    const key = socketToKeyMap.get(socketId);
    const gameMap = req.app.get('game');
    const game = gameMap.get(key);

    if(!game.start) {
        console.dir(`The game is not running now`);
        return res.status(403).send({ error: `The game is not running now` });
    }

    const player = game._black === req.sessionID ? 'black': (game._white === req.sessionID ? 'white' : 'spectator');
    if(player === 'spectator') {
        console.dir(`You're just a spectator`);
        return res.status(403).send({ error: `You're just a spectator` });
    }

    if(!game._record.blocked) {
        console.dir(`Modal is already Closed`);
        return res.status(403).send({ error: `Modal is already Closed` });
    }

    const enemy = player === 'white' ? 'black' : 'white';
    const message = response ? 'accepted' : 'rejected';
    
    clearTimeout(game._record._setTimeRequestRef[type]);

    game._record._modalMessage({
        sender: player,
        receiver: enemy,
        genre: type,
        message,
    });

    setTimeout(() => {
        game._record._modalClose({
            sender: player,
            receiver: enemy,
        });
    }, 3000);
    
    return res.status(202).end();
}