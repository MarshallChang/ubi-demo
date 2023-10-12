import React, { forwardRef, useEffect, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { Object3DEventMap } from 'three'

export type ToiletPropsType = {
  position: THREE.Vector3
}

const Toilet = forwardRef(
  (
    { position }: ToiletPropsType,
    ref: React.Ref<THREE.Group<Object3DEventMap>> | undefined
  ) => {
    const toiletRef = useRef<THREE.Group<Object3DEventMap>>()

    const { scene, animations } = useGLTF('./models/toilet.glb', './libs/')
    const { actions, names } = useAnimations(animations, toiletRef)

    useEffect(() => {
      if (actions && names) {
        actions[names[0]]?.reset().fadeIn(0.5).play()
      }

      return () => {
        if (actions && names) {
          actions[names[0]]?.fadeOut(0.5)
        }
      }
    }, [actions, names])
    return (
      <group
        ref={ref}
        dispose={null}
        position={position}
        rotation={[0, 4.24, 0]}
      >
        <primitive ref={toiletRef} object={scene} />
      </group>
    )
  }
)

useGLTF.preload('./models/toilet.glb', './libs/')

export default Toilet
