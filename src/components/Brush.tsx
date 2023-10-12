import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Object3DEventMap } from 'three'

export type BrushPropsType = {
  position: THREE.Vector3
}

const Brush = forwardRef(
  (_props, ref: React.Ref<THREE.Group<Object3DEventMap>> | undefined) => {
    const { scene } = useGLTF('./models/brush.glb', './libs/')

    return (
      <group ref={ref} dispose={null}>
        <primitive object={scene} rotation={[-1.24, -1.87, -1.11]} />
      </group>
    )
  }
)

useGLTF.preload('./models/brush.glb', './libs/')

export default Brush
