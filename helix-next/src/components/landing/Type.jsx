const Type = ({ text, delay = 0, gradient = false }) => {
  return (
    <div className="relative">
      <h1
        className={`
          inline-block
          whitespace-nowrap
          font-black
          tracking-tight
          text-5xl
          md:text-7xl
          ${
            gradient
              ? "bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
              : "text-white"
          }
        `}
      >
        {text}
      </h1>
    </div>
  );
};

export default Type;
