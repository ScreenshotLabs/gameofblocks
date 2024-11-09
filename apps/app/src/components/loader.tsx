interface LoaderProps {
  message?: string;
}

export default function Loader({ message }: LoaderProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/images/splash-screen@3x.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      {message && (
        <div className="mt-80 text-game-text text-center">
          {message}
        </div>
      )}
    </div>
  );
}