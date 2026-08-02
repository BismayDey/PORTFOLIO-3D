import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Torus } from "@react-three/drei";
import * as THREE from "three";

/**
 * The hero centrepiece: a distorting core inside a wireframe shell, wrapped by
 * three rings on different axes. Sits to the right of the headline on desktop
 * and drifts toward centre on narrow viewports.
 */
export function HeroCore({ x = 3.1 }: { x?: number }) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { x: mx, y: my } = state.pointer;

    if (group.current) {
      // ease toward the cursor rather than snapping to it
      group.current.rotation.y +=
        (mx * 0.5 - group.current.rotation.y) * 0.03;
      group.current.rotation.x +=
        (-my * 0.35 - group.current.rotation.x) * 0.03;
      group.current.position.y = Math.sin(t * 0.6) * 0.18;
    }
    if (shell.current) {
      shell.current.rotation.y = t * 0.18;
      shell.current.rotation.z = t * 0.1;
    }
    if (ringA.current) ringA.current.rotation.z = t * 0.45;
    if (ringB.current) {
      ringB.current.rotation.x = t * 0.35;
      ringB.current.rotation.y = t * 0.2;
    }
    if (ringC.current) {
      ringC.current.rotation.y = t * -0.3;
      ringC.current.rotation.x = Math.PI / 2.4;
    }
  });

  return (
    <group ref={group} position={[x, 0.2, 0]}>
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.8}>
        {/* molten core */}
        <Icosahedron args={[1.15, 12]}>
          <MeshDistortMaterial
            color="#7c3aed"
            emissive="#a855f7"
            emissiveIntensity={0.75}
            metalness={0.85}
            roughness={0.18}
            distort={0.38}
            speed={1.6}
          />
        </Icosahedron>

        {/* faceted shell */}
        <Icosahedron ref={shell} args={[1.75, 1]}>
          <meshBasicMaterial
            color="#f472b6"
            wireframe
            transparent
            opacity={0.35}
          />
        </Icosahedron>

        {/* orbit rings */}
        <Torus ref={ringA} args={[2.35, 0.012, 12, 128]}>
          <meshBasicMaterial color="#c084fc" transparent opacity={0.65} />
        </Torus>
        <Torus ref={ringB} args={[2.75, 0.008, 12, 128]}>
          <meshBasicMaterial color="#f472b6" transparent opacity={0.45} />
        </Torus>
        <Torus ref={ringC} args={[3.1, 0.006, 12, 128]}>
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} />
        </Torus>
      </Float>

      <pointLight position={[0, 0, 2]} intensity={3} color="#a855f7" distance={9} />
      <pointLight position={[2, 1, 1]} intensity={2} color="#f472b6" distance={9} />
    </group>
  );
}
