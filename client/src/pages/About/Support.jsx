import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Support = () => {
    return (
        <div className="flex items-center justify-center  px-8 py-24 text-neutral-800">
            <BlockInTextCard
                tag="/ Поддержка"
                text={
                    <>
                        <strong>Остались вопросы?</strong> Мы готов вам помочь.
                        Обращайтесь в службу поддержки по любым вопросам, с
                        которыми вы можете столкнуться.
                    </>
                }
                examples={[
                    "Не работает страница с задами?",
                    "Могу ли я приглашать других пользователей в приложение?",
                    "Как быстро будет обновляться приложение?",
                    "Не знаю как пользоваться сайтом",
                ]}
            />
        </div>
    );
};

const BlockInTextCard = ({ tag, text, examples }) => {
    return (
        <div className="w-full max-w-xl space-y-6">
            <div>
                <p className="mb-1.5 text-sm font-light uppercase">{tag}</p>
                <hr className="border-neutral-700" />
            </div>
            <p className="max-w-lg text-xl leading-relaxed">{text}</p>
            <div>
                <Typewrite examples={examples} />
                <hr className="border-neutral-300" />
            </div>
            <button className="w-full rounded-full border border-neutral-950 py-2 text-sm font-medium transition-colors hover:bg-neutral-950 hover:text-neutral-100">
                Обратиться в службу поддержки
            </button>
        </div>
    );
};

const LETTER_DELAY = 0.025;
const BOX_FADE_DURATION = 0.125;

const FADE_DELAY = 5;
const MAIN_FADE_DURATION = 0.25;

const SWAP_DELAY_IN_MS = 5500;

const Typewrite = ({ examples }) => {
    const [exampleIndex, setExampleIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setExampleIndex((pv) => (pv + 1) % examples.length);
        }, SWAP_DELAY_IN_MS);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <p className="mb-2.5 text-sm font-light uppercase">
            <span className="inline-block size-2 bg-neutral-950" />
            <span className="ml-3">
                Примеры:{" "}
                {examples[exampleIndex].split("").map((l, i) => (
                    <motion.span
                        initial={{
                            opacity: 1,
                        }}
                        animate={{
                            opacity: 0,
                        }}
                        transition={{
                            delay: FADE_DELAY,
                            duration: MAIN_FADE_DURATION,
                            ease: "easeInOut",
                        }}
                        key={`${exampleIndex}-${i}`}
                        className="relative"
                    >
                        <motion.span
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                delay: i * LETTER_DELAY,
                                duration: 0,
                            }}
                        >
                            {l}
                        </motion.span>
                        <motion.span
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                delay: i * LETTER_DELAY,
                                times: [0, 0.1, 1],
                                duration: BOX_FADE_DURATION,
                                ease: "easeInOut",
                            }}
                            className="absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-neutral-950"
                        />
                    </motion.span>
                ))}
            </span>
        </p>
    );
};
