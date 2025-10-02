"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Box,
  Text,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

export function Scene() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkResponsive();
    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, []);

  const responsiveScale = isMobile ? 0.5 : isTablet ? 0.75 : 1;
  const cameraDistance = isMobile ? 14 : isTablet ? 12 : 10;
  const cameraFOV = isMobile ? 85 : isTablet ? 80 : 75;

  const particlesCount = 15000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);

  const colorPalette = useMemo(
    () => [
      new THREE.Color("#00d9ff"),
      new THREE.Color("#7b2cbf"),
      new THREE.Color("#ff006e"),
      new THREE.Color("#06ffa5"),
      new THREE.Color("#ffbe0b"),
      new THREE.Color("#3a86ff"),
      new THREE.Color("#00ff88"),
      new THREE.Color("#ff6b35"),
    ],
    []
  );

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 4;
  }

  const points = useRef<THREE.Points>(null);
  const textGroup = useRef<THREE.Group>(null);
  const pointerDownRef = useRef<boolean>(false);
  const codeBoxes = useRef<THREE.Group>(null);
  const digitalRain = useRef<THREE.Group>(null);

  // Model refs for the four diagonal corners around the name
  const topRightRef = useRef<THREE.Group>(null);
  const topLeftRef = useRef<THREE.Group>(null);
  const bottomRightRef = useRef<THREE.Group>(null);
  const bottomLeftRef = useRef<THREE.Group>(null);

  // Refs for models that should appear above the name
  const laptopAboveRef = useRef<THREE.Group>(null);
  const mouseAboveRef = useRef<THREE.Group>(null);

  // Load GLTF models from public/3D (keyboard + headset)
  const keyboardGltf = useGLTF(
    "/3D/mechanical_keyboard_-_aesthetic.glb"
  ) as unknown as {
    scene?: THREE.Object3D;
  };
  const headsetGltf = useGLTF("/3D/headset.glb") as unknown as {
    scene?: THREE.Object3D;
  };
  const laptopGltf = useGLTF("/3D/gaming_laptop.glb") as unknown as {
    scene?: THREE.Object3D;
  };
  const mouseGltf = useGLTF("/3D/gaming_mouse.glb") as unknown as {
    scene?: THREE.Object3D;
  };
  const bgMatRef = useRef<THREE.ShaderMaterial>(null);
  const startTimeRef = useRef<number | null>(null);
  // Scroll-based continuous visibility controls
  const scrollTarget = useRef<number>(1); // 1 = hero visible, 0 = hero hidden
  const scrollAnim = useRef<number>(1); // current animated hero visibility value
  const modelsVisibleTarget = useRef<number>(1); // target visibility for other 3D elements
  const modelsVisibleAnim = useRef<number>(1); // animated visibility for other 3D elements

  const baseScales = {
    topRight: 1.15 * responsiveScale,
    topLeft: 1.1 * responsiveScale,
    bottomRight: 1.1 * responsiveScale,
    bottomLeft: 1.05 * responsiveScale,
    laptopAbove: 0.65 * responsiveScale,
    mouseAbove: 1.6 * responsiveScale,
  };

  useEffect(() => {
    const onDown = () => (pointerDownRef.current = true);
    const onUp = () => (pointerDownRef.current = false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    // continuous scroll handler: map scroll position to a hero visibility fraction.
    const onScroll = () => {
      const y = window.scrollY ?? 0;
      // assume hero section ~= viewport height; hero visibility goes from 1 -> 0 as we scroll down one viewport
      const heroFrac = Math.max(0, Math.min(1, 1 - y / window.innerHeight));
      scrollTarget.current = heroFrac;
      modelsVisibleTarget.current = heroFrac;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll as EventListener);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;
    const miX = pointerDownRef.current ? mouseX : 0;
    const miY = pointerDownRef.current ? mouseY : 0;

    if (points.current) {
      points.current.rotation.y = THREE.MathUtils.lerp(
        points.current.rotation.y,
        time * 0.1 + mouseX * 0.15,
        0.05
      );
      points.current.rotation.x = THREE.MathUtils.lerp(
        points.current.rotation.x,
        Math.sin(time * 0.2) * 0.2 + mouseY * 0.15,
        0.05
      );
      const positions = points.current.geometry.attributes.position.array;
      const colors = points.current.geometry.attributes.color.array;

      for (let i = 0; i < positions.length; i += 3) {
        const angle = time + i * 0.001;
        positions[i + 1] += Math.sin(angle + positions[i] * 0.05) * 0.02;
        positions[i] += Math.cos(angle + positions[i + 1] * 0.05) * 0.02;
        positions[i + 2] += Math.sin(angle * 0.5) * 0.015;

        const colorIndex = Math.floor(i / 3) % colorPalette.length;
        const pulseIntensity = (Math.sin(time * 3 + i * 0.005) + 1) * 0.5;
        const shimmer = (Math.cos(time * 2 + i * 0.01) + 1) * 0.3 + 0.7;
        colors[i] = colorPalette[colorIndex].r * pulseIntensity * shimmer;
        colors[i + 1] = colorPalette[colorIndex].g * pulseIntensity * shimmer;
        colors[i + 2] = colorPalette[colorIndex].b * pulseIntensity * shimmer;
      }
      points.current.geometry.attributes.position.needsUpdate = true;
      points.current.geometry.attributes.color.needsUpdate = true;
    }

    if (textGroup.current) {
      textGroup.current.rotation.y = THREE.MathUtils.lerp(
        textGroup.current.rotation.y,
        miX * 0.2,
        0.08
      );
      textGroup.current.rotation.x = THREE.MathUtils.lerp(
        textGroup.current.rotation.x,
        miY * 0.15,
        0.08
      );
    }

    const cornerSpacing = isMobile ? 5.5 : isTablet ? 7.5 : 9.0;
    const cornerVerticalSpacing = isMobile ? 1.2 : isTablet ? 1.6 : 2.0;

    if (topRightRef.current) {
      const targetRotY = time * 0.28 + miX * 0.35;
      topRightRef.current.rotation.y = THREE.MathUtils.lerp(
        topRightRef.current.rotation.y,
        targetRotY,
        0.06
      );
      topRightRef.current.position.y =
        cornerVerticalSpacing + Math.sin(time * 0.6) * 0.08;
      topRightRef.current.position.x =
        cornerSpacing + Math.cos(time * 0.4) * 0.12 + miX * 0.3;
      topRightRef.current.rotation.x = Math.sin(time * 0.16) * 0.03;
    }

    if (topLeftRef.current) {
      const targetRotY = -time * 0.3 - miX * 0.35;
      topLeftRef.current.rotation.y = THREE.MathUtils.lerp(
        topLeftRef.current.rotation.y,
        targetRotY,
        0.06
      );
      topLeftRef.current.position.y =
        cornerVerticalSpacing + Math.cos(time * 0.55) * 0.08;
      topLeftRef.current.position.x =
        -cornerSpacing + Math.sin(time * 0.35) * 0.12 - miX * 0.3;
      topLeftRef.current.rotation.z = Math.sin(time * 0.2) * 0.03;
    }

    if (bottomRightRef.current) {
      const targetRotY = time * 0.32 + miX * 0.3;
      bottomRightRef.current.rotation.y = THREE.MathUtils.lerp(
        bottomRightRef.current.rotation.y,
        targetRotY,
        0.06
      );
      bottomRightRef.current.position.y =
        -cornerVerticalSpacing + Math.sin(time * 0.7) * 0.06;
      bottomRightRef.current.position.x =
        cornerSpacing + Math.cos(time * 0.5) * 0.12 + miX * 0.25;
      bottomRightRef.current.rotation.x = Math.cos(time * 0.18) * 0.02;
    }

    if (bottomLeftRef.current) {
      const targetRotY = -time * 0.34 - miX * 0.32;
      bottomLeftRef.current.rotation.y = THREE.MathUtils.lerp(
        bottomLeftRef.current.rotation.y,
        targetRotY,
        0.06
      );
      bottomLeftRef.current.position.y =
        -cornerVerticalSpacing + Math.cos(time * 0.65) * 0.06;
      bottomLeftRef.current.position.x =
        -cornerSpacing + Math.sin(time * 0.45) * 0.12 - miX * 0.25;
      bottomLeftRef.current.rotation.z = Math.sin(time * 0.22) * 0.025;
    }

    // Startup animation progress (fade + scale in)
    if (startTimeRef.current === null) startTimeRef.current = time;
    const startT = time - (startTimeRef.current ?? 0);
    const progress = Math.min(1, startT / 1.2);

    // Helper to fade materials on an object/group while preserving original material settings
    interface OrigMatProps {
      transparent: boolean;
      opacity: number;
      depthWrite: boolean;
    }
    const applyFade = (obj?: THREE.Object3D | null, p = 1, restore = false) => {
      if (!obj) return;
      obj.traverse((child: THREE.Object3D) => {
        const mesh = child as THREE.Mesh & {
          material?: THREE.Material | THREE.Material[];
        };
        if (mesh instanceof THREE.Mesh && mesh.material) {
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((m) => {
            if (!m) return;
            const mm = m as THREE.MeshStandardMaterial & {
              __orig?: OrigMatProps;
            };
            if (!mm.__orig) {
              const existingOpacity =
                (mm as unknown as { opacity?: number }).opacity ?? 1;
              const existingDepthWrite =
                (mm as unknown as { depthWrite?: boolean }).depthWrite ?? false;
              mm.__orig = {
                transparent: mm.transparent,
                opacity: existingOpacity,
                depthWrite: existingDepthWrite,
              } as OrigMatProps;
            }
            // set temporary fade values
            mm.transparent = true;
            mm.opacity = p;
            mm.depthWrite = false;
            // if restore requested (animation finished), put back original values
            if (restore && mm.__orig) {
              mm.transparent = mm.__orig.transparent;
              (mm as unknown as { opacity: number }).opacity =
                mm.__orig.opacity;
              (mm as unknown as { depthWrite: boolean }).depthWrite =
                mm.__orig.depthWrite;
              delete mm.__orig;
            }
          });
        }
      });
    };

    modelsVisibleAnim.current = THREE.MathUtils.lerp(
      modelsVisibleAnim.current,
      modelsVisibleTarget.current,
      0.05
    );

    // Apply progress to above-name models
    // Starting animation for the name: pop+rise with fade-in + scroll hide/show
    if (textGroup.current) {
      // easeOut cubic for a nice pop
      const eased = 1 - Math.pow(1 - progress, 3);
      const scaleVal = 0.6 + 0.4 * eased; // start slightly smaller, pop to 1
      scrollAnim.current = THREE.MathUtils.lerp(
        scrollAnim.current,
        scrollTarget.current,
        0.06
      );
      const combined = eased * scrollAnim.current;
      textGroup.current.scale.setScalar(scaleVal * combined);
      // subtle vertical rise from below into final position, plus hide translation when scrolling down
      const baseY = 0.4;
      // when hidden, move down by 1.2 units
      textGroup.current.position.y =
        baseY - (1 - eased) * 0.8 - (1 - scrollAnim.current) * 1.2;
      // fade text materials in using the existing helper multiplied by scrollAnim
      applyFade(
        textGroup.current,
        progress * scrollAnim.current,
        progress >= 1 && scrollAnim.current > 0.99
      );
    }

    const aboveModelHorizontalSpacing = isMobile ? 1.2 : isTablet ? 1.6 : 1.8;
    const aboveModelVerticalPos = isMobile ? -1.5 : isTablet ? -1.7 : -1.9;

    if (laptopAboveRef.current) {
      const target = baseScales.laptopAbove;
      const combined = progress * modelsVisibleAnim.current;
      laptopAboveRef.current.scale.setScalar(target * combined);
      const targetRotY = time * 0.25 + miX * 0.15;
      laptopAboveRef.current.rotation.y = THREE.MathUtils.lerp(
        laptopAboveRef.current.rotation.y,
        targetRotY,
        0.06
      );
      laptopAboveRef.current.position.set(
        aboveModelHorizontalSpacing,
        aboveModelVerticalPos +
          Math.sin(time * 0.5) * 0.05 -
          (1 - modelsVisibleAnim.current) * 1.0,
        -0.8
      );
      applyFade(laptopAboveRef.current, combined, combined >= 1 - 1e-3);
    }

    if (mouseAboveRef.current) {
      const target = baseScales.mouseAbove;
      const combined = progress * modelsVisibleAnim.current;
      mouseAboveRef.current.scale.setScalar(target * combined);
      const targetRotY = -time * 0.28 - miX * 0.2;
      mouseAboveRef.current.rotation.y = THREE.MathUtils.lerp(
        mouseAboveRef.current.rotation.y,
        targetRotY,
        0.06
      );
      mouseAboveRef.current.position.set(
        -aboveModelHorizontalSpacing,
        aboveModelVerticalPos -
          0.05 +
          Math.cos(time * 0.45) * 0.05 -
          (1 - modelsVisibleAnim.current) * 1.0,
        -0.8
      );
      applyFade(mouseAboveRef.current, combined, combined >= 1 - 1e-3);
    }

    // Apply fade and scale to corner models
    const cornerGroups = [
      { g: topRightRef.current, key: "topRight" },
      { g: topLeftRef.current, key: "topLeft" },
      { g: bottomRightRef.current, key: "bottomRight" },
      { g: bottomLeftRef.current, key: "bottomLeft" },
    ];
    cornerGroups.forEach(({ g, key }) => {
      if (!g) return;
      const target = (baseScales as Record<string, number>)[key] ?? 1;
      // corner groups fade/scale out as we scroll down past hero
      const combined = progress * modelsVisibleAnim.current;
      g.scale.setScalar(target * combined);
      applyFade(g, combined, combined >= 1 - 1e-3);
    });

    if (codeBoxes.current) {
      codeBoxes.current.rotation.y = time * 0.2 * modelsVisibleAnim.current;
      codeBoxes.current.children.forEach((child, i) => {
        child.position.y =
          Math.sin(time * 0.5 + i) * 0.3 * modelsVisibleAnim.current;
        child.rotation.y = (time * 0.3 + i) * modelsVisibleAnim.current;
        // scale boxes down when hidden
        (child as THREE.Object3D).scale.setScalar(modelsVisibleAnim.current);
      });
      applyFade(
        codeBoxes.current,
        modelsVisibleAnim.current,
        modelsVisibleAnim.current >= 1 - 1e-3
      );
    }

    if (digitalRain.current) {
      digitalRain.current.children.forEach((child) => {
        child.position.y -= 0.05 * Math.max(0.25, modelsVisibleAnim.current);
        if (child.position.y < -10) {
          child.position.y = 10;
        }
        (child as THREE.Object3D).scale.setScalar(modelsVisibleAnim.current);
      });
      applyFade(
        digitalRain.current,
        modelsVisibleAnim.current,
        modelsVisibleAnim.current >= 1 - 1e-3
      );
    }

    // update background shader time
    if (bgMatRef.current) {
      bgMatRef.current.uniforms.uTime.value = time;
    }
  });

  const nameFontSize = isMobile ? 1.2 : isTablet ? 1.8 : 2.2;
  const titleFontSize = isMobile ? 0.45 : isTablet ? 0.6 : 0.75;
  const nameVerticalPos = isMobile ? 1.0 : isTablet ? 1.2 : 1.4;
  const titleVerticalPos = isMobile ? -0.2 : isTablet ? -0.28 : -0.35;

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        enableDamping
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
      />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, cameraDistance]}
        fov={cameraFOV}
      />

      <directionalLight position={[1, 1, 1]} intensity={3} />
      <ambientLight intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={2.5} color="#ff006e" />
      <pointLight position={[5, -5, 5]} intensity={2.5} color="#3a86ff" />
      <pointLight position={[0, 0, 5]} intensity={2.5} color="#06ffa5" />
      <pointLight position={[3, 3, 3]} intensity={2.5} color="#7b2cbf" />
      <pointLight position={[-3, -3, 3]} intensity={2.5} color="#ffbe0b" />
      <pointLight position={[0, 12, 0]} intensity={2} color="#00d9ff" />
      <pointLight position={[4, -2, 2]} intensity={2} color="#00ff88" />
      <spotLight
        position={[0, 12, 0]}
        intensity={4}
        angle={0.3}
        penumbra={1}
        color="#ffffff"
      />

      {/* Fullscreen animated shader background replacing the space/stars background */}
      <mesh position={[0, 0, -40]} frustumCulled={false}>
        <planeGeometry args={[250, 250]} />
        <shaderMaterial
          ref={bgMatRef}
          uniforms={{
            uTime: { value: 0 },
            uSpeed: { value: 0.12 },
          }}
          vertexShader={
            /* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `
          }
          fragmentShader={
            /* glsl */ `
            varying vec2 vUv;
            uniform float uTime;
            uniform float uSpeed;

            void main() {
              // subtle horizontal flow based on your original fragment idea
              float offset = vUv.x + uTime * uSpeed;
              // create a soft banded gradient and color shift
              float band = sin(offset * 6.28318) * 0.5 + 0.5;
              vec3 base = mix(vec3(0.02, 0.05, 0.12), vec3(0.02, 0.16, 0.14), vUv.y);
              vec3 accent = vec3(0.0, 0.8, 0.9) * (0.25 + 0.75 * band);
              vec3 color = base + accent * 0.35;
              // gentle vignetting
              float vig = smoothstep(0.9, 0.2, distance(vUv, vec2(0.5)));
              color *= mix(1.0, 0.6, vig * 0.5);
              gl_FragColor = vec4(color, 1.0);
            }
            `
          }
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <group ref={textGroup} position={[0, 0.4, 0]}>
        <Text
          fontSize={nameFontSize}
          position={[0, nameVerticalPos, 0]}
          anchorX="center"
          anchorY="middle"
          maxWidth={24}
          letterSpacing={0.06}
          outlineWidth={0.06}
          outlineColor="#0a1a2a"
          outlineOpacity={0.75}
        >
          Bismay Dey
        </Text>

        <Text
          fontSize={titleFontSize}
          position={[0, titleVerticalPos, 0]}
          anchorX="center"
          anchorY="middle"
          maxWidth={24}
          letterSpacing={0.2}
          outlineWidth={0.03}
          outlineColor="#062023"
          outlineOpacity={0.6}
          color="#B19CD9"
        >
          Full Stack Developer
        </Text>
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
          size={0.03}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <group ref={codeBoxes} position={[5, 0, -3]}>
        {[0, 1, 2].map((i) => (
          <Box key={i} args={[0.4, 0.4, 0.4]} position={[0, i * 1.5, 0]}>
            <meshStandardMaterial
              color="#00ff88"
              wireframe
              emissive="#00ff88"
              emissiveIntensity={1}
            />
          </Box>
        ))}
      </group>

      <group ref={digitalRain} position={[-5, 5, -5]}>
        {[...Array(10)].map((_, i) => (
          <Text
            key={i}
            position={[i * 0.5, Math.random() * 10, 0]}
            fontSize={0.3}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </Text>
        ))}
      </group>

      {/* Four diagonal corner models around the name (keyboard/headset alternating) */}
      <group ref={topRightRef} position={[9.0, 2.0, -2.0]} scale={1.2}>
        {keyboardGltf?.scene && (
          <primitive object={keyboardGltf.scene} dispose={null} />
        )}
      </group>

      <group ref={topLeftRef} position={[-9.0, 2.0, -2.0]} scale={1.2}>
        {headsetGltf?.scene && (
          <primitive object={headsetGltf.scene} dispose={null} />
        )}
      </group>

      <group ref={bottomRightRef} position={[9.0, -2.0, -2.0]} scale={1.1}>
        {keyboardGltf?.scene && (
          <primitive object={keyboardGltf.scene} dispose={null} />
        )}
      </group>

      <group ref={bottomLeftRef} position={[-9.0, -2.0, -2.0]} scale={1.1}>
        {headsetGltf?.scene && (
          <primitive object={headsetGltf.scene} dispose={null} />
        )}
      </group>

      {/* Models above the name (laptop + mouse) spread out more */}
      <group ref={laptopAboveRef} position={[2.4, 3.0, -1.6]} scale={0}>
        {laptopGltf?.scene && (
          <primitive object={laptopGltf.scene} dispose={null} />
        )}
      </group>

      <group ref={mouseAboveRef} position={[-2.4, 3.0, -1.6]} scale={0}>
        {mouseGltf?.scene && (
          <primitive object={mouseGltf.scene} dispose={null} />
        )}
      </group>
    </>
  );
}
