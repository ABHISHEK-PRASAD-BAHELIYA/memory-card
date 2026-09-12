import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Card from '../components/Card';
import GameOver from '../components/GameOver';
import '../styles/GamePage.scss';

function GamePage({
    goBackToStartPage,
    playClick,
    playFlip,
    shuffle,
    getCharactersToPlayWith,
    countScore,
    charactersToPlayWith,
    charactersToDisplay,
    score,
    bestScore,
    setScore,
    setBestScore,
    setCharactersToPlayWith,
    stateRoundResult
}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [result, setResult] = useState('');

    useEffect(() => {
        getCharactersToPlayWith();

        return () => {
            setCharactersToPlayWith([]);
            setScore(0);
            setBestScore(0);

            charactersToPlayWith.forEach((character) => {
                character.clicked = false;
            });
        };

        // This effect intentionally runs only when GamePage mounts/unmounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCardClick = (character) => {
        // Prevent multiple clicks while cards are flipping.
        if (isClicked) return;

        setIsClicked(true);

        let turnResult = stateRoundResult(character);
        setResult(turnResult);

        character.clicked = true;

        // Stop all actions if the player wins or loses.
        if (turnResult !== '') {
            if (turnResult === 'win') {
                countScore();
            }

            setIsClicked(false);
            return;
        }

        countScore();

        setIsFlipped(true);
        playFlip();

        // Shuffle after the flip animation.
        setTimeout(() => {
            shuffle(charactersToPlayWith);
        }, 800);

        // Finish the flip animation.
        setTimeout(() => {
            setIsFlipped(false);
            setIsClicked(false);
            playFlip();
            turnResult = '';
        }, 1300);
    };

    const restartTheGame = () => {
        setScore(0);
        setResult('');

        charactersToPlayWith.forEach((character) => {
            character.clicked = false;
        });

        getCharactersToPlayWith();
    };

    return (
        <>
            <Header
                goBackToStartPage={goBackToStartPage}
                playClick={playClick}
                score={score}
                bestScore={bestScore}
            />

            <motion.div
                className="playGround"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="cardSection">
                    {charactersToDisplay.map((character) => {
                        return (
                            <Card
                                key={character.id}
                                character={character}
                                isFlipped={isFlipped}
                                handleCardClick={handleCardClick}
                            />
                        );
                    })}
                </div>

                <div className="remainIndicator">
                    {`${score} / ${charactersToPlayWith.length}`}
                </div>
            </motion.div>

            <AnimatePresence>
                {result !== '' && (
                    <GameOver
                        restartTheGame={restartTheGame}
                        playClick={playClick}
                        result={result}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default GamePage;