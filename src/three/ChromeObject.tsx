import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Float } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'

export type Shape = 'sphere' | 'ring' | 'pill' | 'merge'

const MAT = {
  color: '#D67B9F',
  metalness: 0.38,
  roughness: 0.09,
  clearcoat: 1.0,
  clearcoatRoughness: 0.04,
  ior: 1.46,
  transmission: 0.18,
  iridescence: 0.35,
  iridescenceIOR: 1.3,
  envMapIntensity: 1.35,
} as const

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch { return false }
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#2a1e2a']} />
      {/* key: big soft white softbox top-left */}
      <Lightformer form="rect" intensity={6} color="#FFFBFD" position={[-4, 5, 3]} scale={[8, 4, 1]} target={[0, 0, 0]} />
      {/* fill: pale pink from the right */}
      <Lightformer form="rect" intensity={2.4} color="#FEEBF3" position={[6, 1, 2]} scale={[3, 6, 1]} target={[0, 0, 0]} />
      {/* rim: saturated pink ring from behind */}
      <Lightformer form="ring" intensity={4} color="#E98EAC" position={[0, 2, -6]} scale={6} target={[0, 0, 0]} />
      {/* bounce: plum from below */}
      <Lightformer form="rect" intensity={1.2} color="#A64C7B" position={[0, -6, 1]} scale={[10, 2, 1]} target={[0, 0, 0]} />
      {/* thin highlight strip for the specular streak */}
      <Lightformer form="rect" intensity={8} color="#FFFFFF" position={[2, 6, -1]} scale={[0.4, 5, 1]} target={[0, 0, 0]} />
    </Environment>
  )
}

function Body({ shape, spin, progress, pointer }: { shape: Shape; spin: number; progress?: MotionValue<number>; pointer: boolean }) {
  const g = useRef<THREE.Group>(null)
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  const { pointer: p } = useThree()
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial(MAT), [])
  useFrame((_, dt) => {
    const grp = g.current
    if (!grp) return
    const t = performance.now() / 1000
    const pr = progress ? progress.get() : 0
    grp.rotation.y += spin * dt
    grp.rotation.x = THREE.MathUtils.lerp(grp.rotation.x, (pointer ? -p.y * 0.35 : 0) + Math.sin(t * 0.4) * 0.05, 0.06)
    grp.rotation.z = THREE.MathUtils.lerp(grp.rotation.z, pointer ? p.x * 0.25 : 0, 0.06)
    if (shape === 'merge' && a.current && b.current) {
      // two tori move from apart to interlocked, then collapse toward one body
      const gap = THREE.MathUtils.lerp(1.6, 0, Math.min(1, pr * 1.4))
      const squash = THREE.MathUtils.smoothstep(pr, 0.55, 1)
      a.current.position.x = -gap; b.current.position.x = gap
      a.current.rotation.y = pr * Math.PI * 0.5; b.current.rotation.y = -pr * Math.PI * 0.5 + Math.PI / 2
      const s = 1 + squash * 0.25
      a.current.scale.setScalar(s); b.current.scale.setScalar(s)
    }
  })
  if (shape === 'sphere') {
    return (
      <group ref={g} scale={[1, 0.96, 1]}>
        <mesh material={mat}><sphereGeometry args={[1, 128, 128]} /></mesh>
      </group>
    )
  }
  if (shape === 'ring') {
    return (
      <group ref={g} rotation={[0.9, 0, 0.3]}>
        <mesh material={mat}><torusGeometry args={[0.78, 0.3, 64, 160]} /></mesh>
      </group>
    )
  }
  if (shape === 'pill') {
    return (
      <group ref={g} rotation={[0.2, 0, 0.75]}>
        <mesh material={mat}><capsuleGeometry args={[0.42, 1.1, 16, 48]} /></mesh>
      </group>
    )
  }
  return (
    <group ref={g} rotation={[0.5, 0, 0]}>
      <mesh ref={a} material={mat}><torusGeometry args={[0.9, 0.28, 48, 128]} /></mesh>
      <mesh ref={b} material={mat} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.9, 0.28, 48, 128]} /></mesh>
    </group>
  )
}

function Rig({ zoom }: { zoom: number }) {
  const { camera } = useThree()
  useEffect(() => { camera.position.set(0, 0, zoom); camera.lookAt(0, 0, 0) }, [camera, zoom])
  return null
}

export default function ChromeObject({
  shape = 'sphere', className, spin = 0.06, progress, pointer = false, float = true, zoom = 3.2, style,
}: { shape?: Shape; className?: string; spin?: number; progress?: MotionValue<number>; pointer?: boolean; float?: boolean; zoom?: number; style?: React.CSSProperties }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [ok, setOk] = useState<boolean | null>(null)
  const [onScreen, setOnScreen] = useState(true)
  const prm = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  useEffect(() => { setOk(hasWebGL()) }, [])
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: '20% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  if (ok === false) {
    return <div ref={wrap} className={className} style={{ ...style, borderRadius: '50%', background: 'var(--grad-bubble)' }} />
  }
  return (
    <div ref={wrap} className={className} style={style} aria-hidden>
      {ok && (
        <Canvas
          dpr={[1, 1.6]}
          frameloop={prm || !onScreen ? 'demand' : 'always'}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          camera={{ fov: 32, position: [0, 0, zoom] }}
          style={{ background: 'transparent' }}
        >
          <Rig zoom={zoom} />
          <Suspense fallback={null}>
            <Studio />
            {float && !prm ? (
              <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.6} floatingRange={[-0.08, 0.08]}>
                <Body shape={shape} spin={prm ? 0 : spin} progress={progress} pointer={pointer && !prm} />
              </Float>
            ) : (
              <Body shape={shape} spin={prm ? 0 : spin} progress={progress} pointer={pointer && !prm} />
            )}
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}
