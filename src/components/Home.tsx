import { makeObject3DCastAndReceiveShadow } from '@/utils/util'
import { useGLTF } from '@react-three/drei'
import { forwardRef, useMemo } from 'react'

const Home = forwardRef((_props, ref) => {
  const { scene } = useGLTF('./models/home.glb', './libs/')

  useMemo(() => {
    makeObject3DCastAndReceiveShadow(scene.children)
    // scene.traverse((mesh) => {
    //   mesh.castShadow = true
    //   mesh.receiveShadow = true
    // })
    scene.castShadow = true
    scene.receiveShadow = true
  }, [scene])

  return (
    <primitive
      rotation={[0, Math.PI / 4, 0]}
      ref={ref}
      object={scene}
      receiveShadow
      castShadow
    />
  )
})

useGLTF.preload('./models/home.glb', './libs/')

export default Home
