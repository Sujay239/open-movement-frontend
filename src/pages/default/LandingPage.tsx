import { About } from '@/components/blocks/About'
import { FeatureSection } from '@/components/blocks/FeatureSection'
import { Hero } from '@/components/blocks/Hero'
import { HowItWorks } from '@/components/blocks/HowItWorks'
import { Services } from '@/components/blocks/Services'
import { Sponsors } from '@/components/blocks/Sponsors'

const LandingPage = () => {
  return (
    <div className='overflow-y-hidden'>
        <Hero />
        <Sponsors />
        <About />
        <HowItWorks />
        <FeatureSection />
        <Services />
    </div>
  )
}

export default LandingPage
