export default function Loader() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/images/splash-screen@3x.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
