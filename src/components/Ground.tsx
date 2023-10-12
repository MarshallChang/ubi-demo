import { Grid } from '@react-three/drei'

export default function Ground() {
  const gridConfig = {
    cellSize: 0.25,
    cellThickness: 1,
    cellColor: 'red',
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: '#9d4b4b',
    fadeDistance: 30,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  }
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}
