import { useEffect, useState } from "react";

const TypingText = ({ text, speed = 200 }: { text: string, speed?: number }): JSX.Element => {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let currentIndex = 0;

        const getRandomChunkSize = (): number => {
            return Math.floor(Math.random() * 3) + 1; // 1-3文字のランダムなチャンクサイズ
        };

        const interval = setInterval(() => {
            const chunkSize = getRandomChunkSize();
            const nextChunk = text.slice(currentIndex, currentIndex + chunkSize);

            setDisplayText(prev => prev + nextChunk);
            currentIndex += chunkSize;

            if (currentIndex >= text.length) {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval); // クリーンアップ
    }, [text, speed]);

    return <p className="font-mono text-lg">{displayText}</p>;
};

export default TypingText;
