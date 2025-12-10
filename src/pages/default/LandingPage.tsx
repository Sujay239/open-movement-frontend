import { About } from '@/components/blocks/About'
import { FeatureSection } from '@/components/blocks/FeatureSection'
import { Hero } from '@/components/blocks/Hero'
import { HowItWorks } from '@/components/blocks/HowItWorks'
import { Services } from '@/components/blocks/Services'
import { Sponsors } from '@/components/blocks/Sponsors'

const LandingPage = () => {
  return (
    <div className='overflow-y-hidden'>
        {/* <h1>LandingPage</h1>
        <Button>Click Me!</Button> */}
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
