import { TraitType } from '@/utils/util'
import Trait from './Trait'

export type LevelCardProps = {
  level: number
  traits: TraitType[]
}

export default function LevelCard({ level, traits }: LevelCardProps) {
  return (
    <div className='fixed top-8 left-8'>
      <div className='card'>
        <div className='heading'>Lv. {level}</div>
        <div>
          {traits.map((trait, index) => (
            <Trait
              key={trait.name + trait.value + index}
              text={trait.name}
              value={trait.value}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
