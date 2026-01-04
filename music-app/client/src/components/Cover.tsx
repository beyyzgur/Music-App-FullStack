type Props = {
  seed: string | number;
  rounded?: boolean;
};

export default function Cover({ seed, rounded = true }: Props) {
  const colors = [
    "from-violet-500/40 via-indigo-500/30 to-zinc-900",
    "from-fuchsia-500/40 via-purple-500/30 to-zinc-900",
    "from-indigo-500/40 via-sky-500/30 to-zinc-900",
    "from-rose-500/40 via-pink-500/30 to-zinc-900",
  ];

  const index =
    typeof seed === "number"
      ? seed % colors.length
      : seed.length % colors.length;

  return (
    <div
      className={`h-full w-full bg-gradient-to-br ${
        colors[index]
      } ${rounded ? "rounded-xl" : ""}`}
    />
  );
}
