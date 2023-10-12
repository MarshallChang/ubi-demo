import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Object3DEventMap } from 'three'

const IceCream = forwardRef(
  (_props, ref: React.Ref<THREE.Group<Object3DEventMap>> | undefined) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { nodes, materials } = useGLTF('./models/ice-cream.glb', './libs/')
    return (
      <group ref={ref} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001.geometry}
          material={materials.Scoop}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001_1.geometry}
          material={materials.Cone}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001_2.geometry}
          material={materials.Choco_Syurp}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001_3.geometry}
          material={materials.Sprinkle_4}
        />
      </group>
    )
  }
)

useGLTF.preload('./models/ice-cream.glb', './libs/')

export default IceCream
