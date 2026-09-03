"use client";

export default function Lighting({ dim = false }: { dim?: boolean }) {
  const scale = dim ? 0.55 : 1;
  return (
    <>
      <ambientLight intensity={0.65 * scale} />
      <directionalLight position={[2.4, 3.2, 2.6]} intensity={1.1 * scale} color="#ffffff" />
      <directionalLight position={[-2.6, 1.2, -1.8]} intensity={0.5 * scale} color="#5B5CFF" />
      <pointLight position={[0, -0.4, 1.6]} intensity={0.35 * scale} color="#8C8DFF" distance={4} />
    </>
  );
}
