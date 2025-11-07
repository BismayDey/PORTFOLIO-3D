import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Float,
  Text3D,
  OrbitControls,
  Sphere,
  PerspectiveCamera,
  Stars,
  useAspect,
  Torus,
  TorusKnot,
  Octahedron,
  Icosahedron,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";

export function Scene() {
  const particlesCount = 8000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);

  const colorPalette = useMemo(
    () => [
      new THREE.Color("#ff8855"),
      new THREE.Color("#55ff88"),
      new THREE.Color("#5588ff"),
      new THREE.Color("#ff55ff"),
      new THREE.Color("#ffff55"),
      new THREE.Color("#55ffff"),
    ],
    []
  );

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 2;
  }

  const points = useRef();
  const sphere1 = useRef();
  const sphere2 = useRef();
  const sphere3 = useRef();
  const sphere4 = useRef();
  const torus = useRef();
  const torusKnot = useRef();
  const octahedron = useRef();
  const icosahedron = useRef();
  const textGroup = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    // Enhanced particle system with dynamic waves and colors
    if (points.current) {
      points.current.rotation.y = time * 0.1 + mouseX * 0.1;
      points.current.rotation.x = Math.sin(time * 0.2) * 0.1 + mouseY * 0.1;
      const positions = points.current.geometry.attributes.position.array;
      const colors = points.current.geometry.attributes.color.array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + positions[i] * 0.1) * 0.01;
        positions[i] += Math.cos(time + positions[i + 1] * 0.1) * 0.01;

        // Pulsating colors
        const colorIndex = Math.floor(i / 3) % colorPalette.length;
        const pulseIntensity = (Math.sin(time * 2 + i * 0.01) + 1) * 0.5;
        colors[i] = colorPalette[colorIndex].r * pulseIntensity;
        colors[i + 1] = colorPalette[colorIndex].g * pulseIntensity;
        colors[i + 2] = colorPalette[colorIndex].b * pulseIntensity;
      }
      points.current.geometry.attributes.position.needsUpdate = true;
      points.current.geometry.attributes.color.needsUpdate = true;
    }

    // Interactive text group with enhanced follow
    if (textGroup.current) {
      textGroup.current.rotation.y = THREE.MathUtils.lerp(
        textGroup.current.rotation.y,
        mouseX * 0.3,
        0.1
      );
      textGroup.current.rotation.x = THREE.MathUtils.lerp(
        textGroup.current.rotation.x,
        mouseY * 0.3,
        0.1
      );
      textGroup.current.position.z = THREE.MathUtils.lerp(
        textGroup.current.position.z,
        Math.sin(time) * 0.5,
        0.1
      );
    }

    // Enhanced geometric animations
    if (sphere1.current) {
      sphere1.current.position.y = Math.sin(time * 0.5) * 0.8;
      sphere1.current.position.x = Math.cos(time * 0.3) * 0.5;
      sphere1.current.rotation.y = time * 0.5 + mouseX;
      sphere1.current.rotation.z = time * 0.3;
      sphere1.current.scale.setScalar(1 + Math.sin(time) * 0.2);
    }

    if (sphere2.current) {
      sphere2.current.position.y = Math.cos(time * 0.5) * 0.8;
      sphere2.current.position.x = Math.sin(time * 0.3) * 0.5;
      sphere2.current.rotation.y = time * 0.7 - mouseX;
      sphere2.current.rotation.x = time * 0.4;
      sphere2.current.scale.setScalar(1 + Math.cos(time) * 0.2);
    }

    if (sphere3.current) {
      sphere3.current.position.x = Math.sin(time * 0.3) * 2;
      sphere3.current.position.z = Math.cos(time * 0.3) * 2;
      sphere3.current.position.y = Math.sin(time * 0.5) * 0.5;
      sphere3.current.rotation.y = time * 0.6 + mouseX * 0.5;
      sphere3.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.2);
    }

    if (sphere4.current) {
      sphere4.current.position.x = Math.sin(time * 0.4) * 3;
      sphere4.current.position.y = Math.cos(time * 0.3) * 1.5;
      sphere4.current.position.z = Math.sin(time * 0.5) * 2;
      sphere4.current.rotation.x = time * 0.5;
      sphere4.current.rotation.z = time * 0.3;
      sphere4.current.scale.setScalar(0.8 + Math.sin(time * 2) * 0.3);
    }

    if (torus.current) {
      torus.current.rotation.x = time * 0.5;
      torus.current.rotation.y = time * 0.2;
      torus.current.position.y = Math.sin(time * 0.5) * 0.5;
      torus.current.scale.setScalar(1 + Math.sin(time * 0.8) * 0.2);
    }

    if (torusKnot.current) {
      torusKnot.current.rotation.x = time * 0.3;
      torusKnot.current.rotation.y = time * 0.4;
      torusKnot.current.position.z = Math.sin(time * 0.3) * 1;
      torusKnot.current.scale.setScalar(0.8 + Math.cos(time) * 0.2);
    }

    // New geometric animations
    if (octahedron.current) {
      octahedron.current.rotation.x = time * 0.4;
      octahedron.current.rotation.y = time * 0.5;
      octahedron.current.position.y = Math.sin(time * 0.6) * 1;
      octahedron.current.position.x = Math.cos(time * 0.4) * 1;
      octahedron.current.scale.setScalar(0.7 + Math.sin(time * 1.2) * 0.3);
    }

    if (icosahedron.current) {
      icosahedron.current.rotation.x = time * 0.3;
      icosahedron.current.rotation.y = time * 0.6;
      icosahedron.current.position.z = Math.sin(time * 0.5) * 1.5;
      icosahedron.current.position.x = Math.cos(time * 0.5) * 1.5;
      icosahedron.current.scale.setScalar(0.6 + Math.cos(time * 1.5) * 0.2);
    }
  });

  const size = useAspect(1920, 1080, 0.7);

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={75} />

      <directionalLight position={[1, 1, 1]} intensity={2} />
      <ambientLight intensity={0.5} />
      <pointLight position={[-5, 5, 5]} intensity={1.5} color="#ff0000" />
      <pointLight position={[5, -5, 5]} intensity={1.5} color="#0000ff" />
      <pointLight position={[0, 0, 5]} intensity={1.5} color="#00ff00" />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#ff00ff" />
      <pointLight position={[-3, -3, 3]} intensity={1.5} color="#ffff00" />

      <Stars
        radius={100}
        depth={50}
        count={10000}
        factor={6}
        saturation={1}
        fade
        speed={2}
      />

      <group ref={textGroup}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={size[0] * 0.15}
            height={0.2}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelSegments={8}
            position={[-2.5, 1.5, 0]}
          >
            Bismay Dey
            <meshStandardMaterial
              color="#8855ff"
              metalness={0.9}
              roughness={0.1}
              emissive="#8855ff"
              emissiveIntensity={0.8}
            />
          </Text3D>

          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={size[0] * 0.06}
            height={0.1}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.01}
            bevelSegments={8}
            position={[-2, 0.5, 0]}
          >
            Web Developer
            <meshStandardMaterial
              color="#ff5588"
              metalness={0.9}
              roughness={0.1}
              emissive="#ff5588"
              emissiveIntensity={0.8}
            />
          </Text3D>
        </Float>
      </group>

      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particlesCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particlesCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </points>

      <group position={[3, -1, 0]}>
        <Sphere ref={sphere1} args={[1, 32, 32]}>
          <MeshDistortMaterial
            color="#ff8855"
            wireframe
            metalness={0.9}
            roughness={0.1}
            emissive="#ff8855"
            emissiveIntensity={0.8}
            distort={0.4}
            speed={4}
          />
        </Sphere>
      </group>

      <group position={[-3, -1, 0]}>
        <Sphere ref={sphere2} args={[0.7, 32, 32]}>
          <MeshDistortMaterial
            color="#55ff88"
            wireframe
            metalness={0.9}
            roughness={0.1}
            emissive="#55ff88"
            emissiveIntensity={0.8}
            distort={0.3}
            speed={3}
          />
        </Sphere>
      </group>

      <group position={[0, -2, 0]}>
        <Sphere ref={sphere3} args={[0.5, 32, 32]}>
          <MeshDistortMaterial
            color="#5588ff"
            wireframe
            metalness={0.9}
            roughness={0.1}
            emissive="#5588ff"
            emissiveIntensity={0.8}
            distort={0.5}
            speed={5}
          />
        </Sphere>
      </group>

      <group position={[2, 2, -2]}>
        <Sphere ref={sphere4} args={[0.4, 32, 32]}>
          <MeshDistortMaterial
            color="#ff55ff"
            wireframe
            metalness={0.9}
            roughness={0.1}
            emissive="#ff55ff"
            emissiveIntensity={0.8}
            distort={0.6}
            speed={4}
          />
        </Sphere>
      </group>

      <group position={[-2, 2, -1]}>
        <Torus ref={torus} args={[0.6, 0.2, 32, 64]}>
          <MeshDistortMaterial
            color="#ffff55"
            wireframe
            metalness={0.9}
            roughness={0.1}
            emissive="#ffff55"
            emissiveIntensity={0.8}
            distort={0.3}
            speed={3}
          />
        </Torus>
      </group>

      <group position={[0, 0, -2]}>
        <TorusKnot ref={torusKnot} args={[0.5, 0.15, 128, 32]}>
          <MeshDistortMaterial
            color="#55ffff"
            wireframe
            metalness={0.9}
            roughness={0.1}
            emissive="#55ffff"
            emissiveIntensity={0.8}
            distort={0.4}
            speed={5}
          />
        </TorusKnot>
      </group>

      <group position={[2.5, 0, -1.5]}>
        <Octahedron ref={octahedron} args={[0.8, 2]}>
          <MeshDistortMaterial
            color="#ff88aa"
            wireframe
            metalness={0.9}
            roughness={0.1}
            emissive="#ff88aa"
            emissiveIntensity={0.8}
            distort={0.5}
            speed={4}
          />
        </Octahedron>
      </group>

      <group position={[-2.5, 0, -1.5]}>
        <Icosahedron ref={icosahedron} args={[0.7, 1]}>
          <MeshDistortMaterial
            color="#88ffaa"
            wireframe
            metalness={0.9}
            roughness={0.1}
            emissive="#88ffaa"
            emissiveIntensity={0.8}
            distort={0.4}
            speed={3}
          />
        </Icosahedron>
      </group>
    </>
  );
}
