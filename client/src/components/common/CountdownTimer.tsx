import { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface CountdownTimerProps {
    targetDate: Date;
}

interface TimerBoxProps {
    value: number;
    label: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const TimerBox = ({ value, label }: TimerBoxProps) => (
        <div className="flex flex-col items-center bg-slate-900 text-white rounded-lg p-2 min-w-[60px]">
            <span className="font-bold text-xl">{value || '00'}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">{label}</span>
        </div>
    );

    return (
        <div className="flex gap-2">
            <TimerBox value={timeLeft.days} label="Days" />
            <TimerBox value={timeLeft.hours} label="Hrs" />
            <TimerBox value={timeLeft.minutes} label="Mins" />
            <TimerBox value={timeLeft.seconds} label="Secs" />
        </div>
    );
};

export default CountdownTimer;
