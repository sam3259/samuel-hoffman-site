"use client";

import { useEffect, useState } from "react";

type LocalTimeProps = {
  timeZone: string;
};

const formatTime = (timeZone: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date());

export function LocalTime({ timeZone }: LocalTimeProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatTime(timeZone));

    const initialTimer = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 30_000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [timeZone]);

  return (
    <span className="local-time" aria-label="Sam's local time">
      {time ?? "--:--"}
      <span aria-hidden="true"> ET</span>
    </span>
  );
}
